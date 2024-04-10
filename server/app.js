const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const sqlite3 = require("sqlite3").verbose();

const port = 3001;
const app = new Koa();
const router = new Router();

const db = new sqlite3.Database(":memory:");
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS data (key TEXT, id TEXT, name TEXT, description TEXT, date TEXT, tags TEXT)"
  );
  const dataStmt = db.prepare(
    "INSERT INTO data (key, id, name, description, date, tags) VALUES (?, ?, ?, ?, ?, ?)"
  );
  dataStmt.finalize();
});

router.get("/data", async (ctx) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM data", [], (err, rows) => {
      if (err) {
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
        reject(err);
      } else {
        const data = rows.map((row) => ({
          ...row,
          tags: JSON.parse(row.tags),
        }));
        ctx.body = data;
        resolve();
      }
    });
  });
});

router.post("/data", async (ctx) => {
  const { key, id, name, description, date, tags } = ctx.request.body;
  const tagsString = JSON.stringify(tags);
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      "INSERT INTO data (key, id, name, description, date, tags) VALUES (?, ?, ?, ?, ?, ?)"
    );
    stmt.run(key, id, name, description, date, tagsString, function (err) {
      if (err) {
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
        reject(err);
      } else {
        ctx.status = 201;
        ctx.body = { key: this.lastID, message: "Data inserted" };
        resolve();
      }
    });
    stmt.finalize();
  });
});

router.delete("/data/:key", async (ctx) => {
  const { key } = ctx.params;
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM data WHERE key = ?", [key], function (err) {
      if (err) {
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
        reject(err);
      } else if (this.changes === 0) {
        ctx.status = 404;
        ctx.body = { error: "No record found to delete" };
        resolve();
      } else {
        ctx.status = 200;
        ctx.body = { message: "Record deleted successfully" };
        resolve();
      }
    });
  });
});

router.put("/data/:key", async (ctx) => {
  const { key } = ctx.params;
  const { name, description, date, tags } = ctx.request.body;
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE data SET name = ?, description = ?, date = ?, tags = ? WHERE key = ?",
      [name, description, date, JSON.stringify(tags), key],
      function (err) {
        if (err) {
          ctx.status = 500;
          ctx.body = { error: "Internal server error" };
          reject(err);
        } else if (this.changes === 0) {
          ctx.status = 404;
          ctx.body = { error: "No record found to update" };
          resolve();
        } else {
          ctx.status = 200;
          ctx.body = { message: "Record updated successfully" };
          resolve();
        }
      }
    );
  });
});

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

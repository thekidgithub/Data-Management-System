import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider,Navigate } from "react-router-dom";
import App from "./App";
import Tag from "./pages/tag";
import Data from "./pages/data";
import "./styles/tailwind.css";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "data",
        element: <Data />,
      },
      {
        path: "tag",
        element: <Tag />,
      },
      {
        path: '/',
        element: <Navigate to="/data" />,
      },
      {
        path: '*',
        element: <Navigate to="/data" />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

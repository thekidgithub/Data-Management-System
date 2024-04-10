import React, { useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import {
  Table,
  Input,
  Button,
  Select,
  DatePicker,
  Modal,
  Space,
  message,
} from "antd";
import { v4 as uuidv4 } from "uuid";
import useStore from "../../store";
import { LanguageContext } from "../../components/LanguageContext";

const { Option } = Select;
interface FormData {
  key: string;
  id: string;
  name: string;
  description: string;
  date: string;
  tags: string[];
}

interface SearchKeyObj {
  name: string;
  date: string;
  tag: string | undefined;
}

const Data: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const [id, setId] = useState(localStorage.getItem("ID") || "1");
  const [dataArr, setDataArr] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState("");
  const [formData, setFormData] = useState<FormData>({
    key: "",
    id: "1",
    name: "",
    description: "",
    date: "",
    tags: [],
  });
  const [editFormData, setEditFormData] = useState<Omit<FormData, "key" | "id">>({
    name: "",
    description: "",
    date: "",
    tags: [],
  });
  const [searchKeyObj, setSearchKeyObj] = useState<SearchKeyObj>({
    name: "",
    date: "",
    tag: undefined,
  });
  const [messageApi, contextHolder] = message.useMessage();
  const tags = useStore((state) => state.tags);
  const fetchData = async () => {
    try {
      const response = await fetch("/api/data");
      const data = await response.json();
      setDataArr(data);
    } catch (error) {
      console.error("Fetching data failed", error);
    }
  };
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    if (!formData.name.length ||
      !formData.date.length) {
      messageApi.open({
        type: "error",
        content: `${language === 'en' ? 'Name or date cannot be empty' : '名称或日期不能为空'}`
      });
      return;
    }
    formData.key = uuidv4();
    formData.id = id;    
    setId(String(parseInt(id) + 1));
    fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        messageApi.open({
          type: "success",
          content: `${language === 'en' ? 'Added successfully' : '添加成功'}`,
        });
        fetchData();
        setIsModalVisible(false);
        setFormData({
          key: "",
          id: id,
          name: "",
          description: "",
          date: "",
          tags: [],
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        messageApi.error({
          content: `${language === 'en' ? 'Add failed' : '添加失败'}`,
        });
      });
  };

  const handleEditOk = (key: string) => {
    if (!editFormData.name.length ||
      !editFormData.date.length) {
      messageApi.open({
        type: "error",
        content: `${language === 'en' ? 'Name or date cannot be empty' : '名称或日期不能为空'}`
      });
      return;
    }
    fetch(`/api/data/${key}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editFormData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        messageApi.open({
          type: "success",
          content: `${language === 'en' ? 'Edited successfully' : '编辑成功'}`,
        });
        fetchData();
        setIsEditVisible(false);
        setEditFormData({
          name: "",
          description: "",
          date: "",
          tags: [],
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        messageApi.error({
          content: `${language === 'en' ? 'Edit failed' : '编辑失败'}`,
        });
      });
  };
  const handleDeleteOk = (key: string) => {
    fetch(`/api/data/${key}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Deleted:", data);
        messageApi.open({
          type: "success",
          content: `${language === 'en' ? 'Deleted successfully' : '删除成功'}`,
        });
        fetchData();
        setIsDeleteVisible(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        messageApi.error({
          content: `${language === 'en' ? 'Delete failed' : '删除失败'}`,
        });
      });
  };
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSelectChange = (value: string[]) => {
    setFormData({ ...formData, tags: value });
  };
  const handleDateChange = (_: any, dateString: string) => {
    setFormData({ ...formData, date: dateString });
  };
  const handleEditSelectChange = (value: string[]) => {
    setEditFormData({ ...editFormData, tags: value });
  };
  const handleEditDateChange = (_: any, dateString: string) => {
    setEditFormData({ ...editFormData, date: dateString });
  };
  const handleEditInputChange = (e: any) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };
  const handleSearchInput = (e: any) => {
    const { name, value } = e.target;
    setSearchKeyObj({ ...searchKeyObj, [name]: value });
  };
  const handleSearchTag = (tag: string) => {
    setSearchKeyObj({ ...searchKeyObj, tag });
  };
  const handleSearchDate = (_: any, dateString: string) => {
    setSearchKeyObj({ ...searchKeyObj, date: dateString });
  };

  const handleSearch = () => {
    if (
      !searchKeyObj.date.length &&
      !searchKeyObj.tag?.length &&
      !searchKeyObj.name.length
    ) {
      fetchData();
      return;
    }
    setDataArr(
      dataArr.filter((item: FormData) => {
        for (const [key, value] of Object.entries(searchKeyObj)) {
          // @ts-ignore
          if (key !== "tag" && item[key] === value) {
            return true;
          }
          if (
            key === "tag" &&
            value &&
            item["tags"].includes(value?.toUpperCase())
          ) {
            return true;
          }
        }
        return false;
      })
    );
  };
  const handleReset = () => {
    fetchData();
    setSearchKeyObj({
      name: "",
      date: "",
      tag: undefined,
    });
  };
  const columns = [
    {
      title: `${language === 'en' ? 'id' : '编号'}`,
      dataIndex: "id",
      key: "id",
    },
    {
      title: `${language === 'en' ? 'Name' : '名称'}`,
      dataIndex: "name",
      key: "name",
    },
    {
      title: `${language === 'en' ? 'Description' : '描述'}`,
      dataIndex: "description",
      key: "description",
    },
    {
      title: `${language === 'en' ? 'Date' : '添加时间'}`,
      dataIndex: "date",
      key: "date",
    },
    {
      title: `${language === 'en' ? 'Tags' : '标签'}`,
      key: "tags",
      dataIndex: "tags",
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => (
            <Button key={tag} size="small" style={{ marginRight: 8 }}>
              {tag}
            </Button>
          ))}
        </>
      ),
    },
    {
      title: `${language === 'en' ? 'Action' : '操作'}`,
      key: "action",
      render: (item: FormData) => (
        <div>
          <Button
            className="mr-2"
            onClick={() => {
              setCurrentKey(item.key);
              setIsEditVisible(true);
            }}
          >
            {language === 'en' ? 'Edit' : '编辑'}
          </Button>
          <Button
            danger
            onClick={() => {
              setCurrentKey(item.key);
              setIsDeleteVisible(true);
            }}
          >
            {language === 'en' ? 'Delete' : '删除'}
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('ID', id);
  }, [id]); 
  return (
    <>
      <div className="text-black w-full h-full flex flex-col">
        <div className=" bg-white flex items-center h-[120px] mx-8 my-6 rounded-xl">
          <div className="ml-6">{language === 'en' ? 'Name:' : '名称：'}</div>
          <Input
            name="name"
            className="w-[200px] h-[32px]"
            value={searchKeyObj.name}
            onChange={handleSearchInput}
          />
          <div className="ml-6">{language === 'en' ? 'Tags:' : '标签：'}</div>
          <Select
            showSearch
            className="w-[200px] h-[32px]"
            value={searchKeyObj.tag}
            onChange={handleSearchTag}
            allowClear
            optionFilterProp="children"
          >
            {tags.map((item) => (
              <Option value={item.toLowerCase()}>{item}</Option>
            ))}
          </Select>
          <div className="ml-6">{language === 'en' ? 'Date' : '添加时间：'}</div>
          <DatePicker
            allowClear
            value={searchKeyObj.date?.length ? dayjs(searchKeyObj.date) : null}
            className="w-[200px] h-[32px]"
            onChange={handleSearchDate}
            placeholder=""
          />
          <Button
            type="primary"
            className="bg-[#1677ff] ml-6"
            onClick={handleSearch}
          >
            {language === 'en' ? 'Search' : '搜索'}
          </Button>
          <Button className="ml-6" onClick={handleReset}>
            {language === 'en' ? 'Reset' : '重置'}
          </Button>
        </div>
        <div className=" bg-white mx-8 my-6 rounded-xl pt-2 pb-4 flex flex-col items-end">
          <Button
            type="primary"
            className="bg-[#1677ff] mb-2 w-[64px] mr-4"
            onClick={showModal}
          >
            {language === 'en' ? 'Add' : '添加'}
          </Button>
          <Table
            className="w-full"
            dataSource={dataArr}
            columns={columns}
            scroll={{ y: 300 }}
            pagination={{ position: ["bottomRight"], showSizeChanger: true }}
          />
        </div>
      </div>
      <Modal
        title={`${language === 'en' ? 'Add data' : '添加数据'}`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        okButtonProps={{ className: "bg-[#1677ff]" }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            placeholder={`${language === 'en' ? 'Name' : '名称'}`}
            name="name"
            style={{ width: "50%" }}
            value={formData.name}
            onChange={handleInputChange}
          />
          <Input
            placeholder={`${language === 'en' ? 'Description' : '描述'}`}
            name="description"
            style={{ width: "50%" }}
            value={formData.description}
            onChange={handleInputChange}
          />
          <DatePicker
            style={{ width: "50%" }}
            onChange={handleDateChange}
            value={formData.date?.length ? dayjs(formData.date) : null}
            placeholder={`${language === 'en' ? 'Date' : '日期'}`} />
          <Select
            mode="multiple"
            style={{ width: "50%" }}
            placeholder={`${language === 'en' ? 'Tags' : '标签'}`}
            onChange={handleSelectChange}
          >
            {tags.map((item) => (
              <Option value={item.toLowerCase()}>{item}</Option>
            ))}
          </Select>
        </Space>
      </Modal>
      <Modal
        title={`${language === 'en' ? 'Edit data' : '编辑数据'}`}
        open={isEditVisible}
        onOk={() => {
          handleEditOk(currentKey as unknown as string);
        }}
        onCancel={() => {
          setIsEditVisible(false);
        }}
        okButtonProps={{ className: "bg-[#1677ff]" }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            placeholder={`${language === 'en' ? 'Name' : '名称'}`}
            name="name"
            style={{ width: "50%" }}
            value={editFormData.name}
            onChange={handleEditInputChange}
          />
          <Input
            placeholder={`${language === 'en' ? 'Description' : '描述'}`}
            name="description"
            style={{ width: "50%" }}
            value={editFormData.description}
            onChange={handleEditInputChange}
          />
          <DatePicker
            style={{ width: "50%" }}
            value={editFormData.date?.length ? dayjs(editFormData.date) : null}
            onChange={handleEditDateChange}
            placeholder={`${language === 'en' ? 'Date' : '日期'}`}
          />
          <Select
            mode="multiple"
            style={{ width: "50%" }}
            allowClear
            value={editFormData.tags}
            placeholder={`${language === 'en' ? 'Tags' : '标签'}`}
            onChange={handleEditSelectChange}
          >
            {tags.map((item) => (
              <Option value={item.toLowerCase()}>{item}</Option>
            ))}
          </Select>
        </Space>
      </Modal>
      <Modal
        title={`${language === 'en' ? 'Confirm delete?' : '确认删除？'}`}
        open={isDeleteVisible}
        onOk={() => {
          handleDeleteOk(currentKey as unknown as string);
        }}
        onCancel={() => {
          setIsDeleteVisible(false);
        }}
        okButtonProps={{ className: "bg-[#1677ff]" }}>
      </Modal>
      {contextHolder}
    </>
  );
};

export default Data;

import React, { useState, useContext } from "react";
import { Table, Button, Space, Input, message, Modal } from "antd";
import useStore from "../../store";
import { LanguageContext } from "../../components/LanguageContext";

const Tag: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [editTagName, setEditTagName] = useState('');
  const [curTag, setCurTag] = useState('');
  const tags = useStore((state) => state.tags);
  const addTag = useStore((state) => state.addTag);
  const removeTag = useStore((state) => state.removeTag);
  const editTag = useStore((state) => state.editTag);
  const tagsArr = tags.map((tag) => ({ tag }));

  const [messageApi, contextHolder] = message.useMessage();
  const handleOk = () => {
    if(!newTag.length){
      messageApi.error({
        content: `${language === 'en' ? 'Tag name cannot be empty' : '标签名不能为空'}`,
      });
      return;
    };
    addTag(newTag);
    setIsModalVisible(false);
    setNewTag('');
    messageApi.open({
      type: "success",
      content: `${language === 'en' ? 'Added successfully' : '添加成功'}`,
    });
  }

  const handleEditOk = () => {
    if(!curTag?.length || !editTagName?.length){
      messageApi.error({
        content: `${language === 'en' ? 'Tag name cannot be empty' : '标签名不能为空'}`,
      });
      return;
    };
    editTag(curTag, editTagName);
    setIsEditVisible(false);
    setEditTagName('');
    setCurTag('');
    messageApi.open({
      type: "success",
      content: `${language === 'en' ? 'Edited successfully' : '编辑成功'}`,
    });
  };

  const handleNewTagName = (e: any) => {
    const { value } = e.target;
    setNewTag(value);
  }

  const handleEditTagName = (e: any) => {
    const { value } = e.target;
    setEditTagName(value);
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: `${language === 'en' ? 'Tags' : '标签'}`,
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: `${language === 'en' ? 'Action' : '操作'}`,
      key: "action",
      render: (item: { tag: string }) => (
        <div>
          <Button
            className="mr-2"
            onClick={() => {
              setCurTag(item.tag);
              setIsEditVisible(true);
            }}
          >
            {language === 'en' ? 'Edit' : '编辑'}
          </Button>
          <Button
            danger
            onClick={() => {
              setCurTag(item.tag);
              setIsDeleteVisible(true);
            }}
          >
            {language === 'en' ? 'Delete' : '删除'}
          </Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="text-black w-full h-full flex flex-col">
        <div className=" bg-white flex flex-col justify-center items-center h-[600px] mx-8 my-6 rounded-xl">
          <Button
            type="primary"
            className="bg-[#1677ff] mb-2 w-[64px] ml-[500px]"
            onClick={showModal}
          >
            {language === 'en' ? 'Add' : '添加'}
          </Button>
          <Table
            className="w-[600px]"
            dataSource={tagsArr}
            columns={columns}
            scroll={{ y: 500 }}
            pagination={{ position: ["bottomRight"], showSizeChanger: true }}
          />
        </div>
      </div>
      <Modal
        title={`${language === 'en' ? 'Add tag' : '添加标签'}`}
        open={isModalVisible}
        onOk={() => {handleOk()}}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        okButtonProps={{ className: "bg-[#1677ff]" }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            placeholder="Tag"
            name="tag"
            style={{ width: "50%" }}
            value={newTag}
            onChange={handleNewTagName}
          />
        </Space>
      </Modal>
      <Modal
        title={`${language === 'en' ? 'Edit tag' : '编辑标签'}`}
        open={isEditVisible}
        onOk={() => {handleEditOk()}}
        onCancel={() => {
          setIsEditVisible(false);
        }}
        okButtonProps={{ className: "bg-[#1677ff]" }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            placeholder="Tag"
            name="tag"
            style={{ width: "50%" }}
            value={editTagName}
            onChange={handleEditTagName}
          />
        </Space>
      </Modal>
      <Modal
        title={`${language === 'en' ? 'Confirm to delete?' : '确认删除？'}`}
        open={isDeleteVisible}
        onOk={() => {removeTag(curTag)}}
        onCancel={() => {
          setIsDeleteVisible(false);
        }}
        okButtonProps={{ className: "bg-[#1677ff]" }}
        >
      </Modal>
      {contextHolder}
    </>
  );
};

export default Tag;

import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ThunderboltOutlined,
  HighlightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { LanguageContext } from "./LanguageContext";

const Aside: React.FC = () => {
  const { language } = useContext(LanguageContext);

  const [collapsed, setCollapsed] = useState(false);
  const [asideWidth, setAsideWidth] = useState(256);
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setAsideWidth(!collapsed ? 80 : 256);
  };

  return (
    <div
      style={{
        width: `${asideWidth}px`,
        transition: "width 0.2s cubic-bezier(0.2, 0, 0, 1) 0s",
      }}
    >
      <Menu
        defaultSelectedKeys={["1"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        selectedKeys={[location.pathname]}
        style={{
          height: "calc(100% - 48px)",
        }}
      >
        <Menu.Item key="/data">
          <Link to="/data">
            <HighlightOutlined />
            <span>{language === 'en' ? 'Data management' : '数据管理'}</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/tag">
          <Link to="/tag">
            <ThunderboltOutlined />
            <span>{language === 'en' ? 'Tags management' : '标签管理'}</span>
          </Link>
        </Menu.Item>
      </Menu>
      <div
        onClick={toggleCollapsed}
        className="bg-[#001529] text-white h-[48px] cursor-pointer flex justify-center items-center"
      >
        {collapsed ? <RightOutlined /> : <LeftOutlined />}
      </div>
    </div>
  );
};

export default Aside;

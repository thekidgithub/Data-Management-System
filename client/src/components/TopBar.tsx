import React, { useContext } from "react";
import { Dropdown, Menu } from "antd";
import { LanguageContext } from "./LanguageContext";

const TopBar: React.FC = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const menu = (
    <Menu onClick={(item) => {
      toggleLanguage(item.key);
    }}>
      <Menu.Item key="en">English</Menu.Item>
      <Menu.Item key="zh">中文</Menu.Item>
    </Menu>
  );
  return (
    <div className="flex justify-between items-center h-[60px] px-10 bg-[#001529] text-white text-[18px]">
      <div>{language === "en" ? "Data management platform" : "数据管理平台"}</div>
      <Dropdown overlay={menu} trigger={["hover"]}>
        <a className="text-white cursor-pointer" onClick={(e) => e.preventDefault()}>
          {language === "en" ? "Language" : "语言"}
        </a>
      </Dropdown>
    </div>
  );
};

export default TopBar;

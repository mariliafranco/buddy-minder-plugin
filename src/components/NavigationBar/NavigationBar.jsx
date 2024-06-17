import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShakeOutlined,
  ThunderboltOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

const NavigationBar = () => {
  const { t } = useTranslation();

  const items = [
    {
      label: <Link to="/settings">{t("settings")}</Link>,
      icon: <ShakeOutlined />,
      key: "1",
    },
    {
      label: <Link to="/add-reminder">{t("launchNewMemorization")}</Link>,
      icon: <ThunderboltOutlined />,
      key: "2",
    },
    {
      label: <Link to="/user-account">{t("user")}</Link>,
      icon: <UserSwitchOutlined />,
      key: "3",
    },
  ];

  return (
    <div className="navigation-bar-container">
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="horizontal"
        items={items}
      />
    </div>
  );
};

export default NavigationBar;

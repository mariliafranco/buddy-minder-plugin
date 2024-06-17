import React from "react";
import { Layout } from "antd";
import NavigationBar from "../NavigationBar/NavigationBar";
import "./Footer.scss";

const Footer = () => {
  return (
    <Layout className="footer-layout-container">
      <Layout.Footer className="footer-layout">
        <NavigationBar />
      </Layout.Footer>
    </Layout>
  );
};

export default Footer;

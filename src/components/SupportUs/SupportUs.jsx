/* global chrome */
import React from "react";
import { useTranslation } from "react-i18next";
import { Typography, Button, Space } from "antd";
import { DollarCircleFilled, CoffeeOutlined } from "@ant-design/icons";
import "./SupportUs.scss";

const { Title, Text } = Typography;

const SupportUs = () => {
  const { t } = useTranslation();

  return (
    <div className="support-us-container">
      <Title level={4} className="support-title">
        {t("supportTitle")}
      </Title>
      <Text className="support-message">{t("supportMessage")}</Text>
      <Space className="support-buttons" direction="vertical">
        <Button
          className="donation-button"
          type="primary"
          icon={<DollarCircleFilled />}
          href="https://www.paypal.com/donate/?business=6TTSYGQTETA62&no_recurring=0&currency_code=BRL"
          target="_blank"
        >
          {t("donateViaPayPal")}
        </Button>
        <Button
          className="donation-button"
          type="primary"
          icon={<CoffeeOutlined />}
          href="https://buymeacoffee.com/mariliafrc"
          target="_blank"
        >
          {t("buyMeACoffee")}
        </Button>
      </Space>
      <div className="contact-info">
        <Text>
          {t("contactInfo")}
          <a href="mailto:marilia.andrad@gmail.com">marilia.andrad@gmail.com</a>
          .
        </Text>
      </div>
    </div>
  );
};

export default SupportUs;

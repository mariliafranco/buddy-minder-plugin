import React from "react";
import { Typography, Button } from "antd";
import { useTranslation } from "react-i18next";
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
      <Text className="support-message">
        {t("supportMessage")} {t("paypalMessage")}{" "}
        <CoffeeOutlined className="coffee-icon" />
      </Text>

      <div className="paypal-message">
        <Button
          type="primary"
          icon={<DollarCircleFilled />}
          href="https://www.paypal.com/donate/?business=6TTSYGQTETA62&no_recurring=0&currency_code=BRL"
          target="_blank"
          style={{ marginTop: "10px" }}
        >
          {t("donateViaPayPal")}
        </Button>
      </div>
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

/* global chrome */
import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { useTranslation } from "react-i18next";
import "../../i18n";

const Popup = () => {
  const [title, setTitle] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    chrome.storage.local.get(["selectedText"], function (result) {
      if (result.selectedText) {
        setTitle(result.selectedText);
        chrome.storage.local.remove("selectedText");
      }
    });
  }, []);

  return (
    <div>
      <h1>{t("appName")}</h1>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("titlePlaceholder")}
      />
    </div>
  );
};

export default Popup;

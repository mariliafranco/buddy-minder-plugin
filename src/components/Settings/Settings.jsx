/* global chrome */
import React, { useState, useEffect } from "react";
import {
  Switch,
  Tag,
  Row,
  Col,
  Divider,
  Typography,
  Alert,
  Button,
  InputNumber,
} from "antd";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase"; // Adjust the import path as needed
import { useTranslation } from "react-i18next";
import "./Settings.scss";

const { CheckableTag } = Tag;
const { Title, Text } = Typography;

const Settings = () => {
  const { t } = useTranslation();
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [activateTags, setActivateTags] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [frequency, setFrequency] = useState(60);
  const [userTags, setUserTags] = useState([]);

  useEffect(() => {
    const fetchUserTags = async () => {
      const user = auth.currentUser;
      if (user) {
        const remindersRef = collection(db, "users", user.uid, "reminders");
        const snapshot = await getDocs(remindersRef);
        const tagsSet = new Set();
        snapshot.docs.forEach((doc) => {
          const reminder = doc.data();
          if (reminder.tags) {
            reminder.tags.forEach((tag) => tagsSet.add(tag));
          }
        });
        setUserTags(Array.from(tagsSet));
      }
    };

    fetchUserTags();
  }, []);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  const incrementFrequency = () => {
    if (frequency < 1440) {
      setFrequency(frequency + 10);
    }
  };

  const decrementFrequency = () => {
    if (frequency > 10) {
      setFrequency(frequency - 10);
    }
  };

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({
        enableNotifications,
        selectedTags,
        frequency,
      });
    }
  }, [enableNotifications, selectedTags, frequency]);

  return (
    <div className="settings-container">
      <Row justify="center" align="middle">
        <Col span={24}>
          <Title level={2}>{t("settings")}</Title>
        </Col>
        <Col span={24}>
          <Divider />
        </Col>
        <Col span={24} className="settings-col">
          <Text strong>{t("sendNotifications")}</Text>
          <Switch
            size="small"
            checked={enableNotifications}
            onChange={() => setEnableNotifications(!enableNotifications)}
            style={{ marginLeft: "10px" }}
          />
        </Col>
        <Divider />
        <Col span={24} className="settings-col">
          <Text strong>{t("showRemindersByTags")}</Text>
          <Switch
            size="small"
            checked={activateTags}
            onChange={() => setActivateTags(!activateTags)}
            style={{ marginLeft: "10px" }}
          />
        </Col>
        {activateTags && (
          <Col span={24} className="settings-col">
            <Text strong>{t("tags")}</Text>
            <div>
              {userTags.length > 0 ? (
                <Row>
                  {userTags.map((tag) => (
                    <Col
                      key={tag}
                      style={{ marginRight: "10px", marginTop: "10px" }}
                    >
                      <CheckableTag
                        checked={selectedTags.includes(tag)}
                        onChange={(checked) => handleChange(tag, checked)}
                      >
                        {tag}
                      </CheckableTag>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Alert
                  message={t("noCategories")}
                  description={
                    <>
                      {t("createNewReminder")}{" "}
                      <Link className="settings-link" to="/">
                        {t("here")}
                      </Link>{" "}
                      {t("startBoostingMemory")}
                    </>
                  }
                  type="info"
                  style={{ marginTop: "10px" }}
                />
              )}
            </div>
          </Col>
        )}
        <Divider />
        <Col span={24} className="settings-col">
          <Text strong>{t("notificationFrequency")}</Text>
          <Col className="settings-col">
            <Text className="settings-col-info">
              {t("remindersEvery")} {frequency} {t("minutes")}
            </Text>
          </Col>
        </Col>

        <Col span={24} className="settings-col">
          <div className="settings-change-frequency">
            <Text className="settings-col-info" style={{ marginRight: "10px" }}>
              {t("changeFrequency")}
            </Text>
            <Button
              onClick={decrementFrequency}
              style={{ marginRight: "10px" }}
              size="small"
            >
              -
            </Button>
            <InputNumber
              min={10}
              max={1440}
              value={frequency}
              onChange={(value) => setFrequency(value)}
              style={{ width: "50px" }}
            />
            <Button
              onClick={incrementFrequency}
              style={{ marginLeft: "10px" }}
              size="small"
            >
              +
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;

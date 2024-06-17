import React, { useEffect, useState } from "react";
import { List, Space, Tag, Typography } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useTranslation } from "react-i18next";
import "./YourReminders.scss";

const { Title } = Typography;

const YourReminders = () => {
  const [items, setItems] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchReminders = async () => {
      const user = auth.currentUser;
      if (user) {
        const remindersRef = collection(db, "users", user.uid, "reminders");
        const snapshot = await getDocs(remindersRef);
        const fetchedItems = snapshot.docs.map((doc) => doc.data());
        setItems(fetchedItems);
      }
    };

    fetchReminders();
  }, []);

  return (
    <div className="your-reminders-container">
      <Title level={2} className="reminders-title">
        {t("yourBrainsMemorizationCollection")}
      </Title>
      <List
        className="reminders-list"
        bordered
        dataSource={items}
        locale={{ emptyText: t("noRemindersYet") }}
        renderItem={(item, index) => (
          <List.Item key={index} className="reminder-item">
            <Space direction="vertical" className="reminder-content">
              <strong className="reminder-title">{item.title}</strong>
              <span className="reminder-description">{item.description}</span>
              <div className="reminder-tags">
                {item.tags.map((tag, index) => (
                  <Tag color="blue" key={index} className="reminder-tag">
                    {tag}
                  </Tag>
                ))}
              </div>
            </Space>
          </List.Item>
        )}
      />
    </div>
  );
};

export default YourReminders;

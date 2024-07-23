/* global chrome */
import React, { useEffect, useState } from "react";
import { List, Space, Tag, Typography, Button, Input } from "antd";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { db, auth } from "../../firebase";
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import "./YourReminders.scss";

const { Title } = Typography;

const YourReminders = ({ user }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  const { TextArea } = Input;

  useEffect(() => {
    const fetchReminders = async () => {
      const user = auth.currentUser;
      if (user) {
        const remindersRef = collection(db, "users", user.uid, "reminders");
        const snapshot = await getDocs(remindersRef);
        const fetchedItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(fetchedItems);
      }
    };

    fetchReminders();
  }, []);

  const handleDeleteItem = async (id) => {
    try {
      setIsDeleting(true);
      const user = auth.currentUser;
      if (user) {
        const reminderDoc = doc(db, "users", user.uid, "reminders", id);
        await deleteDoc(reminderDoc);
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        setIsDeleted(true);
        setTimeout(() => setIsDeleted(false), 2000);
      }
    } catch (error) {
      console.error("Error deleting reminder: ", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItemId(item.id);
    setEditingTitle(item.title);
    setEditingDescription(item.description);
  };

  const handleUpdateItem = async () => {
    try {
      setIsUpdating(true);
      const user = auth.currentUser;
      if (user && editingItemId) {
        const reminderDoc = doc(
          db,
          "users",
          user.uid,
          "reminders",
          editingItemId
        );
        await updateDoc(reminderDoc, {
          title: editingTitle,
          description: editingDescription,
        });
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === editingItemId
              ? {
                  ...item,
                  title: editingTitle,
                  description: editingDescription,
                }
              : item
          )
        );
        setIsUpdated(true);
        setTimeout(() => setIsUpdated(false), 2000);
        setEditingItemId(null);
        setEditingTitle("");
        setEditingDescription("");
      }
    } catch (error) {
      console.error("Error updating reminder: ", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingTitle("");
    setEditingDescription("");
  };

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
        renderItem={(item) => (
          <List.Item key={item.id} className="reminder-item">
            <Space direction="vertical" className="reminder-content">
              {editingItemId === item.id ? (
                <>
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    placeholder={t("title")}
                  />
                  <TextArea
                    rows={2}
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                    placeholder={t("description")}
                  />
                  <div className="reminder-actions-button">
                    <Button
                      className="save-button"
                      htmlType="submit"
                      type="primary"
                      onClick={handleUpdateItem}
                      icon={<SaveOutlined />}
                      disabled={isUpdating}
                    >
                      {t("save")}
                    </Button>
                    <Button
                      className="cancel-button"
                      htmlType="button"
                      onClick={handleCancelEdit}
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="reminder-actions-button">
                    <Button
                      className="edit-button"
                      htmlType="submit"
                      type="primary"
                      onClick={() => handleEditItem(item)}
                      icon={<EditOutlined />}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      className={`delete-button ${isDeleted ? "success" : ""}`}
                      htmlType="submit"
                      type="primary"
                      onClick={() => handleDeleteItem(item.id)}
                      icon={isDeleted ? <CheckOutlined /> : <DeleteOutlined />}
                      disabled={isDeleting}
                    >
                      {isDeleted ? t("deleted") : t("delete")}
                    </Button>
                  </div>
                  <strong className="reminder-title">{item.title}</strong>
                  <span className="reminder-description">
                    {item.description}
                  </span>
                  <div className="reminder-tags">
                    {item.tags.map((tag, index) => (
                      <Tag color="blue" key={index} className="reminder-tag">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </>
              )}
            </Space>
          </List.Item>
        )}
      />
    </div>
  );
};

export default YourReminders;

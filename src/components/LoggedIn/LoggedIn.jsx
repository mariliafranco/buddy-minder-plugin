import React, { useEffect, useState } from "react";
import { Button, Divider, Typography } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { auth, db, signOut } from "../../firebase";
import { Link } from "react-router-dom";
import SupportUs from "../SupportUs/SupportUs";
import { useTranslation } from "react-i18next";
import "./LoggedIn.scss";

const { Title, Text } = Typography;

const LoggedIn = ({ user }) => {
  const [reminderCount, setReminderCount] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchReminders = async () => {
      if (user) {
        const remindersRef = collection(db, "users", user.uid, "reminders");
        const snapshot = await getDocs(remindersRef);
        setReminderCount(snapshot.size);
      }
    };

    fetchReminders();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload(); // Reload to reset state
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="loggedin-container">
      <div className="welcome-section">
        <Title level={2} className="welcome-message">
          {t("welcome")}, {user.email}
        </Title>
        <Text className="reminder-info">
          {t("reminderInfo", { count: reminderCount })}
        </Text>
        <div className="reminders-link-container">
          <Link to="/" className="reminders-link">
            {t("goToReminders")}
          </Link>
        </div>
        <Button onClick={handleLogout} type="link" className="logout-button">
          {t("logout")}
        </Button>
      </div>
      <Divider />
      <SupportUs />
    </div>
  );
};

export default LoggedIn;

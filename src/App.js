/* global chrome */
import React, { useState, useEffect } from "react";
import { Layout, Spin } from "antd";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { db, auth } from "./firebase";
import Login from "./components/Login/Login";
import YourReminders from "./components/YourReminders/YourReminders";
import AddReminder from "./components/AddReminder/AddReminder";
import Settings from "./components/Settings/Settings";
import Footer from "./components/Footer/Footer";
import { Avatar } from "antd";
import brandIcon from "./remindly-vector.png";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import "./App.scss";

const { Header, Content } = Layout;

const App = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [frequency, setFrequency] = useState(60);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchReminders(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchReminders = async (user) => {
    try {
      if (user) {
        const remindersRef = collection(db, "users", user.uid, "reminders");
        const q = query(remindersRef);
        const snapshot = await getDocs(q);
        const fetchedItems = snapshot.docs.map((doc) => doc.data());
        setItems(fetchedItems);
        if (typeof chrome !== "undefined" && chrome.storage) {
          chrome.storage.local.set({ reminders: fetchedItems });
        }
      }
    } catch (error) {
      console.error("Error fetching reminders: ", error);
    }
  };

  const addItem = async (title, description, tags) => {
    try {
      const newItem = { title, description, tags };
      if (user) {
        const remindersRef = collection(db, "users", user.uid, "reminders");
        await addDoc(remindersRef, newItem);
        setItems((prevItems) => [...prevItems, newItem]);
        if (typeof chrome !== "undefined" && chrome.storage) {
          chrome.storage.local.set({ reminders: [...items, newItem] });
        }
      }
    } catch (error) {
      console.error("Error adding reminder: ", error);
    }
  };

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(
        ["enableNotifications", "frequency", "selectedTags"],
        (result) => {
          setEnableNotifications(result.enableNotifications || true);
          setFrequency(result.frequency || 60);
          setSelectedTags(result.selectedTags || []);
        }
      );

      const scheduleNotifications = (frequency) => {
        chrome.alarms.clear("sendNotification", () => {
          chrome.alarms.create("sendNotification", {
            periodInMinutes: frequency,
          });
        });
      };

      if (enableNotifications) {
        scheduleNotifications(frequency);
      }
    }
  }, [enableNotifications, frequency, selectedTags]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout className="site-layout">
          <Header className="site-layout-background">
            <h1 className="site-layout-header">
              <Avatar
                size={50}
                src={brandIcon}
                style={{ margin: "5px", verticalAlign: "middle" }}
              />
              BuddyMinder<sup>&#174;</sup>
            </h1>
          </Header>
          <Content style={{ margin: "16px" }}>
            <Routes>
              <Route
                path="/"
                element={
                  user ? (
                    <YourReminders items={items} />
                  ) : (
                    <Login
                      onLoginSuccess={() => fetchReminders(auth.currentUser)}
                    />
                  )
                }
              />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/user-account"
                element={
                  <Login
                    onLoginSuccess={() => fetchReminders(auth.currentUser)}
                    currentUser={user}
                  />
                }
              />
              <Route
                path="/add-reminder"
                element={
                  <AddReminder
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    tags={tags}
                    setTags={setTags}
                    addItem={addItem}
                  />
                }
              />
            </Routes>
          </Content>
        </Layout>
        <Footer />
      </Layout>
    </Router>
  );
};

export default App;

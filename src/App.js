/* global chrome */
import React, { useState, useEffect } from "react";
import { Layout, Spin } from "antd";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { db, auth } from "./firebase";
import Login from "./components/Login/Login.jsx";
import YourReminders from "./components/YourReminders/YourReminders.jsx";
import AddReminder from "./components/AddReminder/AddReminder.jsx";
import Settings from "./components/Settings/Settings.jsx";
import Footer from "./components/Footer/Footer.jsx";
import { Avatar } from "antd";
import brandIcon from "./remindly-vector.png";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import "./i18n";
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

  // useEffect(() => {
  //   if (selectedText !== title) {
  //     setTitle(selectedText);
  //     console.log("Inside the if selectedText = ", selectedText);
  //   }

  //   console.log("Outside the if selectedText = ", selectedText);
  // }, [selectedText, title]);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      let selectedText = chrome.storage.local.get("selectedText");
      if (selectedText) {
        setTitle(selectedText);
        console.log("Popup received text:", selectedText);
      }
    });
    console.log(title);
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
          chrome.storage.local.set({ reminders: fetchedItems }, () => {
            if (chrome.runtime.lastError) {
              console.error(
                "Error setting reminders:",
                chrome.runtime.lastError
              );
            } else {
              console.log("Reminders set successfully.");
              chrome.storage.local.get("reminders", (data) => {
                console.log("Stored reminders:", data);
              });
            }
          });
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
          chrome.storage.local.set({ reminders: [...items, newItem] }, () => {
            if (chrome.runtime.lastError) {
              console.error(
                "Error setting reminders:",
                chrome.runtime.lastError
              );
            } else {
              console.log("Reminders updated successfully.");
              chrome.storage.local.get("reminders", (data) => {
                console.log("Updated reminders:", data);
              });
            }
          });
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
          <header className="site-layout-background">
            Testing
            {/* <h1 className="site-layout-header">
              <Avatar
                size={50}
                src={brandIcon}
                style={{ margin: "5px", verticalAlign: "middle" }}
              />
              <span>
                BuddyMinder<sup>&#174;</sup>
              </span>
            </h1> */}
          </header>
          {/* <Content style={{ margin: "16px" }}>
            <Routes>
              <Route
                path="/"
                element={
                  user ? (
                    <AddReminder
                      title={title}
                      setTitle={setTitle}
                      description={description}
                      setDescription={setDescription}
                      tags={tags}
                      setTags={setTags}
                      addItem={addItem}
                    />
                  ) : (
                    <Login
                      onLoginSuccess={() => fetchReminders(auth.currentUser)}
                      currentUser={auth.currentUser}
                    />
                  )
                }
              />
              <Route
                path="/user-reminders"
                element={
                  user ? (
                    <YourReminders items={items} />
                  ) : (
                    <Login
                      onLoginSuccess={() => fetchReminders(auth.currentUser)}
                      currentUser={auth.currentUser}
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
            </Routes>
          </Content> */}
        </Layout>
        {/* <Footer /> */}
      </Layout>
    </Router>
  );
};

export default App;

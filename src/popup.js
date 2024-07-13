/* global chrome */
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const Popup = () => {
  const [selectedText, setSelectedText] = useState("");
  const [reminder, setReminder] = useState(null);

  console.log("Popup.js selectedText:", selectedText);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const text = urlParams.get("text");
    const reminderId = urlParams.get("reminderId");

    if (mode === "textSelection" && text) {
      setSelectedText(text);
      console.log("Popup received text from URL:", text);
    } else if (reminderId) {
      // Fetch the reminder using the ID
      chrome.storage.local.get("reminders", (result) => {
        const reminders = result.reminders || [];
        const foundReminder = reminders.find((r) => r.id === reminderId);
        if (foundReminder) {
          setReminder(foundReminder);
        }
      });
    }
  }, []);

  if (reminder) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <img
          src="remindly-vector.png"
          alt="BuddyMinder Logo"
          style={{ width: "100px", marginBottom: "20px" }}
        />
        <h1>{reminder.title}</h1>
        <p>{reminder.description}</p>
      </div>
    );
  }

  return <App selectedText={selectedText} />;
};

const rootElement = document.getElementById("popup-root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<Popup />);
} else {
  console.error("Popup root element not found");
}

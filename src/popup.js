/* global chrome */
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const Popup = () => {
  const [selectedText, setSelectedText] = useState("");

  console.log("Popup.js selectedText:", selectedText);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === "openPopup") {
        setSelectedText(message.text);
      }
    });
  }, []);

  return <App selectedText={selectedText} />;
};

const rootElement = document.getElementById("popup-root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<Popup />);
} else {
  console.error("Popup root element not found");
}

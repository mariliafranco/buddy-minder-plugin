/* global chrome */
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const Popup = () => {
  const [selectedText, setSelectedText] = useState("");

  console.log("Popup.js selectedText:", selectedText);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const text = urlParams.get("text");

    if (mode === "textSelection" && text) {
      setSelectedText(text);
      console.log("Popup received text from URL:", text);
    }
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

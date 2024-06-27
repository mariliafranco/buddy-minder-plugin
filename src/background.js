/* global chrome */
let selectedText = "";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message in background:", message);
  if (message.action === "textSelected") {
    selectedText = message.text;
    console.log("Text selected in background:", selectedText);
    sendResponse({ status: "success" });
  } else if (message.action === "openPopup") {
    console.log("Opening popup with text:", selectedText);
    chrome.windows.create(
      {
        url: "popup.html",
        type: "popup",
        width: 400,
        height: 300,
      },
      (win) => {
        console.log("Popup window created:", win);
        chrome.runtime.sendMessage(
          { action: "openPopup", text: selectedText },
          (response) => {
            console.log("Popup message sent successfully:", response);
            if (chrome.runtime.lastError) {
              console.error(
                "Error sending popup message:",
                chrome.runtime.lastError
              );
            }
          }
        );
      }
    );
  }
});

/* global chrome */
let selectedText = "";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "textSelected") {
    selectedText = message.text;
    console.log("Text selected in background:", selectedText);
    chrome.contextMenus.create(
      {
        id: "memorizeIt",
        title: "Memorize It",
        contexts: ["selection"],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Context menu creation error:",
            chrome.runtime.lastError
          );
        } else {
          console.log("Context menu created successfully");
        }
      }
    );
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "memorizeIt") {
    chrome.windows.create(
      {
        url: "popup.html",
        type: "popup",
        width: 400,
        height: 300,
      },
      (win) => {
        chrome.runtime.sendMessage({ action: "openPopup", text: selectedText });
        console.log("Popup window created with selected text:", selectedText);
      }
    );
  }
});

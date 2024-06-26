/* global chrome */
window.onload = () => {
  console.log("Hello Marília, I am from content script");
};

function handleTextSelection() {
  document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
      try {
        chrome.runtime.sendMessage(
          { action: "textSelected", text: selectedText },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error sending message:", chrome.runtime.lastError);
            } else {
              console.log("Message sent successfully:", response);
            }
          }
        );
      } catch (error) {
        console.error("Error:", error);
      }
    }
  });
}

handleTextSelection();

/* global chrome */

window.onload = () => {
  console.log("I am from content script");
};

document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();
  console.log("Selected text ------- content file:", selectedText); // Log selected text
  if (selectedText.length > 0) {
    // Check if the icon already exists and remove it if it does
    const existingIcon = document.getElementById("buddyMinderIcon");
    if (existingIcon) {
      existingIcon.remove();
    }

    const icon = document.createElement("img");
    icon.src = chrome.runtime.getURL("remindly-vector.png");
    icon.style.position = "absolute";
    icon.style.left = "20px";
    icon.style.top = "10px";
    icon.style.width = "24px";
    icon.style.height = "24px";
    icon.style.cursor = "pointer";
    icon.id = "buddyMinderIcon";

    document.body.appendChild(icon);

    icon.addEventListener("click", () => {
      if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage(
          {
            type: "TEXT_SELECTED",
            text: selectedText,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error sending message:", chrome.runtime.lastError);
            } else {
              console.log("Message sent successfully:", response);
            }
          }
        );
      } else {
        console.error("chrome.runtime.sendMessage is not available");
      }
    });
  }
});

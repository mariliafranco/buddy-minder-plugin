/* global chrome */
window.onload = () => {
  console.log("Hello Marília, I am from content script");
};

let currentSelectedText = "";

document.addEventListener("selectionchange", () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    currentSelectedText = selectedText;
  }
});

function handleTextSelection() {
  document.addEventListener("mouseup", () => {
    if (currentSelectedText.length > 0) {
      // Remove any existing icon
      const existingIcon = document.getElementById("buddyMinderIcon");
      if (existingIcon) {
        existingIcon.remove();
      }

      // Get the bounding rectangle of the selected text
      const range = window.getSelection().getRangeAt(0);
      const rect = range.getBoundingClientRect();

      console.log("Bounding rectangle:", rect);

      // Create the icon element
      const icon = document.createElement("div");
      icon.id = "buddyMinderIcon";
      icon.style.left = `${rect.left + window.scrollX}px`;
      icon.style.top = `${rect.top + window.scrollY - 30}px`;
      icon.style.position = "absolute";
      icon.style.zIndex = "1000";
      icon.style.cursor = "pointer";
      icon.style.display = "flex";
      icon.style.alignItems = "center";
      icon.style.backgroundColor = "white";
      icon.style.border = "1px solid #ccc";
      icon.style.borderRadius = "4px";
      icon.style.padding = "4px 8px";
      icon.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
      icon.style.fontSize = "14px";

      const img = document.createElement("img");
      img.src = chrome.runtime.getURL("remindly-vector.png");
      img.style.width = "16px";
      img.style.height = "16px";
      img.style.marginRight = "4px";

      img.onerror = () => {
        console.error("Failed to load image:", img.src);
      };

      const text = document.createElement("span");
      text.textContent = "Memorize It";

      icon.appendChild(img);
      icon.appendChild(text);

      document.body.appendChild(icon);

      console.log("Icon added to the DOM");

      icon.addEventListener("click", () => {
        console.log("Icon clicked with text:", currentSelectedText);
        try {
          chrome.runtime.sendMessage(
            { action: "textSelected", text: currentSelectedText },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error(
                  "Error sending message:",
                  chrome.runtime.lastError
                );
              } else {
                console.log("Message sent successfully:", response);
                // Open the popup window
                chrome.runtime.sendMessage(
                  { action: "openPopup", text: currentSelectedText },
                  (response) => {
                    if (chrome.runtime.lastError) {
                      console.error(
                        "Error sending popup message:",
                        chrome.runtime.lastError
                      );
                    } else {
                      console.log("Popup message sent successfully:", response);
                    }
                  }
                );
              }
            }
          );
        } catch (error) {
          console.error("Error:", error);
        }
      });
    } else {
      // Remove the icon if no text is selected
      console.log("Remove the icon if no text is selected");
      const existingIcon = document.getElementById("buddyMinderIcon");
      if (existingIcon) {
        existingIcon.remove();
      }
    }
  });
}

handleTextSelection();

import "./index.css";

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

function removeIcon() {
  const existingIcon = document.getElementById("buddyMinderIcon");
  if (existingIcon) {
    existingIcon.remove();
  }
}

function handleClick() {
  console.log("Icon clicked with text:", currentSelectedText);

  try {
    chrome.runtime.sendMessage(
      { action: "textSelected", text: currentSelectedText },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
        } else {
          console.log("Message sent successfully:", response);
          currentSelectedText = "";
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

function handleTextSelection() {
  document.addEventListener("mouseup", () => {
    if (currentSelectedText.length > 0) {
      // Remove any existing icon
      removeIcon();

      // Get the bounding rectangle of the selected text
      const range = window.getSelection().getRangeAt(0);
      const rect = range.getBoundingClientRect();

      console.log("Bounding rectangle:", rect);

      // Create the icon element
      const icon = document.createElement("div");
      icon.id = "buddyMinderIcon";
      icon.style.left = `${rect.left + window.scrollX}px`;
      icon.style.top = `${rect.top + window.scrollY - 30}px`;

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

      icon.setAttribute("type", "button");

      // Log when the event listener is attached
      console.log("Attaching click event listener to icon");

      icon.addEventListener(
        "mousedown",
        () => {
          console.log("Icon clicked event fired");
          handleClick();
        },
        { capture: true }
      );
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

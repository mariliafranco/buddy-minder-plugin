/* global chrome */
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message in background:", message);
  if (message.action === "textSelected") {
    console.log("Text selected in background:", message.text);
    const url = `popup.html?mode=textSelection&text=${encodeURIComponent(
      message.text
    )}`;
    console.log("Opening popup with URL:", url);
    chrome.windows.create(
      {
        url,
        type: "popup",
        width: 450,
        height: 780,
      },
      (win) => {
        console.log("Popup window created:", win);
      }
    );
  } else if (message.action === "openPopup") {
    console.log("Opening popup without text");
    chrome.windows.create(
      {
        url: "popup.html",
        type: "popup",
        width: 450,
        height: 780,
      },
      (win) => {
        console.log("Popup window created:", win);
      }
    );
  }
  sendResponse({ success: true });
});

// Alarm and notification logic
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "sendNotification") {
    chrome.storage.local.get(
      ["reminders", "enableNotifications", "selectedTags"],
      (result) => {
        if (result.enableNotifications) {
          const reminders = result.reminders || [];
          const selectedTags = result.selectedTags || [];

          const filteredReminders = reminders.filter((reminder) =>
            reminder.tags.some((tag) => selectedTags.includes(tag))
          );

          if (filteredReminders.length > 0) {
            const randomReminder =
              filteredReminders[
                Math.floor(Math.random() * filteredReminders.length)
              ];
            chrome.notifications.create({
              type: "basic",
              iconUrl: "icon-48.png",
              title: randomReminder.title,
              message: randomReminder.description,
              priority: 2,
            });
          }
        }
      }
    );
  }
});

// Function to update the alarm based on the frequency
const updateAlarm = (frequency) => {
  chrome.alarms.clear("sendNotification", () => {
    chrome.alarms.create("sendNotification", { periodInMinutes: frequency });
  });
};

// Listen for changes in the frequency and update the alarm accordingly
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.frequency) {
    updateAlarm(changes.frequency.newValue);
  }
});

// Set an alarm for notifications based on the user's frequency setting on load
chrome.storage.local.get("frequency", (result) => {
  const frequency = result.frequency || 60;
  updateAlarm(frequency);
});

/* global chrome */
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  // Initialize alarm on installation
  chrome.storage.local.get("frequency", (result) => {
    const frequency = result.frequency || 60;
    console.log("Initial frequency set to:", frequency);
    updateAlarm(frequency);
  });
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
        width: 460,
        height: 650,
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

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("Alarm triggered:", alarm.name);
  if (alarm.name === "sendNotification") {
    chrome.storage.local.get(
      ["reminders", "enableNotifications", "selectedTags"],
      (result) => {
        console.log("Alarm storage get result:", result);
        if (result.enableNotifications) {
          const reminders = result.reminders || [];
          const selectedTags = result.selectedTags || [];

          // If no tags are selected, consider all reminders
          const filteredReminders =
            selectedTags.length === 0
              ? reminders
              : reminders.filter((reminder) =>
                  reminder.tags.some((tag) => selectedTags.includes(tag))
                );

          if (filteredReminders.length > 0) {
            const randomReminder =
              filteredReminders[
                Math.floor(Math.random() * filteredReminders.length)
              ];

            // Truncate text for notification
            const truncateText = (text, length) => {
              return text.length > length
                ? text.substring(0, length) + "..."
                : text;
            };
            const maxLength = 100; // Adjust this value as needed

            chrome.notifications.create(randomReminder.id, {
              type: "basic",
              iconUrl: "icon-48.png",
              title: randomReminder.title,
              message: truncateText(randomReminder.description, maxLength),
              priority: 2,
              buttons: [{ title: "View More" }],
              contextMessage: randomReminder.id, // Pass the reminder ID as context message
            });
          }
        }
      }
    );
  }
});

const updateAlarm = (frequency) => {
  console.log("Updating alarm with frequency:", frequency);
  chrome.alarms.clear("sendNotification", () => {
    chrome.alarms.create("sendNotification", { periodInMinutes: frequency });
    console.log("Alarm created with period:", frequency, "minutes");
  });
};

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.frequency) {
    const newFrequency = changes.frequency.newValue;
    console.log("Frequency changed, updating alarm to:", newFrequency);
    updateAlarm(newFrequency);
  }
});

// Set an alarm for notifications based on the user's frequency setting on load
chrome.storage.local.get("frequency", (result) => {
  const frequency = result.frequency || 60;
  console.log("Setting initial alarm frequency to:", frequency);
  updateAlarm(frequency);
});

// Handle notification button click
chrome.notifications.onButtonClicked.addListener(
  (notificationId, buttonIndex) => {
    if (buttonIndex === 0) {
      chrome.windows.create({
        url: `reminderPopup.html?reminderId=${notificationId}`,
        type: "popup",
        width: 600,
        height: 400,
      });
    }
  }
);

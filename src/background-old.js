/* global chrome */

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log(msg);
  console.log(sender);
  sendResponse("Front the background Script");
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed");
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    injectContentScriptInAllTabs();
  }
});

function injectContentScriptInAllTabs() {
  console.log("Installing content script in all tabs.");
  const contentScriptFile =
    chrome.runtime.getManifest().content_scripts[0].js[0];
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    for (let i = 0; i < tabs.length; i++) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[i].id },
          files: [contentScriptFile],
        },
        (result) => {
          if (chrome.runtime.lastError) {
            console.error(
              `Error injecting content script into tab ${tabs[i].id}: ${chrome.runtime.lastError.message}`
            );
          } else {
            console.log(`Injected content script into tab ${tabs[i].id}`);
          }
        }
      );
    }
  });
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background.js Received Message:", message);
  if (message.type === "TEXT_SELECTED") {
    chrome.storage.local.set({ selectedText: message.text }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting selectedText:", chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError });
      } else {
        console.log("Selected text set successfully.");
        chrome.action.openPopup();
        sendResponse({ success: true });
      }
    });
    return true; // Indicates that we will send a response asynchronously
  }
});

// Alarm and notification logic remains the same
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

chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed");
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    injectContentScriptInAllTabs();
  }
});

/* global chrome */
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const reminderId = urlParams.get("reminderId");

  if (reminderId) {
    chrome.storage.local.get("reminders", (result) => {
      const reminders = result.reminders || [];
      const reminder = reminders.find((r) => r.id === reminderId);
      if (reminder) {
        document.getElementById("reminderTitle").textContent = reminder.title;
        document.getElementById("reminderDescription").textContent =
          reminder.description;
      } else {
        console.error(`Reminder with ID ${reminderId} not found`);
      }
    });
  } else {
    console.error("No reminderId found in URL parameters");
  }
});

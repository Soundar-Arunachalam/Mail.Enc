chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "open_popup") {
      chrome.action.openPopup();
    }
  });
  
document.getElementById("keyring").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html#/keyring") });
});

document.getElementById("dashboard").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html#/dashboard") });
});

document.getElementById("file-encryption").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html#/file-encryption") });
});

document.getElementById("security-log").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html#/security-log") });
});

document.getElementById("reload").addEventListener("click", () => {
  chrome.runtime.reload();
});

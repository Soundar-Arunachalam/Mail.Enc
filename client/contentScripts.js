(function () {
  // Add a button to Gmail UI
  const button = document.createElement("button");
  button.style.position = "fixed";
  button.style.bottom = "10px";
  button.style.right = "10px";
  button.style.zIndex = "1000";
  button.style.background = "transparent";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.padding = "0";

  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("icons/zigzag-icon.png");
  img.alt = "Mail.Enc";
  img.style.width = "50px";
  img.style.height = "50px";

  button.appendChild(img);
  document.body.appendChild(button);

  button.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "open_popup" });
  });
})();

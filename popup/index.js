function handleToggle(toggle, debugSelectors, gridSelectors) {
  // Store toggle state:
  chrome.storage.sync.set({ debugToggle: toggle });

  // Pass options to page:
  chrome.tabs.executeScript(
    { code: "var options = " + JSON.stringify({ toggle, debugSelectors, gridSelectors }) },
    function () {
      chrome.tabs.executeScript({ file: "src/index.js" });
    }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const debugClasses = ["container__heading", "container__content", "container--main"];
  const gridClasses = ["container"];

  var toggle = document.getElementById("debug-toggle");

  // Detect & handle previous state:
  chrome.storage.sync.get(["debugToggle"], function (result) {
    if (result.debugToggle) {
      toggle.checked = true;
      handleToggle(result.debugToggle, debugClasses, gridClasses);
    }
  });

  toggle.addEventListener("click", (event) => {
    handleToggle(event.target.checked, debugClasses, gridClasses);
  });
});

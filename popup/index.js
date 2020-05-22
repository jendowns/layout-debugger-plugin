function exampleFunction(toggle, selectors) {
  chrome.tabs.executeScript(
    { code: "var options = " + JSON.stringify({toggle, selectors}) },
    function() {
      chrome.tabs.executeScript({ file: "src/index.js" })
    }
  )
}

const debugClasses = [
  'container',
  'container__heading',
  'container__content',
]

document.addEventListener("DOMContentLoaded", () => {
  var toggle = document.getElementById("debug-toggle");
 
  toggle.addEventListener("click", (event) => {
    exampleFunction(event.target.checked, debugClasses);
  })
})
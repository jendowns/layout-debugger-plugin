function applyStyles() {
  let debugStyles = "";

  // Generate styles for debug selectors:
  if(options.debugSelectors.length > 0) {
    options.debugSelectors.forEach(debugClass => {
      var elements = document.querySelectorAll(`.${debugClass}`);
      if (elements.length > 0) {
        elements.forEach((element) => {
          const debugElement = document.createElement("div");
          debugElement.classList = "debug-message";
          debugElement.innerHTML = `.${debugClass}`;
          element.appendChild(debugElement);

          var rect = element.getBoundingClientRect();

          debugStyles += `
            .${debugClass} > .debug-message {
              position: absolute;
              z-index: 100000000;
              background-color: hotpink;
              padding: 8px;
              color: black;
              top: ${rect.top};
              left: ${rect.left};
            }
          `;
        });
      }
    });
  } else {
    console.log("No debug classes provided.");
  }

  // Generate styles for grid selectors:
  if(options.gridSelectors.length > 0) {
    options.gridSelectors.forEach(gridClass => {
      debugStyles += `
        .${gridClass} {
          outline: 1px solid hotpink;
        }
      `;
    });
  } else {
    console.log("No grid classes provided.");
  }

  var style = document.createElement("style");
  style.setAttribute("id", "debug-styles");
  style.innerHTML = debugStyles;
  document.head.appendChild(style);
}

function cleanupStyles() {
  // Remove style tag with debug styles:
  var styleTags = document.querySelectorAll("#debug-styles");
  styleTags.forEach((element) => element.parentNode.removeChild(element));

  // Remove all debug elements:
  var debugMessages = document.querySelectorAll(".debug-message");
  debugMessages.forEach((element) => element.parentNode.removeChild(element));
}

if (options.toggle) {
  applyStyles();
} else {
  cleanupStyles();
}

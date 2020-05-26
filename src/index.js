function applyStyles() {
  let debugStyles = "";

  // Generate styles for debug selectors:
  if (options.debugSelectors.length > 0) {
    options.debugSelectors.forEach((debugClass) => {
      var elements = document.querySelectorAll(`.${debugClass}`);
      if (elements.length > 0) {
        elements.forEach((element) => {
          /**
           * Check if a debug message has already been appended to this element.
           * This can happen if an element has multiple classes listed for debugging.
           * If true, we need to append the current `debugClass` to the existing message,
           * to avoid creating extra elements that will end up overlapping and become unreadable.
           */
          var existingDebugElement = element.querySelector(".debug-message");

          if (existingDebugElement) {
            existingDebugElement.innerHTML += `.${debugClass}`;
            return;
          }

          // Ensure that screenreaders have proper context around the debug messages:
          var a11yMessage = document.createElement("span");
          a11yMessage.setAttribute(
            "style",
            "position:absolute;height:1px;width:1px;overflow: hidden;clip:rect(1px,1px,1px,1px);white-space:nowrap;"
          );
          a11yMessage.innerHTML = "Debugging class: ";

          // Create a new element to display debug info:
          var debugElement = document.createElement("div");
          debugElement.classList = "debug-message";
          debugElement.appendChild(a11yMessage);
          debugElement.innerHTML += `.${debugClass}`;
          element.appendChild(debugElement);

          var rect = element.getBoundingClientRect();

          debugStyles += `
            .${debugClass} > .debug-message {
              position: absolute;
              z-index: 100000000;
              background-color: hotpink;
              color: black;
              top: ${rect.top}px;
              left: ${rect.left}px;
              opacity: 0.75;
              font-size: 12px;
            }
          `;
        });
      }
    });
  } else {
    console.log("No debug classes provided.");
  }

  // Generate styles for grid selectors:
  if (options.gridSelectors.length > 0) {
    options.gridSelectors.forEach((gridClass) => {
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

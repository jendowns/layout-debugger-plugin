/**
 * Run before appending debugging elements and styles
 * to ensure that class names are valid (and, if not, provide feedback).
 */
function isValidClass(className) {
  if (!className || className.length < 1) {
    console.warn("Skipping empty or `undefined` class name. 🤔");
    return false;
  }

  if (className.toString().match(/^[0-9]+$/g)) {
    console.warn(
      "Skipping the class name '" +
        className +
        "' because it is a number and not a valid class name. 🧐"
    );
    return false;
  }

  if (!className.match(/-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g)) {
    console.warn(
      "Skipping the class name '" +
        className +
        "' because it has invalid characters. 😭"
    );
    return false;
  }

  if (className.includes(".")) {
    console.warn(
      "Skipping the class name '" +
        className +
        '" because it has a period.\nPlease write this class name without the period,\nand please write each class name separately (not strung together, as you would write a selector in CSS). 😅'
    );
    return false;
  }

  return true;
}

/**
 * Whenever debugging is toggled "on", iterate through selectors
 * in `options` to append debugging elements to the DOM
 * and apply appropriate styles.
 */
function applyStyles() {
  let debugStyles = "";

  // Generate styles for debug selectors:
  if (options.debugSelectors.length > 0) {
    options.debugSelectors.forEach((debugClass) => {
      if (!isValidClass(debugClass)) {
        return;
      }

      var elements = document.querySelectorAll(`.${debugClass}`);
      if (elements.length > 0) {
        elements.forEach((element, index) => {
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

          // Create a new element with a unique ID to display debug info:
          var debugElement = document.createElement("div");
          debugElement.classList = "debug-message";
          const debugID = `debug-message-${index}`;
          debugElement.id = debugID;
          debugElement.appendChild(a11yMessage);
          debugElement.innerHTML += `.${debugClass}`;
          element.appendChild(debugElement);

          var rect = element.getBoundingClientRect();

          debugStyles += `
            .${debugClass} > .debug-message#${debugID} {
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
      if (!isValidClass(gridClass)) {
        return;
      }

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

/**
 * Whenever debugging is toggled "off", elements and style tags
 * that were added to the document need to be removed.
 */
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

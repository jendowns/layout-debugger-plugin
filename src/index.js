function applyActiveStyles() {
  var debugStyles = "";
  options.selectors.forEach((debugClass) => {

    let elements = document.querySelectorAll(`.${debugClass}`);
    if(elements.length > 0) {
      elements.forEach(element => {

        const debugElement = document.createElement('div');
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
  
  var style = document.createElement('style');
  style.setAttribute('id', 'debug-styles')
  style.innerHTML = debugStyles;
  document.head.appendChild(style);
}

function applyInactiveStyles() {
  // Remove style tag with debug styles:
  var styleTag = document.getElementById('debug-styles');
  styleTag.parentNode.removeChild(styleTag);

  // Remove all debug elements:
  var debugMessages = document.querySelectorAll('.debug-message');
  debugMessages.forEach(element => {
    console.log(element);
    element.parentNode.removeChild(element);
  })
}

if (options.toggle) {
  applyActiveStyles();
} else {
  applyInactiveStyles();
}

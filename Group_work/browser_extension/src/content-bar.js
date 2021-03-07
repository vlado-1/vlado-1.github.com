/**
 * @module Bar
 * @description
 * This module is responsible for creating a fixed bar interface that other modules
 * can attach elements onto.
 *
 * Functions: createBar(), createUpperBar(), createBarTooltip(), activateBar()
 *
 * Dependencies: content-timer.js
 *
 */

/**
 * Creates a bar that stays fixed even with scrolling.
 * @return {object} - The bar element
 */
const createBar = function () {
  const bar = document.createElement("div");
  bar.id = "bar";
  // based on https://www.w3schools.com/howto/howto_css_fixed_footer.asp
  bar.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0);
    width: 50%;
    max-width: 200px;
    margin: auto;
    background-color: red;
    color: white;
    font-size: 20px;
    text-align: center;
    padding: 5px;
    border-radius: 8px;`
  return bar;
}

/**
 * Creates a bar that sits above the primary bar, intended for displaying
 * additional information.
 * @return {object} - The bar element.
 */
const createUpperBar = function () {
  const bar = createBar();
  bar.id = "bar-upper";
  bar.style.bottom = "30px";
  bar.style.backgroundColor = "green";
  bar.style.padding = "0 5px";
  return bar;
}

/**
 * Creates a bar tooltip that shows when the primary bar is hovered.
 * @return {object} - The tooltip element.
 */
const createBarTooltip = function (bar) {
  const tooltip = document.createElement("div");
  tooltip.id = "timer-hover";
  tooltip.style.cssText = `
    font-family: 'Roboto'
    display: none;
    position: absolute;
    background-color: #282828;
    left: 50%;
    bottom: 100%;
    transform: translate(-50%, 0);
    width: 200px;
    z-index: 10;
    padding: 5px;
    border-radius: 8px;`
  tooltip.style.display = "none";

  tooltip.appendChild(timerInputElement());
  tooltip.appendChild(presetsElement());
  tooltip.appendChild(submitButton());

  bar.addEventListener("mouseover", () => {
    let timerDisplay = document.getElementById("timer-output").innerHTML;
    // only allow timer input box to pop up if timer isn't already running
    if (timerDisplay == "0h 0m 0s") {
      tooltip.style.display = "block"
    }
  });
  bar.addEventListener("mouseout", () => tooltip.style.display = "none");

  return tooltip;
}
/**
 * Adds a bar to the YouTube page. Includes upperbar, timer output and tooltip.
 *
 */
const activateBar = function () {
  // create bar and add to YouTube body
  const upperBar = createUpperBar();
  document.querySelector("body").appendChild(upperBar);

  upperBar.appendChild(timerStateElement());

  const bar = createBar();
  document.querySelector("body").appendChild(bar);

  bar.appendChild(timerOutputElement());
  bar.appendChild(createBarTooltip(bar));



  setDefaultBreakTimer();
}

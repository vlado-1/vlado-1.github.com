/**
 * @module Timer
 * @description
 * This module is responsible for timer input and output on the YouTube page.
 *
 * Functions: time(...), timeToMillis(...), constrain(...), getTimerInput(...),
 * displayTime(...), fillTimerInput(...), disableTimerInput(), displayTimerState(...),
 * sendStartTimer(), setBreakTimer(...), presetButton(...), submitButton(),
 * timerInputElement(), timerOutputElement(), timerStateElement(), presetsElement()
 *
 * Dependencies: Chome API
 */

/**
 * Helper function to quickly create time durations.
 *
 * @param {number} h - hours.
 * @param {number} m - minutes.
 * @param {number} [s=0] - seconds.
 * @return {object} - object containing h, m, s.
 */
const time = (h, m, s = 0) => ({h, m, s});

/**
 * Converts time to milliseconds.
 *
 * @param {object} object - object containing h, m, s.
 * @return {number} - converted time in milliseconds.
 */
const timeToMillis = ({h, m, s}) => ((h * 60 + m) * 60 + s) * 1000;

/**
 * Constrains n between min and max.
 *
 * @param {number} n - The number to constrain.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @return {number} - n if min < n < max, otherwise min or max depending on n.
 */
const constrain = (n, min, max) => Math.max(Math.min(n, max), min);

/**
 * Gets all input elements of the timer.
 *
 * @return {array} - Expected order in array is: hours, minutes, seconds, submit.
 */
const getTimerInput = () => [...document.querySelectorAll("#timer-input input")];

/**
 * Displays time in the #timer-output element
 *
 * @param {number} time - the time to display.
 */
const displayTime =
  time => document.querySelector("#timer-output").textContent = time;

/**
 * Fills timer input with given values
 *
 * @param {object} object - object containing h, m, s.
 * @return {function} - curried function.
 */
const fillTimerInput = ({h = 0, m = 0, s = 0}) => () => {
  const [hours, minutes, seconds] = getTimerInput();
  hours.value = h;
  minutes.value = m;
  seconds.value = s;
}

/**
 * Disables timer input.
 */
const disableTimerInput = () => getTimerInput().forEach(x => x.disabled = true);

/**
 * Shows the current state in the #timer-state element.
 *
 * @param {string} state - the state to be displayed.
 */
const displayTimerState = state => {
  const stateOutput = document.querySelector("#timer-state")
  stateOutput.textContent = state;
  stateOutput.parentNode.style.padding = state ? "5px" : "0 5px";
}

/**
 * After validating input, sends a message to start the timer.
 *
 * @return {boolean} - Whether the timer started successfully.
 */
const sendStartTimer = function() {
  const numericInputElements = getTimerInput().filter(x => x.type === "number");
  const numericInputs = numericInputElements
    .map(x => constrain(x.value, x.min, x.max))
    .map(Math.floor);
  numericInputElements.forEach((x, i) => x.value = numericInputs[i]);

  if (numericInputs.every(x => x === 0)) return false;
  const totalTime = timeToMillis(time(...numericInputs));

  // send message to background.js to start timer
  chrome.storage.sync.get("timer-state", result => {
    // only send if timer is inactive
    if (result["timer-state"] === "inactive") {
      // set the timer state to active and start timer
      chrome.storage.sync.set({"timer-state": "active"});
      // port is for communication with background script
      const port = chrome.runtime.connect({name: "timer"});
      port.postMessage({msg: "start-timer", totalTime});
      // user should not be able to input a new time
      disableTimerInput();
    }
  });
  return true;
}

let presetButtonStyle = "font-family: 'Roboto'; border-radius: 50%;  padding: 10px; margin-right: 12px; margin-left: 12px;"

/**
 * Sets break timer to specified time.
 *
 * @param {number} time - time for break timer.
 * @return {function} - function that runs it.
 */
const setBreakTimer = (time, name) => () => {
  // convert break time to milliseconds
  const totalTime = timeToMillis(time);

  // send message to background.js
  const port = chrome.runtime.connect({name: "timer"});
  port.postMessage({msg: "break-timer", totalTime});

  // ensure all buttons are not coloured
  document.getElementById("preset-10").style = presetButtonStyle;
  document.getElementById("preset-20").style = presetButtonStyle;
  document.getElementById("preset-10s").style = presetButtonStyle;

  // colour button when selected
  const button = document.getElementById(name);
  if (button) {
    if (name == "preset-10") {
      button.style = presetButtonStyle + "background: #61c8ef";
    }
    else if (name == "preset-20") {
      button.style = presetButtonStyle + "background: #61c8ef";
    }
    else if (name == "preset-10s") {
      button.style = presetButtonStyle + "background: #61c8ef";
    }

  }
}

/** default break timer is 30 minutes */
const setDefaultBreakTimer = setBreakTimer(time(0, 30));

/**
 * Creates a preset button with a certain style.
 * @param {string} name - the name of the button.
 * @param {object} [breakTime = {h: 0, m: 30}] - time to break for.
 *
 * @return {object} - the button.
 */
const presetButton = (name, breakTime = time(0, 30)) => () => {
  const btn = document.createElement("button");
  btn.textContent = name;
  const id = `preset-${name.toLowerCase()}`;
  btn.id = id;
  btn.style = presetButtonStyle;
  btn.addEventListener("click", setBreakTimer(breakTime, id));
  return btn;
}
// define some presets
const strictPreset = presetButton("10", time(0, 10));
const workPreset = presetButton("20", time(0, 20));
const demoPreset = presetButton("10s", time(0, 0, 10));

/**
 * Create a submit button.
 * @return {object} - the button.
 */
const submitButton = () => {
  const btn = document.createElement("button");
  btn.textContent = "Start Rescue Timer";
  btn.value = "submit";
  btn.id = "timer-submit";
  btn.addEventListener("click", sendStartTimer);
  btn.style = `
  font-family: 'Roboto';
  background-color: white;
  border: none;
  color: #282828;
  padding: 5px 12px;
  margin: 5px;
  text-align: center;
  display: inline-block;
  font-size: 12px;
  border-radius: 8px;
  `
  return btn;
}
/**
 * Creates the timer input table.
 * @return {object} - A div element containing the timer input.
 */
const timerInputElement = function() {
  const div = document.createElement("div");
  div.id = "timer-input";
  div.innerHTML = `
    <h3 style = "font-size: 24px;">Rescue Timer</h3>
    <table style="margin:auto;">
      <tr>
        <td><a style="font-size: 15px;">Hours:</a>
        <td><input type="number" id="timer-hours" min="0" max="23" value="0"
        style="font-fmily: 'Roboto'; border-radius: 8px; text-align:center;">
      </tr>
      <tr>
        <td><a style="font-size: 15px;">Minutes:</a>
        <td><input type="number" id="timer-minutes" min="0" max="59" value="0"
        style="font-fmily: 'Roboto'; border-radius: 8px; text-align:center;">
      </tr>
      <tr>
        <td><a style="font-size: 15px;">Seconds:</a>
        <td><input type="number" id="timer-seconds" min="0" max="59" value="0"
        style="font-fmily: 'Roboto'; border-radius: 8px; text-align:center;">
      </tr>

      </table>
    `;
  div.style = `
  a {
    font-family: 'Roboto';
    font-size: 14px;
    font-color:red;
  }

  h3 {
    font-family: 'Roboto';
    font-size: 20px;
  }
  `
  return div;
}

/**
 * Creates an element to display the timer. Attaches onto the bar.
 * @return {object} - element.
 */
const timerOutputElement = function() {
  const span = document.createElement("span");
  span.id = "timer-output";
  span.textContent = "0h 0m 0s";
  return span;
}

/**
 * Creates an element to display the timer state. Attaches onto the bar.
 * @return {object} - element.
 */
const timerStateElement = function() {
  const span = document.createElement("span");
  span.id = "timer-state";
  return span;
}

/**
 * Creates an element that contains preset buttons. Attaches onto the bar.
 * @return {object} - element.
 */
const presetsElement = function() {
  const div = document.createElement("div");
  div.id = "timer-presets"
  const title = document.createElement("h3");
  title.textContent = "Set Break Time";
  title.style = "font-family: 'Roboto'; font-size: 18px;";
  div.appendChild(title);

  // add different presets
  div.appendChild(strictPreset());
  div.appendChild(workPreset());
  div.appendChild(demoPreset());


  // default break time disclaimer
  const defaultExplanation = document.createElement("a");
  defaultExplanation.style = "font-family: 'Roboto'; font-size: 12px";
  defaultExplanation.textContent = "Default break time is 30 minutes";
  div.appendChild(defaultExplanation);

  return div;
}

chrome.runtime.onMessage.addListener(request => {
  if (request.timerOutput) displayTime(request.timerOutput);
  else if (request.alert) alert(request.alert);
});

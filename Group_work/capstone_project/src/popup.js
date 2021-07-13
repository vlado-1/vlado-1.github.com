/**
 * @module OptionsMenu
 * @description
 * the module is responsible for connecting the front end
 * popup.html extension menu with the rest of the extension
 * application particularly to the files that manipulate
 * the YouTube DOM
 *
 * Functions: getSwitches(), setOptions(), turnButtonOn(), turnButtonOff(),
 *            initialiseButton(), showInterface()
 *
 * Dependencies: popup.html, Chrome API
 */

/**
 * Helper functions to get all the switches.
 * @return {array} - Array of elements.
*/
const getSwitches = () => [...document.querySelectorAll("input[type=checkbox]")];

/**
 * Function to save all options inputs to chrome storage
*/
getSwitches().forEach(x => {
  // Update settings on launch
  chrome.storage.sync.get(x.id, result => x.checked = result[x.id]);
  // Set click handler
  x.onclick = () => chrome.storage.sync.set({[x.id]: x.checked});
});

/**
 * Sets layout options switches - when on is true, all options are on,
 * when on is false, the switches are disabled
 *
 * @param {boolean} on - determines whether switches are activated
 */

const setOptions = on => function() {
  getSwitches().forEach(x => {
    x.checked = on;
    chrome.storage.sync.set({[x.id]: on});
    x.disabled = !on;
  });
}
const disableOptions = setOptions(false);
const enableOptions = setOptions(true);

/**
 * Function to turn on big button
 */
const turnButtonOn = function() {
  const bigButton = document.getElementById("big-button");
  bigButton.textContent = "On";
  bigButton.style.backgroundColor = "#6cbc2f";
  chrome.storage.sync.set({"button": "On"});
}

/**
 * Function to turn off big button
*/
const turnButtonOff = function() {
  const bigButton = document.getElementById("big-button");
  bigButton.textContent = "Off";
  bigButton.style.backgroundColor = "red";
  chrome.storage.sync.set({"button": "Off"});
  disableOptions();
}

/**
 * Function to set the button to the current state
 * So that button is by default turned on when the user first installs the extension
*/
const initialiseButton = function() {
  chrome.storage.sync.get("button", result => {
    if (!result["button"] || result["button"] === "On") {
      turnButtonOn();
    }
    else {
      turnButtonOff();
    }
  });
}

/**
 * Function to change the button colour and content when clicked
*/
document.getElementById("big-button").onclick = function() {
  chrome.storage.sync.get("button", result => {
      if (result["button"] === "On") {
        turnButtonOff();
      }
      else {
        turnButtonOn();
        enableOptions();
      }
  });
}

/**
 * Function to change the options menu
 * If the user is blocked, timer of remaining time the user will be locked out for is displayed
 * If the user is not blocked, button and layout options switches are displayed
 */
const showInterface = function() {
  chrome.storage.sync.get("timer-state", result => {
    const blocked = result["timer-state"] === "Blocked";
    document.getElementById("interface1").style.display = blocked ? "none" : "";
    document.getElementById("interface2").style.display = blocked ? "" : "none";
  });
}

window.addEventListener("load", initialiseButton);
window.addEventListener("load", showInterface);

/**
 * @module BingeTimer
 * @description
 * contains a class that wraps the Timer class. It provides the Timer class
 * with the additional feature of being able to set off flags at
 * certain points in time,in order to activate certain extension
 * features. The time to set off a flag depends on what % of the
 * total time has already passed.
 * This module also contains event listeners that orchestrate the
 * execution  of the timer. The timer is created and utilised
 * only when the background script receives a message from the
 * popup.js javascript file.
 *
 * Functions: BingeTimer.stage(...)
 *            BingeTimer.func() == same functions as for Timer class
 *            createBreakTimer(...), startBreakTimer(), createBingeTimer(...),
 *            startBingeTimer()
 * Flags:     Stage 1: Autoplay disabled
 *            Stage 2: Greyscale thumbnails, Lowercase titles, remove mouseover thumbnail animations
 *            Stage 3: Inspirational quotes appear when you hover cursor over thumbnails
 *                     sidebar quotes on search page, sidebar quotes on watch page
 *            Stage 4: Quote ads
 *            Stage 5: Recommendations removed and home page layout redesigned
 *
 * Dependencies: Chrome API, background-timer.js, popup.js
 */

// Timer Decorator or Wrapper
class BingeTimer {
  // stageN: time when Nth set of features should activate
  constructor(timer) {
    this.timer = timer;

    const thresholds = [0.5, 0.6, 0.7, 0.8, 0.9];

    this.stages = thresholds.map(x => Math.floor(timer.timeTotal * (1 - x)));
    this.stageStrings = [
      "No Restrictions",
      "Autoplay Disabled",
      "Thumbnail Redesign",
      "Quotes",
      "Quote Ads",
      "Complete Restrictions"
    ];
  }

  /**
  * Activate the appropriate set of features
  */

  stage() {
    chrome.storage.sync.get("timer-state", result => {
      let stage = result["timer-state"];

      // determine which stage you are on
      for (const i in this.stages) {
        const stageString = this.stageStrings[i];
        if (this.timeRemainingAsMillis > this.stages[i]) {
          if (stage !== stageString) {
            chrome.storage.sync.set({ "timer-state": stageString });
            console.log(stageString);
          }
          return;
        }
      }
      if (stage !== "Complete Restrictions") {
        chrome.storage.sync.set({ "timer-state": "Complete Restrictions" });
        console.log("Complete Restrictions");
        chrome.tabs.query({ active: true }, tabs => {
          if (tabs.length === 0) return;
          chrome.tabs.sendMessage(
            tabs[0].id,
            { alert: "This session is almost over!" }
          );
        });
      }
    });
  }

  /**
  * Start timer
  */
  start() {
    this.timer.start(this.stage, this.stages);
  }

  /**
  * Stop timer
  */
  stop() {
    this.timer.stop();
  }

  /**
  * Reset timer
  */
  reset() {
    this.timer.reset();
  }

  set updateFrequency(freq) {
    this.timer.updateFrequency = freq;
  }

  set onUpdate(f) {
    this.timer.onUpdate = () => {
      f();
      this.stage.bind(this)();
    }
  }

  set onFinish(f) {
    this.timer.onFinish = f;
  }

  get timeRemainingAsObject() {
    return this.timer.timeRemainingAsObject;
  }
  get timeRemainingAsString() {
    return this.timer.timeRemainingAsString;
  }
  get timeRemainingAsMillis() {
    return this.timer.timeRemainingAsMillis;
  }
  get timePassedAsPercent() {
    return this.timer.timePassedAsPercent;
  }
}

// End OF BingeTimer class

// only run in live environment where chrome API exists
if (typeof chrome !== "undefined") {
  // for development purposes, reset timer to inactive on extension reload
  chrome.storage.sync.set({ "timer-state": "inactive" });

  /**
  * Function to directly manipulate the Dom of the popup (options layout)
  * the popup should have an element with id="timer-output"
  * and also send message to active tab
  *
  * @param {object} timer
  */

  const updatePopupWithTimer = timer => () => {
    chrome.tabs.query({ active: true }, tabs => {
      if (tabs.length === 0) return;
      chrome.tabs.sendMessage(
        tabs[0].id,
        { timerOutput: timer.timeRemainingAsString }
      );
    });
    chrome.extension.getViews().forEach(view => {
      const insertPoint = view.document.querySelector("#timer-output");
      if (insertPoint) insertPoint.textContent = timer.timeRemainingAsString;
    });
  }

  let bingeTimer;
  let breakTimer;

  /**
  * Function to create break timer
  *
  * @param {object} time
  */
  const createBreakTimer = function (time) {
    breakTimer = new Timer(time);
    breakTimer.onUpdate = updatePopupWithTimer(breakTimer);

    // once timer reaches 0, set state to back to inactive and reset break timer
    breakTimer.onFinish = () => {
      chrome.storage.sync.set({ "timer-state": "inactive" });
      breakTimer = undefined;
    }
    breakTimer.updateFrequency = 100;
    breakTimer.submitted = true;
  }

  /**
  * Function to start break timer
  */
  const startBreakTimer = function () {
    // only start if conditions are met
    if (!breakTimer || !breakTimer.submitted) return;
    chrome.storage.sync.get("timer-state", result => {
      if (result["timer-state"] === "Blocked") breakTimer.start();
    });
  }

  /**
  * Function to create binge timer
  *
  * @param {object} time
  */
  const createBingeTimer = function (time) {
    bingeTimer = new BingeTimer(new Timer(time));
    bingeTimer.onUpdate = updatePopupWithTimer(bingeTimer);

    // once timer reaches 0, set state to blocked and start the break timer
    bingeTimer.onFinish = () => {
      chrome.storage.sync.set({ "timer-state": "Blocked" });
      startBreakTimer();
    }
    // increase accuracy by updating every 0.1 seconds
    bingeTimer.updateFrequency = 100;
  }

  /**
  * Function to start binge timer
  */
  const startBingeTimer = () => bingeTimer.start();

  // event listener to receive a message
  chrome.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(msg => {
      // message for binge timer
      if (msg.msg === "start-timer") {
        // create a binge timer with time included in the message
        createBingeTimer(msg.totalTime);
        startBingeTimer();
      }
      // message for break timer
      else if (msg.msg === "break-timer") {
        // create a normal timer with time included in the message
        createBreakTimer(msg.totalTime);
        startBreakTimer();
      }
    });
  });
}

// export functions for testing
if (typeof module !== "undefined") {
  module.exports = BingeTimer;
}

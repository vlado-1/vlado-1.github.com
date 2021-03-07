/**
* @Module Timer
*/

/**
 * @description
 * Countdown timer using dates to maintain accuracy.
 * Responsible for running the timer that measures session length and break length.
 * Adapted from https://www.w3schools.com/howto/howto_js_countdown.asp
 */
class Timer {
  /**
   * Create a timer.
   * @param {number} millis - Timer duration in milliseconds.
   * @property {number} timeTotal - total time in milliseconds.
   * @property {number} timeRemaining - time remaining in milliseconds.
   * @property {boolean} running - Indicates whether the timer is running.
   * @property {number} updateFrequency - How often the timer updates when running (default 1 second).
   * @property {function} onUpdate - Function that is run when timer updates.
   * Override for custom functionality.
   * @property {function} onFinish - Function that is run when timer finishes.
   * Override for custom functionality.
   * @property {object} timeRemainingAsObject - time remaining in object form.
   * @property {number} timeRemainingAsObject.h - hours remaining.
   * @property {number} timeRemainingAsObject.m - minutes remaining.
   * @property {number} timeRemainingAsObject.s - seconds remaining.
   * @property {string} timeRemainingAsString - time remaining in string format.
   */
  constructor(millis) {
    this.timeTotal = millis;
    this.timeRemaining = millis;
    this.running = false;
    this.updateFrequency = 1000;
    this.onUpdate = undefined;
    this.onFinish = undefined;
  }
  /**
   * Start or resume the timer.
   * @return {boolean} Whether operation was successful.
   */
  start() {
    if (this.running) return false;
    this.running = true;

    this.lastStep = new Date();
    this.timer = setInterval(() => {

      // run onUpdate function if one is specified
      if (typeof this.onUpdate === "function") this.onUpdate();

      // as setInerval isn't 100% accurate, use dates to calculate time passed
      this.currentStep = new Date();
      const elapsedTime = this.currentStep - this.lastStep;
      this.timeRemaining -= elapsedTime;

      // stop timer when it reaches 0
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.stop();
        // run onFinish function if one is specified
        if (typeof this.onFinish === "function") this.onFinish();
      }

      this.lastStep = this.currentStep;
    }, this.updateFrequency);
    return true;
  }
  /**
   * Pause or stop the timer.
   * @return {boolean} Whether operation was successful.
   */
  stop() {
    if (!this.running) return false;
    clearInterval(this.timer);
    this.running = false;
    return true;
  }
  /** Reset the timer. */
  reset() {
    this.stop();
    this.timeRemaining = this.timeTotal;
  }
  // getters to retrieve timer output in different formats
  get timeRemainingAsObject() {
    // convert to hours, minutes, seconds
    const hours = Math.floor(this.timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((this.timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((this.timeRemaining % (1000 * 60)) / 1000);
    return {hours, minutes, seconds};
  }
  get timeRemainingAsString() {
    const {hours, minutes, seconds} = this.timeRemainingAsObject;
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  get timeRemainingAsMillis() {
    return this.timeRemaining;
  }
  get timePassedAsPercent() {
    return (100 * (1 - this.timeRemaining / this.timeTotal)).toFixed(2);
  }
}

// export functions for testing
if (typeof module !== "undefined") {
  module.exports = Timer;
}

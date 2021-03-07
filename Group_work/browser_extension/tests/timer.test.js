const Timer = require("../src/background-timer.js");
const BingeTimer = require("../src/background-timer.js");

jest.setTimeout(20000);

// since the timer is based on real dates
// we use a mock function to count seconds
const secondCounter = jest.fn();

// mock function that warns the user
const mockWarnUser = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("> Timer Tests", () => {
  describe("- Normal", () => {
    /* Requirements: TR
    //
    // Testing Function: BingeTimer
    //
    // Objective: Verify that the user receives a warning when
    //            the timer is at 90%
    //
    // Assumptions: None
    //
    // Function Input: timer of 10 seconds
    //
    // Expected Effect: Warning is received at 90% (± 1% is acceptable)
    //
    */
    // test("#TR2T1 warning the user", done => {
    // 
    //   // set timer for 1 second
    //   const t = new Timer(1000);
    //   t.updateFrequency = 100;
    //   t.onUpdate = secondCounter;
    //   t.start();
    //
    //   // 0 seconds have passed on timer
    //   expect(secondCounter.mock.calls.length).toBe(0);
    //
    //   // let it run 50%
    //   setTimeout(() => {
    //     // 5 seconds have passed on timer
    //     expect(secondCounter.mock.calls.length).toBe(5);
    //
    //
    //   }, 505);
    //
    //   // let it run 90%
    //   setTimeout(() => {
    //     // 9 seconds have passed on timer
    //     expect(secondCounter.mock.calls.length).toBe(9);
    //
    //     // expect the warning to occur
    //     expect(mockWarnUser.mock.calls.length).toBe(1);
    //
    //     done();
    //   }, 905);
    //
    // });
  });
  describe("- Unit Tests for correctness", () => {
    let t;
    beforeEach(() => {
      // set new timer for 1 second
      // updating every 0.1 seconds
      t = new Timer(1000);
      t.updateFrequency = 100;
    });

    test("Verify initial values", () => {
      expect(t.timeRemainingAsMillis).toBe(1000);
      expect(t.running).toBeFalsy();
    });

    test("Starting the timer", done => {
      // first time should start the timer
      expect(t.start()).toBeTruthy();
      expect(t.running).toBeTruthy();
      // starting second time should fail
      expect(t.start()).toBeFalsy();
      setTimeout(() => {
        // time timeRemaining has gone down
        expect(t.timeRemainingAsMillis).toBeLessThan(1000);

        done()
      }, 100);
    });

    test("Stopping the timer", done => {
      t.start();
      setTimeout(() => {
        // stopping for first time
        expect(t.stop()).toBeTruthy();
        expect(t.running).toBeFalsy();

        // stopping for second time should fail
        expect(t.stop()).toBeFalsy();

        done();
      }, 100);
    });

    test("Resetting the timer", done => {
      t.start();
      setTimeout(() => {
        expect(t.timeRemainingAsMillis).toBeLessThan(1000);

        t.reset();

        // should be back to 1000
        expect(t.timeRemainingAsMillis).toBe(1000);
        expect(t.running).toBeFalsy();

        done();
      }, 100);
    });

    test("Running for full duration", done => {
      t.start();
      setTimeout(() => {
        expect(t.timeRemainingAsMillis).toBe(0);
        expect(t.running).toBeFalsy();

        done();
      }, 1050); // allow some room for error
    });

    test("onUpdate is called each cycle", done => {
      const fun = jest.fn();
      t.onUpdate = fun;
      t.start();
      setTimeout(() => {
        expect(fun).toBeCalledTimes(10);

        done();
      }, 1050)
    });

    test("onFinish is called at the end", done => {
      // define empty function
      const fun = jest.fn();
      t.onFinish = fun;
      t.start();
      setTimeout(() => {
        // shouldn't be called  yet
        expect(fun).not.toBeCalled();
      }, 700);
      setTimeout(() => {
        expect(t.timeRemainingAsMillis).toBe(0);
        expect(fun).toBeCalled();

        done();
      }, 1050);
    });

    test("Output getters", () => {
      // as timeRemainingAsMillis is a trivial getter, it won't be tested

      // set timer to 90 mins
      t.timeTotal = 90 * 60 * 1000;
      t.timeRemaining = 90 * 60 * 1000;
      expect(t.timeRemainingAsObject).toEqual({hours: 1, minutes: 30, seconds: 0});
      expect(t.timeRemainingAsString).toBe("1h 30m 0s");
      expect(parseInt(t.timePassedAsPercent)).toBeCloseTo(0);

      // the timer has gone down 45 mins
      t.timeRemaining = 45 * 60 * 1000;
      expect(t.timeRemainingAsObject).toEqual({hours: 0, minutes: 45, seconds: 0});
      expect(t.timeRemainingAsString).toBe("0h 45m 0s");
      expect(parseInt(t.timePassedAsPercent)).toBeCloseTo(50);
    });
  });
});

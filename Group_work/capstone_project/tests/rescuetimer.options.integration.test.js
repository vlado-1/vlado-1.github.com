const puppeteer = require("puppeteer");

jest.setTimeout(20000);

//                       //
//  Rescue Timer Tests   //
//                       //

describe("> Rescue Timer and Options Integration Tests", () => {

    afterAll(() => setTimeout(() => process.exit(), 1000));

    describe("- Normal", () => {

        let browser;

        beforeEach(async function () {

            browser = await puppeteer.launch({
                headless: false,
                args: [
                    "--disable-extensions-except=" + require("path").resolve("../src"),
                    "--load-extension=" + require("path").resolve("../src")],
                defaultViewport: null
            });
        });

        afterEach(async function () {
            await browser.close();
        });

        /* Requirements: RT3
        //
        // Testing: Rescue Timer
        //
        // Objective: To check that the autoplay button gets turned off and disabled
        //            after 50% of timer session length elapses.
        //
        // Assumptions: The other timer requirements (RT), all pass.
        //
        // Timer Input: User Input of 4 seconds into the time
        //
        // Expected Effect: After 2 seconds, the autoplay feature gets
        //                  disabled and turned off.
        //
        */
        test("RT3T1: Check the autoplay feature is disabled after 50% of time has elapsed", async () => {
          let youTubePage = await browser.newPage();
          await youTubePage.goto("https://www.youtube.com/watch?v=0X9DYRLmTNY");

          // emulate user hovering over timer bar
          selector = '#bar';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          // emulating user input for timer
          await youTubePage.$eval('#timer-seconds', el => el.value = '4');

          // Waiting for disable autoplay button to appear
          selector = '#toggle';
          await youTubePage.waitForSelector(selector);

          // emulate user pressing submit button
          selector = '#timer-submit';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          selector = '#timer-state';
          await youTubePage.waitForSelector(selector);
          await youTubePage.waitFor(selector => document.querySelector(selector).textContent == "Autoplay Disabled", {}, selector);

            // check if autoplay is active
            let isActive = await youTubePage.evaluate(() => {
              const autoplay = document.getElementById("toggle")
                || document.getElementById("improved-toggle");

              if (autoplay == null) return true;

              return autoplay.hasAttribute("active");
            });
            expect(isActive).toBe(false);

            // check autoplay can no longer be toggled
            let toggleDisabled = await youTubePage.evaluate(() => {
              const autoplay = document.getElementById("toggle")
                || document.getElementById("improved-toggle");

              if (autoplay == null) return true;

              return autoplay.hasAttribute("disabled");
            });
            expect(toggleDisabled).toBe(true);
            ;
        });

        /* Requirements: RT3
        //
        // Testing: Rescue Timer, Thumbnail
        //
        // Objective: To check that thumbnails become grey, lose their animations, and
        //            get lowercase titles after 60% of timer session length elapses.
        //
        // Assumptions: The other timer requirements (RT), all pass.
        //
        // Timer Input: User Input of 5 seconds into the timer
        //
        // Expected Effect: Initially, all thumbnails are normal.
        //                  After 3 seconds, the thumbnails get lowercase titles,
        //                  and become grey and animationless.
        //
        */
        test("RT3T2, RT3T3 and RT3T4: Check that thumbnails are changed after 60% of time has elapsed", async () => {
          let youTubePage = await browser.newPage();
          await youTubePage.goto("https://www.youtube.com/watch?v=0X9DYRLmTNY");

          // emulate user hovering over timer bar
          selector = '#bar';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          // INTIAL CHECK
          // verify thumbnails grey-scaled
          selector = "ytd-watch-next-secondary-results-renderer";
          await youTubePage.waitForSelector(selector);
          let colour = await youTubePage.$eval(
              selector,
              e => getComputedStyle(e).filter
          );
          expect(colour).not.toBe("grayscale(1)");

          // verify thumbnail titles are lowercase
          let titles = await youTubePage.$eval(
            selector,
            e => getComputedStyle(e).textTransform
          );
          expect(titles).not.toBe("lowercase");

          // verify thumbnail animations Off
          let animation = await youTubePage.$$eval(
              "mouse-overlay",
              elements => elements.map(e => getComputedStyle(e).display)
          );
          animation.forEach(x => expect(x).not.toBe("none"));


          // emulating user input for timer
          await youTubePage.$eval('#timer-seconds', el => el.value = '5');

          // emulate user pressing submit button
          selector = '#timer-submit';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          selector = '#timer-state';
          await youTubePage.waitForSelector(selector);
          await youTubePage.waitFor(selector => document.querySelector(selector).textContent == "Thumbnail Redesign", {}, selector);

          // verify thumbnails grey-scaled
          colour = await youTubePage.$eval(
              "ytd-watch-next-secondary-results-renderer",
              e => getComputedStyle(e).filter
          );
          expect(colour).toBe("grayscale(1)");

          // verify thumbnail titles are lowercase
          titles = await youTubePage.$eval(
            "ytd-watch-next-secondary-results-renderer",
            e => getComputedStyle(e).textTransform
          );
          expect(titles).toBe("lowercase");

          // verify thumbnail animations Off
          animation = await youTubePage.$$eval(
              "mouse-overlay",
              elements => elements.map(e => getComputedStyle(e).display)
          );
          animation.forEach(x => expect(x).toBe("none"));
        });


        /* Requirements: RT3
        //
        // Testing: Rescue Timer
        //
        // Objective: To check that thumbnails get mousover quotes
        //            after 70% of timer session length elapses.
        //
        // Assumptions: The other timer requirements (RT), all pass.
        //
        // Timer Input: User Input of 4 seconds into the timer
        //
        // Expected Effect: Initially, no thumbnails have mouseover quotes.
        //                  Then after 3 seconds, the thumbnails get mouseover
        //                  quotes.
        //
        */
        test("RT3T5: Check that thumbnails have mouseover quotes after 70% of time has elapsed", async () => {
          let youTubePage = await browser.newPage();
          await youTubePage.goto("https://www.youtube.com/watch?v=0X9DYRLmTNY");

          // check thumbnails have no title attribute
          selector = '#thumbnail';
          await youTubePage.waitForSelector(selector);
          let thumbnailTitle = await youTubePage.$$eval(
            "thumbnail",
            elements => elements.map(e => getComputedStyle(e).getPropertyValue('title'))
          );
          thumbnailTitle.forEach(x => expect(x).toBe("none"));

          // emulate user hovering over timer bar
          selector = '#bar';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          // emulating user input for timer
          await youTubePage.$eval('#timer-seconds', el => el.value = '4');

          // emulate user pressing submit button
          selector = '#timer-submit';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          selector = '#timer-state';
          await youTubePage.waitForSelector(selector);
          await youTubePage.waitFor(selector => document.querySelector(selector).textContent == "Quotes", {}, selector);

          // check thumbnails have a title attribute
          thumbnailTitle = await youTubePage.$$eval(
              "thumbnail",
              elements => elements.map(e => getComputedStyle(e).getPropertyValue('title'))
          );
          thumbnailTitle.forEach(x => expect(x).not.toBe("none"));
        });

        /* Requirements: RT3
        //
        // Testing: Rescue Timer
        //
        // Objective: To check that inspirational ads are present on the watch page
        //            after 80% of timer session length elapses.
        //
        // Assumptions: The other timer requirements (RT), all pass.
        //
        // Timer Input: User Input of 10 seconds into the timer
        //
        // Expected Effect: Initially, no inspirational ads appear.
        //                  Then after 8 seconds, Inspirational ads
        //                  get added to the screen.
        //
        */
        test("RT3T6: Check that inspirational ads are inserted after 80% of time has elapsed", async () => {
          let youTubePage = await browser.newPage();
          await youTubePage.goto("https://www.youtube.com/watch?v=BMuknRb7woc");

          // Check image does not exist
          let quoteExists = await youTubePage.evaluate(() => {
            return document.querySelector("#quoteImg") == null;
          });
          expect(quoteExists).toBe(true);

          // emulate user hovering over timer bar
          selector = '#bar';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          // emulating user input for timer
          await youTubePage.$eval('#timer-seconds', el => el.value = '10');

          // emulate user pressing submit button
          selector = '#timer-submit';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          selector = '#timer-state';
          await youTubePage.waitForSelector(selector);
          await youTubePage.waitFor(selector => document.querySelector(selector).textContent == "Quote Ads", {}, selector);

          await youTubePage.waitForSelector("#quoteImg");
          // Check image exist
          quoteExists = await youTubePage.evaluate(() => {
            return document.querySelector("#quoteImg") != null;
          });
          expect(quoteExists).toBe(true);
          ;
        });

        /* Requirements: RT3
        //
        // Testing: Rescue Timer
        //
        // Objective: To check that quotes got inserted into the watch page
        //            after 70% of timer session length elapses.
        //
        // Assumptions: The other timer requirements (RT), all pass.
        //
        // Timer Input: User Input of 10 seconds into the timer.
        //
        // Expected Effect: Initiall no quotes present.
        //                  After 7 seconds, the quotes should exist on the watch page.
        //
        */
        test("RT3T7: Check that quotes exist after 70% of time has elapsed (Watch Page)", async () => {
          let youTubePage = await browser.newPage();
          await youTubePage.goto("https://www.youtube.com/watch?v=BMuknRb7woc");

          // Check image does not exist
          let quoteExists = await youTubePage.evaluate(() => {
            return document.querySelector(".quote2") == null;
          });
          expect(quoteExists).toBe(true);

          // emulate user hovering over timer bar
          selector = '#bar';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          // emulating user input for timer
          await youTubePage.$eval('#timer-seconds', el => el.value = '10');

          // emulate user pressing submit button
          selector = '#timer-submit';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          selector = '#timer-state';
          await youTubePage.waitForSelector(selector);
          await youTubePage.waitFor(selector => document.querySelector(selector).textContent == "Quotes", {}, selector);

          await youTubePage.waitForSelector(".quote2");
          // Check image exist
          quoteExists = await youTubePage.evaluate(() => {
            return document.querySelector(".quote2") != null;
          });
          expect(quoteExists).toBe(true);
        });

        /* Requirements: RT3
        //
        // Testing: Rescue Timer
        //
        // Objective: To check that quotes got inserted into the search page
        //            after 70% of timer session length elapses.
        //
        // Assumptions: The other timer requirements (RT), all pass.
        //
        // Timer Input: User Input of 10 seconds into the timer.
        //
        // Expected Effect: Initiall no quotes present.
        //                  After 7 seconds, the quotes should exist on the search page.
        //
        */
        test("RT3T7: Check that quotes exist after 70% of time has elapsed (Search Page)", async () => {
          let youTubePage = await browser.newPage();
          await youTubePage.goto("https://www.youtube.com/results?search_query=clasical+music");

          // Check image does not exist
          let quoteExists = await youTubePage.evaluate(() => {
            return document.querySelector(".quote1") == null;
          });
          expect(quoteExists).toBe(true);

          // emulate user hovering over timer bar
          selector = '#bar';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          // emulating user input for timer
          await youTubePage.$eval('#timer-seconds', el => el.value = '10');

          // emulate user pressing submit button
          selector = '#timer-submit';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          selector = '#timer-state';
          await youTubePage.waitForSelector(selector);
          await youTubePage.waitFor(selector => document.querySelector(selector).textContent == "Quotes", {}, selector);

          await youTubePage.waitForSelector(".quote1");
          // Check image exist
          quoteExists = await youTubePage.evaluate(() => {
            return document.querySelector(".quote1") != null;
          });
          expect(quoteExists).toBe(true);
          ;
        });

        /* Requirements: RT3
        //
        // Testing: Rescue Timer
        //
        // Objective: To check that the timer reaches the warning state
        //            after 90% of timer session length elapses.
        //
        // Assumptions: The other timer requirements (RT), all pass.
        //
        // Timer Input: User Input of 10 seconds into the timer.
        //
        // Expected Effect: The timer state should be on "Complete Restricitons",
        //                  after 9 seconds.
        //
        */
        test("RT3T8: Check that warning displayed after 90% of time has elapsed", async () => {
          let youTubePage = await browser.newPage();
          await youTubePage.goto("https://www.youtube.com/watch?v=BMuknRb7woc");

          // dismiss the alert when it comes up
          youTubePage.on("dialog", async dialog => await dialog.dismiss());

          // emulate user hovering over timer bar
          selector = '#bar';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          // emulating user input for timer
          await youTubePage.$eval('#timer-seconds', el => el.value = '10');

          // emulate user pressing submit button
          selector = '#timer-submit';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          selector = '#timer-state';
          await youTubePage.waitForSelector(selector);
          await youTubePage.waitFor(selector => document.querySelector(selector).textContent == "Complete Restrictions", {}, selector);

          // Check image exist
          let atWarning = await youTubePage.evaluate(() => {
            return document.querySelector("#timer-state").textContent == "Complete Restrictions";
          });
          expect(atWarning).toBe(true);
        });

        /* Requirements: RT3
        //
        // Testing: Rescue Timer
        //
        // Objective: To check that the extensions kicks the user off YouTube
        //            after 100% of timer session length elapses.
        //
        // Assumptions: The other timer requirements (RT), all pass.
        //
        // Timer Input: User Input of 2 seconds into the timer.
        //
        // Expected Effect: The page URL should no longer be on YouTube after 2 seconds,
        //                  and the User cannot change it back to YouTube.
        //
        */
        test("RT3T9: Check that user blocked from YouTube after 100% of time has elapsed", async () => {
          let youTubePage = await browser.newPage();
          await youTubePage.goto("https://www.youtube.com/watch?v=BMuknRb7woc");

          // dismiss the alert when it comes up
          youTubePage.on("dialog", async dialog => await dialog.dismiss());

          // emulate user hovering over timer bar
          selector = '#bar';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          // emulating user input for timer
          await youTubePage.$eval('#timer-seconds', el => el.value = '2');

          // emulate user pressing submit button
          selector = '#timer-submit';
          await youTubePage.waitForSelector(selector);
          await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

          await youTubePage.waitFor(() => window.location != "https://www.youtube.com/watch?v=BMuknRb7woc");

          // Not on youtube anymore
          let atYouTube = await youTubePage.evaluate(() => {
            return location == "https://www.youtube.com/watch?v=BMuknRb7woc";
          });
          expect(atYouTube).toBe(false);

          // Try to go to YouTube
          await youTubePage.goto("https://www.youtube.com");

          // Not allowed
          atYouTube = await youTubePage.evaluate(() => {
            return location.href == "https://www.youtube.com";
          });
          expect(atYouTube).toBe(false);
        });

});

describe("- Boundary", () => {
  let browser;
  let page;

  beforeEach(async function () {

    browser = await puppeteer.launch({
        headless: false,
        args: [
            "--disable-extensions-except=" + require("path").resolve("../src"),
            "--load-extension=" + require("path").resolve("../src")],
        defaultViewport: null
    });

                  // loading the chrome extension popup
    const extensionName = "Rebuilding the Web: Media and Video"
    const targets = await browser.targets();
    const extensionTarget = targets.find(({ _targetInfo }) => {
      return _targetInfo.title === extensionName && _targetInfo.type === 'background_page';
    });

    const extensionUrl = extensionTarget._targetInfo.url || '';
    const [, , extensionID] = extensionUrl.split('/');

    const extensionPopupHtml = 'popup.html'

    page = await browser.newPage();
    // going to chrome extension popup menu
    await page.goto(`chrome-extension://${extensionID}/${extensionPopupHtml}`);
  });


  afterEach(async function () {
    await browser.close();
  });

  /* Requirements: RT3
  //
  // Testing: Rescue Timer
  //
  // Objective: To check that the timer integration tests still pass if the
  //            the timer is refreshed.
  //
  // Assumptions: The other timer requirements (RT3), all pass.
  //
  // Function Input: User Input of 10 seconds into the timer.
  //
  // Expected Effect: The timer state should go through all the changes that were
  //                  previously tested in RT1-RT9.2
  //
  */
  test("RT3T10: Check the rescue timer functions properly after a page refresh", async () => {
    let youTubePage = await browser.newPage();
    await youTubePage.goto("https://www.youtube.com/watch?v=0X9DYRLmTNY");

    // dismiss the alert when it comes up
    youTubePage.on("dialog", async dialog => await dialog.dismiss());

    // emulate user hovering over timer bar
    selector = '#bar';
    await youTubePage.waitForSelector(selector);
    await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

    // emulating user input for timer
    await youTubePage.$eval('#timer-seconds', el => el.value = '10');

    // emulate user pressing submit button
    selector = '#timer-submit';
    await youTubePage.waitForSelector(selector);
    await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

    // reload page
    await youTubePage.reload();

    // Check autoplay passes
    selector = '#toggle';
    await youTubePage.waitForSelector(selector);

    selector = '#timer-state';
    await youTubePage.waitForSelector(selector);
    await youTubePage.waitFor(selector => document.querySelector(selector).textContent == "Autoplay Disabled", {}, selector);


    let isActive = await youTubePage.evaluate(() => {
      const autoplay = document.getElementById("toggle")
        || document.getElementById("improved-toggle");
      if (autoplay == null) return true;

      return autoplay.hasAttribute("active");
    });
    expect(isActive).toBe(false);

    let toggleDisabled = await youTubePage.evaluate(() => {
      const autoplay = document.getElementById("toggle")
        || document.getElementById("improved-toggle");
      if (autoplay == null) return true;
      return autoplay.hasAttribute("disabled");
    });
    expect(toggleDisabled).toBe(true);

    // check thumbnail tests pass
    selector = '#timer-state';
    await youTubePage.waitForSelector(selector);
    await youTubePage.waitFor(selector => document.querySelector(selector).textContent == "Thumbnail Redesign", {}, selector);

    let colour = await youTubePage.$eval(
        "ytd-watch-next-secondary-results-renderer",
        e => getComputedStyle(e).filter
    );
    expect(colour).toBe("grayscale(1)");

    let titles = await youTubePage.$eval(
      "ytd-watch-next-secondary-results-renderer",
      e => getComputedStyle(e).textTransform
    );
    expect(titles).toBe("lowercase");

    let animation = await youTubePage.$$eval(
        "mouse-overlay",
        elements => elements.map(e => getComputedStyle(e).display)
    );
    animation.forEach(x => expect(x).toBe("none"));

    // check quotes exist and mous-over feature activated
    selector = '#timer-state';
    await youTubePage.waitForSelector(selector);
    await youTubePage.waitFor(selector => document.querySelector(selector).textContent == "Quotes", {}, selector);

    await youTubePage.waitForSelector(".quote2");
    let quoteExists = await youTubePage.evaluate(() => {
      return document.querySelector(".quote2") != null;
    });
    expect(quoteExists).toBe(true);

    let thumbnailTitle = await youTubePage.$$eval(
        "thumbnail",
        elements => elements.map(e => getComputedStyle(e).getPropertyValue('title'))
    );
    thumbnailTitle.forEach(x => expect(x).not.toBe("none"));

    // check quote ads appear
    await youTubePage.waitForSelector("#quoteImg");
    quoteExists = await youTubePage.evaluate(() => {
      return document.querySelector("#quoteImg") != null;
    });
    expect(quoteExists).toBe(true);

    // check warning
    selector = '#timer-state';
    await youTubePage.waitForSelector(selector);
    await youTubePage.waitFor(selector => document.querySelector(selector).textContent == "Complete Restrictions", {}, selector);

    let atWarning = await youTubePage.evaluate(() => {
      return document.querySelector("#timer-state").textContent == "Complete Restrictions";
    });
    expect(atWarning).toBe(true);

    // get bloacked at the end
    await youTubePage.waitFor(() => window.location != "https://www.youtube.com/watch?v=BMuknRb7woc");

    // Not on youtube anymore
    let atYouTube = await youTubePage.evaluate(() => {
      return location == "https://www.youtube.com/watch?v=BMuknRb7woc";
    });
    expect(atYouTube).toBe(false);

    await youTubePage.goto("https://www.youtube.com");

    atYouTube = await youTubePage.evaluate(() => {
      return location.href == "https://www.youtube.com";
    });
    expect(atYouTube).toBe(false);
  });

  /* Requirements: OS1-IT5
  //
  // Testing: Rescue Timer, Options Menu
  //
  // Objective: To check that the timer does not activate any features if the
  //            extension menu button is toggled off.
  //
  // Assumptions: The other timer requirements (RT), all pass.
  //              The other options menu tests (OS), all pass
  //
  // Function Input: User Input of 10 seconds into the timer.
  //
  // Expected Effect: Although the timer reaches the same states as before, it
  //                  should not cause any features to be activated on the page.
  //
  */
  test("OS1-IT5: Check that pressing the Off button on the options menu causes the rescue timer to do nothing", async () => {

    // emulate user toggling off the ON/OFF button
    selector = '#big-button';
    await page.waitForSelector(selector);
    await page.evaluate((selector) => document.querySelector(selector).click(), selector);

    let youTubePage = await browser.newPage();
    await youTubePage.goto("https://www.youtube.com/watch?v=0X9DYRLmTNY");

    // dismiss the alert when it comes up
    youTubePage.on("dialog", async dialog => await dialog.dismiss());

    // emulate user hovering over timer bar
    selector = '#bar';
    await youTubePage.waitForSelector(selector);
    await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

    // emulating user input for timer
    await youTubePage.$eval('#timer-seconds', el => el.value = '10');

    // emulate user pressing submit button
    selector = '#timer-submit';
    await youTubePage.waitForSelector(selector);
    await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

    // Check autoplay passes
    selector = '#toggle';
    await youTubePage.waitForSelector(selector);

    selector = '#timer-state';
    await youTubePage.waitForSelector(selector);
    await youTubePage.waitFor(selector => document.querySelector(selector).textContent == "Autoplay Disabled", {}, selector);


    let isActive = await youTubePage.evaluate(() => {
      const autoplay = document.getElementById("toggle")
        || document.getElementById("improved-toggle");
      if (autoplay == null) return true;

      return autoplay.hasAttribute("active");
    });
    expect(isActive).not.toBe(false);

    let toggleDisabled = await youTubePage.evaluate(() => {
      const autoplay = document.getElementById("toggle")
        || document.getElementById("improved-toggle");
      if (autoplay == null) return true;
      return autoplay.hasAttribute("disabled");
    });
    expect(toggleDisabled).not.toBe(true);

    // check thumbnail tests pass
    selector = '#timer-state';
    await youTubePage.waitForSelector(selector);
    await youTubePage.waitFor(selector => document.querySelector(selector).textContent == "Thumbnail Redesign", {}, selector);

    let colour = await youTubePage.$eval(
        "ytd-watch-next-secondary-results-renderer",
        e => getComputedStyle(e).filter
    );
    expect(colour).not.toBe("grayscale(1)");

    let titles = await youTubePage.$eval(
      "ytd-watch-next-secondary-results-renderer",
      e => getComputedStyle(e).textTransform
    );
    expect(titles).not.toBe("lowercase");

    let animation = await youTubePage.$$eval(
        "mouse-overlay",
        elements => elements.map(e => getComputedStyle(e).display)
    );
    animation.forEach(x => expect(x).not.toBe("none"));

    // check quotes exist and mous-over feature activated
    selector = '#timer-state';
    await youTubePage.waitForSelector(selector);
    await youTubePage.waitFor(selector => document.querySelector(selector).textContent == "Quotes", {}, selector);

    let quoteExists = await youTubePage.evaluate(() => {
      return document.querySelector(".quote2") != null;
    });
    expect(quoteExists).not.toBe(true);

    let thumbnailTitle = await youTubePage.$$eval(
        "thumbnail",
        elements => elements.map(e => getComputedStyle(e).getPropertyValue('title'))
    );
    thumbnailTitle.forEach(x => expect(x).toBe("none"));

    // check quote ads appear
    quoteExists = await youTubePage.evaluate(() => {
      return document.querySelector("#quoteImg") != null;
    });
    expect(quoteExists).not.toBe(true);

    // check warning
    selector = '#timer-state';
    await youTubePage.waitForSelector(selector);
    await youTubePage.waitFor(selector => document.querySelector(selector).textContent == "Complete Restrictions", {}, selector);

    let atWarning = await youTubePage.evaluate(() => {
      return document.querySelector("#timer-state").textContent == "Complete Restrictions";
    });
    expect(atWarning).toBe(true);

    // get bloacked at the end
    await youTubePage.waitFor(() => window.location != "https://www.youtube.com/watch?v=BMuknRb7woc");

    // Not on youtube anymore
    let atYouTube = await youTubePage.evaluate(() => {
      return location == "https://www.youtube.com/watch?v=BMuknRb7woc";
    });
    expect(atYouTube).toBe(false);

    await youTubePage.goto("https://www.youtube.com");

    atYouTube = await youTubePage.evaluate(() => {
      return location.href == "https://www.youtube.com";
    });
    expect(atYouTube).toBe(false);
  });
});
});

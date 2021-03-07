const puppeteer = require("puppeteer");
const contentFunctions = require("../src/content-motivation.js");

jest.setTimeout(40000);

//                                     //
//       Motivation Content Tests      //
//                                     //

describe("> Motivation Content Tests", () => {

    // Global variables
    let browser;
    let page;

    afterAll(async function() {
      await browser.close();
    });


    beforeAll(async function() {
      browser = await puppeteer.launch();
    });

    describe("- Normal", () => {
        /* Requirements: MC1
        //
        // Testing Function: antiBingeTextQuotes(), Update()
        //
        // Objective: To verify that quotes are displayed on the right hand
        //            side of the search results page, and still display properly
        //            after scrolling.
        //
        // Assumptions: None
        //
        // Function Input: True
        //
        // Expected Effect: Quotes are properly displayed.
        //
        */
        test("#MC1T1 Display quotes in search results page", async() => {

            page = await browser.newPage();
            await page.goto("https://www.youtube.com/results?search_query=coding");

            // inject code into page.
            await page.addScriptTag({path: "./__mocks__/mock-content-helper.js"});
            await page.addScriptTag({path: "../src/content-motivation.js"});

            // run function
            await page.waitForSelector("ytd-secondary-search-container-renderer");
            await page.evaluate(contentFunctions.antiBingeTextQuotes, true);

            // check if quotes in correct position and correct style
            let properQuotes = await page.evaluate( () =>
              {
                let elements = document.getElementsByClassName("ytd-secondary-search-container-renderer");
                if (elements == null) {
                  return false;
                }
                let properStyle = true;
                for (let element of elements) {
                  let bool = getComputedStyle(e).textTransform == "padding-top:30%; font-size:1.8rem; font-weight:200";
                  // If any 'bool' is false then 'properStyle' will be set to false in the end.
                  properStyle = properStyle && bool;
                }
                return properStyle;
              }
            );

            expect(properQuotes).toBe(true);

            // Testing after scrolling down the page (Part 1):
            let scrollBrowser = await puppeteer.launch({
                headless: false,
                args: [
                    "--disable-extensions-except=" + require("path").resolve("../src"),
                    "--load-extension=" + require("path").resolve("../src")],
                defaultViewport: null
            });
            let scrollPage = await scrollBrowser.newPage();
            await scrollPage.goto("https://www.youtube.com/results?search_query=coding");

            // emulate user hovering over timer bar
            selector = '#bar';
            await scrollPage.waitForSelector(selector);
            await scrollPage.evaluate((selector) => document.querySelector(selector).click(), selector);

            // emulating user input for timer
            await scrollPage.$eval('#timer-seconds', el => el.value = '10');

            // emulate user pressing submit button
            selector = '#timer-submit';
            await scrollPage.waitForSelector(selector);
            await scrollPage.evaluate((selector) => document.querySelector(selector).click(), selector);

            selector = '#timer-state';
            await scrollPage.waitForSelector(selector);
            await scrollPage.waitFor(selector => document.querySelector(selector).textContent == "Quotes", {}, selector);

            await scrollPage.evaluate(`window.scrollBy(0, 5000);`);
            await scrollPage.waitFor(".quote1");

            properQuotes = await scrollPage.evaluate( () =>
              {
                let elements = document.getElementsByClassName("ytd-secondary-search-container-renderer");
                if (elements == null) {
                  return false;
                }
                let properStyle = true;
                for (let element of elements) {
                  let bool = getComputedStyle(e).textTransform == "padding-top:30%; font-size:1.8rem; font-weight:200";
                  // If any 'bool' is false then 'properStyle' will be set to false in the end.
                  properStyle = properStyle && bool;
                }
                return properStyle;
              }
            );
            expect(properQuotes).toBe(true);

            scrollBrowser.close();

            await page.close();
        });

        /* Requirements: MC1
        //
        // Testing Function: antiBingeTextQuotes()
        //
        // Objective: To verify that quotes are displayed on the right hand
        //            side of the search results page for multiple search
        //            pages.
        //
        // Assumptions: MC1T1 passes
        //
        // Function Input: True
        //
        // Expected Effect: Quotes are properly displayed.
        //
        */
        test("#MC1T2 Display quotes in multiple search results pages (Search coding)", async() => {

            page = await browser.newPage();

            // 1 - Search "coding"
            await page.goto("https://www.youtube.com/results?search_query=coding");

            await page.addScriptTag({path: "./__mocks__/mock-content-helper.js"});
            await page.addScriptTag({path: "../src/content-motivation.js"});

            await page.waitForSelector("ytd-secondary-search-container-renderer");
            await page.evaluate(contentFunctions.antiBingeTextQuotes, true);

            let properQuotes = await page.evaluate( () =>
              {
                let elements = document.getElementsByClassName("ytd-secondary-search-container-renderer");
                if (elements == null) {
                  return false;
                }
                let properStyle = true;
                for (let element of elements) {
                  let bool = getComputedStyle(e).textTransform == "padding-top:30%; font-size:1.8rem; font-weight:200";
                  // If any 'bool' is false then 'properStyle' will be set to false in the end.
                  properStyle = properStyle && bool;
                }
                return properStyle;
              }
            );

            expect(properQuotes).toBe(true);

            await page.close();
        });

        test("#MC1T2 Display quotes in multiple search results pages (Search cats)", async() => {

            page = await browser.newPage();

            // 2 - Search "cats"
            await page.goto("https://www.youtube.com/results?search_query=cats");

            await page.addScriptTag({path: "./__mocks__/mock-content-helper.js"});
            await page.addScriptTag({path: "../src/content-motivation.js"});

            await page.waitForSelector("ytd-secondary-search-container-renderer");
            await page.evaluate(contentFunctions.antiBingeTextQuotes, false);

            properQuotes = await page.evaluate( () =>
              {
                let elements = document.getElementsByClassName("ytd-secondary-search-container-renderer");
                if (elements == null) {
                  return false;
                }
                let properStyle = true;
                for (let element of elements) {
                  let bool = getComputedStyle(e).textTransform == "padding-top:30%; font-size:1.8rem; font-weight:200";
                  // If any 'bool' is false then 'properStyle' will be set to false in the end.
                  properStyle = properStyle && bool;
                }
                return properStyle;
              }
            );

            expect(properQuotes).toBe(true);
            await page.close();

        });

        test("#MC1T2 Display quotes in multiple search results pages (Search javascript)", async() => {

            page = await browser.newPage();

            // 3 - Search "javascript"
            await page.goto("https://www.youtube.com/results?search_query=javascript");

            await page.addScriptTag({path: "./__mocks__/mock-content-helper.js"});
            await page.addScriptTag({path: "../src/content-motivation.js"});

            await page.waitForSelector("ytd-secondary-search-container-renderer");
            await page.evaluate(contentFunctions.antiBingeTextQuotes, false);

            properQuotes = await page.evaluate( () =>
              {
                let elements = document.getElementsByClassName("ytd-secondary-search-container-renderer");
                if (elements == null) {
                  return false;
                }
                let properStyle = true;
                for (let element of elements) {
                  let bool = getComputedStyle(e).textTransform == "padding-top:30%; font-size:1.8rem; font-weight:200";
                  // If any 'bool' is false then 'properStyle' will be set to false in the end.
                  properStyle = properStyle && bool;
                }
                return properStyle;
              }
            );

            expect(properQuotes).toBe(true);
            await page.close();
        });

        /* Requirements: MC2
        //
        // Testing Function: antiBingeTextQuotes(), Update()
        //
        // Objective: To verify that quotes are displayed on the right hand
        //            side of the video pages, and still display properly
        //            after scrolling.
        //
        // Assumptions: None
        //
        // Function Input: True
        //
        // Expected Effect: DOM contains elements of class "quote1" in the
        //                  right location beside the recommended videos.
        //
        */
        test("#MC2T1 Display quotes on the video viewing page", async() => {

            page = await browser.newPage();
            await page.goto("https://www.youtube.com/watch?v=WEDIj9JBTC8&t=20s");
            // inject code into page.
            await page.addScriptTag({path: "./__mocks__/mock-content-helper.js"});
            await page.addScriptTag({path: "../src/content-motivation.js"});
            await page.waitForSelector("ytd-watch-flexy #secondary");
            await page.evaluate(contentFunctions.antiBingeTextQuotes, true);

            // 2 - check quotes are displayed with recommended videos
            await page.waitForSelector(".quote2");
            quotesExist = await page.evaluate(() =>
              document.getElementsByClassName("quote2").length > 0
            );
            expect(quotesExist).toBe(true);

            correctLocation = await page.evaluate(() =>
              {
                let plocation = document.querySelector("ytd-watch-next-secondary-results-renderer #items");
                let quotes = document.getElementsByClassName("quote2");
                let correctLoc = true;
                let i = 0;
                for (; i < quotes.length ; i++) {
                  if (quotes[i].parentNode != plocation){
                    correctLoc = false;
                  }
                }
                return correctLoc;
              }
            );
            expect(correctLocation).toBe(true);

            // Testing after scrolling down the page:
            let scrollBrowser = await puppeteer.launch({
                headless: false,
                args: [
                    "--disable-extensions-except=" + require("path").resolve("../src"),
                    "--load-extension=" + require("path").resolve("../src")],
                defaultViewport: null
            });
            let scrollPage = await scrollBrowser.newPage();
            await scrollPage.goto("https://www.youtube.com/watch?v=WEDIj9JBTC8&t=20s");

            // emulate user hovering over timer bar
            selector = '#bar';
            await scrollPage.waitForSelector(selector);
            await scrollPage.evaluate((selector) => document.querySelector(selector).click(), selector);

            // emulating user input for timer
            await scrollPage.$eval('#timer-seconds', el => el.value = '10');

            // emulate user pressing submit button
            selector = '#timer-submit';
            await scrollPage.waitForSelector(selector);
            await scrollPage.evaluate((selector) => document.querySelector(selector).click(), selector);

            selector = '#timer-state';
            await scrollPage.waitForSelector(selector);
            await scrollPage.waitFor(selector => document.querySelector(selector).textContent == "Quotes", {}, selector);

            await scrollPage.evaluate(`window.scrollBy(0, 5000);`);
            await scrollPage.waitFor(500);

            await page.waitForSelector(".quote2");
            quotesExist = await page.evaluate(() =>
              document.getElementsByClassName("quote2").length > 0
            );
            expect(quotesExist).toBe(true);

            correctLocation = await page.evaluate(() =>
              {
                let plocation = document.querySelector("ytd-watch-next-secondary-results-renderer #items");
                let quotes = document.getElementsByClassName("quote2");
                let correctLoc = true;
                let i = 0;
                for (; i < quotes.length ; i++) {
                  if (quotes[i].parentNode != plocation){
                    correctLoc = false;
                  }
                }
                return correctLoc;
              }
            );
            expect(correctLocation).toBe(true);

            scrollBrowser.close();

            await page.close();
        });

        /* Requirements: MC2
        //
        // Testing Function: antiBingeTextQuotes()
        //
        // Objective: To verify that quotes are displayed on the right hand
        //            side of the video pages with appropriate spacing,
        //            and still display properly after scrolling.
        //
        // Assumptions: MC2T1 has passed.
        //
        // Function Input: True
        //
        // Expected Effect: The elements of class "quote1" are
        //                  spaced 3 thumbnails apart in the DOM (3 thumbnails
        //                  between each quote).
        //
        */
        test("#MC2T2 Display quotes with the appropriate spacing", async() => {
          page = await browser.newPage();
          await page.goto("https://www.youtube.com/watch?v=WEDIj9JBTC8&t=20s");
          // inject code into page.
          await page.addScriptTag({path: "./__mocks__/mock-content-helper.js"});
          await page.addScriptTag({path: "../src/content-motivation.js"});

          // run function
          await page.waitForSelector("ytd-watch-flexy #secondary");
          await page.evaluate(contentFunctions.antiBingeTextQuotes, true);

          // check that quotes exist
          await page.waitForSelector(".quote2");

          // check quotes are displayed amoung recommended videos
          // with the appropriate spacing
          let correctSpacing = await page.evaluate(() =>
            {
              let videos = document.querySelector("ytd-watch-next-secondary-results-renderer #items");
              let currQuoteIndex = 1;
              let prevQuoteIndex = -1;
              let index = 0;
              let correctSpacing = true;
              for (child in videos.childNodes) {
                if (prevQuoteIndex < 0 || child.classList == null || child.classList[0] != "quote2") {
                  continue;
                }
                else if (child.classList[0] == "quote2") {
                    prevQuoteIndex = currQuoteIndex;
                    currQuoteIndex = index;
                    // Difference of 4 means there are 3 thumbnails inbetween
                    //the quotes.
                    if (currQuoteIndex - prevQuoteIndex != 4) {
                      correctSpacing = false;
                      return correctSpacing;
                    }
                }
                index++;
              }
              return correctSpacing;
            }
          );
          expect(correctSpacing).toBe(true);

          // Testing after scrolling down the page:
          let scrollBrowser = await puppeteer.launch({
              headless: false,
              args: [
                  "--disable-extensions-except=" + require("path").resolve("../src"),
                  "--load-extension=" + require("path").resolve("../src")],
              defaultViewport: null
          });
          let scrollPage = await scrollBrowser.newPage();
          await scrollPage.goto("https://www.youtube.com/watch?v=WEDIj9JBTC8&t=20s");

          // emulate user hovering over timer bar
          selector = '#bar';
          await scrollPage.waitForSelector(selector);
          await scrollPage.evaluate((selector) => document.querySelector(selector).click(), selector);

          // emulating user input for timer
          await scrollPage.$eval('#timer-seconds', el => el.value = '10');

          // emulate user pressing submit button
          selector = '#timer-submit';
          await scrollPage.waitForSelector(selector);
          await scrollPage.evaluate((selector) => document.querySelector(selector).click(), selector);

          selector = '#timer-state';
          await scrollPage.waitForSelector(selector);
          await scrollPage.waitFor(selector => document.querySelector(selector).textContent == "Quotes", {}, selector);

          await scrollPage.evaluate(`window.scrollBy(0, 5000);`);
          await scrollPage.waitFor(500);

          await page.waitForSelector(".quote2");

          correctSpacing = await page.evaluate(() =>
            {
              let videos = document.querySelector("ytd-watch-next-secondary-results-renderer #items");
              let currQuoteIndex = 1;
              let prevQuoteIndex = -1;
              let index = 0;
              let correctSpacing = true;
              for (child in videos.childNodes) {
                if (prevQuoteIndex < 0 || child.classList == null || child.classList[0] != "quote2") {
                  continue;
                }
                else if (child.classList[0] == "quote2") {
                    prevQuoteIndex = currQuoteIndex;
                    currQuoteIndex = index;
                    // Difference of 4 means there are 3 thumbnails inbetween
                    //the quotes.
                    if (currQuoteIndex - prevQuoteIndex != 4) {
                      correctSpacing = false;
                      return correctSpacing;
                    }
                }
                index++;
              }
              return correctSpacing;
            }
          );
          expect(correctSpacing).toBe(true);

          scrollBrowser.close();

          await page.close();
        });

        /* Requirements: MC3
        //
        // Testing Function: antiBingeVideo()
        //
        // Objective: To verify that the quote images are being displayed
        //            correctly.
        //
        // Assumptions: None
        //
        // Function Input: (False, True)
        //
        // Expected Effect:  Image positioned above the video.
        //                   Image is of same pixel dimension as video.
        //
        */
        test("#MC3T1 Display quote images correctly on top of the video", async() =>{
          page = await browser.newPage();
          await page.goto("https://www.youtube.com/watch?v=EK32jo7i5LQ");
          await page.addScriptTag({path: "./__mocks__/mock-content-helper.js"});
          await page.addScriptTag({path: "../src/content-motivation.js"});

          // Add images
          await page.waitForSelector("#player-container");
          await page.waitForSelector("video");
          let res = await page.evaluate(contentFunctions.antiBingeVideo, true, true);
          await page.waitForSelector("#quoteImg");

          // Check image exist
          let quoteExists = await page.evaluate(() => {
            return document.querySelector("#quoteImg") != null;
          });
          expect(quoteExists).toBe(true);

          // Check image is in the right position
          let correctPosition = await page.evaluate(() => {
            let location = document.getElementById("player-container");
            let img = document.getElementById("quoteImg");
            let correctParent = img.parentNode == location;

            let correctCoordinates = img.style.position == "absolute" &&
                                     img.style.top == "0px" &&
                                     img.style.left == "0px";

            return correctParent && correctCoordinates;
          });
          expect(correctPosition).toBe(true);

          // Check the image has right dimensions
          let correctDimension = await page.evaluate(() => {
            let img = document.getElementById("quoteImg");
            let video = document.getElementsByTagName("video")[0];

            return img.style.width == video.style.width &&
                   img.style.height == video.style.height;
          });
          expect(correctDimension).toBe(true);
        });

        /* Requirements: MC3
        //
        // Testing Function: antiBingeVideo()
        //
        // Objective: To verify that the quote images are disappearing correctly
        //            after the function is called.
        //
        // Assumptions: MC3T1 has passed
        //
        // Function Input: (False, True) and (False, False)
        //
        // Expected Effect:  The quote images are removed when clicked on.
        //                   The quote images disappear after the function is
        //                    fully executed.
        //
        */
        test("#MC3T2 Quote images on the video disappear correctly", async() =>{
          page = await browser.newPage();
          await page.goto("https://www.youtube.com/watch?v=WEDIj9JBTC8&t=20s");
          await page.addScriptTag({path: "./__mocks__/mock-content-helper.js"});
          await page.addScriptTag({path: "../src/content-motivation.js"});

          // Add images
          await page.waitForSelector("#player-container");
          await page.waitForSelector("video");

          // Execute function but return before it finishes executing
          await page.evaluate(contentFunctions.antiBingeVideo, true, true);
          await page.waitForSelector("#quoteImg");
          let quoteExists = await page.evaluate(() => {
            return document.querySelector("#quoteImg") != null;
          });
          expect(quoteExists).toBe(true);
          await page.click("#quoteImg");
          let quoteNotExists = await page.evaluate(() => {
            return document.querySelector("#quoteImg") == null;
          });
          expect(quoteNotExists).toBe(true);

          // Execute function until it finishes displaying image
          await page.evaluate(contentFunctions.antiBingeVideo, true, false);

          // Wait for image to disappear
          // There will be a timeout error here if the image never disappears
          await page.waitForFunction(() => !document.querySelector('#quoteImg'));
          expect(true).toBe(true);
        });

        /* Requirements: MC4
        //
        // Testing Function: thumbnailAntiBinge()
        //
        // Objective: To verify that the HTML tag with ID "thumbnail" has
        //             a title attribute
        //
        // Assumptions: HTML tags with ID "thumbnail" has a title.
        //
        // Function Input: True
        //
        // Expected Effect: Title for HTML tags with ID "thumbnail" does not
        //                  have a value of "none"
        //
        */
        test("#MC4T1 Hovering over thumbnails displays quote", async() => {

            page = await browser.newPage();
            await page.goto("https://www.youtube.com");
            // inject code into page.
            await page.addScriptTag({path: "./__mocks__/mock-content-helper.js"});
            await page.addScriptTag({path: "../src/content-motivation.js"});

            // run function
            await page.evaluate(contentFunctions.thumbnailAntiBinge, true);
            let thumbnailTitle = await page.$$eval(
                "#thumbnail",
                elements => elements.map(e => getComputedStyle(e).getPropertyValue('title'))
            );
            thumbnailTitle.forEach(x => expect(x).not.toBe("none"));

            // Testing after scrolling down the page:
            // Testing after scrolling down the page:
            let scrollBrowser = await puppeteer.launch({
                headless: false,
                args: [
                    "--disable-extensions-except=" + require("path").resolve("../src"),
                    "--load-extension=" + require("path").resolve("../src")],
                defaultViewport: null
            });
            let scrollPage = await scrollBrowser.newPage();
            await scrollPage.goto("https://www.youtube.com/watch?v=WEDIj9JBTC8&t=20s");

            // emulate user hovering over timer bar
            selector = '#bar';
            await scrollPage.waitForSelector(selector);
            await scrollPage.evaluate((selector) => document.querySelector(selector).click(), selector);

            // emulating user input for timer
            await scrollPage.$eval('#timer-seconds', el => el.value = '10');

            // emulate user pressing submit button
            selector = '#timer-submit';
            await scrollPage.waitForSelector(selector);
            await scrollPage.evaluate((selector) => document.querySelector(selector).click(), selector);

            selector = '#timer-state';
            await scrollPage.waitForSelector(selector);
            await scrollPage.waitFor(selector => document.querySelector(selector).textContent == "Quotes", {}, selector);

            await scrollPage.evaluate(`window.scrollBy(0, 5000);`);
            await scrollPage.waitFor(500);

            await page.evaluate(contentFunctions.thumbnailAntiBinge, true);
            thumbnailTitle = await page.$$eval(
                "#thumbnail",
                elements => elements.map(e => getComputedStyle(e).getPropertyValue('title'))
            );
            thumbnailTitle.forEach(x => expect(x).not.toBe("none"));

            scrollBrowser.close();

        });
    });

      describe("- Boundary", () => {
        /* Requirements: MC1
        //
        // Testing Function: antiBingeTextQuotes()
        //
        // Objective: To verify that quotes are displayed on the right hand
        //            side of the search results page after a page refresh.
        //
        // Assumptions: MC1T1 passes
        //
        // Function Input: None
        //
        // Expected Effect: All elements apart of the class
        //                  "ytd-secondary-search-container-renderer"
        //                  have an appropriate CSS style after refresh.
        //
        */
        test("#MC1T3 Display quotes on search page after page refresh", async () => {

          page = await browser.newPage();
          await page.goto("https://www.youtube.com/results?search_query=coding");

          // Refresh
          await page.reload();
          await page.addScriptTag({path: "./__mocks__/mock-content-helper.js"});
          await page.addScriptTag({path: "../src/content-motivation.js"});
          await page.waitForSelector("ytd-secondary-search-container-renderer");
          await page.evaluate(contentFunctions.antiBingeTextQuotes, true);

          // check again
          properQuotes = await page.evaluate( () =>
            {
              let elements = document.getElementsByClassName("ytd-secondary-search-container-renderer");
              if (elements == null) {
                return false;
              }
              let properStyle = true;
              for (let element of elements) {
                let bool = getComputedStyle(e).textTransform == "padding-top:30%; font-size:1.8rem; font-weight:200";
                // If any 'bool' is false then 'properStyle' will be set to false in the end.
                properStyle = properStyle && bool;
              }
              return properStyle;
            }
          );
          expect(properQuotes).toBe(true);
          await page.close();
        });

        /* Requirements: MC2
        //
        // Testing Function: antiBingeTextQuotes()
        //
        // Objective: To verify that quotes are displayed properly on the
        //            video viewing page after a page refresh.
        //
        // Assumptions: MC2T1 and MC2T2 pass
        //
        // Function Input: None
        //
        // Expected Effect: After refresh AE2T1 and AE2T2 should pass.
        //
        */
        test("#MC2T3 Display quotes on video page after page refresh", async () => {
          page = await browser.newPage();
          await page.goto("https://www.youtube.com/watch?v=WEDIj9JBTC8&t=20s");

          // Refresh
          await page.reload();
          await page.addScriptTag({path: "./__mocks__/mock-content-helper.js"});
          await page.addScriptTag({path: "../src/content-motivation.js"});
          await page.waitForSelector("ytd-watch-flexy #secondary");
          await page.evaluate(contentFunctions.antiBingeTextQuotes, true);

          // Refresh
          await page.waitForSelector(".quote2");

          // check quotes are displayed with recommended videos
          await page.waitForSelector(".quote2");
          quotesExist = await page.evaluate(() =>
            document.getElementsByClassName("quote2").length > 0
          );
          expect(quotesExist).toBe(true);

          correctLocation = await page.evaluate(() =>
            {
              let plocation = document.querySelector("ytd-watch-next-secondary-results-renderer #items");
              let quotes = document.getElementsByClassName("quote2");
              let correctLoc = true;
              let i = 0;
              for (; i < quotes.length ; i++) {
                if (quotes[i].parentNode != plocation){
                  correctLoc = false;
                }
              }
              return correctLoc;
            }
          );
          expect(correctLocation).toBe(true);


          // check quotes are displayed amoung recommended videos
          // with the appropriate spacing
          let correctSpacing = await page.evaluate(() =>
            {
              let videos = document.querySelector("ytd-watch-next-secondary-results-renderer #items");
              let currQuoteIndex = 1;
              let prevQuoteIndex = -1;
              let index = 0;
              let correctSpacing = true;
              for (child in videos.childNodes) {
                if (prevQuoteIndex < 0 || child.classList == null || child.classList[0] != "quote2") {
                  continue;
                }
                else if (child.classList[0] == "quote2") {
                    prevQuoteIndex = currQuoteIndex;
                    currQuoteIndex = index;
                    // Difference of 4 means there are 3 thumbnails inbetween
                    //the quotes.
                    if (currQuoteIndex - prevQuoteIndex != 4) {
                      correctSpacing = false;
                      return correctSpacing;
                    }
                }
                index++;
              }
              return correctSpacing;
            }
          );
          expect(correctSpacing).toBe(true);

          await page.close();
        });
      });
});

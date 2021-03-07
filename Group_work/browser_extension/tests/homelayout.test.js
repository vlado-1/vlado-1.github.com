const puppeteer = require("puppeteer");
const contentFunctions = require("../src/content-layout.js");
const thumbnailFunctions = require("../src/content-thumbnail.js");

jest.setTimeout(20000);

describe("> Home Layout Unit Tests", () => {
  //Some global variables
  let browser;
  let page;

  describe("- Normal", () => {

    /* Test LT1T1 Requirements:
    //
    // Testing Function: changeHomeLayout()
    //
    // Objective: To verify that the YouTube icon is resized
    //
    // Assumptions:
    //
    // Function Input: false
    //
    // Expected Effect: The YouTube icon with HTML tag
    //                  #logo-icon-container.yt-icon-container.style-scope.ytd-topbar-logo-renderer
    //                  should be of height 90px and width 300px;
    */

    test("LT1T1: YouTube icon resized", async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('https://www.youtube.com');
        await page.addScriptTag({path: "../src/content-helper.js"});
        await page.addScriptTag({path: "../src/content-layout.js"});

        let ret = await page.evaluate(contentFunctions.changeHomeLayout, true);

        const height = await page.$eval(
            "#logo-icon-container.yt-icon-container.style-scope.ytd-topbar-logo-renderer",
            e => getComputedStyle(e).height
        );

        expect(height).toBe('90px');

        const width = await page.$eval(
            "#logo-icon-container.yt-icon-container.style-scope.ytd-topbar-logo-renderer",
            e => getComputedStyle(e).width
        );

        expect(width).toBe('300px');

        //page.close();
        await browser.close();
    });



    /* Test LT1T2 Requirements:
    //
    // Testing Function: changeHomeLayout()
    //
    // Objective: To verify that the YouTube icon has been repositioned to the centre of the page
    //
    // Assumptions:
    //
    // Function Input: false
    //
    // Expected Effect: The YouTube icon with HTML tag
    //                  .youtube-logo has style.top value of 25% and style.left value of 37%
    */

    test("LT1T2: YouTube icon repositioned", async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('https://www.youtube.com');
        await page.addScriptTag({path: "../src/content-helper.js"});
        await page.addScriptTag({path: "../src/content-layout.js"});

        let ret = await page.evaluate(contentFunctions.changeHomeLayout, true);

        const top = await page.$eval(
            ".youtube-logo",
            e => e.style.top
        );


        expect(top).toBe('25%');

        const left = await page.$eval(
            ".youtube-logo",
            e => e.style.left
        );

        expect(left).toBe('37%');

        //page.close();
        await browser.close();
    });

    /* Test LT1T3 Requirements:
    //
    // Testing Function: changeHomeLayout()
    //
    // Objective: To verify that the YouTube Search Bar has been resized to fit "Google format"
    //
    // Assumptions:
    //
    // Function Input: false
    //
    // Expected Effect: The YouTube search bar with HTML tag .google-style
    //                  has a width of 500px
    //
    */

    test("LT1T3: Search bar size changed", async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('https://www.youtube.com');
        await page.addScriptTag({path: "../src/content-helper.js"});
        await page.addScriptTag({path: "../src/content-layout.js"});

        let ret = await page.evaluate(contentFunctions.changeHomeLayout, true);

        const width = await page.$eval(
            ".google-style",
            e => getComputedStyle(e).width
        );

        expect(width).toBe('500px');

        //page.close();
        await browser.close();
    });


    /* Test LT1T4 Requirements:
    //
    // Testing Function: changeHomeLayout()
    //
    // Objective: To verify that the YouTube search bar has been repositioned to the centre of the page
    //            below the YouTube icon
    //
    // Assumptions:
    //
    // Function Input: false
    //
    // Expected Effect: The YouTube icon with HTML tag .google-style
    //                  has style.top value of 45% and style.left value of 30%
    */


    test("LT1T4: Search bar repositioned", async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('https://www.youtube.com');
        await page.addScriptTag({path: "../src/content-helper.js"});
        await page.addScriptTag({path: "../src/content-layout.js"});

        let ret = await page.evaluate(contentFunctions.changeHomeLayout, true);

        const top = await page.$eval(
            ".google-style",
            e => e.style.top
        );

        expect(top).toBe('45%');

        const left = await page.$eval(
            ".google-style",
            e => e.style.left
        );

        expect(left).toBe('30%');

        await browser.close();
    });

    /* Test LT1T6 Requirements:
    //
    // Testing Function: changeHomeLayout()
    //
    // Objective: To verify that recommended videos are removed when home page is reformatted to
    //            the "Google style". When recommendations are turned off, recommended videos
    //            should not be removed
    //
    // Assumptions:
    //
    // Function Input: false
    //
    // Expected Effect: The display value of element ".style-scope.ytd-browse.grid-3-columns" is
    //                  "none" when recommendations are off
    //                  The display value of element "ytd-two-column-browse-results-renderer"
    //                  remain unchanged when recommendations are on
    */

    test("LT1T6: Recommended videos removed when home page is reformatted", async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('https://www.youtube.com');
        await page.addScriptTag({path: "../src/content-helper.js"});
        await page.addScriptTag({path: "../src/content-layout.js"});
        await page.addScriptTag({path: "../src/content-thumbnail.js"});
        
        // deactivate home page layout changes
        await page.evaluate(contentFunctions.changeHomeLayout, true);
        await page.evaluate(thumbnailFunctions.hideVideos, true);
        
        const videoDisplay = await page.$eval(
            "ytd-two-column-browse-results-renderer",
            e => getComputedStyle(e).display
        );

        expect(videoDisplay).toBe('none');
        await browser.close();
    });

    test("LT1T6: Recommended videos not removed when home page is unchanged", async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('https://www.youtube.com');
        await page.addScriptTag({path: "../src/content-helper.js"});
        await page.addScriptTag({path: "../src/content-layout.js"});

        const originalDisplay = await page.$eval(
            "ytd-two-column-browse-results-renderer",
            e => getComputedStyle(e).display
        );

        // deactivate home page layout changes
        await page.evaluate(contentFunctions.changeHomeLayout, false);

        const videoDisplay = await page.$eval(
            "ytd-two-column-browse-results-renderer",
            e => getComputedStyle(e).display
        );

        expect(videoDisplay).toBe(originalDisplay);
        await browser.close();
    });

    /* Test LT1T5 Requirements:
    //
    // Testing Function: changeHomeLayout()
    //
    // Objective: To verify that search bar functionality is preserved
    //
    // Assumptions:
    //
    // Function Input: false
    //
    // Expected Effect: User input into search bar takes the user to the search results page
    //                  User input into search bar maintains autocomplete feature
    */


    test ("LT1T5: Search bar autofill functionality preserved", async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('https://www.youtube.com');
        await page.addScriptTag({path: "../src/content-helper.js"});
        await page.addScriptTag({path: "../src/content-layout.js"});

        await page.evaluate(contentFunctions.changeHomeLayout, true);

        // emulate user typing into search bar
        await page.type("#search", "cod");

        await page.type("#search", "i");

        await page.type("#search", "ng");

        await page.type("#search", " ");

        await page.type("#search", " ");

        await page.waitFor(2000);

       // check popup attribute
        const searchSuggestions = await page.$eval(
            "#search.ytd-searchbox",
            e => e.getAttribute("aria-haspopup")
        )

        // popup attribute should be true
        expect(searchSuggestions).toBe("true");

        await browser.close();
    });


    test ("LT1T5: Search bar results page functionality preserved", async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('https://www.youtube.com');
        await page.addScriptTag({path: "../src/content-helper.js"});
        await page.addScriptTag({path: "../src/content-layout.js"});

        await page.evaluate(contentFunctions.changeHomeLayout, true);

        // emulate user input into search bar
        await page.type("#search", "coding");

        // click to see search results
        selector = "#search-icon-legacy.style-scope.ytd-searchbox";
        await page.waitFor(selector);
        await page.evaluate((selector) => document.querySelector(selector).click(), selector);

        // searching should take you to the search results page
        expect(page.url()).toBe('https://www.youtube.com/results?search_query=coding');

        await browser.close();
    });

  });
});

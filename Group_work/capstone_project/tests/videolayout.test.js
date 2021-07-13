const puppeteer = require("puppeteer");
const contentFunctions = require("../src/content-layout.js");

jest.setTimeout(20000);

describe("> Video Layout Unit Tests", () => {
  //Some global variables
  let browser;
  let page;

  describe("- Normal", () => {

   test("Do nothing if not on a Video Page.", async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('https://www.youtube.com');
    await page.addScriptTag({path: "../src/content-helper.js"});
    await page.addScriptTag({path: "../src/content-layout.js"});

    let ret = await page.evaluate(contentFunctions.changeVideoLayout, true);

    expect(ret).toBe(false);

    await page.goto("https://www.youtube.com/results?search_query=cats");
    await page.addScriptTag({path: "../src/content-helper.js"});
    await page.addScriptTag({path: "../src/content-layout.js"});

    ret = await page.evaluate(contentFunctions.changeVideoLayout, true);

    expect(ret).toBe(false);

    await browser.close();
  });

     /* Test LT2T1 and LT3T1 Requirements:
    //
    // Testing Function: changeVideoLayout()
    //
    // Objective: To verify that the YouTube description is moved above the recommendations
    //            in the #secondary column
    //
    // Assumptions:
    //
    // Function Input: false
    //
    // Expected Effect: The HTML tag with the name "#meta.style-scope.ytd-watch-flexy" is appended to the
    //                  #secondary column when the input for the function changeVideoLayout() is set
    //                  to false
    */

    test("LT2T1/LT3T1: Change layout if on Video Page.", async () => {
      browser = await puppeteer.launch();
      page = await browser.newPage();
      await page.setViewport({ width: 1366, height: 768});
      await page.goto("https://www.youtube.com/watch?v=hY7m5jjJ9mM&t=1s");
      await page.addScriptTag({path: "../src/content-helper.js"});
      await page.addScriptTag({path: "../src/content-layout.js"});

      await page.waitForSelector("ytd-expander.style-scope.ytd-video-secondary-info-renderer");
      await page.waitForSelector("#meta.style-scope.ytd-watch-flexy");
      await page.waitForSelector("#secondary");
      await page.waitForSelector("ytd-video-secondary-info-renderer");

      await page.evaluate(contentFunctions.changeVideoLayout, true);

      let changeOccured = await page.evaluate( () => {
        return document.querySelector("#meta.style-scope.ytd-watch-flexy").parentNode.id == "secondary";
      });

      expect(changeOccured).toBe(true);

      await browser.close();
    });

  });

  describe("- Boundary", () => {

    beforeEach(async function () {

      browser = await puppeteer.launch();

      page = await browser.newPage();
      await page.goto('https://www.youtube.com/watch?v=UMKWijxv0kE');
      await page.addScriptTag({path: "../src/content-helper.js"});
      await page.addScriptTag({path: "../src/content-layout.js"});

      await page.setViewport({
        width: 1920,
        height: 1080,
      });

      await page.waitForSelector("#meta.style-scope.ytd-watch-flexy");
      await page.waitForSelector("ytd-expander.style-scope.ytd-video-secondary-info-renderer");

    });

    afterEach(async function () {
      await page.close();
      await browser.close();
    });

     /* Test LT2T2 Requirements:
    //
    // Testing Function: changeVideoLayout()
    //
    // Objective: To verify that after the video page layout has changed, clicking on a recommended
    //            video takes the user to a new video watch page for that video
    //
    // Assumptions:
    //
    // Function Input: false
    //
    // Expected Effect: Clicking on a thumbnail in the recommended video list will change the page url
    //                  to a url different from the initial video url but is still a watch page
    */

    test("LT2T2: Recommended videos functionality preserved", async () => {

      await page.evaluate(contentFunctions.changeVideoLayout, true);

      // emulate user clicking on another video in recommendations column
      let selector = "#thumbnail.yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail";
      await page.waitFor(selector);
      await page.click(selector);
      // await page.evaluate((selector) => document.querySelector(selector).click(), selector);

      await page.waitFor(2000);

      // page changes to another watch page
      expect(page.url()).not.toBe("https://www.youtube.com/watch?v=UMKWijxv0kE");

      // the new page is a YouTube watch page
      expect(page.url()).toMatch(/watch/);
    });

    /* Test LT3T2 Requirements:
    //
    // Testing Function: changeVideoLayout()
    //
    // Objective: To verify that after the video page layout has changed, video recommendations
    //            'show more' and 'show less' buttons remain functional
    //
    // Assumptions:
    //
    // Function Input: false
    //
    // Expected Effect: Clicking on the 'show more' button will make the display value of the
    //                  "#collapsible.style-scope.ytd-metadata-row-container-renderer" element be "none"
    //                  and 'show less' will make the display value for this element remain unchanged
    */

    test ("LT3T2: Description 'show more' functionality preserved", async () => {

      await page.evaluate(contentFunctions.changeVideoLayout, true);

      // wait for description to load
      await page.waitFor("#meta.style-scope.ytd-watch-flexy");

      // Check the description is currently in collapsed form
      const normalDescription = await page.$eval(
        "ytd-expander.style-scope.ytd-video-secondary-info-renderer",
        e => e.hasAttribute("collapsed")
      );
        expect(normalDescription).toBe(true);

        // emulate clicking on 'show more' button
      let selector = "#more.style-scope.ytd-expander";
      await page.waitFor(selector);
      await page.evaluate((selector) => document.querySelector(selector).click(), selector);

      await page.waitFor(2000);

      // check that description is no longer in collapsed form
      const expandedDescription = await page.$eval(
        "ytd-expander.style-scope.ytd-video-secondary-info-renderer",
        e => e.hasAttribute("collapsed")
      );
        expect(expandedDescription).toBe(false);

    });
    

    test ("LT3T2: Description 'show less' functionality preserved", async () => {

      await page.evaluate(contentFunctions.changeVideoLayout, true);

      // emulate clicking on 'show more' button
      let selector = "#more.style-scope.ytd-expander";
      await page.waitFor(selector);
      await page.evaluate((selector) => document.querySelector(selector).click(), selector);

      // emulate clicking on 'show less' button
      selector = "#less.style-scope.ytd-expander";
      await page.waitFor(selector);
      await page.evaluate((selector) => document.querySelector(selector).click(), selector);

      await page.waitFor(2000);

      // check that description is in collapsed form
      normalDescription = await page.$eval(
        "ytd-expander.style-scope.ytd-video-secondary-info-renderer",
        e => e.hasAttribute("collapsed")
      );
        expect(normalDescription).toBe(true);

    });

  });

});

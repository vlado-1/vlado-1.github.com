const puppeteer = require("puppeteer");
const contentFunctions = require("../src/content-thumbnail.js");

jest.setTimeout(20000);

//                              //
//  Unit Testing Video Display  //
//                              //

describe("> Video Display Unit Tests", () => {

  describe("- Normal", () => {

    test("Should initially be visible then hidden afterwards", async () => {
      const browser = await puppeteer.launch({
        //headless: false,
        //slowMo: 40
      });
      const page = await browser.newPage();
      await page.goto("https://www.youtube.com");
      // inject code into page.
      await page.addScriptTag({path: "../src/content-thumbnail.js"});
      const videoStyleBefore = await page.$eval(
        "ytd-two-column-browse-results-renderer",
        e => getComputedStyle(e).display
      );
      expect(videoStyleBefore).not.toBe("none");
      // run function
      await page.evaluate(contentFunctions.hideVideos, true);
      /*
      const videoStyle = await page.evaluate(() =>
        getComputedStyle(document.querySelector("ytd-two-column-browse-results-renderer")).display
      );
      */
      // Alternate way of doing the above, may or may not be better.
      const videoStyleAfter = await page.$eval(
        "ytd-two-column-browse-results-renderer",
        e => getComputedStyle(e).display
      );
      expect(videoStyleAfter).toBe("none");

      await browser.close();
    });

    test("Should initially be visible and still be visible afterwards", async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.youtube.com");
      // inject code into page.
      await page.addScriptTag({path: "../src/content-thumbnail.js"});
      const videoStyleBefore = await page.$eval(
        "ytd-two-column-browse-results-renderer",
        e => getComputedStyle(e).display
      );
      expect(videoStyleBefore).not.toBe("none");
      // run function
      await page.evaluate(contentFunctions.hideVideos, false);
      const videoStyleAfter = await page.$eval(
        "ytd-two-column-browse-results-renderer",
        e => getComputedStyle(e).display
      );
      expect(videoStyleAfter).not.toBe("none");

      await browser.close();
    });
  });
});

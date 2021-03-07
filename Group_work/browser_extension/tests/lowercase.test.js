const puppeteer = require("puppeteer");
const contentFunctions = require("../src/content-thumbnail.js");

jest.setTimeout(20000);


//                                 //
//  Unit Testing lowercase titles  //
//                                 //

describe("> Lowercase Unit Tests", () => {

  describe("- Normal", () => {

    /* Requirements:
    //
    // Testing Function: lowercaseTitles()
    //
    // Objective: To verify that the HTML tag with the name "ytd-two-column-browse-results-renderer"
    //            is set to lowercase mode in the YouTube Homepage after the lowercaseTitles() function
    //            is applied to the page.
    //
    // Assumptions: Initially all video titles are normal and lowercaseTitles() works as intended.
    //
    // Function Input: true
    //
    // Expected Effect: The HTML tag "ytd-two-column-browse-results-renderer" has its textTransform
    //                  style set to "lowercase".
    //
    */
    test("#TL3T2, #TL3T3 Home Page: Turn video titles to lowercase (+ #TL3T4 Refreshing page)", async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.youtube.com");
      // inject code into page.
      await page.addScriptTag({path: "../src/content-thumbnail.js"});
      // run function
      await page.evaluate(contentFunctions.lowercaseTitles, true);
      const style = await page.$eval(
        "ytd-two-column-browse-results-renderer",
        e => getComputedStyle(e).textTransform
      );

      expect(style).toBe("lowercase");

      // Testing after reloading page
      await page.evaluate(() => {
        location.reload(true)
      });
      expect(style).toBe("lowercase");


      await browser.close();
    });

    /* Requirements:
    //
    // Testing Function: lowercaseTitles()
    //
    // Objective: To verify that the HTML tag with the name "ytd-two-column-browse-results-renderer"
    //            is not set to lowercase mode in the YouTube Homepage after the lowercaseTitles() function
    //            is applied to the page.
    //
    // Assumptions: Initially lowercaseTitles() works as intended and video return to normal
    //              when its argument is set to "false".
    //
    // Function Input: true, then false
    //
    // Expected Effect: The HTML tag "ytd-two-column-browse-results-renderer" has its textTransform
    //                  style set to what it originally was.
    //
    */
    test("#TL3T1, #TL3T3 Home Page: Return video titles to normal (+ #TL3T4 Refreshing page)", async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.youtube.com");
      // inject code into page.
      await page.addScriptTag({path: "../src/content-thumbnail.js"});
      // run function

      const originalStyle = await page.$eval(
        "ytd-two-column-browse-results-renderer",
        e => getComputedStyle(e).filter
      );

      await page.evaluate(contentFunctions.lowercaseTitles, true);
      await page.evaluate(contentFunctions.lowercaseTitles, false);

      const style = await page.$eval(
        "ytd-two-column-browse-results-renderer",
        e => getComputedStyle(e).textTransform
      );

      expect(style).toBe(originalStyle);

      // Testing after reloading page
      await page.evaluate(() => {
        location.reload(true)
      });
      expect(style).toBe(originalStyle);

      await browser.close();
    });

    /* Requirements:
    //
    // Testing Function: lowercaseTitles()
    //
    // Objective: To verify that the HTML tag with the name "ytd-section-list-renderer"
    //            is set to lowercase mode in the YouTube Search Page after the lowercaseTitles() function
    //            is applied to the page.
    //
    // Assumptions: Assumptions: Initially all video titles are normal and lowercaseTitles() works as intended.
    //
    // Function Input: true
    //
    // Expected Effect: The HTML tag "ytd-section-list-renderer" has its textTransform
    //                  style set to "lowercase".
    //
    */
    test("#TL3T2, #TL3T3 Search Page: Turn video titles to lowercase (+ #TL3T4 Refreshing page)", async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.youtube.com/results?search_query=cats");
      // inject code into page.
      await page.addScriptTag({path: "../src/content-thumbnail.js"});
      // run function
      await page.evaluate(contentFunctions.lowercaseTitles, true);
      const style = await page.$eval(
        "ytd-section-list-renderer",
        e => getComputedStyle(e).textTransform
      );

      expect(style).toBe("lowercase");

      // Testing after reloading page
      await page.evaluate(() => {
        location.reload(true)
      });
      expect(style).toBe("lowercase");

      await browser.close();
    });

    /* Requirements:
    //
    // Testing Function: lowercaseTitles()
    //
    // Objective: To verify that the HTML tag with the name "ytd-section-list-renderer"
    //            is not set to lowercase mode in the YouTube Search Page after the lowercaseTitles() function
    //            is applied to the page.
    //
    // Assumptions: Initially lowercaseTitles() works as intended and video return to normal
    //              when its argument is set to "false".
    //
    // Function Input: true, then false
    //
    // Expected Effect: The HTML tag "ytd-section-list-renderer" has its textTransform
    //                  style set to what it originally was.
    //
    */
    test("#TL3T1, #TL3T3 Search Page: Return video titles to normal (+ #TL3T4 Refreshing page)", async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.youtube.com/results?search_query=cats");
      // inject code into page.
      await page.addScriptTag({path: "../src/content-thumbnail.js"});
      // run function

      const originalStyle = await page.$eval(
        "ytd-section-list-renderer",
        e => getComputedStyle(e).filter
      );

      await page.evaluate(contentFunctions.lowercaseTitles, true);
      await page.evaluate(contentFunctions.lowercaseTitles, false);

      const style = await page.$eval(
        "ytd-section-list-renderer",
        e => getComputedStyle(e).textTransform
      );

      expect(style).toBe(originalStyle);

      // Testing after reloading page
      await page.evaluate(() => {
        location.reload(true)
      });
      expect(style).toBe(originalStyle);

      await browser.close();
    });

    /* Requirements:
    //
    // Testing Function: lowercaseTitles()
    //
    // Objective: To verify that the HTML tag with the name "ytd-watch-next-secondary-results-renderer"
    //            is set to lowercase mode in the YouTube Video Page after the lowercaseTitles() function
    //            is applied to the page.
    //
    // Assumptions: Initially all video titles are normal and lowercaseTitles() works as intended.
    //
    // Function Input: true
    //
    // Expected Effect: The HTML tag "ytd-watch-next-secondary-results-renderer" has its textTransform
    //                  style set to "lowercase".
    //
    */
    test("#TL3T2, #TL3T3 Video Page: Turn video titles to lowercase (+ #TL3T4 Refreshing page)", async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.youtube.com/watch?v=hY7m5jjJ9mM&t=1s");
      // inject code into page.
      await page.addScriptTag({path: "../src/content-thumbnail.js"});
      // run function
      await page.waitForSelector("ytd-watch-next-secondary-results-renderer");
      await page.evaluate(contentFunctions.lowercaseTitles, true);
      const style = await page.$eval(
        "ytd-watch-next-secondary-results-renderer",
        e => getComputedStyle(e).textTransform
      );

      expect(style).toBe("lowercase");

      // Testing after reloading page
      await page.evaluate(() => {
        location.reload(true)
      });
      expect(style).toBe("lowercase");

      await browser.close();
    });

    /* Requirements:
    //
    // Testing Function: lowercaseTitles()
    //
    // Objective: To verify that the HTML tag with the name "ytd-watch-next-secondary-results-renderer"
    //            is not set to lowercase mode in the YouTube Video Page after the lowercaseTitles() function
    //            is applied to the page.
    //
    // Assumptions: Initially lowercaseTitles() works as intended and video return to normal
    //              when its argument is set to "false".
    //
    // Function Input: true, then false
    //
    // Expected Effect: The HTML tag "ytd-watch-next-secondary-results-renderer" has its textTransform
    //                  style set to what it originally was.
    //
    */
    test("#TL3T1, #TL3T3 Video Page: Return video titles to normal (+ #TL3T4 Refreshing page)", async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.youtube.com/watch?v=hY7m5jjJ9mM&t=1s");
      // inject code into page.
      await page.addScriptTag({path: "../src/content-thumbnail.js"});
      // run function
      await page.waitForSelector("ytd-watch-next-secondary-results-renderer");
      const originalStyle = await page.$eval(
        "ytd-watch-next-secondary-results-renderer",
        e => getComputedStyle(e).filter
      );

      await page.evaluate(contentFunctions.lowercaseTitles, true);
      await page.evaluate(contentFunctions.lowercaseTitles, false);

      const style = await page.$eval(
        "ytd-watch-next-secondary-results-renderer",
        e => getComputedStyle(e).textTransform
      );

      expect(style).toBe(originalStyle);

      // Testing after reloading page
      await page.evaluate(() => {
        location.reload(true)
      });
      expect(style).toBe(originalStyle);

      await browser.close();
    });
  });
});

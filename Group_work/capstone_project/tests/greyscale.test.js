const puppeteer = require("puppeteer");
const contentFunctions = require("../src/content-thumbnail.js");

jest.setTimeout(20000);


//                              //
//  Unit Testing Grey-scaling   //
//                              //

describe("> Grey-scaling Unit Tests", () => {

  describe("- Normal", () => {

    /* Requirements:
    //
    // Testing Function: greyscaleThumbnails()
    //
    // Objective: To verify that the HTML tag with the name "ytd-two-column-browse-results-renderer"
    //            is greyscaled on the YouTube homepage after the greyscaleThumbnails() function
    //            is applied to the page. Also, verify that it results remains when the scrolling down the page 
    //            and refreshed.
    //
    // Assumptions: Initially all thumbnails have colour and greyscaleThumbnails() works as intended.
    //
    // Function Input: true
    //
    // Expected Effect: The HTML tag "ytd-two-column-browse-results-renderer" has its filter
    //                  style set to "greyscale(1)".
    //
    */
    test("#TL1T1 Home Page: Turn all thumbnails grey (+ #TL1T2: Scroll test and #TL1T4: Page refresh)", async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.youtube.com");
      // inject code into page.
      await page.addScriptTag({path: "../src/content-thumbnail.js"});
      // run function
      await page.evaluate(contentFunctions.greyscaleThumbnails, true);
      const style = await page.$eval(
        "ytd-two-column-browse-results-renderer",
        e => getComputedStyle(e).filter
      );

      expect(style).toBe("grayscale(1)");

      // Scrolling down the page:
      page.evaluate(`window.scrollBy(0, window.innerHeight);`);
      expect(style).toBe("grayscale(1)");

      // Testing after reloading page
      await page.evaluate(() => {
        location.reload(true)
      });
      expect(style).toBe("grayscale(1)");

      await browser.close();
    });

    /* Requirements:
    //
    // Testing Function: greyscaleThumbnails()
    //
    // Objective: To verify that the HTML tag with the name "ytd-two-column-browse-results-renderer"
    //            is not greyscaled on the YouTube homepage after the greyscaleThumbnails() function
    //            is applied to the page. Also, verify that it results remains when the scrolling down the page 
    //            and refreshed.
    //
    // Assumptions: Initially all thumbnails have colour then greyscaleThumbnails() works as intended.
    //              The thumbnails are returned to origial colour when greyscaleThumbnails() is deactivated.
    //
    // Function Input: true, then false
    //
    // Expected Effect: The HTML tag "ytd-two-column-browse-results-renderer" has its filter
    //                  style set to what it originally was.
    //
    */
    test("#TL1T3 Home Page: Return colour to thumbnails (+ #TL1T2: Scroll test and #TL1T4: Page refresh)", async () => {
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

      await page.evaluate(contentFunctions.greyscaleThumbnails, true); //activate
      await page.evaluate(contentFunctions.greyscaleThumbnails, false);  //deactivate

      const style = await page.$eval(
        "ytd-two-column-browse-results-renderer",
        e => getComputedStyle(e).filter
      );

      expect(style).toBe(originalStyle);

      // Scrolling down the page:
      page.evaluate(`window.scrollBy(0, window.innerHeight);`);
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
    // Testing Function: greyscaleThumbnails()
    //
    // Objective: To verify that the HTML tag with the name "ytd-section-list-renderer"
    //            is greyscaled on the YouTube Search Page after the greyscaleThumbnails() function
    //            is applied to the page. Also, verify that it results remains when the scrolling down the page 
    //            and refreshed.
    //
    // Assumptions: Initially all thumbnails have colour and greyscaleThumbnails() works as intended.
    //
    // Function Input: true
    //
    // Expected Effect: The HTML tag "ytd-section-list-renderer" has its filter
    //                  style set to "greyscale(1)".
    //
    */
    test("#TL1T1 Search Page: Turn all thumbnails grey (+ #TL1T2: Scroll test and #TL1T4: Page refresh)", async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.youtube.com/results?search_query=cats");
      // inject code into page.
      await page.addScriptTag({path: "../src/content-thumbnail.js"});
      // run function
      await page.evaluate(contentFunctions.greyscaleThumbnails, true);
      const style = await page.$eval(
        "ytd-section-list-renderer",
        e => getComputedStyle(e).filter
      );

      expect(style).toBe("grayscale(1)");

      // Scrolling down the page:
      page.evaluate(`window.scrollBy(0, window.innerHeight);`);
      expect(style).toBe("grayscale(1)");

      // Testing after reloading page
      await page.evaluate(() => {
        location.reload(true)
      });
      expect(style).toBe("grayscale(1)");

      await browser.close();
    });

    /* Requirements:
    //
    // Testing Function: greyscaleThumbnails()
    //
    // Objective: To verify that the HTML tag with the name "ytd-section-list-renderer"
    //            is not greyscaled on the YouTube Search Page after the greyscaleThumbnails() function
    //            is applied to the page. Also, verify that it results remains when the scrolling down the page 
    //            and refreshed.
    //
    // Assumptions: Initially all thumbnails have colour then greyscaleThumbnails() works as intended.
    //              The thumbnails are returned to origial colour when greyscaleThumbnails() is deactivated.
    //
    // Function Input: true, then false
    //
    // Expected Effect: The HTML tag "ytd-section-list-renderer" has its filter
    //                  style set to what it originally was.
    //
    */
    test("#TL1T3 Search Page: Return colour to thumbnails (+ #TL1T2: Scroll test and #TL1T4: Page refresh)", async () => {
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

      await page.evaluate(contentFunctions.greyscaleThumbnails, true); //activate
      await page.evaluate(contentFunctions.greyscaleThumbnails, false);  //deactivate

      const style = await page.$eval(
        "ytd-section-list-renderer",
        e => getComputedStyle(e).filter
      );

      expect(style).toBe(originalStyle);

      // Scrolling down the page:
      page.evaluate(`window.scrollBy(0, window.innerHeight);`);
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
    // Testing Function: greyscaleThumbnails()
    //
    // Objective: To verify that the HTML tag with the name "ytd-watch-next-secondary-results-renderer"
    //            is greyscaled on the YouTube Video Page after the greyscaleThumbnails() function
    //            is applied to the page. Also, verify that it results remains when the scrolling down the page 
    //            and refreshed.
    //
    // Assumptions: Initially all thumbnails have colour then greyscaleThumbnails() works as intended.
    //
    // Function Input: true
    //
    // Expected Effect: The HTML tag "ytd-watch-next-secondary-results-renderer" has its filter
    //                  style set to "greyscale(1)".
    //
    */
    test("#TL1T1 Video Page: Turn all thumbnails grey (+ #TL1T2: Scroll test and #TL1T4: Page refresh)", async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.youtube.com/watch?v=hY7m5jjJ9mM&t=1s");
      // inject code into page.
      await page.addScriptTag({path: "../src/content-thumbnail.js"});
      // run function
      await page.waitForSelector("ytd-watch-next-secondary-results-renderer");
      await page.evaluate(contentFunctions.greyscaleThumbnails, true);
      const style = await page.$eval(
        "ytd-watch-next-secondary-results-renderer",
        e => getComputedStyle(e).filter
      );

      expect(style).toBe("grayscale(1)");

      // Scrolling down the page:
      page.evaluate(`window.scrollBy(0, window.innerHeight);`);
      expect(style).toBe("grayscale(1)");

      // Testing after reloading page
      await page.evaluate(() => {
        location.reload(true)
      });
      expect(style).toBe("grayscale(1)");

      await browser.close();
    });

    /* Requirements:
    //
    // Testing Function: greyscaleThumbnails()
    //
    // Objective: To verify that the HTML tag with the name "ytd-watch-next-secondary-results-renderer"
    //            is not greyscaled on the YouTube Video Page after the greyscaleThumbnails() function
    //            is applied to the page. Also, verify that it results remains when the scrolling down the page 
    //            and refreshed.
    //
    // Assumptions: Initially all thumbnails have colour. greyscaleThumbnails() works
    //              The thumbnails are returned to origial colour when greyscaleThumbnails() is deactivated.
    //
    // Function Input: true, then false
    //
    // Expected Effect: The HTML tag "ytd-watch-next-secondary-results-renderer" has its filter
    //                  style set to what it originally was.
    //
    */
    test("#TL1T3 Video Page: Return colour to thumbnails (+ #TL1T2: Scroll test and #TL1T4: Page refresh)", async () => {
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

      await page.evaluate(contentFunctions.greyscaleThumbnails, true); //activate
      await page.evaluate(contentFunctions.greyscaleThumbnails, false);  //deactivate

      const style = await page.$eval(
        "ytd-watch-next-secondary-results-renderer",
        e => getComputedStyle(e).filter
      );

      expect(style).toBe(originalStyle);

      // Scrolling down the page:
      page.evaluate(`window.scrollBy(0, window.innerHeight);`);
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

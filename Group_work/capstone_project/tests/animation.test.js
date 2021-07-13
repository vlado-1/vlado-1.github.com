const puppeteer = require("puppeteer");
const contentFunctions = require("../src/content-thumbnail.js");

jest.setTimeout(20000);


//                                                  //
//  Unit testing thumbnail animation Functionality  //
//                                                  //

describe("> Thumbnail Animation Unit Tests", () => {

  describe("- Normal", () => {

    /* Requirements:
    //
    // Testing Function: hideAnimation() and getThumbnailAnimation()
    //
    // Objective: To verify that the HTML tag with the name "mouseover-overlay" is hidden from
    //            on YouTube homepage after the startAnimation() and getThumbnailAnimation() function
    //            on the page.
    //
    // Assumptions: HTML tags with the name "mouseover-overlay" is not hidden as default 
    //              and hideAnimation() works as intended.
    //
    // Function Input: true
    //
    // Expected Effect: HTML tags with the name "mouseover-overlay" does not have a value of "none"
    //
    */
    test("#TL2T1 Home Page: Hiding thumbnail animations (+ #TL2T4 Refreshing page)", async () => {

      // Open YouTube Homepage
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://www.youtube.com');
      await page.addScriptTag({path: "../src/content-thumbnail.js"});

      // Checking mouse-overlay elements for each thumbnail
      await page.evaluate(contentFunctions.hideAnimation, true);
      let thumbnailStyle = await page.$$eval(
        "mouse-overlay",
        elements => elements.map(e => getComputedStyle(e).display)
      );
      thumbnailStyle.forEach(x => expect(x).toBe("none"));

      // Testing after reloading page
      await page.evaluate(() => {
        location.reload(true)
      });
      thumbnailStyle.forEach(x => expect(x).toBe("none"));

      await browser.close();
    });

    /* Requirements:
    //
    // Testing Function: hideAnimation() and getThumbnailAnimation()
    //
    // Objective: To verify that the HTML tag with the name "mouseover-overlay" is not hidden from
    //            on YouTube homepage if the button is active.
    //
    // Assumptions: HTML tags with the name "mouseover-overlay" is not hidden.
    //              and hideAnimation() works as intended.
    //
    // Function Input: false
    //
    // Expected Effect: HTML tags with the name "mouseover-overlay" have a value of "none"
    //
    */
    test("#TL2T2 Home Page: Normal thumbnail animations (+ #TL2T4 Refreshing page)", async () => {
      
      // Open YouTube Homepage
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://www.youtube.com');
      await page.addScriptTag({path: "../src/content-thumbnail.js"});

      // Checking mouse-overlay elements for each thumbnail
      await page.evaluate(contentFunctions.hideAnimation, false);
      thumbnailStyle = await page.$$eval(
        "mouse-overlay",
        elements => elements.map(e => getComputedStyle(e).display)
      );
      thumbnailStyle.forEach(x => expect(x).not.toBe("none"));

      // Testing after reloading page
      await page.evaluate(() => {
        location.reload(true)
      });
      thumbnailStyle.forEach(x => expect(x).toBe("none"));

      await browser.close();
    });


    /* Requirements:
    //
    // Testing Function: hideAnimation() and getThumbnailAnimation()
    //
    // Objective: Similar to Tests T44 and T45; To verify on YouTube search pages.
    //
    // Assumptions: HTML tags with the name "mouseover-overlay" is not hidden as default.
    //              and hideAnimation() works as intended.
    //
    // Function Input: true and false
    //
    // Expected Effect: HTML tags with the name "mouseover-overlay" have a value of "none"
    //                  and then it does not have a value of "none"
    //
    */
    test("#TL2T3 Search Page: Hiding thumbnail animations (+ #TL2T4 Refreshing page)", async () => {

      // Open YouTube search page
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.youtube.com/results?search_query=cats");
      await page.addScriptTag({path: "../src/content-thumbnail.js"});

      // Checking mouse-overlay elements for each thumbnail (when toggle off)
      await page.evaluate(contentFunctions.hideAnimation, true);
      let thumbnailStyle = await page.$$eval(
        "mouse-overlay",
        elements => elements.map(e => getComputedStyle(e).display)
      );
      thumbnailStyle.forEach(x => expect(x).toBe("none"));

      // Testing after reloading page
      await page.evaluate(() => {
        location.reload(true)
      });
      thumbnailStyle.forEach(x => expect(x).toBe("none"));

      await browser.close();
    });

    test("#TL2T2 Search Page: Normal thumbnail animations (+ #TL2T4 Refreshing page)", async () => {
      
        // Open YouTube Homepage
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://www.youtube.com');
      await page.addScriptTag({path: "../src/content-thumbnail.js"});

      // Checking mouse-overlay elements for each thumbnail (when toggle on)
      await page.evaluate(contentFunctions.hideAnimation, false);
      thumbnailStyle = await page.$$eval(
        "mouse-overlay",
        elements => elements.map(e => getComputedStyle(e).display)
      );
      thumbnailStyle.forEach(x => expect(x).not.toBe("none"));

      // Testing after reloading page
      await page.evaluate(() => {
        location.reload(true)
      });
      thumbnailStyle.forEach(x => expect(x).not.toBe("none"));

      await browser.close();
    });


    /* Requirements:
    //
    // Testing Function: hideAnimation() and getThumbnailAnimation()
    //
    // Objective: Similar to Tests T44 and T45; To verify on YouTube video pages.
    //
    // Assumptions: HTML tags with the name "mouseover-overlay" is hidden as default.
    //              and hideAnimation() works as intended.
    //
    // Function Input: true and false
    //
    // Expected Effect: HTML tags with the name "mouseover-overlay" have a value of "none"
    //                  and then it does not have a value of not "none".
    //
    */
    test("#TL2T3 Video Page: Hiding thumbnail animations (+ #TL2T4 Refreshing page)", async () => {

      // Open YouTube video page
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.youtube.com/watch?v=hY7m5jjJ9mM&t=1s");
      await page.waitForSelector("#mouseover-overlay");
      await page.addScriptTag({path: "../src/content-thumbnail.js"});

      // Checking mouse-overlay elements for each thumbnail (when toggle off)
      await page.evaluate(contentFunctions.hideAnimation, true);
      let thumbnailStyle = await page.$$eval(
        "mouse-overlay",
        elements => elements.map(e => getComputedStyle(e).display)
      );
      thumbnailStyle.forEach(x => expect(x).toBe("none"));
      
      // Testing after reloading page
      await page.evaluate(() => {
        location.reload(true)
      });
      thumbnailStyle.forEach(x => expect(x).toBe("none"));

      await browser.close();
    });

    test("#TL2T2 Video Page: Normal thumbnail animations (+ #TL2T4 Refreshing page)", async () => {
      
        // Open YouTube Homepage
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://www.youtube.com');
      await page.addScriptTag({path: "../src/content-thumbnail.js"});

      // Checking mouse-overlay elements for each thumbnail (when toggle on)
      await page.evaluate(contentFunctions.hideAnimation, false);
      thumbnailStyle = await page.$$eval(
        "mouse-overlay",
        elements => elements.map(e => getComputedStyle(e).display)
      );
      thumbnailStyle.forEach(x => expect(x).not.toBe("none"));

      // Testing after reloading page
      await page.evaluate(() => {
        location.reload(true)
      });
      thumbnailStyle.forEach(x => expect(x).not.toBe("none"));

      await browser.close();
    });
  });
});

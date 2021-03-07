const puppeteer = require("puppeteer");
const contentFunctions = require("../src/content-sidebar.js");

jest.setTimeout(20000);

//                                      //
//  Unit Testing SideBar Functionality  //
//                                      //

describe("> Side Bar Unit Tests", () => {

  //Some global variables
  let browser;
  let page;

  //Some global functions running before each test(...) function
  beforeEach(async function () {
    page = await browser.newPage();
    await page.goto('https://www.youtube.com');
  })


  afterEach(async function () {
    await page.close();
  })

  //Normal Unit tests
  describe("- Normal", () => {
    beforeAll(async function () {
      browser = await puppeteer.launch();
    });

    afterAll(async function () {
      await browser.close();
    });
    //
    /* Requirement: SR1
    // Testing Function: hideSidebar()
    //
    // Objective: To verify that the sidebar and related features disappear from
    //            all YouTube page types after the hideSidebar() function
    //            acts on the pagees with the appropriate arguments.
    //            The sidebar and relevant features consist of the youtube
    //            Guide, mini-guide, and guide icons/buttons.
    //
    // Assumptions: The sidebar and related features are initially visisble.
    //
    // Function Input: True
    //
    // Expected Effect: The 'display' property of the sidebar and related
    //                  features is set to "none".
    //
    */
    test("#SR1T1 Hiding the sidebar and related features", async () => {

      // Test on Homepage
      await page.addScriptTag({path: "../src/content-sidebar.js"});
      await page.evaluate(contentFunctions.hideSidebar, true);

      let videoStyle = await page.evaluate(() =>
        [getComputedStyle(document.querySelector("#guide")).display,
         getComputedStyle(document.querySelector("ytd-mini-guide-renderer")).display,
         getComputedStyle(document.querySelector("#guide-button")).display,
         getComputedStyle(document.getElementsByTagName("ytd-popup-container")[0]).display
       ]
      );
      videoStyle.forEach(x => {
        expect(x).toBe("none");
      });

      // Test on Search Page
      await page.goto("https://www.youtube.com/results?search_query=cats");
      await page.addScriptTag({path: "../src/content-sidebar.js"});
      await page.evaluate(contentFunctions.hideSidebar, true);

      videoStyle = await page.evaluate(() =>
        [getComputedStyle(document.querySelector("#guide")).display,
         getComputedStyle(document.querySelector("ytd-mini-guide-renderer")).display,
         getComputedStyle(document.querySelector("#guide-button")).display,
         getComputedStyle(document.getElementsByTagName("ytd-popup-container")[0]).display
       ]
      );
      videoStyle.forEach(x => {
        expect(x).toBe("none");
      });

      // Test on Video page
      await page.goto("https://www.youtube.com/watch?v=hY7m5jjJ9mM&t=1s");
      await page.addScriptTag({path: "../src/content-sidebar.js"});
      await page.waitForSelector("#guide");
      await page.evaluate(contentFunctions.hideSidebar, true);

      videoStyle = await page.evaluate(() =>
        [getComputedStyle(document.querySelector("#guide")).display,
         getComputedStyle(document.querySelector("ytd-mini-guide-renderer")).display,
         getComputedStyle(document.querySelector("#guide-button")).display,
         getComputedStyle(document.getElementsByTagName("ytd-popup-container")[0]).display
       ]
      );
      videoStyle.forEach(x => {
        expect(x).toBe("none");
      });
    });

    /* Requirement: SR1
    //
    // Testing Function: hideSidebar()
    //
    // Objective: To verify that all other icons and buttons in the YouTube
    //            header disappear from all YouTube page types after the
    //            hideSidebar() function acts on the page with the
    //            appropriate arguments.
    //
    // Assumptions: The buttons are initially visisble.
    //
    // Function Input: True
    //
    // Expected Effect: The 'display' property of the html tag with the ID
    //                  'buttons' has a value of "none".
    //
    */
    test("#SR1T2 Hiding other icons and buttons", async () => {

      // Test on Homepage
      await page.addScriptTag({path: "../src/content-sidebar.js"});
      await page.evaluate(contentFunctions.hideSidebar, true);

      let videoStyle = await page.evaluate(() =>
        getComputedStyle(document.getElementById("buttons")).display
      );
      expect(videoStyle).toBe("none");

      // Test on Search Page
      await page.goto("https://www.youtube.com/results?search_query=cats");
      await page.addScriptTag({path: "../src/content-sidebar.js"});
      await page.evaluate(contentFunctions.hideSidebar, true);

      videoStyle = await page.evaluate(() =>
        getComputedStyle(document.getElementById("buttons")).display
      );
      expect(videoStyle).toBe("none");

      // Test on Video page
      await page.goto("https://www.youtube.com/watch?v=hY7m5jjJ9mM&t=1s");
      await page.addScriptTag({path: "../src/content-sidebar.js"});
      await page.waitForSelector("#buttons");
      await page.evaluate(contentFunctions.hideSidebar, true);

      videoStyle = await page.evaluate(() =>
        getComputedStyle(document.getElementById("buttons")).display
      );
      expect(videoStyle).toBe("none");
    });

    /* Requirement: S1
    //
    // Testing Function: hideSidebar()
    //
    // Objective: To verify that the YouTube hompage does not change after the
    //            hideSidebar() function acts on the page.
    //
    // Assumptions: All components of the sidebar are initially visisble.
    //
    // Function Input: False
    //
    // Expected Effect: The sidebar and other buttons are still visible after the
    //                  function is applied.
    //
    */
    test("Repeating above when function expected to do nothing", async () => {

      await page.addScriptTag({path: "../src/content-sidebar.js"});
      await page.waitForSelector("ytd-mini-guide-renderer", true);
      await page.waitForSelector("#guide-button", true);
      await page.waitForSelector("#guide", true);
      await page.waitForSelector("#buttons", true);
      await page.waitForSelector("ytd-popup-container", true);


      const videoStyleBefore = await page.evaluate(() => [
        getComputedStyle(document.getElementsByTagName("ytd-mini-guide-renderer")[0]).display,
        getComputedStyle(document.getElementById("guide-button")).display,
        getComputedStyle(document.getElementById("buttons")).display,
        getComputedStyle(document.getElementById("guide")).display,
        getComputedStyle(document.getElementsByTagName("ytd-popup-container")[0]).display
      ]
      );

      await page.evaluate(contentFunctions.hideSidebar, false);

      const videoStyleAfter = await page.evaluate(() => [
        getComputedStyle(document.getElementsByTagName("ytd-mini-guide-renderer")[0]).display,
        getComputedStyle(document.getElementById("guide-button")).display,
        getComputedStyle(document.getElementById("buttons")).display,
        getComputedStyle(document.getElementById("guide")).display,
        getComputedStyle(document.getElementsByTagName("ytd-popup-container")[0]).display
      ]
      );

      for (var i = 0; i < videoStyleBefore.length; i++) {
        expect(videoStyleAfter[i]).toBe(videoStyleBefore[i]);
      }
    });
  });


  //Boundary Unit Tests
  describe("- Boundary", () => {

    beforeAll(async function () {

      browser = await puppeteer.launch({
        headless: false,
        args: [
          "--disable-extensions-except=" + require("path").resolve("../src"),
          "--load-extension=" + require("path").resolve("../src")]
      });

      // loading the chrome extension popup
      const extensionName = "Rebuilding the Web: Media and Video"
      const targets = await browser.targets();
      const extensionTarget = targets.find(({ _targetInfo }) => {
        return _targetInfo.title === extensionName && _targetInfo.type === 'background_page';
      });

      const extensionUrl = extensionTarget._targetInfo.url || '';
      const [,, extensionID] = extensionUrl.split('/');

      const extensionPopupHtml = 'popup.html'

      page = await browser.newPage();

      // going to chrome extension popup menu
      await page.goto(`chrome-extension://${extensionID}/${extensionPopupHtml}`);

      // Activate the sidebar removal option from the extension menu
      let selector = '#homepage';
      await page.waitForSelector(selector, true);
      await page.evaluate((selector) => {
        if (document.querySelector(selector).checked != true) {
            document.querySelector(selector).click()
        }
      }, selector);
    });

    afterAll(async function () {
      await browser.close();
    });

    /* Requirement: SR1
    //
    // Testing Function: hideSidebar(), Update()
    //
    // Objective: To verify that the function still takes effect on
    //            all YouTube page types after a page refresh.
    //
    // Assumptions: All Options module tests pass.
    //              All the above hideSidebar() tests pass.
    //              Sidebar and related buttons are initially hidden.
    //
    // Function Input: True
    //
    // Expected Effect: The Sidebar and related buttons are still hidden after
    //                  a refresh.
    //
    */
    test("#SR1T3 Page Refresh", async () => {

      // Homepage
      await page.goto("https://www.youtube.com");
      // Refresh page
      await page.reload();
      await page.waitForSelector("ytd-mini-guide-renderer", true);
      await page.waitForSelector("#guide-button", true);
      await page.waitForSelector("#guide", true);
      await page.waitForSelector("#buttons", true);
      await page.waitForSelector("ytd-popup-container", true);

      //Expect sidebar to be hidden by default
      let videoStyle = await page.evaluate(() => [
        getComputedStyle(document.getElementsByTagName("ytd-mini-guide-renderer")[0]).display,
        getComputedStyle(document.getElementById("guide-button")).display,
        getComputedStyle(document.getElementById("buttons")).display,
        getComputedStyle(document.getElementById("guide")).display,
        getComputedStyle(document.getElementsByTagName("ytd-popup-container")[0]).display
      ]
      );
      videoStyle.forEach(x => expect(x).toBe("none"));

      // Search Page
      await page.goto("https://www.youtube.com/results?search_query=cats");
      await page.reload();
      await page.waitForSelector("ytd-mini-guide-renderer", true);
      await page.waitForSelector("#guide-button", true);
      await page.waitForSelector("#guide", true);
      await page.waitForSelector("#buttons", true);
      await page.waitForSelector("ytd-popup-container", true);

      videoStyle = await page.evaluate(() => [
        getComputedStyle(document.getElementsByTagName("ytd-mini-guide-renderer")[0]).display,
        getComputedStyle(document.getElementById("guide-button")).display,
        getComputedStyle(document.getElementById("buttons")).display,
        getComputedStyle(document.getElementById("guide")).display,
        getComputedStyle(document.getElementsByTagName("ytd-popup-container")[0]).display
      ]
      );
      videoStyle.forEach(x => expect(x).toBe("none"));

      // Video Page
      await page.goto("https://www.youtube.com/watch?v=hY7m5jjJ9mM&t=1s");
      await page.reload();
      await page.waitForSelector("ytd-mini-guide-renderer", true);
      await page.waitForSelector("#guide-button", true);
      await page.waitForSelector("#guide", true);
      await page.waitForSelector("#buttons", true);
      await page.waitForSelector("ytd-popup-container", true);

      videoStyle = await page.evaluate(() => [
        getComputedStyle(document.getElementsByTagName("ytd-mini-guide-renderer")[0]).display,
        getComputedStyle(document.getElementById("guide-button")).display,
        getComputedStyle(document.getElementById("buttons")).display,
        getComputedStyle(document.getElementById("guide")).display,
        getComputedStyle(document.getElementsByTagName("ytd-popup-container")[0]).display
      ]
      );
      videoStyle.forEach(x => expect(x).toBe("none"));
    });

  });

});

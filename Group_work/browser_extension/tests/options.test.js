const puppeteer = require("puppeteer");

jest.setTimeout(20000);

//                              //
//  Options Menu Layout Tests   //
//                              //

describe("> Options Menu Layout Tests", () => {

  describe("- Normal", () => {

    let browser;
    let page;

    beforeEach(async function () {

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

    });

    afterEach(async function () {
      await page.close();
      await browser.close();
    });

    /* Test OS1T1 Requirements:
    //
    // Testing Function: popup.html document 
    //
    // Objective: To verify that user can press the ON/OFF button 
    //
    // Assumptions: By clicking the selector, the button switches to the opposite state (ON or OFF)
    //
    // Function Input: click()
    //
    // Expected Effect: The button can be turned ON and OFF 
    //
    */

    test("OS1T1: Turn off other options", async() => {

      // emulate user toggling off the ON/OFF button  
      selector = '#big-button';
      await page.waitForSelector(selector);
      await page.evaluate((selector) => document.querySelector(selector).click(), selector);

      await page.screenshot({path: 'otherOptionsOff.png'});

      // emulate user toggling on the ON/OFF button
      selector = '#big-button';
      await page.waitForSelector(selector);
      await page.evaluate((selector) => document.querySelector(selector).click(), selector);

      await page.screenshot({path: 'otherOptionsOn.png'});

    });

    /* Test OS2T1 Requirements:
    //
    // Testing Function: update (content-update.js)
    //
    // Objective: To verify that user can modify the function by pressing the toggle options button
    //
    // Assumptions: By clicking the selector, the toggle is turned on
    //
    // Function Input: click()
    //
    // Expected Effect: Corresponding selector is switched on
    //
    */
    
    test("OS2T1: Toggle options off", async() => {

      // Change homepage 
      let selector = '#homepage';
      await page.waitForSelector(selector);
      await page.evaluate((selector) => document.querySelector(selector).click(), selector);

      // Change watchpage 
      selector = '#watchpage';
      await page.waitForSelector(selector);
      await page.evaluate((selector) => document.querySelector(selector).click(), selector);

      // Remove comments
      selector = '#comments';
      await page.waitForSelector(selector);
      await page.evaluate((selector) => document.querySelector(selector).click(), selector);
    });
    

    /* Test OS2T2 Requirements:
    //
    // Testing Function: update (content-update.js)
    //
    // Objective: To verify that user can modify the function by pressing the toggle options button
    //
    // Assumptions: By clicking the selector, the toggle is turned off
    //
    // Function Input: click()
    //
    // Expected Effect: Corresponding selector is switched off
    //
    */
    

    test("OS2T2: Toggle options on", async() => {
     // Change homepage 
     let selector = '#homepage';
     await page.waitForSelector(selector);
     await page.evaluate((selector) => document.querySelector(selector).click(), selector);
     await page.evaluate((selector) => document.querySelector(selector).click(), selector);

     // Change watchpage 
     selector = '#watchpage';
     await page.waitForSelector(selector);
     await page.evaluate((selector) => document.querySelector(selector).click(), selector);
     await page.evaluate((selector) => document.querySelector(selector).click(), selector);

     // Add filters 
     selector = '#comments';
     await page.waitForSelector(selector);
     await page.evaluate((selector) => document.querySelector(selector).click(), selector);
     await page.evaluate((selector) => document.querySelector(selector).click(), selector);
    });

    /* Test OS4T1 Requirements:
    //
    // Testing Function: popup.html
    //
    // Objective: To verify that user feedback form button is functional
    //
    // Assumptions: The feedback form link is correct in popup.html
    //
    // Function Input: click()
    //
    // Expected Effect: The user is taken to the user feedback form
    //
    */

    test("OS4T1: User feedback button functional", async() => {
      // Press feedback form button
      let selector = '#feedback-form';
      await page.waitForSelector(selector);
      await page.evaluate((selector) => document.querySelector(selector).click(), selector);
      
     });
  });
  
});

const puppeteer = require("puppeteer");

jest.setTimeout(20000);

//                           //
//  Comments Removal Tests   //
//                           //

describe("> Comments Removal Tests", () => {

       /* Integration Test 
       //
       // Testing Function: popup.html document, content-comment.js, content-update.js
       //
       // Objective: To verify that turning ON the Comments switch removes comments 
       //            from video viewing page
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: Comments can be removed and added to the video viewing page
       //
       */

    describe("CR1-IT1 and CR1-IT2: Integration Test - Comments Removal Switch", () => {

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
            const [, , extensionID] = extensionUrl.split('/');

            const extensionPopupHtml = 'popup.html'

            page = await browser.newPage();

            // going to chrome extension popup menu
            await page.goto(`chrome-extension://${extensionID}/${extensionPopupHtml}`);

        });

        afterEach(async function () {
            //await page.close();
            await browser.close();
        });

       /* Requirements: CR1 
       //
       // Testing Function: popup.html document, content-comment.js, content-update.js
       //
       // Objective: To verify that turning ON the Comments switch removes comments 
       //            from video viewing page
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: Comments are removed from the video viewing page
       //
       */

        test("CR1-IT1: Remove comments on watch page", async () => {
            await (1000);

             // check button is on 
             const bigButton = await page.$eval(
                "#big-button",
                e => e.innerHTML
            );

            expect(bigButton).toBe("On");
            
            // emulate user toggling on comments removal
            selector = '#big-button';
            await page.waitForSelector(selector);
            await page.evaluate((selector) => document.querySelector(selector).click(), selector);

            selector = '#big-button';
            await page.waitForSelector(selector);
            await page.evaluate((selector) => document.querySelector(selector).click(), selector);

            let youTubePage = await browser.newPage();
            await youTubePage.goto("https://www.youtube.com/watch?v=Fr-qagv7ig0");

            const comments = await youTubePage.$eval(
                "#comments.style-scope.ytd-watch-flexy",
                e => e.style.display
            );
            
            expect(comments).toBe('none');

            await youTubePage.close();

        });

       /* Requirements: CR2
       //
       // Testing Function: popup.html document, content-comment.js, content-update.js
       //
       // Objective: To verify that turning OFF the Comments switch adds the comments 
       //            back onto the video viewing page
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: Comments are not removed from the video viewing page
       //
       */

        test("CR1-IT2: Show comments on watch page when comments is toggled off", async () => {
            await (1000);

             // check button is on 
             const bigButton = await page.$eval(
                "#big-button",
                e => e.innerHTML
            );

            expect(bigButton).toBe("On");
            
            // emulate user toggling on comments removal
            selector = '#big-button';
            await page.waitForSelector(selector);
            await page.evaluate((selector) => document.querySelector(selector).click(), selector);

            let youTubePage = await browser.newPage();
            await youTubePage.goto("https://www.youtube.com/watch?v=Fr-qagv7ig0");

            const comments = await youTubePage.$eval(
                "#comments.style-scope.ytd-watch-flexy",
                e => e.style.display
            );
            
            expect(comments).toBe('block');

            await youTubePage.close();

        });

    });

});

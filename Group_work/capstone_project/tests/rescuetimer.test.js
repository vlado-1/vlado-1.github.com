const puppeteer = require("puppeteer");

jest.setTimeout(30000);

//                       //
//  Rescue Timer Tests   //
//                       //

describe("> Rescue Timer Tests", () => {

    describe("- Normal", () => {

        let browser;
        let page;

        beforeEach(async function () {

            browser = await puppeteer.launch({
                headless: false,
                args: [
                    "--disable-extensions-except=" + require("path").resolve("../src"),
                    "--load-extension=" + require("path").resolve("../src")],
                defaultViewport: null
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
            await page.close();
            await browser.close();
        });

        test("RT1T1 and RT2T2: User can enter time into timer and submit", async () => {
            await (1000);
            let youTubePage = await browser.newPage();
            await youTubePage.goto("https://www.youtube.com");

            // emulate user hovering over timer bar
            selector = '#bar';
            await youTubePage.waitForSelector(selector);
            await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

            // emulating user input for timer

            await youTubePage.$eval('#timer-hours', el => el.value = '1');
            await youTubePage.$eval('#timer-minutes', el => el.value = '30');

            // emulate user pressing submit button
            selector = '#timer-submit';
            await youTubePage.waitForSelector(selector);
            await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

            // wait 1 second
            await (1000);

            await youTubePage.screenshot({ path: 'timer.png' });

            // check timer-output
            const timerOutput = await youTubePage.$eval(
                "#timer-output",
                e => e.innerHTML
            );

            expect(timerOutput).toBe('1h 29m 59s');

            await youTubePage.close();

        });

        test("RT1T2: Pressing submit without entering a time does nothing", async () => {
            let youTubePage = await browser.newPage();
            await youTubePage.goto("https://www.youtube.com");

            // emulate user hovering over timer bar
            selector = '#bar';
            await youTubePage.waitForSelector(selector);
            await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

            // emulate user pressing submit button
            selector = '#timer-submit';
            await youTubePage.waitForSelector(selector);
            await youTubePage.evaluate((selector) => document.querySelector(selector).click(), selector);

            // wait 4 seconds
            await (4000);

            // check timer-output
            const timerOutput = await youTubePage.$eval(
                "#timer-output",
                e => e.innerHTML
            );

            expect(timerOutput).toBe('0h 0m 0s');

            await youTubePage.close();

        });

        test("RT2T2: Check that initially the timer displays as 0h 0m 0s", async () => {
            let youTubePage = await browser.newPage();
            await youTubePage.goto("https://www.youtube.com");

            // check timer-output
            const timerOutput = await page.$eval(
                "#timer-output",
                e => e.innerHTML
            );

            expect(timerOutput).toBe('0h 0m 0s');

            await youTubePage.close();

        });

        test("RT4T1 and RT4T2: Check that the timer bar exists on the home page and mouseover popup works", async () => {
            let youTubePage = await browser.newPage();
            await youTubePage.goto("https://www.youtube.com");

            // check timer-output - test will timeout if not found
            selector = "#bar";
            await youTubePage.waitForSelector(selector);

            // emulate user hovering over timer bar
            await youTubePage.hover(selector);

            const hover = await youTubePage.$eval(
                "#timer-hover",
                e => e.style.display
            );

            expect(hover).toBe('block');
            await youTubePage.close();

        });

        test("RT4T1 and RT4T2: Check that the timer bar exists on the search page and mouseover popup works", async () => {
            let youTubePage = await browser.newPage();
            await youTubePage.goto("https://www.youtube.com/results?search_query=coding");

            // check timer-output - test will timeout if not found
            selector = "#bar";
            await youTubePage.waitForSelector(selector);

            // emulate user hovering over timer bar
            await youTubePage.hover(selector);

            const hover = await youTubePage.$eval(
                "#timer-hover",
                e => e.style.display
            );

            expect(hover).toBe('block');
            await youTubePage.close();

        });

        test("RT4T1 and RT4T2: Check that the timer bar exists on the video page and mouseover popup works", async () => {
            let youTubePage = await browser.newPage();
            await youTubePage.goto("https://www.youtube.com/watch?v=Is1IWMPNqh4");

            // check timer-output - test will timeout if not found
            selector = "#bar";
            await youTubePage.waitForSelector(selector);

            // emulate user hovering over timer bar
            await youTubePage.hover(selector);

            const hover = await youTubePage.$eval(
                "#timer-hover",
                e => e.style.display
            );

            expect(hover).toBe('block');
            await youTubePage.close();

        });

        test("RT5T1: Set break timer", async () => {
            let youTubePage = await browser.newPage();
            await youTubePage.goto("https://www.youtube.com");

            await youTubePage.waitForSelector("#bar");
            await youTubePage.hover("#bar");
            await youTubePage.click("#preset-20");
            const colour = await youTubePage.$eval(
              "#preset-20",
              e => e.style.background
            );

            expect(colour).toBe("rgb(97, 200, 239)");
            await youTubePage.close();
        });

        test("RT5T2: Check that user is unblocked when break timer runs out", async () => {
            let youTubePage = await browser.newPage();
            await youTubePage.goto("https://www.youtube.com");

            // dismiss the alert when it comes up
            youTubePage.on("dialog", async dialog => await dialog.dismiss());
            await youTubePage.waitForSelector("#bar");
            await youTubePage.hover("#bar");

            // set timer for 5 seconds and break for 10 seconds
            await youTubePage.$eval('#timer-seconds', el => el.value = "5");
            await youTubePage.click("#preset-10s");
            await youTubePage.click("#timer-submit");
            await youTubePage.waitFor(6000);

            // now blocked
            expect(await youTubePage.url()).not.toBe("https://www.youtube.com/");

            // should be no longer blocked
            await youTubePage.waitFor(10000);
            await youTubePage.goto("https://www.youtube.com");
            expect(await youTubePage.url()).toBe("https://www.youtube.com/");

            await youTubePage.close();
        });

        test("RT6T1 and RT7T1: Break timer in options menu and default to 30 min", async () => {
            let youTubePage = await browser.newPage();
            await youTubePage.goto("https://www.youtube.com");

            // dismiss the alert when it comes up
            youTubePage.on("dialog", async dialog => await dialog.dismiss());
            await youTubePage.waitForSelector("#bar");
            await youTubePage.hover("#bar");

            // set timer for 5 seconds
            await youTubePage.$eval('#timer-seconds', el => el.value = "5");
            // don't click any presets
            await youTubePage.click("#timer-submit");
            await youTubePage.waitFor(5000);

            // go back to options menu
            await page.bringToFront();
            await page.reload();
            await page.waitFor(1000);
            await page.waitForSelector("#timer-output");
            let timerOutput = await page.$eval(
              "#timer-output",
              e => e.textContent
            );
            // default shoould be 30 min
            expect(timerOutput === "0h 29m 59s" || timerOutput === "0h 29m 58s").toBeTruthy();

            await youTubePage.close();
        });

    });

});

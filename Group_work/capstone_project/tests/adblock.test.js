const puppeteer = require("puppeteer");

jest.setTimeout(20000);

//                              //
//          AdBlock Tests       //
//                              //

describe("> AdBlock Tests", () => {

    describe("- Normal", () => {

        test("#AK1T1 Homepage banner removed (+ #AK1T2 Refreshing page)", async() => {

            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("https://www.youtube.com/");

            // inject code into page.
            await page.addScriptTag({path: "../src/background-adblock.js"});

            let elements = document.getElementsByClassName("ytd-video-masthead-ad-v3-renderer");

            for (let element of elements) {
                const style = await page.$eval(
                    element,
                    e => getComputedStyle(e).textTransform
                  );
                  expect(style).toBe("none");
            }
            
            // Testing after reloading page
            await page.evaluate(() => {
                location.reload(true)
            });
            for (let element of elements) {
                const style = await page.$eval(
                    element,
                    e => getComputedStyle(e).textTransform
                  );
                  expect(style).toBe("none");
            }
            
            await browser.close();
        });


    });

});

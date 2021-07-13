const contentFunctions = require("../src/content-helper.js");

describe("> Page detection unit tests" , () => {
  describe("- onHomePage", () => {
    test("Should match", () => {
      const strings = [
        "https://youtube.com",
        "https://youtube.com/",
        "https://www.youtube.com/?param1=value1&param2=value2",
        "https://www.youtube.com/?param1=value1&param2=value2/",
      ]
      strings.forEach(x => expect(contentFunctions.onHomePage(x)).toBeTruthy());
    });

    test("Should not match", () => {
      const strings = [
        "https://www.youtube.com/results?search_query=peppa+pig",
        "https://www.youtube.com/watch?v=3Iq9f5pLzRc",
      ]
      strings.forEach(x => expect(contentFunctions.onHomePage(x)).toBeFalsy());
    });
  });

  describe("- onSearchPage", () => {
    test("Should match", () => {
      const strings = [
        "https://www.youtube.com/results?search_query=peppa+pig",
      ]
      strings.forEach(x => expect(contentFunctions.onSearchPage(x)).toBeTruthy());
    });

    test("Should not match", () => {
      const strings = [
        "https://youtube.com",
        "https://youtube.com/",
        "https://www.youtube.com/?param1=value1&param2=value2",
        "https://www.youtube.com/?param1=value1&param2=value2/",
        "https://www.youtube.com/watch?v=3Iq9f5pLzRc",
      ]
      strings.forEach(x => expect(contentFunctions.onSearchPage(x)).toBeFalsy());
    });
  });

  describe("- onWatchPage", () => {
    test("Should match", () => {
      const strings = [
        "https://www.youtube.com/watch?v=3Iq9f5pLzRc",
      ]
      strings.forEach(x => expect(contentFunctions.onWatchPage(x)).toBeTruthy());
    });

    test("Should not match", () => {
      const strings = [
        "https://youtube.com",
        "https://youtube.com/",
        "https://www.youtube.com/?param1=value1&param2=value2",
        "https://www.youtube.com/?param1=value1&param2=value2/",
        "https://www.youtube.com/results?search_query=peppa+pig",
      ]
      strings.forEach(x => expect(contentFunctions.onWatchPage(x)).toBeFalsy());
    });
  });
});

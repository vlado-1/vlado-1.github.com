/**
 * @module Helper
 * @desription
 * This module contains functions used across multiple modules, that cannot be
 * categorised to belong to any particular extension feature.
 *
 * Functions: onHomePage(), onSearchPage(), onWatchPage(), randomNumber(...),
 * randomIndex(...), randomElement(...), randomElementGenerator(...),
 * getTextQuotes(...), getJokes(), getImageQuotes(...)
 *
 * Helper: readFile(...)
 *
 * Dependencies: Chome API
 */

/**
 * Determine if you are on the home page.
 *
 * @param {string} [url=loation.href] - The url to be tested.
 * @return {boolean} Whether the url matches the home page regex.
 */
const onHomePage = (url = location.href) => /youtube.com\/?(\?.*)?$/.test(url);

/**
 * Determine if you are on the search page.
 *
 * @param {string} [url=loation.href] - The url to be tested.
 * @return {boolean} Whether the url matches the search page regex.
 */
const onSearchPage =
  (url = location.href) => /youtube.com\/results\?search_query/.test(url);

/**
 * Determine if you are on the watch page.
 *
 * @param {string} [url=loation.href] - The url to be tested.
 * @return {boolean} Whether the url matches the watch page regex.
 */
const onWatchPage = (url = location.href) => /youtube.com\/watch?/.test(url);

// Helper functions relating to random numbers

/**
 * Generates a random number within a specified range.
 *
 * @param {number} min - Lower bound of the random number (inclusive).
 * @param {number} max - Upper bound of the random number (exclusive).
 * @return {number} Random integer in the range [min, max).
 */
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

/**
 * Get a random index from an array.
 *
 * @param {Array} array - The array.
 * @return {number} A random, valid index if the array wasn't empty.
 */
const randomIndex = array => randomNumber(0, array.length);

/**
 * Get a random element from an array.
 *
 * @param {Array} array - The array.
 * @return {*} A random element if the array wasn't empty.
 */
const randomElement = array => array[randomIndex(array)];

/**
 * Get random elements from an array such that
 * no element is duplicated until all elements are used.
 *
 * @param {Array} array - The array.
 * @yield {*} A random element if the array wasn't empty.
 */
const randomElementGenerator = function* (array) {
  while (true) {
    const cloned = [...array]
    while (cloned.length > 0) {
      const index = randomIndex(cloned);
      yield cloned.splice(index, 1)[0];
    }
  }
}

/**
 * Retrieves text from a local file.
 *
 * @param {string} filePath - Path to file.
 * @return {function(): Promise<string[]>} A curried function when executed
 * gives an array where each line is an element.
 */
const readFile = function(filePath) {
  return function() {
    const url = chrome.runtime.getURL(filePath);
    return fetch(url)
      .then(res => res.text())
      .then(text => text.split("\n"));
  }
}

// retrieve quotes from a local file
const getTextQuotes = readFile("quotes-text.txt");

const getJokes = readFile("quotes-jokes.txt");

// retrieve image urls from a local file
const getImageQuotes = readFile("quotes-imageurl.txt");

// retrieve image urls from a local file
const getCalmImageQuotes = readFile("quotes-calmimageurl.txt");

// export functions for testing
if (typeof module !== "undefined") {
  module.exports.onHomePage = onHomePage;
  module.exports.onSearchPage = onSearchPage;
  module.exports.onWatchPage = onWatchPage;
  module.exports.readFile = readFile;
  module.exports.getTextQuotes = getTextQuotes;
  module.exports.getImageQuotes = getImageQuotes;
  module.exports.getCalmImageQuotes = getCalmImageQuotes;
  module.exports.getJokes = getJokes;
  module.exports.randomElementGenerator = randomElementGenerator;
  module.exports.randomElement = randomElement;
  module.exports.randomNumber = randomNumber;
  module.exports.randomIndex = randomIndex;
}

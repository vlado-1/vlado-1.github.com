/**
 * @module Adblock
 * @description
 * This module is responsible for blocking ads and annotations that try to
 * connect to YouTube. It blocks all ads and annotations that come from a
 * domain specified in some regex expressions.
 *
 * Functions: checkURL(...)
 *
 * Dependencies: Chome API
 */

/**
 * Checks the url of a request object against.
 *
 * @param {object} request - A web request to the browser.
 * @param {string} request.url - The url of the request.
 * @return {undefined|object} - Nothing, or an object that cancels the request.
 */
const checkURL = function({url}) {
  // regex strings to check against
  const YOUTUBE_AD_REGEX = /(doubleclick\.net)|(adservice\.google\.)|(youtube\.com\/api\/stats\/ads)|(&ad_type=)|(&adurl=)|(-pagead-id.)|(doubleclick\.com)|(\/ad_status.)|(\/api\/ads\/)|(\/googleads)|(\/pagead\/gen_)|(\/pagead\/lvz?)|(\/pubads.)|(\/pubads_)|(\/securepubads)|(=adunit&)|(googlesyndication\.com)|(innovid\.com)|(tubemogul\.com)|(youtube\.com\/pagead\/)|(google\.com\/pagead\/)|(flashtalking\.com)|(googleadservices\.com)|(s0\.2mdn\.net\/ads)|(www\.youtube\.com\/ptracking)|(www\.youtube\.com\/pagead)|(www\.youtube\.com\/get_midroll_)|(www\.youtube\.com\/api\/stats)/;
  const YOUTUBE_ANNOTATIONS_REGEX = /^https?:\/\/(\w*.)?youtube\.com\/annotations_invideo\?/;

  if (YOUTUBE_AD_REGEX.test(url)) {
    console.log("ad blocked");
    return { cancel: true }
  }
  if (YOUTUBE_ANNOTATIONS_REGEX.test(url)) {
    console.log("annotation blocked");
    return { cancel: true }
  }
}

// Block ad/annotation request inside YouTube tabs
chrome.webRequest.onBeforeRequest.addListener(checkURL, {
    urls: ["http://*/*", "https://*/*"],
    types: [
      "script",
      "image",
      "xmlhttprequest",
      "sub_frame"
    ]
  }, ["blocking"]
);

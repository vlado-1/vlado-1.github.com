/**
*  @Module Thumbnail
*
*  @Description
*  the module is responsible for altering the display, colour,
*  title case, and animation of YouTube thumbnails. Certain
*  helper methods have been developed in order to assist in
*  extracting the appropriate tags/elements from YouTube's DOM.
*
*  Functions: hideVideos(...), greyscaleThumbnails(...), lowercaseTitles(...),
*              hideAnimation(...)
*
*  Helpers:  getVids(), getThumbnailAnimation()
*
*  Dependencies: None
*/

/**
 * Get all video containers all the three main pages.
 * @return {array} - Array of elements.
 */
const getVids = () => [
  // video page
  ...document.getElementsByTagName("ytd-watch-next-secondary-results-renderer"),
  // home page
  ...document.getElementsByTagName("ytd-two-column-browse-results-renderer"),
  // search results page
  ...document.getElementsByTagName("ytd-section-list-renderer")
];

/**
 * Controls the display of recommended videos.
 *
 * @param {boolean} active - If true, hide videos.
 */
const hideVideos =
  active => getVids().forEach(x => x.style.display = active ? "none" : "");

/**
 * Controls the colour of video thumbnails.
 *
 * @param {boolean} active - If true, turn greyscale.
 */
const greyscaleThumbnails =
  active => getVids().forEach(x => x.style.filter = active ? "grayscale(1)" : "");

/**
 * Controls the case of thumbnail titles.
 *
 * @param {boolean} active - If true, titles are in lowercase.
 */
const lowercaseTitles =
  active => getVids().forEach(x => x.style.textTransform = active ? "lowercase" : "");

/**
 * Gets the mouseover element of each video.
 *
 * @return {array} - Array of elements.
 */
const getThumbnailAnimation = () => document.querySelectorAll('#mouseover-overlay');

/**
 * Controls mouseover behaviour on thumbnails.
 *
 * @param {boolean} active - If true, hide the animation/video preview.
 */
const hideAnimation =
  active => getThumbnailAnimation().forEach(x => x.style.display = active ? "none" : "");

// export functions for testing
if (typeof module !== "undefined") {
  module.exports.hideVideos = hideVideos;
  module.exports.greyscaleThumbnails = greyscaleThumbnails;
  module.exports.lowercaseTitles = lowercaseTitles;
  module.exports.getThumbnailAnimation = getThumbnailAnimation;
  module.exports.hideAnimation = hideAnimation;
  module.exports.getVids = getVids;
}

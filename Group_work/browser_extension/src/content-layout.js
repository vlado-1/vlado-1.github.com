/**
 * @module Layout
 * @description
 * The responsibility of this module is to adjust the layout of the video page
 * and home page. It contains the functions responsible for altering YouTube's
 * home page style so that it resembles Google's, and for shifting the video
 * description to beside the video.
 *
 * Functions: changeVideoLayout(...), disableAutoplay(), changeHomeLayout(...)
 *
 * Helpers: getHomePageElements(), createGoogleStyleElements(), createOriginalLayoutElements()
 *
 * Dependecies: content-helper.js
 */

/**
 * Moves the description to the side of the video. First it checks whether or not
 * the user is on the YouTube watch page. If they are, then it extracts the DOM
 * elements for the YouTubedescription box, alters the size of the description,
 * and inserts the description as the first element in the suggested video feed column.
 *
 * @param {boolean} active - To turn this feature on or off.
 * @return {boolean} - Whether the function did anything.
 */
const changeVideoLayout = active => {
  // function only runs on the YouTube watch page
  if (!onWatchPage()) return false;

  if (!active) {
    const videoDescription = document.querySelector("#meta.style-scope.ytd-watch-flexy");
    const secondaryColumn = document.querySelector("ytd-watch-flexy #secondary");

    // Reset layout if it has been changed
    if (videoDescription.parentNode == secondaryColumn) {
      const originalLocation = document.querySelector("#primary-inner");
      const adjacentNode = document.querySelector("#ticket-shelf");
      originalLocation.insertBefore(videoDescription, adjacentNode);
    }
    return false;
  }

  // function runs as normal
  const videoDescription = document.querySelector("#meta.style-scope.ytd-watch-flexy");

  // expand description to be the same size as the video
  // with a default of 300px if something goes wrong
  const descriptionExpander = document.querySelector("ytd-expander.style-scope.ytd-video-secondary-info-renderer");
  const video = document.querySelector("video");
  const videoHeight = video && video.style.height || "300px";
  descriptionExpander.style.cssText = `--ytd-expander-collapsed-height: ${videoHeight}`;

  // move video description to the secondary column
  // insert the video description before the recommended videos
  const secondaryColumn = document.querySelector("ytd-watch-flexy #secondary");
  secondaryColumn.insertBefore(videoDescription, secondaryColumn.childNodes[0]);

  return true;
}

/**
 * Disables YouTube's autoplay. First it checks whether or not the user is on the
 * YouTube watch page, and the the feature should be on. If so, then we retrieve
 * the autoplay toggle button element from YouTube's DOM, and click on it.
 *
 * This function takes advantage of the fact that YouTube has already implmented
 * a button which can enable/disable autoplay.
 *
 * @param {boolean} active - To turn this feature on or off.
 * @return {boolean} - Whether the function did anything.
 *
 */
function disableAutoplay(active) {
  // function only runs on the YouTube watch page
  if (!active || !onWatchPage()) return false;

  // get autoplay toggle element
  const autoplay = document.getElementById("toggle")
    || document.getElementById("improved-toggle");

  // disable the autoplay toggle if it is active
  if (autoplay) {
    if (autoplay.hasAttribute("active")) {
      autoplay.click();
    }
    autoplay.setAttribute("disabled", "");
  }
  return true;
}

/**************************
*  @Section: Home Page Google Layout
*
*  @Description: this section is responsible for altering YouTube's homepage so
*                that it resembles Google's homepage. More specifically, this
*                section resizes and repositions YouTube's icon and search bar
*                such that both are enlarged, positioned in the centre of the screen,
*                and with the icon sitting on top of the search bar.
*
*                Helper methods have been developed to abstract away the process
*                of retrieving the elements from YouTube's DOM, styling them, and
*                returning them to their original form.
*
*
*  @Functions: changeHomeLayout(...)
*
*  @Helpers:  getHomePageElements(), createGoogleStyleElements(),
*             createOriginalLayoutElements()
*
*  @Dependencies: content-helper.js
*
***************************/

/**
 * The google style look is based on two main features: logo and search box.
 *
 * logo is a responsive element with YouTube's logic which changes on
 * dark mode, YouTube Red, etc. and is stored as a vector so scaling up doesn't
 * lose quality.
 *
 * logoSizeHandler is a separate element which handles the size of the logo.
 *
 * searchBox is a search box using YouTube's built in style and handles all the
 * suggestions.
 *
 * @return {object} - Object containing the logo and searchbar which need changing.
 */
const getHomePageElements = () => ({
  logo: document.querySelector("ytd-topbar-logo-renderer"),
  logoSizeHandler: document.querySelector("#logo-icon-container"),
  searchBox: document.querySelector("ytd-searchbox")
});

/**
 * Turns elements into google style format. This is made easily reversible by
 * using wrapper divs which can be removed later.
 *
 * @return {object} - Object containing Google formatted logo and searchbar.
 */
const createGoogleStyleElements = function() {
  const {logo, logoSizeHandler, searchBox} = getHomePageElements();

  // resize the logo, maintaining aspect ratio
  const width = 300;
  logoSizeHandler.style.cssText = `width: ${width}px; height: ${width*3/10}px;`;

  // creating wrapper divs
  const newLogo = document.createElement("div");
  const newSearchBox = document.createElement("div");

  // adding informative classes
  // class "to-remove" is used for removing the element when not needed
  newLogo.classList.add("youtube-logo", "to-remove");
  newSearchBox.classList.add("google-style", "to-remove");

  // removing unwanted classes
  // ytd-masthead class adds responsive styles that aren't wanted to achieve this look
  searchBox.classList.remove("ytd-masthead");

  // positioning the logo and search box with css
  newLogo.style.cssText = "top:25%;left:37%;position:absolute;";
  newSearchBox.style.cssText = "top:45%;left:30%;position:absolute;width:500px";

  // add original element to the wrapper
  newLogo.appendChild(logo);
  newSearchBox.appendChild(searchBox);
  return {newLogo, newSearchBox};
}

// Get elements to be modified for the original YouTube layout
// There isn't too much to revert as most of the modifications were done
// on the wrapper div
/**
 * Get elements to be modified for the original YouTube layout. There isn't too
 * much to revert as most of the modifications were done on a wrapper div.
 *
 * @return {object} - Object containing YouTube's original logo and searchbar.
 */
const createOriginalLayoutElements = function() {
  const {logo, logoSizeHandler, searchBox} = getHomePageElements();

  // add back the class we removed
  searchBox.classList.add("ytd-masthead");

  // undo the logo size change
  logoSizeHandler.removeAttribute("style");
  return {logo, searchBox};
}


/**
 * Places elements in the centre of the page (for Google style).
 * @return {undefined}
 */
const placeInCentre = function() {
  // ytd-browse is the main part of the home page
  const insertPoint = document.querySelector("ytd-browse");
  const {newLogo, newSearchBox} = createGoogleStyleElements();
  insertPoint.appendChild(newLogo);
  insertPoint.appendChild(newSearchBox);
}

/**
 * Restores the original YouTube layout.
 * Places elements back in their former location.
 * @return {undefined}
 */
const placeAtTop = function() {
  const insertPoint = document.querySelector("#masthead > #container");
  const {logo, searchBox} = createOriginalLayoutElements();
  insertPoint.insertBefore(logo, document.querySelector("#skip-navigation"));
  insertPoint.insertBefore(searchBox, document.querySelector("#end"));
}

/**
 * Creates a Google style homepage. First it checks whether or not the user is
 * on the YouTube homepage. If they are, then firstly clean up any ad banners on
 * the page. Secondly, check if any recommended videos are showing on the
 * homepage at the moment. If they are, then we need to make sure the homepage
 * is like normal - no Google style. If there are no recommended videos, then we
 * are free to change the layout to resemble Google's.
 *
 * @param {boolean} active - Whether homepage should be Google style.
 * @return {boolean} - whether the function did anything.
 */
const changeHomeLayout = function(active) {
  // function only runs on the YouTube home page
  if (!onHomePage()) {
    placeAtTop();
    return false;
  }
  // remove home page banner ads
  const banners = [
    ...document.querySelectorAll("#masthead-ad"),
    ...document.querySelectorAll("ytd-video-masthead-ad-v3-renderer")
  ]
  banners.forEach(x => x.style.display = "none");

  if (active) {
    placeInCentre();
  }
  else {
    placeAtTop();
  }
  // remove any empty div elements to not clutter the DOM
  // only visible through inspect element
  document.querySelectorAll(".to-remove").forEach(x => {
    if (!x.hasChildNodes()) x.remove();
  });
  return true;
}

// export functions for testing
if (typeof module !== "undefined") {
  module.exports.changeVideoLayout = changeVideoLayout;
  module.exports.changeHomeLayout = changeHomeLayout;
}

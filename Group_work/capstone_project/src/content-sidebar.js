/**
*  @Module Sidebar
*
*  @Description
*   the module is responsible for altering the display of the
*  YouTube Sidebar (or Guide), as well as the display of other
*  icons and buttons on YouTube's navigation bar. A method has
*  been developed to assist with extracting the appropriate
*  tags/elements from YouTube's DOM.
*
*  Fuctions: hideSidebar(...)
*
*  Helpers: getSidebar()
*
*  Dependencies: none
*
*/


/**
 * Get all elements composing the side bar of YouTube and
 * get all elements composing the sign in buttons in the top right hand corner
 *
 * @return {array} - array of DOM elements that make up the side bar and sign in buttons
 */
const getSideBar = () => [
  //get YouTube Guide Icon element
  ...document.querySelectorAll("#guide-button"),
  //get YouTube Guide Side Bar element
  ...document.querySelectorAll("#guide"),
  //get YouTube buttons (links for creating videos, YouTube apps, Messages and notifications) elements
  ...document.querySelectorAll("#buttons"),
  //get YouTube Mini-Guide Side Bar element
  ...document.querySelectorAll("ytd-mini-guide-renderer"),
  //get YouTube Guide Pop-up Container element
  ...document.querySelectorAll("ytd-popup-container")
];

/**
 * function to control the display of the side bar
 *
 * @param {boolean} active -  if function parameter is true, hide sidebar, else show sidebar.
 */
const hideSidebar =
  active => getSideBar().forEach(x => x.style.display = active ? "none" : "");

// export functions for testing
if (typeof module !== "undefined") {
  module.exports.hideSidebar = hideSidebar;
  module.exports.getSideBar = getSideBar;
}

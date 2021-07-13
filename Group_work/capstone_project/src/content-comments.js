/**
 * @module CommentsRemoval
 * @description
 * This module is responsible for removing comments from the video viewing page.
 *
 * Functions: removeComments()
 *
 * Dependencies: content-helper.js
 *
 */

/**
 * Hides comments on the watch page.
 *
 * @param {boolean} active - Turn the feature on or off.
 */
const removeComments = active => {
  // function only runs on the YouTube watch page
  if (!onWatchPage()) return false;

  const comments = document.querySelector("#comments.style-scope.ytd-watch-flexy");

  // If filters is toggled ON, remove the comments section
  if (active) {
    comments.style.display = "none";
  }

  // If filters is toggled OFF, display the comments section
  else {
    comments.style.display = "block";
  }
}

// export functions for testing
if (typeof module !== "undefined") {
  module.exports.removeComments = removeComments;
}

/**
*  @Module Update
*
*  @Description
*  the module is resposible for reading the state of the
*  extension (such as whether or not the timer is on, or what
*  buttons have been activated) and subsequently applying
*  the appropriate changes to the YouTube webpage. The module
*  listens for chrome and window events upon which an update
*  is invoked.
*
*  Functions: update()
*
*  Helpers: turnEverythingOff(), handleTimerState(...)
*
*  Dependencies: content-thumbnail.js, content-sidebar.js, content-layout.js,
*                 content-motivation.js, background-bingeTimer, Chrome API
*/

// function to turn everything off
const turnEverythingOff = function() {
  // hideSidebar(false);
  // hideVideos(false);
  greyscaleThumbnails(false);
  hideAnimation(false);
  lowercaseTitles(false);
  antiBingeTextQuotes(false);
  disableAutoplay(false);
  thumbnailAntiBinge(false);
}

/**
 * function to interpret a given timer state.
 *
 * Particular states require that the appropriate functions are applied to the
 * YouTube DOM. The mapping of states to corresponding function calls
 * happens here.
 *
 * @param {string} state - the state of the timer.
 */
const handleTimerState = function(state) {
  switch (state) {
    // Redirect user if blocked
    case "Blocked":
      location.replace("https://www.google.com/search?q=cats&tbm=isch");
      break;
    // for stages 2-5, activate features for current stage and all previous stages

    // When the timer reaches 90% of total time
    // Home page is reformatted to the google style page
    case "Complete Restrictions":
      hideVideos(true);
      hideSidebar(true);

    // When the timer reaches 80% of total time
    // Inspirational quotes start to appear on the side bar
    // of the search results page and watch page
    case "Quote Ads":
      antiBingeVideo(true);

    // When the timer reaches 70% of total time
    // Autoplay is disabled
    case "Quotes":
      antiBingeTextQuotes(true);
      thumbnailAntiBinge(true);

    // When the timer reaches 60% of total time
    // Thumbnail design is changed (greyscale, lowercase titles and no mouseover animations)
    case "Thumbnail Redesign":
      greyscaleThumbnails(true);
      hideAnimation(true);
      lowercaseTitles(true);

    // When the timer reaches 50% of total time
    // Thumbnail mouseover quotes start to appear
    case "Autoplay Disabled":
      disableAutoplay(true);
      break;

    // When the timer starts, YouTube remains unchanged
    // Except for minor changes
    case "No Restrictions":
      turnEverythingOff();
      break;
    default: return false;
  }
  return true;
}

let lastUpdate;

/**
 * Update youtube according to stored settings.
 *
 * All YouTube modifying functions (excluding adblock) get called from here
 * and the current state of the timer gets read and interpreted.
 * All extension menu options are applied from here.
 *
 */
const update = function() {
  // spam prevention
  if (new Date() - lastUpdate < 50) return;
  lastUpdate = new Date();
  let usingTimer = false;
  chrome.storage.sync.get("timer-state", upperResult => {
    chrome.storage.sync.get("button", lowerResult => {

      disableFeatures = lowerResult["button"] == "Off";
      isBlocked = upperResult["timer-state"] == "Blocked";

      if (disableFeatures && !isBlocked) {
        usingTimer = handleTimerState("No Restrictions");
      }
      else {
        usingTimer = handleTimerState(upperResult["timer-state"]);
      }
    });
  });
  chrome.storage.sync.get("timer-state", result => {
    if (result["timer-state"] !== "inactive") {
      displayTimerState(result["timer-state"]);
      disableTimerInput();
    }
  });
  if (usingTimer) return;

  // User is Not Using Timer
  chrome.storage.sync.get("homepage", result => {
    if (onHomePage()) {
      hideVideos(result.homepage);
    }
    else {
      hideVideos(false);
    }
    changeHomeLayout(result.homepage);
    hideSidebar(result.homepage);
  });

  chrome.storage.sync.get("watchpage", result => {
    changeVideoLayout(result.watchpage);
  });

  chrome.storage.sync.get("comments", result => {
    // filtering functions
    //addMessageFilter(result.filters);
    //addVideoFilter(result.filters);
    removeComments(result.comments);
  });
}

// create mutation observer that calls update
const observer = new MutationObserver(update);

// create observer for each video container
const setupObserverNodes = () =>
  getVids().forEach(x => observer.observe(x, { attributes: true }));

// Update on launch
window.addEventListener("load", update);
window.addEventListener("load", setupObserverNodes);

// Update on page change
window.addEventListener("yt-page-data-updated", update);
window.addEventListener("yt-page-data-updated", setupObserverNodes);
window.addEventListener("yt-page-data-updated", () => samePage = false);
// Update when settings are changed
chrome.storage.onChanged.addListener(update);

// activate bar
window.addEventListener("load", activateBar);

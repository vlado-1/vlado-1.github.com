/*******************************************************************************
* @Module Motivational Content
*
* @Description
*
*  this module is responsible for adding inspirational quotes
*  to the YouTube video feed on both the Search and Watch pages;
*  for administering ad-like quotes before a video starts; and
*  for enabling quotes to be displayed over a thumbnail when
*  the user's mouse hovers over one. It is broken down into three
*  sections, one for each feature.
*
*  Functions:   antiBingeTextQuotes(...), thumbnailAntiBinge(...),
*                antiBingeVideo(...)
*
*  Helpers: styleQuote(...), addQuotesToElement(...), addQuotesBetweenVideos(...),
*            prepareImageElement(...), fadeOutImage(...)
*
*  Dependencies: content-helper.js
*
*******************************************************************************/





/**************************
*  @Section: Quote Feed
*
*  @Description: the role of this section is to insert quotes into the video
*                and search pages. Helper methods have been developed to
*                further abstract how quotes are styled, and how they are
*                added onto the page.
*
*  @Functions: antiBingeTextQuotes(...)
*
*  @Helpers: styleQuote(...), addQuotesToElement(...), addQuotesBetweenVideos(...)
*
*  @Dependencies: content-helper.js
*
***************************/

/**
 * function to style quotes. Alters text style and gives a border.
 *
 * @param {string} image- image resource location as string.
 * @param {string} quoteText - quote text to insert alongside image.
 * @return {object} - a DOM element containing an image beside a quote text.
 */
const styleQuote = function(image, quoteText) {
  // Border
  const border_div = document.createElement("div");
  border_div.style.cssText =
    "border-radius: 25px; border-style: solid; border-width: medium; border-collapse: separate;"
    + "margin: 20px 0; padding: 5px 30px; width: 300px; overflow: auto";

  // Image
  const img = document.createElement("img");
  img.id = "calmImg";
  img.src = image;
  img.style.cssText =
    "align: middle; width: 120px; height: 100px; margin-right: 15px; float: left;";
  border_div.appendChild(img);

  // Text
  const text_div = document.createElement("div");
  text_div.textContent = quoteText;
  text_div.style.cssText =
    "text-align: left; font-size: 1.6rem; font-style: 'Roboto';"
  border_div.append(text_div);

  return border_div;
}

/**
 * adds n quotes to an element
 *
 * @param {array} quotes- array of quotes to add.
 * @param {object} parent - parent element to add quotes to.
 * @param {number} n- number of quotes to add, default is 10.
 */
const addQuotesToElement = function(img, quotes, parent, n = 10) {
  const quotesGenerator = randomElementGenerator(quotes);
  for (let i = 0; i < n; ++i) {
    const randomImg = randomElement(img);
    const quote = quotesGenerator.next().value;
    const container = styleQuote(randomImg, quote);
    container.classList.add("quote1");
    parent.appendChild(container);
  }
  quotesGenerator.return();
}

/**
 * add quotes to column when videos showing
 *
 * @param {array} img- array of image resource locations .
 * @param {array} quotes - array of jokes.
 */
const addQuotesBetweenVideos = function(img, quotes) {
  // element containing list of videos
  const videos = document.querySelector("ytd-watch-next-secondary-results-renderer #items");

  let loadLimit = Math.floor(videos.childNodes.length/3)
  let count = 0

  quotes.forEach((quote, i) => {
    if (count > loadLimit) {
      return;
    }
    const randomImg = randomElement(img);
    const container = styleQuote(randomImg, quote);
    container.classList.add("quote2");
    videos.insertBefore(container, videos.childNodes[i * 4 + 1]);
    count++;
  });
}

/**
 * mix an array of quotes with jokes, given a ratio
 *
 * @param {array} quotes- the quotes that will be diplayed.
 * @param {number} ratio - how many jokes per quote.
 * @return {promise} - an object containing the array of quotes and jokes mixed together.
 */
const mixWithJokes = async (quotes, ratio = 1) => {
  const jokes = await getJokes().then(randomElementGenerator);
  const output = quotes.reduce((acc, cur) => {
    const newJokes = new Array(ratio).fill(jokes.next().value);
    return acc.concat(cur, newJokes);
  }, []);
  jokes.return();
  return output;
}

// timeout variable
let delay;

let samePage = false;

/**
 * Adds quotes to search and watch pages.
 *
 * It uses methods from the content-helper.js module to determine
 * whether or not the user is on the search page or watch page.
 * If it is on one of these pages, then the function will continue
 * to retrieve the quotes it needs, and insert them beneath the
 * appropriate YouTube DOM elements.
 *
 * @param {boolean} active - boolean representing whether or not this function should add quotes.
 */
const antiBingeTextQuotes = async function(active) {
  //if (samePage) return;
  if (onSearchPage()) {
    // Get right column of search results page
    // and remove its contents (playlists, ads, existing quotes, etc)
    const rightCol = document.querySelector("ytd-secondary-search-container-renderer");
    rightCol.innerHTML = "";

    if (active) {
      rightCol.removeAttribute("hidden");
      const quotes = await getTextQuotes()
        .then(mixWithJokes);
      const img = await getCalmImageQuotes();
      addQuotesToElement(img, quotes, rightCol);
      samePage = true;
    }
    else {
      rightCol.setAttribute("hidden", "");
    }
  }
  else if (onWatchPage()) {
    // remove all quotes on the page
    document.querySelectorAll(".quote1").forEach(x => x.remove());
    document.querySelectorAll(".quote2").forEach(x => x.remove());

    if (active) {
      const quotes = await getTextQuotes()
        .then(mixWithJokes);
      const img = await getCalmImageQuotes();

      // set 300 ms delay to allow DOM to fully load
      // if function is called more than once during this time, refresh the delay
      clearTimeout(delay);
      delay = setTimeout(addQuotesBetweenVideos(img, quotes), 300);
      samePage = true;
    }
  }
}




/**************************
*  @Section: Thumbnail AntiBinge
*
*  @Description: the role of this section is to enable quotes to popup up on screen
*                when a user's mouse hovers over a particular thumbnail.
*
*  @Functions: thumbnailAntiBinge(...)
*
*  @Helpers: None
*
*  @Dependencies: None
*
***************************/

/**
 * Enables quotes to be displayed on screen when a user hovers
 * their mouse over a thumbnail.
 *
 * This is accomplished by overriding the title attribute of the
 * YouTube thumbnails. This is an attribute that YouTube
 * will display on its site by default when a user's mouse hovers
 * over a thumbnail.
 *
 * @param {boolean} active - boolean representing whether or not this function should do anything..
 */
const thumbnailAntiBinge = async active => {
  if (!active) return false;

  // Setting titles for each thumbnail
  const thumbnails = document.querySelectorAll("#thumbnail");
  const quotes = await getTextQuotes();

  thumbnails.forEach(thumbnail => {
    const quote = randomElement(quotes);
    thumbnail.setAttribute("title", quote);
  });
}




/**************************
*  @Section: Inspirational Ads
*
*  @Description: the role of this section is to display an image of an
*                inspirational quote before the video starts, and then to gradually
*                make it fade away, or to remove it upon a user click. Helper
*                methods have been developed to abstract away the task of
*                preparing the HTML image, and having it fade away on screen.
*
*  @Functions: antiBingeVideo(...)
*
*  @Helpers: prepareImageElement(...), fadeOutImage(...)
*
*  @Dependencies: content-helper.js
*
***************************/

/**
 * function for creating image elements with appropriate style
 *
 * @param {String} url- location of the image
 * @param {Object} video - a DOM element containing the video the image will cover.
 */
const prepareImageElement = function(url, video) {
  const img = document.createElement("img");
  img.id = "quoteImg";
  img.src = url;

  // Set position
  img.style.position = "absolute";
  img.style.top = "0px";
  img.style.left = "0px";

  // Adjust to youtube's screen size;
  img.style.width = video.style.width;;
  img.style.height = video.style.height;

  return img;
}

/**
 * Apply fade out effect to image
 *
 * @param {Object} img - the DOM element containing the Motivational Image.
 * @param {Object} video - a DOM element containing the video the image will cover.
 */
const fadeOutImage = (img, video) => new Promise(resolve =>
  // 3 second delay to allow for reading of the quote
  setTimeout(() => {
    // set initial opacity to 1 then slowly fade out
    img.style.opacity = 1;
    const fade = setInterval(function() {
      if (img.style.opacity > 0) {
        img.style.opacity -= 0.05;

        // constantly adjust to youtube's screen size;
        img.style.width = video.style.width;;
        img.style.height = video.style.height;
      } else {
        clearInterval(fade);
        resolve();
      }
    }, 100);
  }, 3000));

// variable to keep track of last video watched
let previousVideo = null;

/**
 * Controls the quote at the start of a video.
 *
 * The function checks if the user is on the YouTube watch page, and if
 * they are watching a new video. If this is the case, it will pause
 * the video, create a quote image element, insert it in front of the
 * video, and then gradually make it fade out.
 * The image will have been assigned an onClick() event function
 * which deletes the image if the user clicks on it.
 *
 * @param {boolean} active - boolean representing whether or not this function should do anything.
 * @param {boolean} skipFadeOut - boolean specifing if the fade out sequence should be
 *                                skipped. Set false to default. Mainly utlilised
 *                                during testing.
 */
const antiBingeVideo = async function(active, skipFadeOut = false) {
  if (!active || !onWatchPage() || previousVideo === location.href) return false;
  previousVideo = location.href;

  // Get and pause the video
  const video = document.querySelector("video");
  video.pause();

  // retrieve image quote urls
  // pick a random one to insert into the img element
  const quotes = await getImageQuotes();
  const randomQuote = randomElement(quotes);
  const img = prepareImageElement(randomQuote, video);

  // define function to remove the image and play the video
  const removeImage = function() {
    img.remove();
    video.play();
  }

  // Play video and remove image if image clicked on
  img.onclick = removeImage;

  // Insert image
  const insertPoint = document.getElementById("player-container");
  insertPoint.appendChild(img);

  // if the fade out isn't required (mainly for testing purposes)
  if (skipFadeOut) return true;

  //Remove image from video by fade out
  fadeOutImage(img, video).then(removeImage);

  return true;
}

// export functions for testing
if (typeof module !== "undefined") {
  module.exports.antiBingeVideo = antiBingeVideo;
  module.exports.antiBingeTextQuotes = antiBingeTextQuotes;
  module.exports.thumbnailAntiBinge = thumbnailAntiBinge;
}

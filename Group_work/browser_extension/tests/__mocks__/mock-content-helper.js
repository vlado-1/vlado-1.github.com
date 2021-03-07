// Helper functions to determine what page you are on
const onHomePage = (url = location.href) => /youtube.com\/?(\?.*)?$/.test(url);

const onSearchPage =
  (url = location.href) => /youtube.com\/results\?search_query/.test(url);

const onWatchPage = (url = location.href) => /youtube.com\/watch?/.test(url);


// Mock of Helper function
const readFile = function(filePath) {

  if (filePath == "quotes-text.txt") {
    return ["Lack of direction not lack of time is the problem. We all have twenty-four hour days.",
            "It is during our darkest moments that we must focus to see the light.",
            "Concentrate all your thoughts upon the work at hand. The sun’s rays do not burn until brought to a focus."
           ];
  }

  else if (filePath == "quotes-imageurl.txt") {
    return ["https://collinsfinancialgroup.com.au/wp-content/uploads/Quote-2017-02-13-Stop-getting-distracted.jpg",
            "https://www.keepinspiring.me/wp-content/uploads/2015/11/29.jpg",
            "https://media-cache-ak0.pinimg.com/736x/37/9a/56/379a568e4adddc355fe012f499e0e907.jpg"
           ];
  }

  else if (filePath == "quotes-jokes.txt") {
    return ["Super",
            "Funny",
            "Joke"];
  }

  else if (filePath == "quotes-calmimageurl.txt") {
    return ["https://isomerica.net/~mlah/art/photos/small.nature.puffball.jpg",
            "https://images.pexels.com/photos/574282/pexels-photo-574282.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            "https://images.pexels.com/photos/1437953/pexels-photo-1437953.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            "https://www.mindtools.com/media/Responsive-Images/Articles/Communication_Skills/IS_4878080_AVTG_1x1.jpg"];
  }
}

// retrieve quotes from a local file
const getTextQuotes = async () => readFile("quotes-text.txt");

// retrieve image urls from a local file
const getImageQuotes = async () => readFile("quotes-imageurl.txt");

const getJokes = async () => readFile("quotes-jokes.txt");

// retrieve image urls from a local file
const getCalmImageQuotes = async () => readFile("quotes-calmimageurl.txt");

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

const randomIndex = array => randomNumber(0, array.length);

const randomElement = array => array[randomIndex(array)];

const randomElementGenerator = function* (array) {
  while (true) {
    const cloned = [...array]
    while (cloned.length > 0) {
      const index = randomIndex(cloned);
      yield cloned.splice(index, 1)[0];
    }
  }
}

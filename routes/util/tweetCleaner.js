const tiny = require('tiny-text/lib/tiny');
const cleanTweet = function (tweet) {

  // change index to 9 for testing, 13 for prod
  tweet = tweet.substring(13);

  // replace encoding w/ iron tag
  tweet = tweet.replace(/<img=10>/, "[⛑️] ");
  tweet = tweet.replace(/<img=2>/, "[👷] ");
  tweet = tweet.replace(/<img=3>/, "[👨‍🚀] ");

  // strip @ symbol to re/opmove tagging
  // tweet = tweet.replace(/@/g, "");

  // trim and filter message
  tweet = tweet.replace(/[\uFFFD]/g, " ");
 
  // add emoji mark
  tweet = addMark(tweet);
  
  return tweet;
};

const getUserName = function (latestMessage) {
  
    // remove timestamp + clan chat logo
    // change index to 9 for testing, 13 for prod
  latestMessage = latestMessage.substring(13);

  // grab beginnign of string to beginning of message
  let username = latestMessage.substring(latestMessage.indexOf(":"), 0);

  // remove helmie shit
  username = username.replace(/<img=10>/, "");
  username = username.replace(/<img=2>/, "");
  username = username.replace(/<img=3>/, "");


  // return parsed username
  return username;
  
};

const addMark = function(tweet) {
  if (tweet.includes("Peanut Blitz")) {
    tweet = "[🥜] " + tweet;
  } else if (tweet.includes("Im Cripping")) {
    tweet = "[💨] " + tweet;
  } else if (tweet.includes("ImaGetchya")) {
    tweet = "[🍑 BOTTOMED OUT ON THE DAILY 🍑] " + tweet;
  } else if (tweet.includes("Pet Awowogei")) {
    tweet = "[🙈] " + tweet;
  } else if (tweet.includes("Cat Shaped")) {
    tweet = "[😻] " + tweet;
  } else if (tweet.includes("Spaciousness")) {
    tweet = "[😊] " + tweet;
  } else if (tweet.includes("wiggle worm")) {
    tweet = "[🐛] " + tweet;
  } else if (tweet.includes("Phocks")) {
    tweet = "[🔥] " + tweet;
  } else if (tweet.includes("Molly Seidel")) {
    tweet = "[🌭] " + tweet;
  } else if (tweet.includes("Donnie Darko")) {
    tweet = "[🍆] " + tweet;
  } else if (tweet.includes("juuuuuuice")) {
    tweet = "[🧃] " + tweet;
  } else if (tweet.includes("fergina")) {
    tweet = "[👨🏿‍🌾] " + tweet;
  } else if (tweet.includes("JoneZii")) {
    tweet = "[🐦] " + tweet;
  } else if (tweet.includes("Billabong")) {
    tweet = "[🦁] " + tweet;
  } else if (tweet.includes("DevMoney420")) {
    tweet = "[💸] " + tweet;
  }

  return tweet;
}

const addUserStamp = function(tweet){
}

module.exports.cleanTweet = cleanTweet;
module.exports.getUserName = getUserName;

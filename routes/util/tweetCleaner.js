const cleanTweet = function (tweet) {

  // change index to 9 for testing, 13 for prod
  tweet = tweet.substring(13);

  // replace encoding w/ iron tag
  tweet = tweet.replace(/<img=10>/, "[⛑️] ");
  tweet = tweet.replace(/<img=2>/, "[👷] ");
  tweet = tweet.replace(/<img=3>/, "[👨‍🚀] ");

  // strip @ symbol to re/opmove tagging
  tweet = tweet.replace(/@/g, "");

  // trim and filter message
  tweet = tweet.replace(/[\uFFFD]/g, " ");
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

}

module.exports.cleanTweet = cleanTweet;
module.exports.getUserName = getUserName;

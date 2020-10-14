// twitter package
var Twitter = require("twitter");

// api secure data
require("dotenv").config();

// twitter api keys
const TOKEN = process.env.BEARER_TOKEN;
var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET,
});

// send tweet function
// takes in the tweet message
const sendTweet = function (tweetContent) {
  client
    .post("statuses/update.json", { status: tweetContent })
    .then(function (tweet) {
      console.log(tweet);
    })
    .catch(function (error) {
      console.log(error);
    });
};

// delete tweet
// requires tweet id and username
const deleteTweet = function(id) {
  console.log("tweet deleted: " + id);
}

module.exports.sendTweet = sendTweet;
module.exports.deleteTweet = deleteTweet;

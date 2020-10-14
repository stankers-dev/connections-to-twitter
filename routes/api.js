// imports
const express = require("express");
const router = express.Router();
const { sendTweet, deleteTweet } = require("./connections/twitterConnection");
const { cleanTweet } = require("./util/tweetCleaner");

const fs = require("fs");

let latestMessage = "";
let prevMessage = "";
//08:38:31 [R] <img=2>LunaLuvgood: Gm stankers
var postTweetPattern = /^[0-9][0-9]:[0-9][0-9]:[0-9][0-9] [[][R][\]] [0-9a-zA-Z_<>= ]+: Rt/g;
var deleteTweetPattern = /^[0-9][0-9]:[0-9][0-9]:[0-9][0-9] [[][R][\]] [0-9a-zA-Z_<>= ]+: Del/g;

// authorized list of users
let whitelist = ["stankyppfoot", "Molly Seidel", "LunaLuvgood", 
      "JoneZii", "Spaciousness", "Pet Awowogei", "Im Cripping", "Phocks",
      "Stra p", "425Druid", "Stankzu", "Peanut Blitz", "Sploitz"];

// gets the latest message then determines what to do w/ it
const getLatestMessage = function () {
  // find chat log file
  // C:\Users\joshs\.runelite\chatlogs\friends
  fs.readFile(
    "./../../../.runelite/chatlogs/friends/latest.log",
    "UTF-8",
    function (err, data) {
      if (err) {
        console.log(err);
      }
      // divide chat into array
      chats = data.split("\n");
      // check if latest message is a new message
      if (chats[chats.length - 2].replace(/[\uFFFD]/g, " ") != latestMessage) {

        // remove invalid unicode
        prevMessage = chats[chats.length - 3];
        latestMessage = chats[chats.length - 2];
        latestMessage = latestMessage.replace(/[\uFFFD]/g, " ");

        // parse current message and determine actions
        // check if its post tweet
        if (latestMessage.match(postTweetPattern)) {
          // authorized users
          for (let i = 0; i < whitelist.length; i++) {

            //
            if (latestMessage.indexOf(whitelist[i]) != -1) {
              
              // refine tweet
              let refinedTweet = cleanTweet(prevMessage);

              // tweet to acc
              sendTweet(refinedTweet);

            }
          }
        }
        
        // delete tweet pattern
        if (latestMessage.match(deleteTweetPattern)) {

          // authorized users
          for (let i = 0; i < whitelist.length; i++) {
        
            if (latestMessage.indexOf(whitelist[i]) != -1) {
              
              // refine tweet
              //let refinedTweet = cleanTweet(prevMessage);

              // tweet to acc
              deleteTweet("id placeholder");

            }
          }
        }
      }
    }
  );
};

setInterval(getLatestMessage, 100);

module.exports = router;

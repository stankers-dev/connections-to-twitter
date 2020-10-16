// imports
const express = require("express");
const router = express.Router();
const { sendTweet, deleteTweet } = require("./connections/twitterConnection");
const { cleanTweet, getUserName } = require("./util/tweetCleaner");
const tinytext = require('tiny-text');

const fs = require("fs");
const { send } = require("process");

// track messages
let latestMessage = "";
let prevMessage = "";

// PROD (public) regex patterns
const POST_TWEET_PATTERN = /^[0-9][0-9]:[0-9][0-9]:[0-9][0-9] [[][R][\]] [0-9a-zA-Z_<>= ]+: Rt/g;
const DELETE_TWEET_PATTERN = /^[0-9][0-9]:[0-9][0-9]:[0-9][0-9] [[][R][\]] [0-9a-zA-Z_<>= ]+: Del/g;
const MAP_TWEET_PATTERN = /^[0-9][0-9]:[0-9][0-9]:[0-9][0-9] [[][R][\]] [0-9a-zA-Z_<>= ]+: Map/g;
// TEST (clan chat) regex patterns
// const POST_TWEET_PATTERN   = /^[0-9][0-9]:[0-9][0-9]:[0-9][0-9] [0-9a-zA-Z_<>= ]+: Rt/g;
// const DELETE_TWEET_PATTERN = /^[0-9][0-9]:[0-9][0-9]:[0-9][0-9] [0-9a-zA-Z_<>= ]+: Del/g;
// const MAP_TWEET_PATTERN    = /^[0-9][0-9]:[0-9][0-9]:[0-9][0-9] [0-9a-zA-Z_<>= ]+: Map/g;

// map usernames to tweet ids
let users = new Map();
let username = "";

// authorized list of users
let whitelist = [
  "stankyppfoot",
  "Molly Seidel",
  "LunaLuvgood",
  "JoneZii",
  "Spaciousness",
  "Pet Awowogei",
  "Im Cripping",
  "Phocks",
  "1 v1",
  "Stra p",
  "425Druid",
  "Stankzu",
  "Peanut Blitz",
  "Sploitz",
  "Spun Wooks",
  "Donnie Darko",
  "Ko Ley",
  "Alollyon",
  "Cat Shaped",
  "juuuuuuice",
  "fergina",
  "Vid Master",
  "Tardletics"
];

// block list -->
// RSP, any home dawg alt

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
        // set last 2 messages
        prevMessage = chats[chats.length - 3];
        latestMessage = chats[chats.length - 2];

        // remove unusable unicode
        latestMessage = latestMessage.replace(/[\uFFFD]/g, " ");

        // parse current message and determine actions
        // check if its post tweet
        // prevent retweet of 'rt' (duplicate cmd)
        if (
          latestMessage.match(POST_TWEET_PATTERN) &&
          prevMessage.match(POST_TWEET_PATTERN)
        ) {
          console.log("rt message aborted");
        } else if (latestMessage.match(POST_TWEET_PATTERN)) {
          // parse username from message
          username = getUserName(latestMessage);
          console.log("Username: " + username);
          // authorized users
          for (let i = 0; i < whitelist.length; i++) {
            // if user found in whitelist
            if (latestMessage.indexOf(whitelist[i]) != -1) {
              // refine tweet
              let refinedTweet = cleanTweet(prevMessage);
              refinedTweet = refinedTweet + "\n " + tinytext("tweeted by: " + getUserName(latestMessage));
              sendTweet(refinedTweet);
            }
          }
        }

        // delete tweet pattern
        if (latestMessage.match(DELETE_TWEET_PATTERN)) {
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

        // console log map
        if (latestMessage.match(MAP_TWEET_PATTERN)) {
          // authorized users
          for (let i = 0; i < whitelist.length; i++) {
            if (latestMessage.indexOf(whitelist[i]) != -1) {
              let iter = users.keys();
              let curKey = "";
              for (var j = 0; j < users.size; j++) {
                console.log("auth");
                curKey = iter.next();
                console.log("CURKEY: " + curKey);
                console.log(
                  i + " - " + curKey.keys + " : " + users.get(curKey)
                );
              }
            }
          }
        }
      }
    }
  );
};

// update map with new user ID
const logUserId = function () {
  //
};

setInterval(getLatestMessage, 100);

module.exports = router;

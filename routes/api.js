// imports
const express = require("express");
const router = express.Router();
const { sendTweet } = require("./twitterConnection");

const fs = require("fs");

let latestMessage = "";
let prevMessage = "";
//08:38:31 [R] <img=2>LunaLuvgood: Gm stankers
var pattern = /^[0-9][0-9]:[0-9][0-9]:[0-9][0-9] [[][R][\]] [0-9a-zA-Z_<>=]+: Rt/g;

//let whiteList = ["LunaLuvgood", "stankyppfoot", "JoneZii", "Molly Seidel", "Marx n rec", "Spaciousness", "Im Cripping", "Ray Sensei"];
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
      if (
        chats[chats.length - 2].replace(
          /[\uFFFD]/g,
          " "
        ) != latestMessage
      ) {
        prevMessage = chats[chats.length - 3];
        latestMessage = chats[chats.length - 2];
        latestMessage = latestMessage.replace(
          /[\uFFFD]/g,
          " "
        );
        console.log(latestMessage);
        // console.log(latestMessage.indexOf("Molly Seidel:"));
        // console.log(latestMessage.indexOf("Ray Sensei:"));
        // parse current message and determine actions
        if (latestMessage.match(pattern)) {
          // authorized users
          // for (var i = 0; i < whiteList.length; i++) {
          //   if (latestMessage.indexOf(whiteList[i]) > -1) {
              // remove timestamp
              prevMessage = prevMessage.substring(13);

              // replace encoding w/ iron tag
              prevMessage = prevMessage.replace(/<img=10>/, "[⛑️] ");
              prevMessage = prevMessage.replace(/<img=2>/, "[👷] ");
              prevMessage = prevMessage.replace(/<img=3>/, "[👨‍🚀] ");

              // strip @ symbol to re/opmove tagging
              prevMessage = prevMessage.replace(/@/g, "");

              // trim and filter message
              console.log("RETWEETED: " + prevMessage);
              sendTweet(prevMessage);
          //   }
          // }
        }
      }
      // delete tweet

      // TODO: add spam filter, language, etc
    }
  );
};

setInterval(getLatestMessage, 100);

module.exports = router;

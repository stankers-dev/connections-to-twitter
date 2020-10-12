// imports
const express = require("express");
const axios = require("axios");
const router = express.Router();
// twitter package
var Twitter = require("twitter");

// api secure data
require("dotenv").config();

// env
const TOKEN = process.env.BEARER_TOKEN;

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET,
});

// route
router.post("/:tweetContent", (req, res) => {
  client
    .post("statuses/update.json", { status: req.params.tweetContent })
    .then(function (tweet) {
      console.log(tweet);
    })
    .catch(function (error) {
      throw error;
    });
});

module.exports = router;

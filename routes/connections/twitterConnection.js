// twitter package
var Twitter = require("twitter");

// api secure data
require("dotenv").config();

// utils
const { appendToFile } = require("../util/fileIO.js");


// twitter api keys
const TOKEN = process.env.BEARER_TOKEN;
var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET,
});

// gets paginated list of followers
// list begins at passed cursor, starting at -1
async function getFollowersForUser(screenName, cursor) {
	return new Promise((resolve, reject) => {
    client
      .get("followers/ids.json", { 
        'screen_name': screenName,
        'cursor': cursor,
        'stringify_ids': true
      })
      .then((results) => {
        appendToFile('./followers.txt', results.ids.join());
        resolve(results);
      })
      .catch((err) => {
        reject(err);
      });

  });
};


function lookupUsers(keyword, count, page) {
  console.log(`searching for first ${count} users on page ${page} for keyword ${keyword}`);
	return new Promise((resolve, reject) => {
    client
      .get("users/search.json", { 
        q: keyword, 
        count: count,
        page: page
      })
      .then((results) => {
        let topAccsArr = [];
        for(let name of results){
          topAccsArr.push(name.screen_name);
        }
        appendToFile('./top-suggest-accounts.txt', topAccsArr.join(',\n'));
        resolve(results);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// gets paginated list of followers
// list begins at passed cursor, starting at -1
async function getFollowingForUser(screenName, cursor) {
  console.log(`searching for following for user ${screenName} - cursor ${cursor} `);
	return new Promise((resolve, reject) => {
    client
      .get("friends/ids.json", { 
        'screen_name': screenName,
        'cursor': cursor,
        'stringify_ids': true
      })
      .then(function (results) {
        resolve(results);
      })
      .catch(function (error) {
        reject(error);
      });

  });
};


const getUserById = function (id) {
	return new Promise((resolve, reject) => {
    client
      .get(`/users/show.json`, {
        'user_id': id
      })
      .then(function (results) {
        resolve(results);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

function followUser(id, screenName) {
  console.log(`following user ${screenName} with id ${id}`);
	return new Promise((resolve, reject) => {
    client
      .post(`friendships/create.json`, {
        'screen_name': screenName
      })
      .then(() => {
        // move this to file io
        appendToFile(`./new-following.txt`, screenName + ',\n');
        let resObj = {
          'followed': true
        };
        resolve(resObj);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

function unfollowUser(screenName) {
  console.log(`unfollowing user ${screenName}`);
	return new Promise((resolve, reject) => {
    client
      .post(`friendships/destroy.json`, {
        'screen_name': screenName
      })
      .then(() => {
        let resObj = {
          'status': `${screenName} followed!`
        };
        resolve(resObj);
      })
      .catch((err) => {
        reject(err);
      });
  });
};


function checkIsMutual(me, id2){
  console.log(me + " " + id2);
  return new Promise((resolve, reject) => {
  client
    .get(`friendships/show.json`, {
      'source_screen_name': me,
      'target_screen_name': id2
    })
    .then((value) => {
      if(value.relationship.source.following != value.relationship.source.followed_by){
        unfollowUser(id2);
        resolve({
          'status': 'unfollowed',
          'user': id2
        })
      }
      resolve({
        'status': 'still following',
        'user': id2
      })
    })
    .catch((err) => {
      reject(err);
    });
});

}

module.exports.lookupUsers = lookupUsers;
module.exports.getFollowersForUser = getFollowersForUser;
module.exports.getUserById = getUserById;
module.exports.followUser = followUser;
module.exports.getFollowingForUser = getFollowingForUser;
module.exports.checkIsMutual = checkIsMutual;
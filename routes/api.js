// imports
const express = require("express");
const app = express();
const router = express.Router();
const {lookupUsers, getFollowersForUser, getUserById, followUser, getFollowingForUser,checkIsMutual} = require("./connections/twitterConnection.js");
const {promisify} = require('util');
const { resolve } = require("path");
const { Resolver } = require("dns");
const { doesNotMatch } = require("assert");
const { appendToFile, readFile, writeToFile } = require("./util/fileIO.js");
const { writeFile } = require("fs");

let cursor = -1;
let usersFollowed = 0;

// get followers for a specific id
router.get('/getFollowers/:screen_name&:cursor', function (req, res) {
  let cursor = req.params.cursor;
  let screen_name = req.params.screen_name;
  getFollowersForUser(screen_name, cursor)
    .then((response) => {
      if(response.next_cursor == '0'){
        let responseJson = {
          status: 'done',
          cursor: response.next_cursor
        }
        console.log(`sending response: ${JSON.stringify(responseJson)}`);
        res.json(responseJson);
      } else {
        let responseJson = {
          status: 'pending',
          cursor: response.next_cursor
        }
        console.log(`sending response: ${JSON.stringify(responseJson)}`);
        res.json(responseJson);
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 'errored',
        error: err
      })
    });
});

// get all top accounts for keyword
router.get('/getUsers/:keyword&:count&:page', function (req, res) {
  lookupUsers(req.params.keyword, req.params.count, req.params.page)
    .then((users) => {
      res.send(users);
    })
})

// get followers for a specific id
router.get('/getTopAccounts', function (req, res) {
  fs.readFile(`./top-accounts.txt`, 'utf8' , (err, data) => {
    if (err) {
      res.send(err)
      return
    }
    let accounts = data.split(",");
    let trimmedAccounts = [ ... new Set(accounts)];
    res.send(JSON.stringify(trimmedAccounts));
  })
});


// check if 2 users are mutual following
router.get('/checkMutual/:id1&:id2', function (req, res) {
  // console.log(`getting user ${req.params.id2}`);
  // getUserById(req.params.id2)
  //   .then((results) => {
      console.log(`checking if ${req.params.id2} is following you back...`);
      checkIsMutual(req.params.id1, req.params.id2)
      .then((value) => {
        res.send(value);
      })
      .catch((err) =>{
        console.log(err);
      })
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
});


// get following for a specific id
router.get('/getFollowing/:id&:cursor', function (req, res) {
  let cursor = req.params.cursor;
  let id = req.params.id;
  getFollowingByPage(id, cursor)
    .then((response) => {
      if(response.next_cursor == '0'){
        let responseJson = {
          status: 'done',
          cursor: response.next_cursor
        }
        console.log(`sending response: ${JSON.stringify(responseJson)}`);
        res.json(responseJson);
      } else {
        let responseJson = {
          status: 'pending',
          cursor: response.next_cursor
        }
        console.log(`sending response: ${JSON.stringify(responseJson)}`);
        res.json(responseJson);
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 'errored',
        error: err
      })
    });
});

function getFollowingByPage(id, cursor){
	return new Promise((resolve, reject) => {
    getFollowingForUser(id, cursor)
      .then(value => {
        let followed = value.ids;
        console.log(followed);
        console.log(`you are following ${followed.length} users`);
        fs.writeFile(`./following.txt`, followed.join(), err => {});
        cursor = value.next_cursor;
        resolve(value);
      })
      .catch(function (error) {
        reject(error);
      });
    });
}

// get followers.txt trimmed
router.get('/getFollowersList/:page&:count', async (req, res) => {
  let page = req.params.page;
  const file = await readFile(`./followers${page}.txt`);
  let fileArr = file.split(',');
  let hundredUsers = fileArr.splice(0, req.params.count);
  writeToFile(`./followers${page}.txt`, fileArr.join());
  res.send(JSON.stringify(hundredUsers));
});

// get followers.txt trimmed
router.get('/getNewFollowingList', async (req, res) => {
  const file =  await readFile(`./new-following.txt`);
  res.send(JSON.stringify(file));
});

// takes in a user id
// and returns a json for that user
router.get('/getUsers/:id', function (req, res) {
  getUserById(req.params.id)
    .then((value) => {
      res.send(value)
    })
    .catch((error) => {
      res.send(error);
    });
})

router.get('/followTool/:id', function (req, res) {
  // grab first 20 users, make an array, and remove them from the file
  // check all 20 users bio for keyword
  // if so, follow them and add them to a 'followed' file
  getUserById(req.params.id)
    .then(value => {
      // add users to new list
      let pokemonFan = {
        'id': value.id_str,
        'name': value.screen_name,
        'description': value.description.toLowerCase()
      };
      if(pokemonFan.description.includes('poké') 
        || pokemonFan.description.includes('poke') 
        || pokemonFan.description.includes('tcg')
        || pokemonFan.description.includes('trainer')
        || pokemonFan.description.includes('pika')
        || pokemonFan.description.includes('eevee')
        || pokemonFan.description.includes('zard') 
        || pokemonFan.description.includes('card')
        || pokemonFan.description.includes('pack')
        || pokemonFan.description.includes('collector')
        || pokemonFan.description.includes('nintendo'))
      {
        followUser(pokemonFan.id, pokemonFan.name)
          .then((value) => {
            res.json(value)
          })
          .catch((error) => {
            res.send(error);
          });
      } else {
        res.send({
          'followed': false
        })
      }
  })
  .catch((error) => {
    res.send(error);
  });
})

module.exports = router;
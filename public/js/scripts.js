console.log("js file found");
let topics = ['pokemon', 'pokemontcg', 'pokemoncards', 'tcg'];

// template GET request method
async function getData(url = '', screenName = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      screenName: screenName
    })
    return response.json(); // parses JSON response into native JavaScript objects
}


// get values from input field
// get all followers for each user in list
async function getFollowers(){
  let cursor = -1;
  // get value from text field
  const accountsString = document.getElementById("accounts-text-area").value;
  // convert value into iterable array
  let accountsArr = accountsString.split(',');
  for(let accounts of accountsArr){
    accounts.trim();
  };
  // interval is set to 65 seconds to avoid 15 req/15 min rate limit
  let checkAccounts = setInterval(() => {
    getData(`/api/getFollowers/${accountsArr[0]}&${cursor}`)
      .then((response) => {
        if(response.status == 'errored'){
          // 34 is page not found
          // move to next user
          if(response.error[0].code == 34){
            cursor = -1;
            accountsArr.shift();
            if(accountsArr.length == 0){
              // break out of search loop
              clearInterval(checkAccounts);
            }
          } else {
            // break out of search loop
            clearInterval(checkAccounts);
          }
        }
        else if(response.status == 'pending'){
          cursor = response.cursor;
        }
        else if(response.status == 'done'){
          cursor = -1;
          accountsArr.shift();
          if(accountsArr.length == 0){
            // break out of search loop
            clearInterval(checkAccounts);
          }
        }
      });
  }, 65000);
}

// take in keywords and return top 20 users associated with that keyword
async function getTopAccounts(){
  // get value from text field
  const accountsString = document.getElementById("top-accounts-text-area").value;
  // convert value into iterable array
  let accountsArr = accountsString.split(',');
  for(let accounts of accountsArr){
    accounts.trim();
  };
  let checkAccounts = setInterval(() => {
    getData(`/api/getUsers/${accountsArr[0]}&20&0`)
    .then(() => {
      accountsArr.shift();
      if(accountsArr.length == 0){
        // break out of search loop
        clearInterval(checkAccounts);
      }
    });
  }, 2000);
}

// helper function
// only output top accounts AFTER all promises are resolved
async function getUsers(){
  let totalPages = 2;
  // input param is number of PAGES of users to grab
  // each PAGE is 20 users
  // i.e. 4 == top 100 users per given keyword
  for(let i=0; i < topics.length; i++){
    for(let j=0; j<totalPages; j++){
      await getData('/api/getUsers/' + topics[i] + '&20&' + j);
    }
  }
}

// reads the top-accounts.txt
async function getTopAccountsFromServer(){
  return await getData(`/api/getTopAccounts`);
}

// gets all followers
// api is rate limited to 15 calls / 15 mins
// 100 accs takes approx. 100 mins etc
async function getMyFollowers(){
  let checkAccounts = setInterval(() => {
    getData(`/api/getFollowers/MythicalPulls&${cursor}`)
      .then((response) => {
        if(response.status == 'errored'){
          clearInterval(checkAccounts);
        }
        else if(response.status == 'pending'){
          cursor = response.cursor;
        }
        else if(response.status == 'done'){
          cursor = -1;
          clearInterval(checkAccounts);
        }
      });
  }, 65000);
}

// gets all following users
// api is rate limited to 15 calls / 15 mins
// 100 accs takes approx. 100 mins etc
async function getMyFollowing(){
  let checkAccounts = setInterval(() => {
    getData(`/api/getFollowing/MythicalPulls&${cursor}`)
      .then((response) => {
        if(response.status == 'errored'){
          clearInterval(checkAccounts);
        }
        else if(response.status == 'pending'){
          cursor = response.cursor;
        }
        else if(response.status == 'done'){
          cursor = -1;
          clearInterval(checkAccounts);
        }
      });
  }, 20000);
}


// grabs the user bio for every follower in the followers.txt server file
async function getFollowersFromServer(){
  let followers = await getData(`/api/getFollowersList`);
  console.log(followers);
  let checkFollower = setInterval(() => {
    getData(`/api/followTool/${followers[0]}`)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
      followers.shift();
      if(followers.length <= 0){
        clearInterval(checkFollower);
      }
  }, 4000);
};

// grabs the user bio for every follower in the followers.txt server file
async function unfollowUsers(){
  let following = await getData(`/api/getNewFollowingList`);
  console.log('followers obtained');
  let checkRelationship = setInterval(async () => {
    await getData(`/api/checkMutual/MythicalPulls&${following[0]}`)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
      following.shift();
      if(following.length <= 0){
        clearInterval(checkRelationship);
      }
  }, 30000);
};

async function getUserById(userId) {
  console.log(`getting user ${userId}`);
  await getData(`/api/getUsers/${userId}`)
  .then(user => {
    return user;
  })
  .catch(function (error) {
    console.log(error);
  });
}

async function followUsersHelper() {
  console.log('follow user function hit');
	return new Promise( async (resolve, reject) => {
      let count = 5;
      let page = 2;
      let numToFollow = 10;
      let numFollowed = 0;
      (async function pollAgain(){
        let followers = await getData(`/api/getFollowersList/${page}&${count}`);
        console.log('got follower file');
        await followUsers(followers)
          .then((value) => {
              numFollowed += value;
              if(numFollowed >= numToFollow){
                console.log(`${numFollowed} -- exiting loop`)
                resolve(true);
              } else {
                console.log(`${numFollowed} so far...`)
                setTimeout(pollAgain, 30000);
              }
          })
          .catch((err) => {
            reject(err);
          });
      })();
  });
}

async function followUsers(followers) {
	return new Promise((resolve, reject) => {
    let numFollowed = 0;
    let followUsers = setInterval(() => {
      getData(`/api/followTool/${followers[0]}`)
        .then((response) => {
          if(response.followed){
            numFollowed++;
          }
        })
        .catch((err) => {
          followers.shift();
          console.log(err);
        });
        followers.shift();
        if(followers.length <= 0){
          clearInterval(followUsers);
          resolve(numFollowed);
        }
    }, (30000 + (Math.random() * 15000)));
  });
}

async function unfollowUser(id) {
  let following = await getData(`/api/getNewFollowingList`);
  let userArr = following.split(',');
  let followLoop = setInterval(async () => {
    await getData(`/api/checkMutual/MythicalPulls&${userArr[0]}`)
      .then(() => {
        userArr.shift();
        if(userArr.length <= 0){
          clearInterval(followLoop);
        }
      })
  }, 4000);
}

function hideLoading(){
  $( "#spinner" ).remove(); //makes page more lightweight 
};

function showLoading(){
  $( "#spinner" ).show(); //makes page more lightweight 
};
console.log("js file found");

var HttpClient = function () {
  this.post = function (aUrl, aCallback) {
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function () {
      if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
        aCallback(anHttpRequest.responseText);
    };

    anHttpRequest.open("POST", aUrl, true);
    anHttpRequest.send(null);
  };
};

function sendTweet(inputTweet) {
  console.log(inputTweet);
  let client = new HttpClient();
  client.post("/api/:" + inputTweet, (res) => {
    console.log(res);
  });
}

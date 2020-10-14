const cleanTweet = function(tweet){
    tweet = tweet.substring/(13);

    // replace encoding w/ iron tag
    tweet = tweet.replace(/<img=10>/, "[⛑️] ");
    tweet = tweet.replace(/<img=2>/, "[👷] ");
    tweet = tweet.replace(/<img=3>/, "[👨‍🚀] ");

    // strip @ symbol to re/opmove tagging
    tweet = tweet.replace(/@/g, "");

    // trim and filter message
    tweet = tweet.replace(/[\uFFFD]/g, " ");
    console.log("RETWEETED: " + tweet);
    return tweet;
}

module.exports.cleanTweet = cleanTweet;
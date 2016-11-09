# line-msg-api

Node.js package for LINE Messaging API.
this code is based on LINE API https://devdocs.line.me

#How to install this

```
npm install line-msg-api
```


#How to use this 

please get accessToken, channelSecret from https://business.line.me/services/bot
if you don't have the digital certificates, you can get a free digital certificates from https://letsencrypt.org


The following code is a part of echoback_test.js, please see it if you want to know more functions.


```
var LineMsgApi = require('line-msg-api');
var bot = new LineMsgApi({
    accessToken: 'Put here your access token',
    channelSecret: 'Put here your channel secret',

    server: {
        port: 3000,
        key: 'Put here the file name of encript.key',
        cert: 'Put here the file name of encript_fullchain.crt'
    }
});
 
// Geting a message
bot.on(function (msg) {

    if (msg.events[0].message.type == 'text') {
	console.log("Message ----");
	console.log( msg.events[0].message.text);
	replyMessage = msg.events[0].message.text;

	// Replying a message
	bot.replyMessage(msg.events[0].replyToken, replyMessage);

	// Getting the user profile of the message sender
	bot.getProfile(msg.events[0].source.userId ,function(err,profile) {
	    console.log("profile= ", profile);
	    
	    if ( replyMessage == 'Push') {
		// Pushing a message
		bot.pushMessage(profile.userId, "Hello Tokyo");
	    }
	});
    }
});
```
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
 
bot.on(function (msg) {

    if (msg.events[0].message.type == 'text') {
	// geting text message
	console.log("Message ----");
	console.log( msg.events[0].message.text);
	replyMessage = msg.events[0].message.text;
	bot.replyMessage(msg.events[0].replyToken, replyMessage);

    } else {
	// getting other info
	console.log("Other ----");
	console.log(msg.events[0]);
    }
});
```
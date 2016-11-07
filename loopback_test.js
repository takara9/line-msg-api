#!/usr/bin/env node
//
//  Smaple code 
//    Author: Maho Takara
//

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
	replyMessage = msg.events[0].message.text;
	bot.replyMessage(msg.events[0].replyToken, replyMessage);

	// getting the user profile of the message sender
	bot.getProfile(msg.events[0].source.userId ,function(err,body) {
	    console.log("body=", body);
	});

    } else if (msg.events[0].message.type == 'image') {
	// getting a image file
	console.log("Image ----");
	bot.getContent(msg.events[0].message.id,"test.jpg");
    } else if (msg.events[0].message.type == 'audio') {
	// getting a sound file
	console.log("Sound ----");
	bot.getContent(msg.events[0].message.id,"test.au");
    } else if (msg.events[0].message.type == 'sticker') {
	// getting a stikcer IDs
	console.log("Sticker ----");
	MessageObj = {
	    "type": "sticker",
	    "packageId": "1",
	    "stickerId": "3"
	};
	bot.replyMessageObject(msg.events[0].replyToken, MessageObj);
    } else {
	// getting other info
	console.log("Other ----");
	console.log(msg.events[0]);
    }

});




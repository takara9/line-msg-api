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
    } else if (msg.events[0].message.type == 'image') {
	// Getting a image file
	console.log("Image ----");
	bot.getContent(msg.events[0].message.id,"test.jpg");
    } else if (msg.events[0].message.type == 'audio') {
	// Getting a sound file
	console.log("Sound ----");
	bot.getContent(msg.events[0].message.id,"test.au");
    } else if (msg.events[0].message.type == 'sticker') {
	// Getting a stikcer IDs
	console.log("Sticker ----");
	console.log(msg.events[0].message);
	MessageObj = {
	    "type": "sticker",
	    "packageId": "1",
	    "stickerId": "3"
	};
	bot.replyMessageObject(msg.events[0].replyToken, MessageObj);
    } else {
	// Getting other info
	console.log("Other ----");
	console.log(msg.events[0]);
    }
});

const fs = require('fs');
const https = require('https');
const http = require('http');
const request = require('superagent');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto')
const SIGNATURE_HEADER = 'x-line-signature'
const HASH_ALGORITHM = 'sha256'


var LineMsgApi = function(options_args) {

    var eventHandlers = [];
    var options = options_args || {};
    var endpoint = options.endpoint || 'https://api.line.me/v2';
    var server = null;

    this.app = express();
    this.app.use(bodyParser.json({
	verify (req, res, buf) {
	    req.rawBody = buf
	}
    }))

    // for Bluemix CF health check
    this.app.get('/', function(req,res,next) {
	res.end('OK');
    });

    this.app.post('/webhook', validator(), function(req,res,next){
	res.sendStatus(200);
	eventHandlers.forEach(function (handler) {
	    handler(req.body);
	});
    });

    if (options.https) {
	// for Bluemix virtrual server
	server = https.createServer({
            key: fs.readFileSync(options.https.key),
            cert: fs.readFileSync(options.https.cert)
	}, this.app).listen(options.port || 443);
    } else {
	// for Bluemix CF runtime
	server = http.createServer(this.app).listen(process.env.PORT || options.port);
    }

    this.on = function(callback) {
	eventHandlers = eventHandlers || [];
	eventHandlers.push(callback);
    };

    this.destroy = function() {
	server.close();
    };

    // Validate recived message
    function validator(req, res, next) {
	return (req, res, next) => {
	    var hmac = crypto.createHmac(HASH_ALGORITHM, options.channelSecret)
	    hmac = hmac.update(req.rawBody)
	    if (req.headers[SIGNATURE_HEADER] === hmac.digest('base64')) {
		next()
	    } else {
		next(new Error('Signature validation is faild'))
	    }
	}
    };

    // Respond to LINE sender
    this.replyMessage = function(replyToken, replyMessage) {
	var postmsg = {
	    "replyToken": replyToken,
	    "messages": [{"type": "text", "text": replyMessage }]
	};
	
	return new Promise((resolve, reject) => {
	    request
		.post(`${endpoint}/bot/message/reply`)
		.send(postmsg)
		.set('Authorization', `Bearer ${options.accessToken}`)
		.end((err, res) => {
		    if (err) { 
			return reject(err);
		    }
		    return resolve(res);
		})
	})
    };
    
    // Get the message sender user profile
    this.getProfile = function(userId,callback) {
	return new Promise((resolve, reject) => {
	    request
		.get(`${endpoint}/bot/profile/${userId}`)
		.set('Authorization', `Bearer ${options.accessToken}`)
		.end((err, res) => {
		    callback(err,res.body);
		})
	})
    }
    
    // Download the contents file from LINE server
    this.getContent = function(messageId,fileName) {
	return new Promise((resolve, reject) => {
	    request
		.get(`${endpoint}/bot/message/${messageId}/content`)
		.set('Authorization', `Bearer ${options.accessToken}`)
		.end((err, res) => {
		    if (err) { 
			return reject(err);
		    } 
		    return resolve(res)
		}).pipe(fs.createWriteStream(fileName));
	})
    };

    // Send the message object
    this.replyMessageObject = function(replyToken, MessageObj) {
	
	var msgObj = {
	    "replyToken": replyToken,
	    "messages": [ MessageObj ]
	};
	
	return new Promise((resolve, reject) => {
	    request
		.post(`${endpoint}/bot/message/reply`)
		.send(msgObj)
		.set('Authorization', `Bearer ${options.accessToken}`)
		.end((err, res) => {
		    if (err) { 
			return reject(err);
		    }
		    return resolve(res);
		})
	})
    };

    // Push the message 
    this.pushMessage = function(to, pushMessage) {

	var pushMsg = {
	    "to": to,
	    "messages":[{ "type": "text", "text": pushMessage}]
	};

	return new Promise((resolve, reject) => {
	    request
		.post(`${endpoint}/bot/message/push`)
		.send(pushMsg)
		.set('Authorization', `Bearer ${options.accessToken}`)
		.end((err, res) => {
		    if (err) { 
			return reject(err);
		    }
		    return resolve(res);
		})
	})
    };
}

module.exports = LineMsgApi;

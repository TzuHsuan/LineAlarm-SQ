const line = require('@line/bot-sdk');
const express = require('express');
const {Client} = require('pg');
const eol = require('os').EOL;

const db = new Client({
	connectionString: process.env.DATABASE_URL,
  	ssl: true
})

const config = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
	channelSecret: process.env.CHANNEL_SECRET
};

const baseURL = process.env.BASE_URL;

const client = new line.Client(config);

const app = express();

app.post('/callback', line.middleware(config), (req, res) => {

	if(!Array.isArray(req.body.events)){
		return res.status(500).end()
	}

	Promise.all(req.body.events.map(handleEvent))
	.then(()=>res.end())
	.catch((err)=>{
		console.log(err);
		res.status(500).end();
	});
});

const replyText = (token, message) => {
	message = Array.isArray(message)? message:[message];
	return client.replyMessage(
		token,
		message.map((message)=>({type:'text', text:message}))
	);
};

const pushMessage = (targetID, message) => {
	message = Array.isArray(message)? message:[message];
	return client.pushMessage(
		targetID,
		message.map((message)=>({type:'text', text:message}))
	);
};

function handleEvent(event){
	switch (event.type){
		case 'message':
			switch (event.message.type){
				case 'text':
					return handleText(event.message, event.replyToken, event.source);
				case 'image':
				case 'video':
				case 'audio':
				case 'location':
				case 'sticker':
					//ignore event
					return 0;
				default:
					throw new Error(`Unknown message: ${JSON.stringify(message)}`);
			}
		case 'follow':
		case 'join':
			return replyText(event.replyToken, 'Hi, Welcome to line bot. /n This is a greeting message.')
			// change to basic tutorial

		case 'unfollow':
		case 'leave':
			//TODO remove from sub list
			break;

		default:
			throw new Error(`Unknown even: ${JSON.stringify(event)}`);
	}
}

function handleText(message, replyToken, source){
	switch(message.text){
		case '!訂閱 公單':
			var value;
			switch (source.type){
				case 'user':
					value = source.userId;
					break;
				case 'group':
					value = source.groupId;
					break;
				case 'room':
					value = source.roomId;
					break;
			}
			console.log(value);
			db.connect();
			console.log('after connect');
			db.query('INSERT INTO public_order VALUES($1) RETURNING *', [value])
			.then(res => console.log(res.rows[0]))
			.catch(e => console.error(e.stack));
			//db.end();
			console.log('after end');
			return replyText(replyToken, '已訂閱公單通知');

		case '!unsub':
			return replyText(replyToken, 'Unsub command.');
		default:
			return 0;
	}
}



const port = process.env.PORT || 3000;
app.listen(port, ()=> {
	console.log(`listening on ${port}`);
})
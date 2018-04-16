const line = require('@line/bot-sdk');
const express = require('express');
const {Pool} = require('pg');
const eol = require('os').EOL;
const cron = require('cron').CronJob;

const db = new Pool({
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

new cron('* 55 10,15,19 * * *',() =>{
	db.query('SELECT * FROM public_order')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(r.id,'公單即將出現，請準備');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');


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
			return replyText(event.replyToken, 'Hi, Welcome to line bot.'+eol+'This is a greeting message.')
			// change to basic tutorial

		case 'unfollow':
		case 'leave':
			var value;
			switch (event.source.type){
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
			db.connect();
			db.query('DELETE FROM public_order WHERE id = $1', [value])
			.then(res => {
				console.log(res.rows[0]);
			})
			.catch(e => {
				console.error(e.stack);
			});
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
			db.connect();
			db.query('INSERT INTO public_order VALUES($1) RETURNING *', [value])
			.then(res => {
				console.log(res.rows[0]);
			})
			.catch(e => {
				console.error(e.stack)
			});			
			return replyText(replyToken, '已訂閱公單通知');

		case '!取消 公單':
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
			db.connect();
			db.query('DELETE FROM public_order WHERE id = $1', [value])
			.then(res => {
				console.log(res.rows[0]);
			})
			.catch(e => {
				console.error(e.stack)
			});			
			return replyText(replyToken, '已取消公單通知');


		default:
			return 0;
	}
}



const port = process.env.PORT || 3000;
app.listen(port, ()=> {
	console.log(`listening on ${port}`);
})
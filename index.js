const line = require('@line/bot-sdk');
const express = require('express');
const eol = require('os').EOL;
const cron = require('cron').CronJob;
const dbUtil = require('./dbUtil.js');
const messages = require('./messages.json').messages;


const config = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
	channelSecret: process.env.CHANNEL_SECRET
};

const db = new dbUtil;

const client = new line.Client(config);

const app = express();

var sub = db.loadSub()

messages.forEach(message => {
	new cron(message.cronTime,() => {
		subscribers[message.target].forEach(subscriber => {
			pushMessage(subscriber, message.messages.reduce((a,b)=>{a+eol+b}));
		})
	},null,true,'Asia/Taipei');
})
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

const replyText = (client, token, message) => {
	message = Array.isArray(message)? message:[message];
	return client.replyMessage(
		token,
		message.map((message)=>({type:'text', text:message}))
	);
};

const pushMessage = (client, targetID, message) => {
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
		return replyText(event.replyToken, '大家好，這裡是食契鬧鐘'+eol+'目前接受的指令：'+eol+'		!訂閱'+eol+'		!取消'+eol+'		!離開'+eol+'能用的參數：'+eol+'		公單'+eol+'		晚安'+eol+'		皇家'+eol+'		便當'+eol+'		天城'+eol+'		世界王'+eol+'		全部');
			// change to basic tutorial

		case 'unfollow':
		case 'leave':
			var value = event.source.userId||event.source.groupId||event.source.roomId;
			db.sub('all', value);
			break;

		default:
			throw new Error(`Unknown even: ${JSON.stringify(event)}`);
	}
}

function handleText(message, replyToken, source){
	switch(message.text){
		case '!訂閱 全部':
			db.sub('all', source);
			return replyText(replyToken, '已訂閱所有通知');
		case '!訂閱 公單':
			db.sub('public_order', source);
			return replyText(replyToken, '已訂閱公單提醒');
		case '!訂閱 晚安':
			db.sub('goodnight', source);		
			return replyText(replyToken, '已訂閱晚安訊息');
		case '!訂閱 便當':
			db.sub('bento', source);		
			return replyText(replyToken, '已訂閱便當提醒');
		case '!訂閱 皇家':
			db.sub('royal', source);		
			return replyText(replyToken, '已訂閱皇家提醒');
		case '!訂閱 天城':
			db.sub('arena', source);		
			return replyText(replyToken, '已訂閱天城提醒');
		case '!訂閱 世界王':
			db.sub('boss', source);		
			return replyText(replyToken, '已訂閱世界王提醒');

		case '!取消 公單':
			db.unsub('public_order', source)
			return replyText(replyToken, '已取消公單提醒');
		case '!取消 搶劫':
			db.unsub('rob', source);	
			return replyText(replyToken, '已取消搶劫提醒');
		case '!取消 晚安':
			db.unsub('goodnight', source);		
			return replyText(replyToken, '已取消晚安訊息');
		case '!取消 便當':
			db.unsub('bento', source);		
			return replyText(replyToken, '已取消便當提醒');
		case '!取消 皇家':
			db.unsub('royal', source);		
			return replyText(replyToken, '已取消皇家提醒');
		case '!取消 天城':
			db.unsub('bento', source);		
			return replyText(replyToken, '已取消天城提醒');
		case '!取消 世界王':
			db.unsub('royal', source);		
			return replyText(replyToken, '已取消世界王提醒');

		case '!離開':
			var value;
			switch (source.type){
				case 'user':
					value = source.userId;
					break;
				case 'group':
					value = source.groupId;
					client.leaveGroup(value);
					break;
				case 'room':
					value = source.roomId;
					client.leaveRoom(value);
					break;
			}
			//fallthrough to unsub all
		case '!取消 全部'	:
		db.unsub('all',source);
			return replyText(replyToken, '已取消所有通知');
		default:
			return 0;
	}
}



const port = process.env.PORT || 3000;
app.listen(port, ()=> {
	console.log(`listening on ${port}`);
})

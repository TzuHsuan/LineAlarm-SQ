const line = require('@line/bot-sdk');
const express = require('express');
const {Pool} = require('pg');
const eol = require('os').EOL;
const cron = require('cron').CronJob;

const db = new Pool({
	connectionString: process.env.DATABASE_URL,
  	ssl: true
})

const sqconfig = {
	channelAccessToken: process.env.SQ_CHANNEL_ACCESS_TOKEN,
	channelSecret: process.env.SQ_CHANNEL_SECRET
};

const mapleconfig = {
	channelAccessToken: process.env.MAPLE_CHANNEL_ACCESS_TOKEN,
	channelSecret: process.env.MAPLE_CHANNEL_SECRET
};

const baseURL = process.env.BASE_URL;

const sqclient = new line.Client(sqconfig);

//const mapleclient = new line.Client(mapleconfig);

const app = express();


//公單
new cron('0 55 10,15,19 * * *',() =>{
	db.query('SELECT * FROM public_order')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(sqclient, r.id,'公單即將出現，請準備迎接包子');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');


//便當
new cron('0 50 13,19,22 * * *',() =>{
	db.query('SELECT * FROM bento')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(sqclient, r.id,'便當店即將打烊，不要辜負了老闆的愛心 <3');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');

//皇家
new cron('0 30 8,17 * * *',() =>{
	db.query('SELECT * FROM royal')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(sqclient, r.id,'競技場次數將於半小時後更新');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');

//每晚提醒
new cron('0 0 23 * * 1-6',() =>{
	db.query('SELECT * FROM goodnight')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(sqclient, r.id,'各位晚安，目前時間為晚上11點'+eol+'還沒有建設以及打公會獸的請記得');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');

//週日提醒
new cron('0 0 22 * * 0',() =>{
	db.query('SELECT * FROM goodnight')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(sqclient, r.id,'各位晚安，目前時間為晚上10點'+eol+'今日公會獸會提早在11點回家睡覺'+eol+'遺跡沒打完的進度也不能帶到明天喲'+eol+'還沒完成的請盡快完成');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');


app.post('/callback/sq', line.middleware(sqconfig), (req, res) => {

	if(!Array.isArray(req.body.events)){
		return res.status(500).end()
	}

	Promise.all(req.body.events.map(sqhandleEvent))
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

function sqsubAll(source) {
	let tables = ['public_order', 'rob', 'goodnight', 'royal', 'bento'];
	tables.map(table => sub(table, source));
}

function squnsubAll(source) {
	let tables = ['public_order', 'rob', 'goodnight', 'royal', 'bento'];
	tables.map(table => unsub(table, source));
}

function sub(table, source) {
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
	db.query(`INSERT INTO ${table} VALUES($1) RETURNING *`, [value])
		.then(res => {
			console.log(res.rows[0]);
		})
		.catch(e => {
			console.error(e.stack)
		});	
}

function unsub(table, source) {
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
	db.query(`DELETE FROM ${table} WHERE id = $1`, [value])
		.then(res => {
			console.log(res.rows[0]);
		})
		.catch(e => {
			console.error(e.stack)
		});	
}

function sqhandleEvent(event){
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
			return replyText(sqclient, event.replyToken, '大家好，這裡是食契鬧鐘'+eol+'目前接受的指令：'+eol+'		!訂閱'+eol+'		!取消'+eol+'		!離開'+eol+'能用的參數：'+eol+'		公單'+eol+'		晚安'+eol+'		皇家'+eol+'		便當'+eol+'		全部');

		case 'unfollow':
		case 'leave':
			var value;
			switch (event.source.type){
				case 'user':
					value = event.source.userId;
					break;
				case 'group':
					value = event.source.groupId;
					break;
				case 'room':
					value = event.source.roomId;
					break;
			}
			squnsubAll(value);
			break;

		default:
			throw new Error(`Unknown even: ${JSON.stringify(event)}`);
	}
}

function handleText(message, replyToken, source){
	switch(message.text){
		case '!訂閱 全部':
			sqsubAll(source);
			return replyText(sqclient, replyToken, '已訂閱所有通知');
		case '!訂閱 公單':
			sub('public_order', source);
			return replyText(sqclient, replyToken, '已訂閱公單提醒');
		case '!訂閱 晚安':
			sub('goodnight', source);		
			return replyText(sqclient, replyToken, '已訂閱晚安訊息');

		case '!訂閱 便當':
			sub('bento', source);		
			return replyText(sqclient, replyToken, '已訂閱便當提醒');

		case '!訂閱 皇家':
			sub('royal', source);		
			return replyText(sqclient, replyToken, '已訂閱皇家提醒');


		case '!取消 公單':
			unsub('public_order', source)
			return replyText(sqclient, replyToken, '已取消公單提醒');

		case '!取消 搶劫':
			unsub('rob', source);	
			return replyText(sqclient, replyToken, '已取消搶劫提醒');

		case '!取消 晚安':
			unsub('goodnight', source);		
			return replyText(sqclient, replyToken, '已取消晚安訊息');

		case '!取消 便當':
			unsub('bento', source);		
			return replyText(sqclient, replyToken, '已取消便當提醒');

		case '!取消 皇家':
			unsub('royal', source);		
			return replyText(sqclient, replyToken, '已取消皇家提醒');
		
		case '!離開':
			var value;
			switch (source.type){
				case 'user':
					value = source.userId;
					break;
				case 'group':
					value = source.groupId;
					sqclient.leaveGroup(value);
					break;
				case 'room':
					value = source.roomId;
					sqclient.leaveRoom(value);
					break;
			}
			//fallthrough
		case '!取消 全部'	:
			unsubAll(source);
			return replyText(sqclient, replyToken, '已取消所有通知');
		default:
			return 0;
	}
}



const port = process.env.PORT || 3000;
app.listen(port, ()=> {
	console.log(`listening on ${port}`);
})
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


//公單
new cron('0 55 10,15,19 * * *',() =>{
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

//搶劫
new cron('0 42 11,16,20 * * *',() =>{
	db.query('SELECT * FROM rob')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(r.id,'公單即將回程，請準備好你的傢伙');
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
				pushMessage(r.id,'各位晚安，目前時間為11點'+eol+'還沒有建設以及打公會獸的記得要去唷');
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
				pushMessage(r.id,'各位晚安，現在已經10點囉'+eol+'提醒今日公會獸將於11點打烊，遺跡沒打完的進度也不能帶到明天喲');
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

const deleteAll = (value) =>{
			db.query('DELETE FROM public_order WHERE id = $1', [value])
			.then(res => {
				console.log(res.rows[0]);
			})
			.catch(e => {
				console.error(e.stack);
			});
						db.query('DELETE FROM rob WHERE id = $1', [value])
			.then(res => {
				console.log(res.rows[0]);
			})
			.catch(e => {
				console.error(e.stack);
			});
						db.query('DELETE FROM goodnight WHERE id = $1', [value])
			.then(res => {
				console.log(res.rows[0]);
			})
			.catch(e => {
				console.error(e.stack);
			});

}

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
			return replyText(event.replyToken, '大家好，這裡是事件提醒的小助手'+eol+'目前接受的指令有 !訂閱 以及 !取消'+eol+'能用的參數有 公單、搶劫以及晚安')
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
			deleteAll(value);
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
			db.query('INSERT INTO public_order VALUES($1) RETURNING *', [value])
			.then(res => {
				console.log(res.rows[0]);
			})
			.catch(e => {
				console.error(e.stack)
			});			
			return replyText(replyToken, '已訂閱公單通知');

		case '!訂閱 搶劫':
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
			db.query('INSERT INTO rob VALUES($1) RETURNING *', [value])
			.then(res => {
				console.log(res.rows[0]);
			})
			.catch(e => {
				console.error(e.stack)
			});			
			return replyText(replyToken, '已訂閱搶劫通知');

		case '!測試':
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
			table = 'test'
			db.query(`INSERT INTO ${table} VALUES($1) RETURNING *`, [value])
			.then(res => {
				console.log(res.rows[0]);
			})
			.catch(e => {
				console.error(e.stack)
			});			
			return replyText(replyToken, 'test');

		case '!訂閱 晚安':
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
			db.query('INSERT INTO goodnight VALUES($1) RETURNING *', [value])
			.then(res => {
				console.log(res.rows[0]);
			})
			.catch(e => {
				console.error(e.stack)
			});			
			return replyText(replyToken, '已訂閱晚安訊息');



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
			db.query('DELETE FROM public_order WHERE id = $1', [value])
			.then(res => {
				console.log(res.rows[0]);
			})
			.catch(e => {
				console.error(e.stack)
			});			
			return replyText(replyToken, '已取消公單通知');

		case '!取消 搶劫':
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
			db.query('DELETE FROM rob WHERE id = $1', [value])
			.then(res => {
				console.log(res.rows[0]);
			})
			.catch(e => {
				console.error(e.stack)
			});			
			return replyText(replyToken, '已取消搶劫通知');

		case '!取消 晚安':
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
			db.query('DELETE FROM goodnight WHERE id = $1', [value])
			.then(res => {
				console.log(res.rows[0]);
			})
			.catch(e => {
				console.error(e.stack)
			});			
			return replyText(replyToken, '已取消晚安訊息');
		
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
			
			deleteAll(value);
		default:
			return 0;
	}
}



const port = process.env.PORT || 3000;
app.listen(port, ()=> {
	console.log(`listening on ${port}`);
})
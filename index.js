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

const mapleclient = new line.Client(mapleconfig);

const app = express();

//maple
new cron('0 0 7 * * *',() =>{
	db.query('SELECT * FROM maple')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(mapleclient, r.id,'小夥伴們早安，大家吃早餐了嗎？'+eol+'記得要去『公會地城』刷一下喔！'+eol+'小秘書關心你～');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');

new cron('0 0 10 * * *',() =>{
	db.query('SELECT * FROM maple')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(mapleclient, r.id,'嗨嗨，現在10點囉，各位小夥伴要記得上『公會地城』喔。'+eol+'小夥伴們要定時去看一下版規喔，我們會不定時更新。'+eol+'小秘書提醒你');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');

new cron('0 0 11 * * *',() =>{
	db.query('SELECT * FROM maple')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(mapleclient, r.id,'嗨嗨，小秘書我又出現了owo'+eol+'倒數一小時要打王團囉，請小夥伴們準備'+eol+'記得先看『王團筆記本的規定』哦，不要當白白哦！');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');

new cron('0 0 12 * * *',() =>{
	db.query('SELECT * FROM maple')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(mapleclient, r.id,'打王團啦!! 記得看一下『王團筆記本的規則』喔!!'+eol+'趕快報名 +1+1 !!'+eol+'小秘書替你們加加油 !!');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');

new cron('0 0 13 * * *',() =>{
	db.query('SELECT * FROM maple')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(mapleclient, r.id,'注意(๑•̀ω•́๑)'+eol+'公會地城記得打'+eol+'公會地城記得打'+eol+'今日起簽到部分由公會地城計算，所以不要遺忘「公會地城」嘍'+eol+'記得不要忘記，加油');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');

new cron('0 0 19 * * *',() =>{
	db.query('SELECT * FROM maple')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(mapleclient, r.id,'嗨嗨，小夥伴們都吃飽飽了吧！'+eol+'倒數一小時要打王團囉，請小夥伴們準備囉'+eol+'記得先看『王團筆記本的規定』哦，不要當白白哦。');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');

new cron('0 0 20 * * *',() =>{
	db.query('SELECT * FROM maple')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(mapleclient, r.id,'打王團啦!! 記得看一下『王團筆記本的規則』喔!!'+eol+'趕快報名 +1+1 !!'+eol+'小秘書替你們加加油 !!');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');

new cron('0 0 21 * * *',() =>{
	db.query('SELECT * FROM maple')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(mapleclient, r.id,'注意(๑•̀ω•́๑)'+eol+'公會地城記得打'+eol+'公會地城記得打'+eol+'今日起簽到部分由公會地城計算，所以不要遺忘「公會地城」嘍'+eol+'記得不要忘記，加油'+eol+'(*๓´╰╯`๓)'+eol+'「4會公宴開始～～」');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');

new cron('0 30 21 * * *',() =>{
	db.query('SELECT * FROM maple')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(mapleclient, r.id,'倒數30分鐘後公會宴會'+eol+'請小夥伴們準時入座'+eol+'才不會人擠人擠不進去喔！');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');

new cron('0 0 22 * * *',() =>{
	db.query('SELECT * FROM maple')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(mapleclient, r.id,'公宴啦 !!! 開飯飯囉！'+eol+'大家都進去了嗎？'+eol+'要幫小秘書打『公會地城』喔，幫助公會排名。');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');


//公單
new cron('0 55 10,15,19 * * *',() =>{
	db.query('SELECT * FROM public_order')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(sqclient, r.id,'公單即將出現，油都加滿了嗎？');
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
				pushMessage(sqclient, r.id,'便當店即將打烊，再不快點就要餓肚子囉');
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


//天城
new cron('0 0 16 * * 2,5',() =>{
	db.query('SELECT * FROM arena')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(sqclient, r.id,'今日有天城演武，別忘了報名囉！');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');

new cron('0 0 20 * * 2,5',() =>{
	db.query('SELECT * FROM arena')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(sqclient, r.id,'天城演武剩下半小時，記得要打喔！');
			})
		}
	})
	.catch(err=>console.error(err.stack));
},null,true,'Asia/Taipei');


//世界王
new cron('0 0 19 * * *',() =>{
	db.query('SELECT * FROM boss')
	.then(result => {
		if(result.rows.length>0){
			result.rows.map(r=>{
				pushMessage(sqclient, r.id,'世界王已出現，大夥們快上RRR');
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

app.post('/callback/maple', line.middleware(mapleconfig), (req, res) => {

	if(!Array.isArray(req.body.events)){
		return res.status(500).end()
	}

	Promise.all(req.body.events.map(maplehandleEvent))
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
	let tables = ['public_order', 'arena', 'goodnight', 'royal', 'bento', 'boss'];
	tables.map(table => sub(table, source));
}

function squnsubAll(source) {
	let tables = ['public_order', 'rob', 'goodnight', 'royal', 'bento', 'arena', 'boss'];
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
					return sqhandleText(event.message, event.replyToken, event.source);
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
			return replyText(sqclient, event.replyToken, '大家好，這裡是食契鬧鐘'+eol+'目前接受的指令：'+eol+'		!訂閱'+eol+'		!取消'+eol+'		!離開'+eol+'能用的參數：'+eol+'		公單'+eol+'		晚安'+eol+'		皇家'+eol+'		便當'+eol+'		天城'+eol+'		世界王'+eol+'		全部');

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

function maplehandleEvent(event){
	switch (event.type){
		case 'message':
			switch (event.message.type){
				case 'text':
					//return handleText(event.message, event.replyToken, event.source);
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
			sub('maple', event.source);
			return replyText(mapleclient, event.replyToken, '大家好，這裡是楓谷小秘書～');

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
			unsub('maple', value);
			break;

		default:
			throw new Error(`Unknown even: ${JSON.stringify(event)}`);
	}
}

function sqhandleText(message, replyToken, source){
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

		case '!訂閱 天城':
			sub('arena', source);		
			return replyText(sqclient, replyToken, '已訂閱天城提醒');

		case '!訂閱 世界王':
			sub('boss', source);		
			return replyText(sqclient, replyToken, '已訂閱世界王提醒');


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

		case '!取消 天城':
			unsub('arena', source);		
			return replyText(sqclient, replyToken, '已取消天城提醒');

		case '!取消 世界王':
			unsub('boss', source);		
			return replyText(sqclient, replyToken, '已取消世界王提醒');
		
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
const {Pool} = require('pg');

const db = new Pool({
	connectionString: process.env.DATABASE_URL,
  	ssl: true
})

const tableList = ['public_order', 'bento', 'royal', 'goodnight', 'arena', 'boss'];

class dbUtil {
	loadSub() {
		return new Promise((resolve, reject) => {
			let subscribers = {};
			Promise.all(tableList.map( item => {
				return db.query(`SELECT * FROM ${item}`)
				.then(result => {
					subscribers[item] = result.rows;
					return Promise.resolve(item);
				})
				.catch(err=>console.error(err.stack));
			}))
			.then( () => {
				resolve(subscribers);
			})
			.catch(err=> {
				reject(err);
			})
		})
	}
	sub(target, source) {
		let value = source.userId||source.groupId||source.roomId;
		target === 'all' ? (target = tableList) : (target = [target]);
		target.forEach(table => {
			db.query(`INSERT INTO ${table} VALUES($1) RETURNING *`, [value])
				.then(res => {
					console.log(res.rows[0]);
				})
				.catch(e => {
					console.error(e.stack)
			});
		})	
	}
	unsub(target, source) {
		let value = source.userId||source.groupId||source.roomId;
		target === 'all' ? (target = tableList) : (target = [target]);
		target.forEach(table => {
			db.query(`DELETE FROM ${table} WHERE id = $1`, [value])
				.then(res => {
					console.log(res.rows[0]);
				})
				.catch(e => {
					console.error(e.stack)
			});
		})	
	}
}

module.exports = dbUtil;
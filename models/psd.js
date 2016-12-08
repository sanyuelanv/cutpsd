var pool = require('../config/pool');

//sql操作语句
var sql = {
	getImg:'select * from psd where sid=?',
	insert:'INSERT INTO psd VALUES '
};

var psd = {};
psd.addAll = function(arr,sid,callback){
	var str = '';
	for(var i=0;i<arr.length;i++){
		str = str + "(0,'"+arr[i].name+"',"+arr[i].left+','+arr[i].top+','+arr[i].width+','+arr[i].height+','+sid+')';
		if(i != arr.length - 1){str = str + ',';}
	}
	pool.getConnection(function(err,connection) {
		//错误，返回 err 信息
		if(err){return callback(err);}
		//插入
		connection.query(sql.insert+str,function(err){
			//错误，返回 err 信息
			if(err){
				connection.release();
				return callback(err);
			}
			connection.release();
			//成功！
			callback(null);
		});
	});
};
psd.getImg = function (name, callback) {
	pool.getConnection(function(err,connection) {
		//错误，返回 err 信息
		if(err){return callback(err);}
		//查找
		connection.query(sql.getImg,name,function(err, users) {
			//错误，返回 err 信息
			if(err){
				connection.release();
				return callback(err);
			}
			connection.release();
			var result = {state:-1,data:null};
			//返回对象未定义，操作不成功
			if (typeof users === 'undefined'){result.state = 0;}
			if(users.length > 0){
				result.state = 1;
				result.data = users;
			}
			//成功！返回查询的用户信息
			callback(null,result);
		});
	});
};
module.exports = psd;
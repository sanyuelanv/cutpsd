var pool = require('../config/pool');
var crypto = require('crypto');
//创建用户对象
var User = function (user) {
	this.name = user.name;
	this.password = user.password;
	this.payword = user.payword;
	this.level = user.level;
};

//sql操作语句
var sql = {
	getUser:'select * from user where name=?',
	getUserList:'select * from user where visible=true and level>0 order by id desc limit ?,10',
	insertUser:'INSERT INTO user(id,name,password,playpw,money,score,level,visible) VALUES(0,?,?,?,0,0,?,1)',
	deleteUser:'update user set visible=0 where name=?',
	spw:'update user set password=? where id=?',
	sppw:'update user set playpw=? where id=?',
	setUser:'update user set score=?,level= ? where name=?'
};
module.exports = User;
//添加用户
User.prototype.save = function (callback) {
	var user = {
		name:this.name,
		password:this.password,
		payword:this.payword,
		level:this.level
	};
	pool.getConnection(function(err,connection) {
		//错误，返回 err 信息
		if(err){return callback(err);}
		//插入
		connection.query(sql.insertUser,[user.name,user.password,user.payword,user.level],function(err,result){
			//错误，返回 err 信息
			if(err){
				connection.release();
				return callback(err);
			}
			connection.release();
			//成功！
			callback(null,result);
		});
	});
};
//删除用户
User.delUser = function (name,callback) {
	pool.getConnection(function(err,connection){
		//错误，返回err信息
		if(err){return callback(err);}
		//删除
		connection.query(sql.deleteUser,name,function(err,result){
			//错误，返回 err 信息
			if(err){
				connection.release();
				return callback(err);
			}
			connection.release();
			//成功！返回查询的用户信息
			callback(null,result);
		});
	});
};
User.setUser = function (name,score,level,callback) {
	pool.getConnection(function(err,connection){
		//错误，返回err信息
		if(err){return callback(err);}
		//删除
		connection.query(sql.setUser,[score,level,name],function(err,result){
			//错误，返回 err 信息
			if(err){
				connection.release();
				return callback(err);
			}
			connection.release();
			//成功！返回查询的用户信息
			callback(null,result);
		});
	});
}
//修改密码
User.changePW = function (id,pw,callback) {
	//加密密码
	var md5 = crypto.createHash('md5'),
		password = md5.update(pw).digest('hex');
	pool.getConnection(function(err,connection){
		//错误，返回err信息
		if(err){return callback(err);}
		//修改
		//:sql 语句在多个占位符的时候需要[]
		connection.query(sql.spw,[password,id],function(err,result){
			//错误，返回 err 信息
			if(err){
				connection.release();
				return callback(err);
			}
			connection.release();
			//成功！返回查询的用户信息
			callback(null,result);
		});
	});
};
//修改支付密码
User.changePPW = function (id,pw,callback) {
	//加密密码
	pool.getConnection(function(err,connection){
		//错误，返回err信息
		if(err){return callback(err);}
		//修改
		//:sql 语句在多个占位符的时候需要[]
		connection.query(sql.sppw,[pw,id],function(err,result){
			//错误，返回 err 信息
			if(err){
				connection.release();
				return callback(err);
			}
			connection.release();
			//成功！返回查询的用户信息
			callback(null,result);
		});
	});
};
//读取单个用户信息，用于登录
User.get = function (name,callback) {
	pool.getConnection(function(err,connection) {
		//错误，返回 err 信息
		if(err){return callback(err);}
		//查找
		connection.query(sql.getUser,name,function(err, user) {
			//错误，返回 err 信息
			if(err){
				connection.release();
				return callback(err);
			}
			connection.release();
			var result = {state:-1,data:null};
			//返回对象未定义，操作不成功
			if (typeof user === 'undefined'){result.state = 0;}
			//返回对象长度为0 ，查找不到
			else if(user.length == 0){result.state = 1;}
			//返回对象长度为1 ，查找到了有这个名字的用户名字的,再检测这个name是否可见的。
			else if(user.length == 1){
				if(user[0].visible ==1){
					result.state = 2;
					result.data = user[0];
				}
				else{result.state = 1;}
			}
			//返回多个名字一样的，检测visible是真的那个
			else if(user.length > 1){
				var pos = -1;
				for(var i=0;i<user.length;i++){if(user[i].visible ==1){pos = i}}
				if(pos == -1){result.state = 1;}
				else{
					result.state = 2;
					result.data = user[pos];
				}
			}
			//成功！返回查询的用户信息
			callback(null,result);
		});
	});
};
//读取指定开始位置的十个用户信息，用于管理员管理
User.getList = function (startPos,callback) {
	pool.getConnection(function(err,connection) {
		//错误，返回 err 信息
		if(err){return callback(err);}
		//查找
		connection.query(sql.getUserList,startPos,function(err, users) {
			//错误，返回 err 信息
			if(err){
				connection.release();
				return callback(err);
			}
			connection.release();
			var result = {state:-1,data:null};
			//返回对象未定义，操作不成功
			if (typeof users === 'undefined'){result.state = 0;}
			//已经到底了
			else if(users.length < 10){
				result.state = 1;
				result.data = users;
			}
			//正常获取
			else if(users.length > 0 && users.length <=10){
				result.state = 2;
				result.data = users;
			}
			//成功！返回查询的用户信息
			callback(null,result);
		});
	});
};
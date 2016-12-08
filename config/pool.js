/**
    sanyuelanv 2015年10月23日 14:53:59
 */
// 使用连接池，提升性能
var mysql = require('mysql');
var $conf = require('../config/mbd');
var util = function(target, source, flag) {
    for(var key in source) {
        if(source.hasOwnProperty(key))
            flag ?
                (target[key] = source[key]) :
                (target[key] === void 0 && (target[key] = source[key]));
    }
    return target;
};
var pool  = mysql.createPool(util({}, $conf.mysql));
module.exports = pool;
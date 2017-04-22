var config = require('./config');
var express = require('express');
var sio		= require('socket.io');
var cookieParser = require('cookie-parser');
var app =global.APP =express();




app.use(cookieParser());
//全局变量
/**
 * 全部房间
 * token:Array<Room>
 * */
global.ROOMS ={};
/**
 * 创建后未被使用的Token
 * @type {String[]}
 * */
global.TOKENS =[];
/**
 * 下一个使用的房间ID
 * @type {Number}
 * */
global.ROOMS_ID =1;
/**
 * 为申请房间的令牌设定的密码
 * token:password
 * */
global.TOKEN2PASSWD ={};


var server = app.listen(config.port, function () {
	console.log('Server listening at http://%s:%s', config.host, config.port);
});

// 当 http server 接收到 upgrade websocket 时就将请求转给 socket.io 处理
global.IO = sio.listen(server);
// 直播间


var apiRouter = require('./api_router');

app.use(function(req ,res ,next){
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Content-Length, Authorization, Accept, X-Requested-With'
    );
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method == 'OPTIONS') {
        res.send(200); //options快速响应
    }
    else {
        next();
    }
});

// route
app.use('/', apiRouter);


module.exports = app;
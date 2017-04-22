var express = require('express');
var token = require('./api/token');
var websocket = require('./api/websocket');
// var config = require('./config');

var router = express.Router();

// token
router.get('/token/create/:passwd?', token.create);
router.get('/token/destory/:token', token.destory);

// websocket
// 请求建立连接
router.get('/websocket/connect/:token/:passwd?', websocket.connect);
// 获取房间列表
router.get('/websocket/getrooms', websocket.getRooms);


module.exports = router;
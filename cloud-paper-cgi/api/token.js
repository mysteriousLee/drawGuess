var config = require('../config');
var {createToken,stdRes} = require('../lib');

var fs = require('fs');


// 创建token、创建房间
var create = function(req, res) {
	var token = createToken();
    global.TOKENS.push(token);
    if(req.params.passwd) global.TOKEN2PASSWD[token] = req.params.passwd;
    console.log(token)
    res.cookie('token',token);
    res.send(stdRes('ok',0,{
    	token:token,
	}));
    return;

    //监听使用此token的第一位连接着
    //针对房主，创建房间
 //    newRoom.nsp = IO.of('/' + token);

 //    newRoom.nsp.once('connection', function(socket){
 //        // 销毁申请的token
 //        global.TOKENS.splice(global.TOKENS.indexOf(token),1);
 //        // 创建房间
	// 	var room = new Room({
 //            token,
 //            roomId:global.ROOMS_ID++
 //        });
 //        global.ROOMS[token] = room;
 //        // 添加连接，绑定事件
 //        room.connectPool.push(socket);
 //        socket.on('message', function() {
 //        	for(let link of room.connectPool.slice(1)){
 //                link.emit('message', ...arguments);
	// 		};
 //        });
 //    });

 //    ROOMS.push(newRoom);
 //    if(global.TOKENS.indexOf(token)!==-1){//使用已申请的Token

 //    };
 //    return;





	// var roomId = req.params.id || 30,
	// 	roomPwd = req.params.password || 123;
	// var token = "",
	// 	chars = config.chars;
	
	// // 判断房间名是否存在

	// // 生成随机字符

	// // 根据token创建文件存储
	// var dataStore = fs.createWriteStream(__dirname + '/../storage/' + token + '.json', { 'flag': 'a+'});

	// // 判断token是否重复


	// // 新房间
	// var newRoom = {
	// 	id: roomId,	// 房间名
	// 	password: roomPwd != "" ? roomPwd : null,	// 房间密码
	// 	token: token,	// 令牌
	// 	owner: null,    // 房主
	// 	nsp: null,		// websokcet的命名空间
	// 	clientList: []  // 客户端列表
	// };

	// // 针对房主，创建房间
	// newRoom.nsp = IO.of('/' + token);

	// newRoom.nsp.on('connection', function(socket){

	// 	if(newRoom.owner == null) {
	// 		// 设置房主socket
	// 		newRoom.owner = socket;
	// 		// 接收房主传来的消息，存储、转发
	// 		newRoom.owner.on('message', function(msg) {
	// 			if(msg != "[]") {
	// 				console.log("msg:" + msg);
	// 				newRoom.owner.broadcast.emit('message', msg);
	// 				dataStore.write(msg);
	// 			}
	// 		});
	// 		console.log('room create');
	// 	}else {
	// 		newRoom.clientList.push(socket);
	// 		console.log('client connect');
	// 	}
	// });

	// ROOMS.push(newRoom);

	// res.send(token);

};

exports.create = create;



// 销毁token
var destory = function(req, res) {
	delete ROOMS[req.params.token];
    res.send(stdRes());
	return;



	var token = req.params.token;

	for(var i = 0;i < ROOMS.length;i++) {
		if(ROOMS[i].token == token) {
			ROOMS.splice(i, 1);
			break;
		}
	}

	res.send("ok")
}

exports.destory = destory;

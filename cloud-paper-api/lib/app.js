import Express from 'express'
import sio from 'socket.io'
import cookieParser from 'cookie-parser'
import cookie from 'cookie'
import router from '../api_router'


let app = Express();
let server = app.listen(8000, () => {
    console.log('Server listening at http://localhost:8000');
});

global.IO = require('socket.io')(server);
//全局变量 房间序号
global.ROOM_ID = 1;
// 全局变量 房间信息
global.ROOMS = [];
// 全局变量 房间token
global.TOKENS = [];
// 当 http server 接收到 websocket 时就将请求转给 socket.io 处理
global.DATA = [];
/*
    DATA是一个全局数组，保存着对应房间序号的流动题目，在创建房间时向showpage页面传递房间序号
    在showpage页面中如果是host就给对应元素更新题目，然后返回答案，如果不是host就请求对应的描述
    所有流动题目均保存在data里
 */
app.use(cookieParser());
app.use((req, res, next) => {
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

app.use('/', router);






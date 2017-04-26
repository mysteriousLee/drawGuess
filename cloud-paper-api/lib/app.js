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






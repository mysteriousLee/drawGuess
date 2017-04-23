import Express from 'express'
import sio from 'socket.io'
import cookieParser from 'cookie-parser'
import router from '../api_router'


let app = Express();

// 全局变量 房间信息
global.ROOMS ={};
// 全局变量 房间token
global.TOKENS =[];


app.use(cookieParser());
app.use('/', router);
app.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header("Access-Control-Allow-Credentials", "true");  
    res.header("Access-Control-Allow-Methods","*");   
    next();  
});


let server = app.listen(8000, () => {
	console.log('Server listening at http://localhost:8000');
});

// 当 http server 接收到 websocket 时就将请求转给 socket.io 处理
global.IO = sio.listen(server);


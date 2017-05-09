import Express from 'express'
import sio from 'socket.io'
import cookieParser from 'cookie-parser'
import cookie from 'cookie'
import router from '../api_router'
import globalData from '../overallData'

let app = Express();
let server = app.listen(8000, () => {
    console.log('Server listening at http://localhost:8000');
});

global.IO = require('socket.io')(server);

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
//socket连接
global.IO.on('connection', (socket) => {
        let token = cookie.parse(socket.request.headers.cookie).token;
        if(globalData.TOKENS.indexOf(token) !== -1){
            
            let room = globalData.ROOMS[token];
            // 销毁申请的token
            globalData.TOKENS.splice(globalData.TOKENS.indexOf(token),1);
            console.log('create room');
            room.connectPool.push(socket);
            socket.on('message', (data) => {
                    //console.log('emit event message, token is ' + token);
                    room.historyData.push(data);
                    //console.log(data);
                    for(let link of room.connectPool.slice(1)){
                        link.emit('message',data);
                    };
            });
        }
         else {
            let token = cookie.parse(socket.request.headers.cookie).token;
            let room = globalData.ROOMS[token];
            // 观众连接
            console.log('add connect pool ' + token);
            room.connectPool.push(socket);
            // 将所有历史数据推过去
            //console.log(room.historyData.length);
            if(room.historyData.length !== 0) {
                room.historyData.forEach((data) => {
                    socket.emit('message',data);
                }); 
            }
            socket.on('checkmsg', (data) => {
                let tokenData = data.token.split('=')[1];
                let connectHost = globalData.ROOMS[tokenData].connectPool[0];
                connectHost.emit('checkmsg',data.msg);
                for(let link of globalData.ROOMS[tokenData].connectPool.slice(1)){
                        link.emit('checkmsg',data.msg);
                };
            });
        }
     });






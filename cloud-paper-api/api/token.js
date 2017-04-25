import stdRes from '../stdRes.js'
import cookie from 'cookie'
import judgeToken from '../judgeToken.js'
function createToken(){
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = '';
    function randomChar() {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // 生成16位随机字符，每4位用 - 连接
    for(let i = 0;i < 4; i++) {
        for(let j = 0;j < 4; j++) {
            token += randomChar();
        }
        if(i != 3) {
            token += "-";
        }
    }
    return token;
}

let create = (req, res) => {
    let token = createToken();
    global.TOKENS.push(token);
    res.cookie('token',token);
    let room = {
                roomId : global.ROOMS_ID++,
                token : token,
                connectPool : [],
                historyData : []
    };
    res.json(stdRes('success',0,{token:token}));
    global.IO.on('connection', (socket) => {
        console.log('create room');
        room.connectPool.push(socket);
        socket.on('message', () => {
                console.log('emit event message, token is ' + token);
                room.historyData.push(arguments);
                for(let link of room.connectPool.slice(1)){
                    link.emit('message', ...arguments);
                };
        });
    });
    global.ROOMS.push(room);
    return;
};
export default create;
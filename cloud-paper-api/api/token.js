import stdRes from '../stdRes.js'
import cookie from 'cookie'
import judgeToken from '../judgeToken.js'
import connectWS from './connectWS.js'
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
    res.json(stdRes('success',0,{token:token}));
    let room = {
                connectPool : [],
                historyData : []
    };
    global.ROOMS[token] = room;
    connectWS(token);
    return;
};
export default create;
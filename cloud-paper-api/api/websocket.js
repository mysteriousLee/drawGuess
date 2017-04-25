import stdRes from '../stdRes.js'
import cookie from 'cookie'
import judgeToken from '../judgeToken.js'
//请求建立连接
let connect = (req, res) => {
	let token = req.params.token;
	if(!judgeToken(token)){
        res.json(stdRes('token无效',102,{}));
		return;
	};
	// 通过
    res.cookie('token',token);
    res.json(stdRes());
    global.IO.on('connection', (socket) => {
        let cookieObj = cookie.parse(socket.request.headers.cookie);
        let token = cookieObj.token;
        console.log('client connection use ' + token);
	    let num = 0;
        for(let i = 0;i < global.ROOMS.length; i++){
	        if(global.ROOMS[i].token === token){
	            num = i;
	            break;
	        }
	    }  
	    console.log(num);
        if(!token || !judgeToken(token)){
	        console.log('token invalid');
	        socket.disconnect();
	        return;
	    };
	    
	    // 观众连接
	    console.log('add connect pool');
	    
	    global.ROOMS[num].connectPool.push(socket);
	    // 将所有历史数据推过去
	    global.ROOMS[num].historyData.forEach((data) => {
	        socket.emit('message',...data);
	    });
    });
    return;
};


export default connect;
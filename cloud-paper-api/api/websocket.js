import stdRes from '../stdRes.js'
import cookie from 'cookie'
import judgeToken from '../judgeToken.js'
import connectWS from './connectWS.js'
//请求建立连接
let connect = (req, res) => {
	let token = req.params.token;
	if(!judgeToken(token)){
        res.json(stdRes('token无效',-1,{}));
		return;
	};
	// 通过
    res.cookie('token',token);
    res.json(stdRes('token有效，开始建立连接',0,{}));
    connectWS(token);
    return;
};


export default connect;
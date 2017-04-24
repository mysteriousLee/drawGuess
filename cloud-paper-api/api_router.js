import Express from 'express'
import create from './api/token'
import connect from './api/websocket'
import getRooms from './api/getrooms'

let router = Express.Router();

//获取token值
router.get('/token/create', create);
//请求建立socket连接
 router.get('/websocket/connect/:token', connect);
// 获取房间列表
 router.get('/websocket/getrooms', getRooms);

export default router;
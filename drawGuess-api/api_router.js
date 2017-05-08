import Express from 'express'
import create from './api/token'
import connect from './api/websocket'
import getRooms from './api/getrooms'
import { setData,getData,checkData } from './api/subject'

let router = Express.Router();

//获取token值
router.get('/token/create', create);
//请求建立socket连接
router.get('/websocket/connect/:token', connect);
// 获取房间列表
router.get('/websocket/getrooms', getRooms);
 //设置答案,提示词
router.get('/subject/set/:id', setData);
//观察者获取提示词
router.get('/subject/get/:id', getData);
//检查答案
router.get('/subject/check/:answer/:id', checkData);
export default router;
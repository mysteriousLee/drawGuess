import Express from 'express'
import create from './api/token'
import connect from './api/websocket'
import getRooms from './api/getrooms'
import { getData,judgeAns } from './api/get'

let router = Express.Router();

//获取token值
router.get('/token/create', create);
//请求建立socket连接
router.get('/websocket/connect/:token', connect);
// 获取房间列表
router.get('/websocket/getrooms', getRooms);
 //获取答案,提示词
router.get('/get/getData', getData);
//观察者输入答案
router.get('/get/judgeAns/:ans', judgeAns);
export default router;
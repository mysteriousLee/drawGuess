import Express from 'express'
import create from './api/token'
// import {websocket} from './api/websocket'

let router = Express.Router();

//获取token值
router.get('/token/create', create);



//请求建立socket连接
// router.get('/websocket/connect/:token', websocket.connect);

export default router;
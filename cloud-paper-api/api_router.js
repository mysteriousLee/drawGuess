import Express from 'express'
import {create} from './api/token'

let router = Express.Router();

//获取token值
router.get('/token/create', create);

export default router;
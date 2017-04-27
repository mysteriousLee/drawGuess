import data from '../data.json'
import stdRes from '../stdRes.js'

let getData = (req, res) => {
	let len = data.datas.length - 1;
	let num = parseInt(Math.random() * (len + 1));
	global.DATA = data.datas[num];
	res.json(stdRes('success',0,{des:data.datas[num].des,ans:data.datas[num].ans}));
	return;
};
let judgeAns = (req, res) => {
	let ans = req.params.ans;
	if(ans === global.DATA.ans) {
		res.json(stdRes('success',0,{}));
	} else {
		res.json(stdRes('error',0,{}));
	}
	return;
};
export { getData,judgeAns };
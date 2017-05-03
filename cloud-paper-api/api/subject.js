import data from '../data.json'
import stdRes from '../stdRes.js'

let setData = (req, res) => {
	let id = req.params.id;
	let len = data.datas.length - 1;
	let num = parseInt(Math.random() * (len + 1));
	global.DATA[id] = data.datas[num];
	console.log(global.DATA);
	res.json(stdRes('success',0,{des:data.datas[num].des,ans:data.datas[num].ans}));
	return;
};
let getData = (req, res) => {
	let id = req.params.id;
	let subject = global.DATA[id];
	res.json(stdRes('success',0,{des:subject.des}));
	return;
};
let checkData = (req, res) => {
	let id = req.params.id;
	let answer = req.params.answer;
	if(answer == global.DATA[id].ans){
		res.json(stdRes('success',0,{}));
	} else{
		res.json(stdRes('error',-1,{}));
	}
};
export { setData,getData,checkData };
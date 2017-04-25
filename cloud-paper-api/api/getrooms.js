import stdRes from '../stdRes.js'
//获取房间列表
let getRooms = (req, res) => {
	let result = {rooms:[]};
	for(let token in global.ROOMS){
        result.rooms.push({
        	id    :global.ROOMS[token].roomId,
            token : global.ROOMS[token].token
        });
    };
    res.json(stdRes('ok',0,result));
    return;
};
export default getRooms;
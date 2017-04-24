function judgeToken(token) {
	let flag = 0;
    for(let i = 0;i < global.ROOMS.length; i++){
		if(global.ROOMS[i].token === token){
			flag = 1;
			break;
		}
	}
	return flag;
}

export default judgeToken;

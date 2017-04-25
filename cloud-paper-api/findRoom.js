function findRoom(token) {
	let num;
	for(let i = 0;i < global.ROOMS.length; i++){
		if(token === global.ROOMS[i].token){
			num = i;
			return num;
		}
	}
}
export default findRoom;
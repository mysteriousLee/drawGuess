class Room{
    constructor({token,roomId}){
        this.token = token;
        this.roomId = roomId;
        this.passwd ='';
        this.connectPool =[];
        this.historyData =[];
    };
}
exports.Room =Room;


function stdRes(errmsg='ok',errcode=0,errorObj={}){
    errorObj.errmsg =errmsg;
    errorObj.errcode =errcode;
    return JSON.stringify(errorObj)
}
exports.stdRes =stdRes;

function createToken(){
    var chars ="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var token ='';
    function randomChar() {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // 生成16位随机字符，每4位用 - 连接
    for(var i = 0;i < 4;i++) {
        for(var j = 0;j < 4;j++) {
            token += randomChar();
        }
        if(i != 3) {
            token += "-";
        }
    }
    return token;
}
exports.createToken =createToken;
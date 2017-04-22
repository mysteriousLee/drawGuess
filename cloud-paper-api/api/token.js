function createToken(){
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = '';
    function randomChar() {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // 生成16位随机字符，每4位用 - 连接
    for(let i = 0;i < 4; i++) {
        for(let j = 0;j < 4; j++) {
            token += randomChar();
        }
        if(i != 3) {
            token += "-";
        }
    }
    return token;
}

let create = (req, res) => {
    let token = createToken();
    console.log(token);
    res.cookie('token',token);
    if(token === '') {
        res.json({"errcode":-1,"errmsg":"error"});
    } else {
        res.json({"errcode":0,"errmsg":"success","token":token});
    }
};
export {create};
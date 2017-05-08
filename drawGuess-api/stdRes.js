function stdRes(errmsg = 'ok',errcode = 0,errorObj = {}){
    errorObj.errmsg = errmsg;
    errorObj.errcode = errcode;
    return errorObj;
}
export default stdRes;
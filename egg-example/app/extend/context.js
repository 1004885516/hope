'use strict';
const _ = require('underscore');
const Common = require('../common');

const { ERR_TYPE } = Common.Constant;
const { ERR_CODE } = Common.Constant.ERR_CODE;
const { RES_BODY } = Common.Constant.RES_BODY;
const extendCtx = {
    setErrBody(err){
        let errCode;
        let msg;
        const body = {};
        if(ERR_TYPE.isSystemError(err)){
            errCode = err.code;
            msg = err.message;
        }else {
            errCode = ERR_CODE.SERVER_ERR;
            msg = err.message
        }
        body.code = RES_BODY[errCode].code;
        body.msg = RES_BODY[errCode].msg;
        if(msg){
            body.msg = msg
        }
        this.body = body;
    },
    setSuccessBoy(data,msg){
        const code = ERR_CODE.SUCCESS;
        const body = _.clone(RES_BODY[code]) // 此处拷贝为了避免body修改影响到commen中定义好的RES_BODY内容
        if(data){
            body.data = _.clone(data)
        }
        if(msg){
            body.msg = msg
        }
        this.body = body
    }
};
module.exports = extendCtx;

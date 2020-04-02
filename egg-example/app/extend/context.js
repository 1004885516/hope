'use strict';
const _ = require('underscore');
const Common = require('../common');
const Parameter = require('parameter')

const SystemError = Common.SystemError;
const { ERR_TYPE } = Common.Constant;
const { ERR_CODE } = Common.Constant.ERR_CODE;
const { RES_BODY } = Common.Constant.RES_BODY;
const extendCtx = {
    setErrBody(err){
        this.logger.info('');
        let errCode;
        let msg;
        const body = {};
        if(ERR_TYPE.isSystemError(err)){
            this.logger.error(`SystemError:${JSON.stringify(err)}`);
            errCode = err.code;
            msg = err.message;
        }else {
            this.logger.error(`Error:${JSON.stringify(err)}`);
            errCode = ERR_CODE.SERVER_ERR;
            msg = err.message
        }
        body.code = RES_BODY[errCode].code;
        body.msg = RES_BODY[errCode].msg;
        if(msg){
            body.msg = msg
        }
        this.logger.info(`ErrBody:${JSON.stringify(body)}`);
        this.body = body;
    },
    setSuccessBody(data,msg){
        const code = ERR_CODE.SUCCESS;
        const body = _.clone(RES_BODY[code]); // 此处拷贝为了避免body修改影响到commen中定义好的RES_BODY内容
        if(data){
            body.data = _.clone(data)
        }
        if(msg){
            body.msg = msg
        }
        this.logger.info(`SuccessBody:${JSON.stringify(body)}`);
        this.body = body
    },
    validate(rules, data) {
        data = data || this.request.body;
        const errors = this.app.validator.validate(rules, data);
        if (errors) {
            this.throw(new SystemError({code:ERR_CODE['INVALID_PARAM_ERR'], message:`参数验证失败:${errors[0].field} ${errors[0].message}`}));
        }
    },
};
module.exports = extendCtx;

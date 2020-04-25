'use strict';


const _ = require('underscore');
const Common = require('../common');
const { SystemError } = Common;
const { ERR_TYPE } = Common.Validator;
const { ERR_CODE } = Common.Constant.ERR_CODE;
const { RES_BODY } = Common.Constant.RES_BODY;

const extendCtx = {
    /**
     * 构建errorBody
     * @param { Object } err 捕获到的错误
     * @return { Object } body 返回异常结果
     */
    setErrBody(err){

        let errCode;
        let msg;
        const body = {};

        if(ERR_TYPE.isSystemError(err)){

            this.logger.error(`SystemError:${JSON.stringify(err)}`);
            errCode = err.code;
            msg = err.message;

        }else {

            this.app.emit('error', err, this); // 此处打印一条error级别的日志到node控制台
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
    /**
     * 统一处理成功响应 response
     * @param { Object } data 处理成功的返回结果
     * @param { String } msg 描述，暂时不需要，预留参数
     * @return { Object } body 处理成功的返回结果
     */
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
    }
};
module.exports = extendCtx;

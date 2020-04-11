'use strict';
const Joi = require('@hapi/joi');
const common = require('../common');
const { SystemError } = common
const { INVALID_PARAM_ERR } = common.Constant.ERR_CODE.ERR_CODE
const { RES_BODY } = common.Constant.RES_BODY
const { userBodySchema } = common.Validator.PARAM_SCHEMA
/**
 * 验证用户模块参数中间件
 */
async function reqUserBodyValidator(ctx, next){
    ctx.logger.info('进入reqBodyValidator#########')
    const body = ctx.request.body;
    try{
        await userBodySchema.validateAsync(body)  // 此处必须用await 和 validateAsync，否则catch无法捕捉到错误
    }catch (err){
        ctx.logger.error(`reqUserBodyValidator userBodySchema.validate err:${err.toString()}`)
        const massage = `${RES_BODY[INVALID_PARAM_ERR].code},${err.toString()}`
        throw new SystemError({ code: INVALID_PARAM_ERR, massage: massage })
    }
    await next();
}
/**
 * 根据传入不同type值，获取对应中间件函数（目前只有一个，后续可扩展）
 * @param { String } type 中间件类型
 * @return { Function } 返回中间件函数
 */
function getValidator(type){
    let validatorFunc;
    switch(type){
        case 'reqUserBodyValidator':
            validatorFunc = reqUserBodyValidator
            break;
        default:
            validatorFunc = null;
    }
    return validatorFunc;
}

module.exports = {
    getValidator
}
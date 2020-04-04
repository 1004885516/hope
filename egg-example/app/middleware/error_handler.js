'use strict';

async function errorHandler(ctx,next) {
    try {
        await next()
        // 此处记录处理成功日志
        ctx.logger.inifo(`request success,body:${JSON.stringify(ctx.request.body)}`)
    }catch (err) {
        // 此处记录错误日志

        ctx.setErrBody(err)
    }
}
module.exports = ()=>{
  return errorHandler
};

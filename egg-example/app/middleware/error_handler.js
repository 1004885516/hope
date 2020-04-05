'use strict';

async function errorHandler(ctx,next) {
    try {
        await next();
        // 记录处理成功日志
        ctx.logger.info(`request success, body:${JSON.stringify(ctx.request.body)}`)
    }catch (err) {
        // 记录处理失败日志
        ctx.logger.error(`request error, body:${JSON.stringify(ctx.request.body)}`);
        ctx.setErrBody(err)
    }
}
module.exports = ()=>{
  return errorHandler
};

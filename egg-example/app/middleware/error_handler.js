'use strict';

async function errorHandler(ctx,next) {
    try {
        await next()
        // 此处记录处理成功日志

    }catch (err) {
        // 此处记录错误日志


        ctx.setErrBody(err)
    }
}
module.exports = ()=>{
  return errorHandler
};
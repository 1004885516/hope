'use strict';
const jwt = require('jsonwebtoken');
const common = require('../common');
const { SystemError } = common
const { TOKEN_ERR, NO_DATA_ERR } = common.Constant.ERR_CODE.ERR_CODE
async function verifyUser(ctx, next) {
    ctx.logger.info('verifyUser')
    const token = ctx.request.body['x-access-token'] || ctx.request.headers['x-access-token'];
    if(token){
        const userdata = jwt.verify(token, ctx.app.config.secret_keys.usersecret)
        const user = await ctx.model.User.findOne({ login: userdata.login })
        if(!user){
            throw new SystemError({ code: NO_DATA_ERR, message: "未找到该用户" })
        }
        ctx.user = user // 把user信息挂载到ctx对象上，方便以后在业务代码中直接获取用户信息，节省部分数据库查询操作
        await next();
    }else{
        ctx.throw(new SystemError({ code: TOKEN_ERR, message: `no_tokeno \n url: ${ ctx.request.url }`}))
    }
};
function getValidator(type){
    let validatorFunc;
    switch(type){
        case 'verifyUser':
            validatorFunc = verifyUser
            break;
        default:
            validatorFunc = null;
    }
    return validatorFunc;
}

module.exports = {
    getValidator
}

'use strict';

const Controller = require('egg').Controller;
const Common = require('../common');
const { SystemError, Constant } = Common;
const { ERR_CODE } = Constant.ERR_CODE;
/*
    调试代码
 */
class UserController extends Controller {
    async adduser() {
        const { ctx, app } = this;
        const reqbody = ctx.request.body;
        const createRule = {
            userName: { type:'string' },
            pwd:{ type: 'string'}
        };
        ctx.validate(createRule);
        // await ctx.model.User.create(reqbody)
        await ctx.service.user.editUser(reqbody);
        ctx.setSuccessBody(body);
    }
    // 获取全量小区
    async getAllEstate(){
        const {ctx} = this
        const result = await ctx.service.estate.getList({});
        ctx.helper.success({ ctx, res: result });
    }
}

module.exports = UserController;

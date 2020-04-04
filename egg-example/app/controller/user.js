'use strict';

const Controller = require('egg').Controller;
const Common = require('../common');
const { SystemError, Constant } = Common;
const { ERR_CODE } = Constant.ERR_CODE;
/*
    调试代码
 */
class UserController extends Controller {
    // 获取全量小区
    async getAllEstate(){
        const {ctx} = this;
        const body = ctx.request.body;
        const id = body.id;
        const VerifyRule = {
          id:{ type: 'string'}
        };
        ctx.validate(VerifyRule, body);
        const result = await ctx.service.dao.estate.getList({ _id:id });
        ctx.setSuccessBody(result);
    }
}

module.exports = UserController;

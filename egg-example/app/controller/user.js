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
        const result = await ctx.service.dao.estate.getList({});
        ctx.setSuccessBody(result);
    }
}

module.exports = UserController;

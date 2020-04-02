'use strict';

const Controller = require('egg').Controller;
const Common = require('../common');
const { SystemError, Constant } = Common;
const { ERR_CODE } = Constant.ERR_CODE;
/*
    调试代码
 */
class User extends Controller {
    async adduser() {
        const { ctx } = this;
        const body = ctx.request.body;
        const createRule = {
            userName: { type:'string' },
            pwd:{ type: 'string'}
        };
        ctx.validate(createRule);
        ctx.setSuccessBody(body);
    }
}

module.exports = User;

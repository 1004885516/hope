'use strict';

const Controller = require('egg').Controller;

class User extends Controller {
    async adduser() {
        const { ctx } = this;
        // throw new SystemError({code: ERR_CODE['PARAM_ERR'], message:'测试错误'});
        console.log('1111111111111111111111111')
        ctx.logger.info('hi,egg');
        ctx.setSuccessBody('hi, egg');
    }
}

module.exports = User;

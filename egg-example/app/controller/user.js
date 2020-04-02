'use strict';

const Controller = require('egg').Controller;

class User extends Controller {
    async adduser() {
        const { ctx, app} = this;
        // throw new SystemError({code: ERR_CODE['PARAM_ERR'], message:'测试错误'});
        console.log('body', ctx.request.body)
        ctx.validate({ userName: {type:'string'} });
        ctx.setSuccessBody('hi, egg');
    }
}

module.exports = User;

'use strict';

const Controller = require('egg').Controller;
const Common = require('../common');
const { SystemError, Constant } = Common;
const { ERR_CODE } = Constant.ERR_CODE;
const { GLOBAL_FIELD } = Constant.GLOBAL_FIELD;
const { USER_CREATE, USER_LOGIN, GET_ONE_USER, GET_USER_LIST } = GLOBAL_FIELD.ACTION;

class UserController extends Controller {
    constructor(ctx){
        super(ctx);
        this.service = ctx.service;
        this.reqBody = ctx.request.body;
    }
    async userHandler(){
        const { ctx, service, reqBody, logger } = this;
        ctx.logger.info('controller/userHandler, reqBody:',JSON.stringify(reqBody));
        const action = reqBody.action;
        let user = null;
        switch (action) {
            case USER_CREATE:    // 创建用户
                user = await service.user.createUserServer(reqBody);
                break;
            case GET_ONE_USER:   // 获取一条用户信息
                user = await service.user.getOneUser(reqBody);
                break;
            case GET_USER_LIST:   // 获取用户列表
                user = await service.user.getUserList(reqBody);
                break;
            default:
                throw new SystemError({ code:ERR_CODE.INVALID_PARAM_ERR, message: 'no such action' })
        }
        if(user){
            ctx.setSuccessBody(user)
        }else{
            ctx.setSuccessBody()
        }
    }
}

module.exports = UserController;

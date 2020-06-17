'use strict';


const Controller = require('egg').Controller;
const common = require('../common');
const { SystemError, Constant } = common;
const { ERR_CODE } = Constant.ERR_CODE;
const { PROJECT_FIELD } = Constant.PROJECT_FIELD;

const {
  USER_UPDATE,
  USER_DELETE,
  GET_ONE_USER,
  GET_USER_LIST
} = PROJECT_FIELD.ACTION;

const {
  createUserSchema,
  loginSchema,
  userUpdateSchema,
  deleteUserSchema,
  getOneUserSchema,
  getListUser
} = common.Validator.USER_SCHEMA


class UserController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.service = ctx.service;
    this.reqBody = ctx.request.body;
  }

  /**
   * 创建用户
   */
  async createUser () {

    const { ctx, service, reqBody } = this;

    ctx.logger.info('controller/createUser, reqBody:', JSON.stringify(reqBody));

    await createUserSchema.validateAsync(reqBody);

    const user = await service.user.createUser(reqBody);

    ctx.setSuccessBody(user);
  }

  /**
   * 登录
   */
  async login () {

    const { ctx, service, reqBody } = this;

    ctx.logger.info('controller/login, reqBody: ', JSON.stringify(reqBody))

    await loginSchema.validateAsync(reqBody);

    const data = await service.user.userLogin(reqBody);

    const result = {
      token: data
    };

    ctx.setSuccessBody(result);
  }

  /**
   * 用户相关操作
   */

  async userHandler () {

    const { ctx, service, reqBody } = this;

    ctx.logger.info('controller/userHandler, reqBody:', JSON.stringify(reqBody));

    const action = reqBody.action;
    let user = null;

    switch (action) {
      case USER_UPDATE:    // 更新用户信息
        await userUpdateSchema.validateAsync(reqBody);
        await service.user.userUpdate(reqBody)
        break;
      case USER_DELETE:    // 注销一个用户
        await deleteUserSchema.validateAsync(reqBody);
        await service.user.userDelete(reqBody)
        break;
      case GET_ONE_USER:   // 获取一条用户信息
        await getOneUserSchema.validateAsync(reqBody);
        user = await service.user.getOneUser(reqBody);
        break;
      case GET_USER_LIST:  // 获取用户列表
        await getListUser.validateAsync(reqBody);
        user = await service.user.getUserList(reqBody);
        break;
      default:
        throw new SystemError({ code: ERR_CODE.INVALID_PARAM_ERR, message: 'no such action' })
    }
    if (user) {
      ctx.setSuccessBody(user)
    } else {
      ctx.setSuccessBody()
    }
  }
}

module.exports = UserController;

'use strict';


const Service = require('egg').Service;
const _ = require('underscore');
const Common = require('../common');
const { SystemError, Constant } = Common;
const { ERR_CODE } = Constant.ERR_CODE;
const { PROJECT_FIELD } = Constant.PROJECT_FIELD;
const { LIMIT, PAGE } = PROJECT_FIELD.DB_PARAMS;
const { CreateToken, EncryptionPwd } = require('../util')


class UserService extends Service {

  constructor(ctx) {

    super(ctx);

    this.dao = ctx.service.dao;

  }

  async createUser (reqBody) {

    const { ctx, dao } = this;
    const { username, password, name } = reqBody;
    let errorObj = null;
    let errorBody = null;

    ctx.logger.info(`createUser username:${username} password:${password} name:${name}`);

    const user = await dao.user.getOne({ find: { username: username } })

    if (user) {

      errorObj = { code: ERR_CODE.REPEAT_ACTION_ERR, message: '该用户已注册' };
      errorBody = new SystemError(errorObj);

      if (!errorBody) {
        errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
      }

      ctx.throw(errorBody);

    }

    const pwd = EncryptionPwd.encryptPassword(username, password)
    const query = {
      doc: {
        username: username,
        password: pwd,
        name: name
      }
    };

    const result = await dao.user.addOne(query);

    return result;
  }

  async userLogin (reqBody) {

    const { ctx, dao } = this;
    const { username, password } = reqBody;
    let errorObj = null;
    let errorBody = null;

    ctx.logger.info(`userLogin username: ${username} password: ${password}`)

    const query = {
      find: { username: username }
    }

    const user = await dao.user.getOne(query);

    if (!user) {

      errorObj = { code: ERR_CODE.NO_DATA_ERR, message: '未找到该用户' };
      errorBody = new SystemError(errorObj);

      if (!errorBody) {
        errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
      }

      ctx.throw(errorBody);
    }

    const pwd = EncryptionPwd.validatePassword(username, password, user.password)

    if (!pwd) {

      errorObj = { code: ERR_CODE.INVALID_PARAM_ERR, message: '密码错误' }
      errorBody = new SystemError(errorObj)

      if (!errorBody) {
        errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
      }

      ctx.throw(errorBody)
    }

    const token = CreateToken.createTokenUser(user)

    return token;
  }

  async userUpdate (reqBody) {

    const { ctx, dao } = this;
    const { username, name } = reqBody;

    ctx.logger.info(`userUpdate username ${username} name: ${name}`)

    const query = {
      find: { username: username },
      update: {
        $set: { name: name }
      }
    };

    const result = await dao.user.upDateOne(query);

    return result;
  }

  async userDelete (reqBody) {

    const { ctx, dao } = this;
    const { _id } = reqBody;

    ctx.logger.info(`userDelete _id ${_id}`)

    const query = {
      find: { _id: _id }
    };

    const result = await dao.user.deleteOne(query);

    return result;
  }

  async getOneUser (reqBody) {

    const { ctx, dao } = this;
    const { username } = reqBody;

    ctx.logger.info(`getOneUser username:${username}`);

    const query = {
      find: {
        username: username ? username : ctx.user.username
      },
      select: { '__v': 0, password: 0, createTime: 0 }
    };

    const result = await dao.user.getOne(query);

    return result;
  }

  async getUserList (reqBody) {

    const { ctx, dao } = this;
    const $limit = reqBody.limit ? reqBody.limit : LIMIT;
    const page = reqBody.page ? reqBody.page : PAGE;

    ctx.logger.info(`getUserList:`);

    const query = {
      find: {},
      select: { '__v': 0 },
      $limit: $limit,
      $skip: (page - 1) * $limit
    };

    const count = await dao.user.getCount(query);

    const totalPage = Math.ceil(count / $limit);

    const users = await dao.user.getList(query);

    const result = { total: count, totalPage: totalPage, item: users }

    return result;
  }

}

module.exports = UserService;


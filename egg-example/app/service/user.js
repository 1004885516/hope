'use strict';
const Service = require('egg').Service;
const _ = require('underscore');
const Common = require('../common');
const { SystemError, Constant } = Common;
const { ERR_CODE } = Constant.ERR_CODE;
const { GLOBAL_FIELD } = Constant.GLOBAL_FIELD;
const { LIMIT, PAGE } = GLOBAL_FIELD.PAGING;
const { CreateToken } = require('../util')
class UserService extends Service {
    constructor(ctx){
        super(ctx);
        this.dao = ctx.service.dao;
    }
    async createUser(reqBody) {
        const { ctx, dao } = this;
        const { login, password, name } = reqBody;
        ctx.logger.info(`createUser login:${ login } password:${ password } name:${name}`);
        const user = await dao.user.getOne({ find: { login: login } })
        if(user){
            ctx.throw(new SystemError({ code: ERR_CODE.REPEAT_ACTION_ERR, message: '该用户已注册' }))
        }
        const query = {
            doc: {
                login: login,
                password: password,
                name: name
            }
        };
        return await dao.user.addOne(query);
    }
    async userLogin(reqBody){
        const { ctx, dao } = this;
        const { login, password } = reqBody;
        ctx.logger.info(`userLogin login: ${ login } password: ${ password }`)
        const query = {
            find:{ login: login}
        }
        const user = await dao.user.getOne(query);
        if(!user){
            return ctx.throw(new SystemError({ code: ERR_CODE.NO_DATA_ERR, message: "未找到该用户" }))
        }
        return CreateToken.createTokenUser(user)
    }
    async userUpdate(reqBody){
        const { ctx, dao } = this;
        const { login, name } = reqBody;
        ctx.logger.info(`userUpdate login ${ login } name: ${ name }`)
        const query = {
            find:{ login: login },
            update:{
                $set: { name: name}
            }
        };
        return dao.user.upDateOne(query);
    }
    async userDelete(reqBody){
        const { ctx, dao } = this;
        const { _id } = reqBody;
        ctx.logger.info(`userDelete _id ${ _id }`)
        const query = {
            find: { _id: _id }
        };
        return dao.user.deleteOne(query);
    }
    async getOneUser(reqBody) {
        const { ctx, dao } = this;
        const { login } = reqBody;
        ctx.logger.info(`getOneUser login:${ login }`);
        const query = {
            find: {
                login: login
            }
        };
        return await dao.user.getOne(query);
    }
    async getUserList(reqBody) {
        const { ctx, dao } = this;
        const $limit = reqBody.limit ? reqBody.limit : LIMIT;
        const page = reqBody.page ? reqBody.page : PAGE;
        ctx.logger.info(`getUserList:`);
        const query = {
            find: {},
            select:{ '__v':0 },
            $limit: $limit,
            $skip: (page - 1) * $limit
        };
        const users = await dao.user.getList(query);
        const count = await dao.user.getCount(query);
        const totalPage = Math.ceil(count / $limit);
        return { total: count, totalPage: totalPage, item: users }
    }
}

module.exports = UserService;


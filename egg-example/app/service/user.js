'use strict';
const Service = require('egg').Service;
const _ = require('underscore');
const Common = require('../common');
const { Constant } = Common;
const { GLOBAL_FIELD } = Constant.GLOBAL_FIELD;
const { LIMIT, PAGE } = GLOBAL_FIELD.PAGING;
class UserService extends Service {
    constructor(ctx){
        super(ctx);
        this.dao = ctx.service.dao;
    }
    async createUserServer(reqBody) {
        const { ctx, dao } = this;
        const verifyRule = {
            login: { type: 'string' },
            password: { type: 'string' },
            name: { type: 'string' }
        };
        ctx.validate(verifyRule, reqBody);
        const { login, password, name } = reqBody;
        ctx.logger.info(`createUserServer login:${ login } password:${ password } name:${name}`);
        const query = {
            doc: {
                login: login,
                password: password,
                name: name
            }
        };
        return await dao.user.addOne(query);
    }
    async getOneUser(reqBody) {
        const { ctx, dao } = this;
        const verifyRule = { login: { type: 'string' } };
        ctx.validate(verifyRule, reqBody);
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


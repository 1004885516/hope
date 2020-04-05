/**
 * Created by Administrator on 2018/6/26/026.
 */
'use strict';
const Service = require('egg').Service;


class user extends Service {
    constructor(ctx) {
        super(ctx);
        this.model = ctx.model;
    }
    async addOne(query) {
        const { ctx, model } = this;
        ctx.logger.info('dao/user:addOne  doc', JSON.stringify(query));
        const doc = query.doc;
        return await model.User.create(doc);
    }
    async getOne(query) {
        const { ctx, model } = this;
        ctx.logger.info('dao/user:getOne  doc', JSON.stringify(query));
        return await model.User
            .findOne(query.find)
            .select(query.select || {})
            .exec();
    }
    async getList(query) {
        const { ctx, model } = this;
        ctx.logger.info('dao/user:getList  doc', JSON.stringify(query));
        return await model.User
            .find(query.find)
            .select(query.select || {})
            .sort(query.sort || {})
            .skip(query.$skip)
            .limit(query.$limit)
            .exec();
    }
    async getCount(query) {
        const { model } = this;
        return await model.User
            .find(query.find)
            .count()
            .exec();
    }
}


module.exports = user;

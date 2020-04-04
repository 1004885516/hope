/**
 * Created by Administrator on 2018/6/26/026.
 */
'use strict';
const Service = require('egg').Service;
// const _ = require('underscore');

class estate extends Service {
    async getOne(data) {
        return await this.ctx.model.Estate
            .findOne(data)
            .select(data.select || {})
            .exec();
    }
    async getList(data) {
        return await this.ctx.model.Estate
            .find(data)
            .select(data.select || {})
            .exec();
    }
    async add(data) {
        return await this.ctx.model.Estate.insertMany(data);
    }
}


module.exports = estate;

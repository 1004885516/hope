'use strict';
const { Service } = require('egg');

class DetailService extends Service{
    constructor(ctx) {
        super(ctx);
        this.model = ctx.model;
        this.extLogger = ctx.extLogger;
    }
    async findDetail(reqbody) {
        console.log('@@@@@@@@@@@@@@@@@@@')
        const { model } = this
        // console.log('model', model)
        await model.user.create(reqbody)
        // await this.ctx.model.user.create(reqbody)
    }
}
module.exports = DetailService;

'use strict';
const { Service } = require('egg');

class DetailService extends Service{
    // constructor(ctx){
    //     super(ctx);
    //     this.model = ctx.model;
    // }
    async findDetail() {
        const { app } = this;
        console.log('model#####', app.model.user)
    }
}
module.exports = DetailService;

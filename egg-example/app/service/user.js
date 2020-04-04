'use strict';
const Service = require('egg').Service;


class UserService extends Service {
    async editUser(id, password) {
        console.log('this.ctx.model', this.ctx.app.model);
        return await this.ctx.model.User.updateOne({ _id: id }, { password });
    }
}

module.exports = UserService;


'use strict';

/*
    用户信息
 */
module.exports = app => {
    const mongoose = app.mongoose;

    const userSchema = new mongoose.Schema({
        login:{ type:String,required: true, unique: true },      // 登录账号
        password:{ type: String },                               // 密码
        name: {type: String },                                   // 姓名
        createTime: { type: Date, default: Date.now}             // 创建时间
    });

    return mongoose.model('user', userSchema);

};

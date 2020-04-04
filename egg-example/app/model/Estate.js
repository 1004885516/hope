'use strict';

/*
    小区信息
 */
module.exports = app => {
    const mongoose = app.mongoose;

    const estateSchema = new mongoose.Schema({
        name:{type:String},    // 小区名字
        street:{type: String}  // 街道名字
    });

    return mongoose.model('estate', estateSchema);

};

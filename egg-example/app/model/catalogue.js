'use strict';


/*
    书籍目录
 */
module.exports = app => {

  const mongoose = app.mongoose;

  const catalogueSchema = new mongoose.Schema({
    book_id: { type: String, required: true },                       // 所属书籍id
    fileName: { type: String },                                      // 文件名称
    navId: { type: String, required: true, unique: true },           // 当前目录id 设置唯一索引，避免只删除书籍没删除目录，导致重复写入
    pid: { type: String },                                           // 父级目录id
    label: { type: String },                                         // 目录标签(描述)
    href: { type: String },                                          // 文本引用链接(nginx)
    order: { type: Number },                                         // 目录顺序(实际上是解压顺序)
    level: { type: String },                                         // 目录层级
    text: { type: String },                                          // 电子书目录点击跳转连接
    createTime: { type: Date, default: Date.now }                    // 创建时间
  });

  return mongoose.model('catalogue', catalogueSchema);

};

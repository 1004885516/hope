'use strict';


/*
    电子书信息
 */
module.exports = app => {

  const mongoose = app.mongoose;

  const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },        // 书名
    author: { type: String },                                     // 作者
    publisher: { type: String },                                  // 出版社
    language: { type: String },                                   // 语种
    rootFile: { type: String },                                   // 根文件(电子书的核心内容文件)
    cover: { type: String },                                      // 封面图片URL(nginx图片访问地址)
    coverPath: { type: String },                                  // 封面图片路径(nginx静态资源路径)
    url: { type: String },                                        // 电子书nginx访问路径
    fileName: { type: String, required: true, unique: true },     // 上传文件的名称
    path: { type: String },                                       // epub文件路径(nginx静态资源所在路径)
    filePath: { type: String },                                   // 上传epub文件所在nginx目录(完整路径)
    unzipPath: { type: String },                                  // 文件解压路径(nginx)
    originalName: { type: String },                               // 原始文件名
    createUser: { type: Object },                                 // 创建人
    updateTime: { type: Date },                                   // 更新时间
    createTime: { type: Date, default: Date.now }                 // 创建时间
  });

  return mongoose.model('book', bookSchema);

};

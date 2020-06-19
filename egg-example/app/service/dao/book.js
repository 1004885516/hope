/**
 * Created by Administrator on 2018/6/26/026.
 */
'use strict';


const Service = require('egg').Service;
const Common = require('../../common');
const { DATA_TYPE } = Common.Validator;

class book extends Service {

  constructor(ctx) {

    super(ctx);

    this.model = ctx.model;

  }

  // 书籍相关操作
  async addOneBook (query) {

    const { ctx, model } = this;

    ctx.logger.info('dao/book:addOneBook  query', JSON.stringify(query));

    const doc = query.doc;

    if (!DATA_TYPE.isObject(doc)) {

      ctx.throw(new Error('数据库写入失败，doc is not a object'));

    }

    Object.keys(doc).forEach(key => {

      // 此处判断book对象中的每一个值都必须有Book类构造 

      if (!doc.hasOwnProperty(key)) {

        ctx.throw(new Error('数据库写入失败，不合法的值'));

      }

    })

    const result = await model.Book.create(doc);

    return result;
  }

  async getOneBook (query) {

    const { ctx, model } = this;

    ctx.logger.info('dao/book: getOneBook  query', JSON.stringify(query));

    return await model.Book
      .findOne(query.find)
      .select(query.select || {})
      .lean()
      .exec();
  }

  async updateOneBook (query) {

    const { ctx, model } = this;

    ctx.logger.info('dao/book: updateOneBook query', JSON.stringify(query));

    return await model.Book
      .update(query.find, query.update)
      .exec()
  }

  async getList (query) {

    const { ctx, model } = this;

    ctx.logger.info('dao/book: getList query', JSON.stringify(query));

    return await model.Book
      .find(query.find)
      .select(query.select || {})
      .sort(query.sort || {})
      .skip(query.$skip)
      .limit(query.$limit)
      .exec();
  }

  async getCount (query) {

    const { ctx, model } = this;

    ctx.logger.info('dao/book: getCount query', JSON.stringify(query));

    return await model.Book
      .find(query.find)
      .countDocuments()
      .exec();
  }

  async deleteOne (query) {

    const { ctx, model } = this;

    ctx.logger.info('dao/book: deleteOne query', JSON.stringify(query));

    return await model.Book
      .remove(query.find)
      .exec()
  }

  // 目录相关
  async addOneCatalogue (query) {

    const { ctx, model } = this;

    ctx.logger.info('dao/book:addOneCatalogue  query', JSON.stringify(query));

    const doc = query.doc;

    if (!DATA_TYPE.isObject(doc)) {

      ctx.throw(new Error('数据库写入失败，doc is not a object'));

    }

    const result = await model.Catalogue.create(doc);

    return result;
  }

  // 获取书籍列表
  async getCatalogueList (query) {

    const { ctx, model } = this;

    ctx.logger.info('dao/book:getCatalogueList  query', JSON.stringify(query));
    console.log('query', query)
    return await model.Catalogue
      .find(query.find)
      .select(query.select || {})
      .sort(query.sort || {})
      .skip(query.$skip)
      .limit(query.$limit)
      .lean()    // 查询到的结果为javascript对象，从而可进行操作，否则不能修改
      .exec();
  }

}


module.exports = book;

/**
 * Created by Administrator on 2018/6/26/026.
 */
'use strict';


const Service = require('egg').Service;
const Common = require('../../common');
const { SystemError, Constant } = Common;
const { ERR_CODE } = Constant.ERR_CODE;
const { DATA_TYPE } = Common.Validator;

class book extends Service {

  constructor(ctx) {

    super(ctx);

    this.model = ctx.model;

  }

  async addOne (query) {

    const { ctx, model } = this;

    ctx.logger.info('dao/book:addOne  query', JSON.stringify(query));

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

  async getOne (query) {

    const { ctx, model } = this;

    ctx.logger.info('dao/book: getOne  query', JSON.stringify(query));

    return await model.Book
      .findOne(query.find)
      .select(query.select || {})
      .exec();
  }

  async updateOne (query) {

    const { ctx, model } = this;

    ctx.logger.info('dao/book: upDateOne query', JSON.stringify(query));

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

}


module.exports = book;

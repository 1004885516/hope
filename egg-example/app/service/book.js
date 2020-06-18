'use strict';


const Service = require('egg').Service;
const _ = require('lodash');
const Common = require('../common');
const { SystemError, Constant } = Common;
const { ERR_CODE } = Constant.ERR_CODE;
const { PROJECT_FIELD } = Constant.PROJECT_FIELD;
const { LIMIT, PAGE } = PROJECT_FIELD.DB_PARAMS;
const { UPLOAD_PATH } = PROJECT_FIELD.PATH;
const path = require('path');
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
const Book = require('../util/book/book_model')

class BookService extends Service {
  constructor(ctx) {

    super(ctx);

    this.dao = ctx.service.dao;

  }

  // 写入文件流并解析资源文件
  async uploadBook (parts) {

    const { ctx } = this;

    ctx.logger.info('service/book_model, reqBody:', JSON.stringify(parts));

    let part;

    while ((part = await parts()) != null) {

      if (part.length) {

        // 其他处理

      } else {

        const target = path.join(UPLOAD_PATH, `/book/${part.filename}`) // 目标路径

        // 此处封装promise为了保证写入流必须先执行成功，然后才能保证后面解析时能读到epub文件，
        // 否则调用book.paras时会报错找不到文件（这个问题很经典，很关键，很考验对异步的理解）

        await new Promise((resolve, reject) => {

          const writeStream = fs.createWriteStream(target);
          part.pipe(writeStream);

          let errFlag;

          writeStream.on('error', err => {

            errFlag = true;
            sendToWormhole(part); // 执行失败，将上传的文件流消费掉
            reject(err);

          })

          writeStream.on('finish', () => {
            if (errFlag) return

            resolve('写入成功')
          })

        })

      }

      const book = new Book(part);
      await book.paras(ctx)
      return book;

    }
  }

  // 创建书籍和目录相关
  async createBook (reqBody) {

    const { ctx, dao } = this;
    let errorObj = null;
    let errorBody = null;

    const bookData = await dao.book.getOne({ find: { title: reqBody.title } });

    if (bookData) {

      errorObj = { code: ERR_CODE.REPEAT_ACTION_ERR, message: '该书籍已添加，不可重复操作' };
      errorBody = new SystemError(errorObj);

      if (!errorBody) {
        errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
      }

      ctx.throw(errorBody);
    }

    // 为reqBody对象添加user信息
    const user_id = ctx.user._id.toString();
    reqBody.user = {
      username: ctx.user.name,
      user_id: user_id,
      roles: ctx.user.roles
    }

    // 创建book对象
    const book = new Book(null, reqBody);

    // 写入书籍
    const result = await dao.book.addOneBook({ doc: book });

    // 写入书籍目录
    const contents = await book.getContents();
    const book_id = result._id.toString();
    const select = ['filename', 'navId', 'label', 'href', 'pid', 'order', 'level'];

    contents.forEach(async (item) => {

      let catalogue = _.pick(item, select);
      catalogue.book_id = book_id;

      await this.service.dao.book.addOneCatalogue({ doc: catalogue })

    });
  }

  async updateBook (reqBody) {

  }
}

module.exports = BookService
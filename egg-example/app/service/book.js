'use strict';


const Service = require('egg').Service;
const _ = require('underscore');
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

}

module.exports = BookService
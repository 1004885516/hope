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

        let result;

        try {

          const target = path.join(UPLOAD_PATH, `/book${part.filename}`) // 目标路径
          const writeStream = fs.createWriteStream(target);

          await part.pipe(writeStream)

        } catch (err) {

          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part);

          const errorObj = { code: ERR_CODE.UPLOAD_ERR, message: '上传失败' };
          let errorBody = new SystemError(errorObj);

          if (!errorBody) {
            errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
          }

          ctx.throw(errorBody);

        }
      }

      const book = new Book(part);
      await book.paras(ctx)
      console.log('book', book)

    }

  }

}

module.exports = BookService
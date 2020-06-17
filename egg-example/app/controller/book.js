'use strict';


const Controller = require('egg').Controller;
const common = require('../common');
const { SystemError, Constant } = common;
const { ERR_CODE } = Constant.ERR_CODE;
const { PROJECT_FIELD } = Constant.PROJECT_FIELD;

const {
  BOOK_CREATE,
  BOOK_UPDATE
} = PROJECT_FIELD.ACTION;

const {
  createBookSchema,
  updateBookSchema
} = common.Validator.BOOK_SCHEMA


class BookController extends Controller {

  constructor(ctx) {

    super(ctx);
    this.service = ctx.service;
    this.reqBody = ctx.request.body;

  }
  async upload () {

    const { ctx, service, reqBody } = this;

    ctx.logger.info('controller/book/upload, reqBody:', JSON.stringify(reqBody));

    const parts = ctx.multipart();

    const result = await service.book.uploadBook(parts);

    ctx.setSuccessBody(result, '上传成功');
  }

  async bookHandler () {

    const { ctx, service, reqBody } = this;

    ctx.logger.info('controller/bookHandler, reqBody', JSON.stringify(reqBody))

    const action = reqBody.action
    let book;

    switch (action) {
      case BOOK_CREATE:
        await createBookSchema.validateAsync(reqBody);
        book = await service.book.createBook(reqBody);
        break;
      case BOOK_UPDATE:
        await updateBookSchema.validateAsync(reqBody);
        await service.book.updateBook(reqBody);
        break;
      default:
        throw new SystemError({ code: ERR_CODE.INVALID_PARAM_ERR, message: 'no such action' })
    }

    if (book) {

      ctx.setSuccessBody(book)

    } else {

      ctx.setSuccessBody()

    }

  }

}

module.exports = BookController;
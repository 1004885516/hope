'use strict';


const Controller = require('egg').Controller;
const common = require('../common');
const { SystemError, Constant } = common;
const { ERR_CODE } = Constant.ERR_CODE;
const { PROJECT_FIELD } = Constant.PROJECT_FIELD;



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
}

module.exports = BookController;
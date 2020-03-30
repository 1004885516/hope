'use strict';

const Controller = require('egg').Controller;
const { SystemError } = require('../common');
const { ERR_CODE } = require('../common/constant').ERR_CODE;
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    throw new SystemError({code: ERR_CODE['PARAM_ERR'], message:'测试错误'});
    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;

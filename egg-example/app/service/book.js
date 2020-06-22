'use strict';


const Service = require('egg').Service;
const _ = require('lodash');
const Common = require('../common');
const util = require('../util')
const { SystemError, Constant } = Common;
const { ERR_CODE } = Constant.ERR_CODE;
const { PROJECT_FIELD } = Constant.PROJECT_FIELD;
const { PAGES, PAGE_SIZE } = PROJECT_FIELD.PUBLIC_PARAMS;
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

    ctx.logger.info(`createBook title:${reqBody.title}`);

    // 创建book对象
    const book = new Book(null, reqBody);
    let errorObj = null;
    let errorBody = null;
    const query = {
      title: reqBody.title,
      author: reqBody.author,
      publisher: reqBody.publisher
    }

    const bookData = await dao.book.getOneBook({ find: query });

    if (bookData) {

      // 如果电子书的书名，作者，出版社都相同，认为这本书存在，因此要移除资源服务器中本次上传的文件
      await book.reset()

      errorObj = { code: ERR_CODE.REPEAT_ACTION_ERR, message: '该书籍已添加，不可重复操作' };
      errorBody = new SystemError(errorObj);

      if (!errorBody) {
        errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
      }

      ctx.throw(errorBody);
    }

    // 为book对象添加user信息
    const user_id = ctx.user._id.toString();
    book.createUser = {
      username: ctx.user.name,
      user_id: user_id,
      roles: ctx.user.roles
    }

    // 写入书籍
    const result = await dao.book.addOneBook({ doc: book });

    // 写入书籍目录
    const contents = await book.getContents();
    const book_id = result._id.toString();
    const select = ['fileName', 'navId', 'label', 'href', 'pid', 'order', 'level', 'text'];

    contents.forEach(async (item) => {

      let catalogue = _.pick(item, select);
      catalogue.book_id = book_id;

      await this.service.dao.book.addOneCatalogue({ doc: catalogue })

    });
  }

  // 获取一条书籍信息
  async getOneBook (reqBody) {

    const { ctx, dao } = this;
    const { fileName } = reqBody;

    ctx.logger.info(`getOneBook fileName:${reqBody.fileName}`);

    // 获取书籍信息
    const book = await dao.book.getOneBook({ find: { fileName: fileName } });

    // 获取目录信息
    const query = {
      find: { fileName: fileName },
      sort: { order: 1 }
    }

    const catalogue = await dao.book.getCatalogueList(query)

    book.contentsTree = Book.getContentsTree(catalogue);

    return book;
  }

  // 更新书籍
  async updateBook (reqBody) {

    const { ctx, dao } = this;

    ctx.logger.info(`createBook title:${reqBody.title}`);

    const { fileName } = reqBody;
    let errorObj = null;
    let errorBody = null;

    // 查询电子书
    const bookData = await dao.book.getOneBook({ find: { fileName: fileName } });

    if (!bookData) {

      errorObj = { code: ERR_CODE.NO_DATA_ERR, message: '该书籍不存在' };
      errorBody = new SystemError(errorObj);

      if (!errorBody) {
        errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
      }

      ctx.throw(errorBody);
    }

    // 更新电子书
    const update = {
      $set: {
        title: reqBody.title,
        author: reqBody.author,
        publisher: reqBody.publisher,
        language: reqBody.language
      }
    };
    await dao.book.updateOneBook({ find: { fileName: fileName }, update: update });
  }

  // 获取书籍列表
  async getBookList (reqBody) {
    const { ctx, dao } = this;

    ctx.logger.info(`getBookList title:${reqBody}`);

    const { title, author, category, pages, pageSize } = reqBody;
    const find = {};
    if (title) {
      find.title = { $regex: title };
    }
    if (author) {
      find.author = { $regex: author };
    }
    if (category) {
      find.category = category;
    }

    const _pages = pages || PAGES;
    const _pageSize = pageSize || PAGE_SIZE;
    const query = {
      find: find,
      select: { '__v': 0 },
      $limit: _pageSize,
      $skip: (_pages - 1) * _pageSize
    };

    const bookList = await dao.book.getBookList(query);
    bookList.forEach(item => {
      item.createTime = util.Formit.dateFormat(item.createTime, "yyyy-MM-dd hh:mm:ss")
    })
    const bookCount = await dao.book.getBookCount({ find: find });
    const totalPage = Math.ceil(bookCount / _pageSize);
    const result = { total: bookCount, totalPage: totalPage, bookList: bookList };

    return result;
  }

  // 删除一本电子书
  async deleteOneBook (reqBody) {

    const { ctx, dao } = this;
    const { fileName } = reqBody;
    ctx.logger.info(`deleteOneBook fileName:${reqBody.fileName}`);

    // 获取电子书信息
    const bookData = await this.getOneBook(reqBody);

    if (!bookData) {

      errorObj = { code: ERR_CODE.NO_DATA_ERR, message: '该电子书不存在' };
      errorBody = new SystemError(errorObj);

      if (!errorBody) {
        errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
      }

      ctx.throw(errorBody);
    }

    // 删除书籍相关信息
    await dao.book.deleteOneBook({ find: { fileName: fileName } });

    // 删除书籍目录相关信息
    const book_id = bookData._id.toString();
    await dao.book.deleteCatalogue({ find: { book_id: book_id } });

    // 删除nginx资源文件
    const book = new Book(null, bookData);
    await book.reset();

  }
}

module.exports = BookService
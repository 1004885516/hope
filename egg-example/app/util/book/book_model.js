'use static'


const EPub = require('../epub')
// const EPub = require('epub');
const fs = require('fs');
const path = require('path');
const Common = require('../../common');
const { SystemError, Constant } = Common;
const { ERR_CODE } = Constant.ERR_CODE;
const { PROJECT_FIELD } = Constant.PROJECT_FIELD;
const { UPLOAD_PATH, UPLOAD_URL } = PROJECT_FIELD.PATH;

class Book {
  constructor(file, data) {

    if (file) {
      this.createBookFromFile(file)
    } else {
      this.createBookFromData(data)
    }

  }

  createBookFromFile (file) {
    console.log('file', file)
    const { filename, mimeType, _readableState } = file;
    const filePath = path.join(UPLOAD_PATH, `/book/${filename}`).replace(/\\/g, "/");

    this.filename = filename.split('.')[0];
    this.mimeType = mimeType;
    this.filePath = filePath

  }

  createBookFromData (data) {

  }

  async paras (ctx) {

    const bookPath = this.filePath;

    if (!fs.existsSync(bookPath)) {

      const errorObj = { code: ERR_CODE.UPLOAD_ERR, message: '电子书不存在' };
      let errorBody = new SystemError(errorObj);

      if (!errorBody) {
        errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
      }

      ctx.throw(errorBody);
    }

    const epub = new EPub(bookPath)

    epub.on('error', err => {

      if (err) {

        const errorObj = { code: ERR_CODE.PARSE_ERR, message: '电子书解析失败' };
        let errorBody = new SystemError(errorObj);

        if (!errorBody) {
          errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
        }

        ctx.throw(errorBody);

      }

    })

    epub.on('end', err => {

      if (err) {
        ctx.throw(err)
      } else {
        console.log('metadata', epub.metadata)
      }

    })

    epub.parse();

  }
}

module.exports = Book;
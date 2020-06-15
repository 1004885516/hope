'use static'


const EPub = require('../epub')
const AdmZip = require('adm-zip');
const { parseString } = require('xml2js');
const fs = require('fs');
const path = require('path');
const Common = require('../../common');
const { SystemError, Constant } = Common;
const { ERR_CODE } = Constant.ERR_CODE;
const { PROJECT_FIELD } = Constant.PROJECT_FIELD;
const { UPLOAD_PATH, UPLOAD_URL } = PROJECT_FIELD.PATH;
const { MIME_TYPE_EPUB } = PROJECT_FIELD.BOOK;
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

    const { filename, mimeType, _readableState } = file;;
    const newfilename = filename.split('.')[0];
    const filePath = path.join(UPLOAD_PATH, `/book/${filename}`).replace(/\\/g, "/");
    // const suffix = mimeType === MIME_TYPE_EPUB ? '.epub' : '';
    const url = `${UPLOAD_URL}/book/${filename}`;
    const unzipPath = `${UPLOAD_PATH}/unzip/${newfilename}`;
    const unzipUrl = `${UPLOAD_URL}/unzip/${newfilename}`;

    if (!fs.existsSync(unzipPath)) {
      fs.mkdirSync(unzipPath, { recursive: true }) // 创建电子书解压后的目录
    }

    this.filename = newfilename;
    this.path = `/book/${filename}`
    this.mimeType = mimeType;
    this.filePath = filePath;
    this.url = url;
    this.title = '' // 标题
    this.author = '' // 作者
    this.publisher = '' // 出版社
    this.contents = [] // 目录
    this.cover = '' // 封面图片URL
    this.coverPath = '' // 封面图片路径
    this.category = -1 // 分类ID
    this.categoryText = '' // 分类名称
    this.language = '' // 语种
    this.unzipPath = `/unzip/${newfilename}` // 解压后的电子书目录
    this.unzipUrl = unzipUrl // 解压后的电子书链接
    this.originalName = file.originalname
  }

  createBookFromData (data) {

  }

  async paras (ctx) {

    const bookPath = this.filePath;
    // console.log('bookPath', bookPath)
    if (!fs.existsSync(bookPath)) {

      const errorObj = { code: ERR_CODE.UPLOAD_ERR, message: '电子书不存在' };
      let errorBody = new SystemError(errorObj);

      if (!errorBody) {
        errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
      }

      ctx.throw(errorBody);
    }

    await new Promise((resolve, reject) => {

      const epub = new EPub(bookPath)

      epub.on('error', err => {

        reject(err)

      })

      epub.on('end', err => {

        if (err) {
          reject(err)
        } else {

          const {
            creator,
            creatorFileAs,
            title,
            language,
            cover,
            publisher
          } = epub.metadata

          if (!title) {

            const errorObj = { code: ERR_CODE.PARSE_ERR, message: '图书标题为空' };
            let errorBody = new SystemError(errorObj);

            if (!errorBody) {
              errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
            }

            ctx.throw(errorBody);

          } else {

            this.title = title
            this.language = language || 'en'
            this.author = creator || creatorFileAs || 'unknown'
            this.publisher = publisher || 'unknown'
            this.rootFile = epub.rootFile

            try {

              this.unzip(this.path)

              this.parseContents(ctx, epub)

              const handleGetImage = (err, file, mimeType) => {
                if (err) {
                  reject(err)
                } else {
                  const suffix = mimeType.split('/')[1];
                  const coverPath = `${UPLOAD_PATH}/img/${this.filename}.${suffix}`; // 封面图片路径
                  const coverUrl = `${UPLOAD_URL}/img/${this.filename}.${suffix}`;   // 封面图片url
                  fs.writeFileSync(coverPath, file, 'binary')
                  this.coverPath = `/img/${this.filename}.${suffix}`
                  this.cover = coverUrl
                  resolve()
                }
              }
              epub.getImage(cover, handleGetImage)

            } catch (err) {
              reject(err)
            }

          }
        }

      })

      epub.parse();
    })
  }

  unzip () {

    const zip = new AdmZip(Book.genPath(this.path));

    // 解压文件，并放到指定目录下
    zip.extractAllTo(Book.genPath(this.unzipPath), true)

  }

  parseContents (ctx, epub) {

    // 获取电子书中的ncx文件路径
    function getNcxFilePath () {
      const spine = epub && epub.spine;
      const manifest = epub && epub.manifest;
      const ncx = spine.toc && spine.toc.href
      const toc_id = spine.toc && spine.toc.id;
      if (ncx) {
        return ncx;
      } else {
        return manifest[toc_id].href
      }
    }

    // 为目录每一级添加level和pid属性,处理成树状结构
    function findParent (arr, level = 0, pid = '') {
      return arr.map(item => {
        item.level = level;
        item.pid = pid;
        if (item.navPoint && item.navPoint.length > 0) {
          item.navPoint = findParent(item.navPoint, level + 1, pid = item.$.id)
        } else if (item.navPoint) {
          item.navPoint.level = level + 1;
          item.navPoint.pid = item.$.id
        }
        return item
      })
    }

    // 多维数组扁平化
    function flatten (arr) {
      return [].concat(...arr.map(item => {
        if (item.navPoint && item.navPoint.length > 0) {
          return [].concat(item, ...flatten(item.navPoint))
        } else if (item.navPoint) {
          return [].concat(item, item.navPoint)
        }
        return item
      }))
    }

    const ncxFilePath = Book.genPath(`${this.unzipPath}/${getNcxFilePath()}`)
    const fileName = this.filename;
    if (fs.existsSync(ncxFilePath)) {

      // 解析xml书籍目录
      return new Promise((resolve, reject) => {

        const xml = fs.readFileSync(ncxFilePath, 'utf-8');
        parseString(xml, {
          explicitArray: false,
          ignoreAttrs: false
        }, function (err, json) {
          if (err) {
            reject(err)
          } else {

            const navMap = json.ncx.navMap;
            if (navMap.navPoint && navMap.navPoint.length > 0) {

              navMap.navPoint = findParent(navMap.navPoint);
              // console.log('navMap.navPoint', navMap.navPoint)
              const newNavMap = flatten(navMap.navPoint);
              const chapters = [];
              epub.flow.forEach((chapter, index) => {

                if (index + 1 > newNavMap.length) {
                  return
                }

                const nav = newNavMap[index];
                chapter.text = `${UPLOAD_URL}/unzip/${fileName}/${chapter.href}`;

                if (nav && nav.navLabel) {
                  chapter.label = nav.navLabel.text || '';
                } else {
                  chapter.label = '';
                }

                chapter.level = nav.level;
                chapter.pid = nav.pid;
                chapter.navid = nav['$'].id;
                chapter.filename = fileName;
                chapter.order = index + 1;
                chapters.push(chapter)

              });
              console.log('chapters', chapters)
            } else {

              reject(new Error('解析失败，电子书目录为空'))

            }

          }
        })

      })
    } else {

      const errorObj = { code: ERR_CODE.PARSE_ERR, message: '目录文件不存在' };
      let errorBody = new SystemError(errorObj);

      if (!errorBody) {
        errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
      }

      ctx.throw(errorBody);

    }
  }

  static genPath (path) {

    // 检查字符串是否以/开头
    if (!path.startsWith('/')) {
      path = `/${path}`
    }

    return `${UPLOAD_PATH}${path}`

  }

}

module.exports = Book;
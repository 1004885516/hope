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

  // 根据上传电子书信息，初始化book对象
  createBookFromFile (file) {

    const { filename, mimeType, _readableState } = file;;
    const newfilename = filename.split('.')[0];
    const filePath = path.join(UPLOAD_PATH, `/book/${filename}`).replace(/\\/g, "/");
    const url = `${UPLOAD_URL}/book/${filename}`;
    const unzipPath = `${UPLOAD_PATH}/unzip/${newfilename}`;
    const unzipUrl = `${UPLOAD_URL}/unzip/${newfilename}`;

    if (!fs.existsSync(unzipPath)) {
      fs.mkdirSync(unzipPath, { recursive: true }) // 创建电子书解压后的目录
    }

    this.fileName = newfilename;
    this.path = `/book/${filename}`
    this.mimeType = mimeType;
    this.filePath = filePath;
    this.url = url;
    this.title = '' // 标题
    this.author = '' // 作者
    this.publisher = '' // 出版社
    this.contents = [] // 目录
    this.contentsTree = [] // 目录树
    this.cover = '' // 封面图片URL
    this.coverPath = '' // 封面图片路径
    this.category = -1 // 分类ID
    this.categoryText = '' // 分类名称
    this.language = '' // 语种
    this.unzipPath = `/unzip/${newfilename}` // 解压后的电子书目录
    this.unzipUrl = unzipUrl // 解压后的电子书链接
    this.originalName = filename //电子书原始文件名
  }
  // 根据表单提交信息，填充book对象，用于存入数据库
  createBookFromData (data) {
    this.fileName = data.fileName
    this.url = data.url
    this.path = data.path
    this.cover = data.cover
    this.title = data.title
    this.author = data.author
    this.publisher = data.publisher
    this.language = data.language
    this.rootFile = data.rootFile
    this.originalName = data.originalName
    this.filePath = data.path || data.filePath
    this.unzipPath = data.unzipPath
    this.coverPath = data.coverPath
    this.createUser = data.user
    this.contents = data.contents
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

    await new Promise((resolve, reject) => {

      const epub = new EPub(bookPath)

      epub.on('error', err => {

        reject(err)

      })

      epub.on('end', async err => {

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
              // 解压文件
              this.unzip(this.path)

              const { chapters, chaptersTree } = await this.parseContents(ctx, epub)
              this.contents = chapters;
              this.contentsTree = chaptersTree;

              const handleGetImage = (err, file, mimeType) => {
                if (err) {
                  reject(err)
                } else {
                  const suffix = mimeType.split('/')[1];
                  const coverPath = `${UPLOAD_PATH}/img/${this.fileName}.${suffix}`; // 封面图片路径
                  const coverUrl = `${UPLOAD_URL}/img/${this.fileName}.${suffix}`;   // 封面图片url
                  fs.writeFileSync(coverPath, file, 'binary')
                  this.coverPath = `/img/${this.fileName}.${suffix}`
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


  // 解析电子书目录
  async parseContents (ctx, epub) {

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

          item.navPoint = findParent(item.navPoint, level + 1, item.$.id) // 此处要特别注意，参数赋值 item.$.id如果为 pid = item.$.id 会覆盖findParent的默认值，导致后面一系列的树状结构处理出大问题

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
    const fileName = this.fileName;

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

              // 调用处理树状结构函数，返回包含level和pid属性的新数组，pid用来在前端展示树状层级
              navMap.navPoint = findParent(navMap.navPoint);

              // 多维数组扁平化处理
              const newNavMap = flatten(navMap.navPoint);
              const chapters = [];
              newNavMap.forEach((chapter, index) => {
                const src = chapter.content['$'].src;
                const dir = path.dirname(ncxFilePath).replace(UPLOAD_PATH, '')
                chapter.href = `${dir}/${src}`
                chapter.text = `${UPLOAD_URL}${dir}/${src}`;
                chapter.label = chapter.navLabel.text || '';
                chapter.pid = chapter.pid;
                chapter.navId = chapter['$'].id;
                chapter.filename = fileName;
                chapter.order = index + 1;
                chapters.push(chapter)

              });

              const chaptersTree = [];

              chapters.forEach(item => {

                if (!item.pid) {

                  chaptersTree.push(item);

                } else {

                  const parent = chapters.find(item2 => {
                    return item.pid === item2.navId
                  })

                  if (!parent.children) {

                    parent.children = [item]

                  } else {

                    parent.children.push(item)

                  }

                }
              })

              resolve({ chapters, chaptersTree })
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

  // 处理路径，避免误传
  static genPath (path) {
    // 检查字符串是否以/开头
    if (!path.startsWith('/')) {
      path = `/${path}`
    }

    return `${UPLOAD_PATH}${path}`

  }

  // 获取目录对象
  async getContents () {
    return this.contents
  }
}

module.exports = Book;
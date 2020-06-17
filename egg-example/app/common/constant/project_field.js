'use strict';


const { env } = require('./env')
const upload_path = env === 'env' ? 'D:/nginx/nginxServer/static' : 'root/upload/book';
const upload_url = env === 'env' ? 'http://127.0.0.1:8089' : ''

exports.PROJECT_FIELD = {

  ACTION: {
    USER_UPDATE: 'user_update',
    USER_DELETE: 'user_delete',
    GET_ONE_USER: 'get_one_user',
    GET_USER_LIST: 'get_user_list',
    BOOK_CREATE: 'create_book',
    BOOK_UPDATE: 'update_book'
  },

  DB_PARAMS: {
    LIMIT: 10,
    PAGE: 1
  },
  PATH: {
    UPLOAD_PATH: upload_path,
    UPLOAD_URL: upload_url
  },
  BOOK: {
    MIME_TYPE_EPUB: 'application/epub+zip'
  }
};

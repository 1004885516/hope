'use strict';


const env = process.env.NODE_ENV;
const upload_path = env === 'env' ? 'D:/nginx/nginxServer/static' : '/root/nginx/upload';
const upload_url = env === 'env' ? 'http://127.0.0.1:8089' : '60.205.191.215'

exports.PROJECT_FIELD = {

  ACTION: {
    USER_UPDATE: 'user_update',
    USER_DELETE: 'user_delete',
    GET_ONE_USER: 'get_one_user',
    GET_USER_LIST: 'get_user_list',
    BOOK_CREATE: 'create_book',
    GET_ONE_BOOK: 'get_one_book',
    UPDATE_ONE_BOOK: 'update_one_book',
    GET_LIST_BOOK: 'get_list_book',
    DELETE_ONE_BOOK: 'delete_one_book'
  },

  PUBLIC_PARAMS: {
    PAGES: 1,
    PAGE_SIZE: 10
  },
  PATH: {
    UPLOAD_PATH: upload_path,
    UPLOAD_URL: upload_url
  },
  BOOK: {
    MIME_TYPE_EPUB: 'application/epub+zip'
  }
};

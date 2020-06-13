'use strict';


const ERR_CODE = {
  'SUCCESS': 'SUCCESS',                         // 处理成功
  'INVALID_PARAM_ERR': 'INVALID_PARAM_ERR',     // 参数错误
  'NO_DATA_ERR': 'NO_DATA_ERR',                 // 无数据返回
  'SERVER_ERR': 'SERVER_ERR',                   // 服务器异常
  'PORT_ERR': 'PORT_ERR',                       // 接口异常
  'REPEAT_ACTION_ERR': 'REPEAT_ACTION_ERR',     // 重复操作
  'TOKEN_ERR': 'TOKEN_ERR',                     // token 异常
  'UPLOAD_ERR': 'UPLOAD_ERR',                   // 文件上传失败
  'PARSE_ERR': 'PARSE_ERR',                     // 解析失败
};

module.exports = {
  ERR_CODE
};

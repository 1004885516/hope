/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.mongoose = {
    // url: 'mongodb://47.92.118.197:27017/admin',
    url: 'mongodb://admin_1:root123@60.205.191.215:27017/admin',
    options: {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0,
      useUnifiedTopology: true
    },
  };

  config.cors = {
    origin: 'http://60.205.191.215:9527',  // vue axios发送请求携带cookie时，此处不允许为通配符 *
    // origin:'*',
    allowMethods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH',
    credentials: true // 允许客户端发送cookie
  };
  return {
    ...config
  };
};

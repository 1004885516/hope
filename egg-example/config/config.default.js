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

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1585549437569_2969';

  // add your middleware config here
  config.middleware = ['errorHandler'];

  config.logger = {
    appLogName: `${appInfo.name}-web.log`,
  };

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/DB01',
    options: {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0,
      useUnifiedTopology: true
    },
  };

  config.cors = {
    origin: 'http://localhost:9527',  // vue axios发送请求携带cookie时，此处不允许为通配符 *
    // origin:'*',
    allowMethods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH',
    credentials: true // 允许客户端发送cookie
  };

  // 解除安全验证，保证post请求对接口可以正常访问
  config.security = {
    csrf: {
      enable: false,
    }
  };

  // 允许任何IP访问
  config.cluster = {
    listen: {
      hostname: '0.0.0.0',
      port: 7001,
    }
  };

  // 为每一次请求添加tracerId，方便追踪接口问题
  config.tracer = {
    Class: require('../app/common/tracer')
  };

  // 用于生成token
  config.secret_keys = {
    usersecret: 'usersecret'
  };

  // session基础配置
  config.session = {
    key: 'session_key',
    maxAge: 24 * 3600 * 1000, // 1天
    httpOnly: true,
    encrypt: true,
    renew: true, // 每次访问都会给session延长时间
  }

  // multipart 扩展白名单配置支持.epub文件
  config.multipart = {
    mode: 'stream',
    fileExtensions: ['.epub']
  };

  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};

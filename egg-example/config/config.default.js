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
    // url: 'mongodb://47.92.118.197:27017/subject',
    url: 'mongodb://127.0.0.1:27017/DB01',
    options: {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0,
    },
  };

  config.cors = {
    origin:'*',
    allowMethods:'GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH'
  };

  // 解除安全验证，保证post请求对接口可以正常访问
  config.security = {
    csrf:{
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

  config.secret_keys = {
    usersecret: 'usersecret'
  };

  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};

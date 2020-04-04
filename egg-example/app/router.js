'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller} = app;
  router.post('/getAllEstate', controller.user.getAllEstate);   // 获取全量小区
};

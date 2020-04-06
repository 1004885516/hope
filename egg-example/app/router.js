'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const { user } = controller;
  router.post('/user/api', user.userHandler);
};

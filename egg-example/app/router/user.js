'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const getValidator = middleware.verifyUser.getValidator
  const verifyUser = getValidator('verifyUser');
  const { user } = controller;
  router.post('/createuser/api', user.createUser);
  router.post('/login/api', user.login);
  router.post('/user/api', verifyUser, user.userHandler);
};

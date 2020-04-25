'use strict';


/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  
  const { router, controller, middleware } = app;
  const { user } = controller;
  const { getValidator } = middleware.verifyUser;
  const verifyUser = getValidator('verifyUser');

  router.post('/createuser/api', user.createUser);
  router.post('/login/api', user.login);
  router.post('/user/api', verifyUser, user.userHandler);
};

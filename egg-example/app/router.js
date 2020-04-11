'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const getValidator = middleware.varifyParam.getValidator
  const varifyParam = getValidator('reqUserBodyValidator')
  const { user } = controller;
  
  router.post('/user/api', varifyParam, user.userHandler);
};

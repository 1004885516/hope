/**
 * 书籍相关接口
 */

module.exports = app => {

  const { router, controller, middleware } = app;
  const { book } = controller;
  const { getValidator } = middleware.verifyUser;
  const verifyUser = getValidator('verifyUser');

  router.post('/book/upload', verifyUser, book.upload);
  router.post('/book/api', verifyUser, book.bookHandler)
}
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, controller,jwt } = app;//解构的写法 获得变量

  router.get('/', controller.worker.index); //测试使用路由 普通路由 不需要验证token
  router.get('/list', controller.worker.list); //测试使用路由 普通路由 不需要验证token
  router.post('/login', controller.worker.login);//该路由登录并生成token 生成token的代码写在controller的该方法里  想要使用多个controller的形式报错了 以后再解决 目前只能使用一个controller
  router.get('/getworkerbasedata',jwt,controller.worker.getworkerbasedata) //
  router.get('/testtoken', jwt, controller.worker.testtoken); //测试使用的路由,加上jwt后 访问后端的请求必须带token才能访问
  // 上传头像
  router.post('/uploadavatar', controller.worker.uploadAvatar);
  // 获取头像
  router.get('/getavatar', controller.worker.getAvatar);

};

'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, controller,jwt } = app;//解构的写法 获得变量

  router.get('/', controller.worker.index); //测试使用路由 普通路由 不需要验证token
  router.get('/list', controller.worker.list); //测试使用路由 普通路由 不需要验证token
  router.post('/login', controller.worker.login);//该路由登录并生成token 生成token的代码写在controller的该方法里  想要使用多个controller的形式报错了 以后再解决 目前只能使用一个controller
  router.get('/getworkerbasedata',controller.worker.getworkerbasedata) //
  router.get('/testtoken', jwt, controller.worker.testtoken); //测试使用的路由,加上jwt后 访问后端的请求必须带token才能访问
  // 上传头像
  router.post('/uploadavatar', controller.worker.uploadAvatar);
  // 获取头像
  router.get('/getavatar', controller.worker.getAvatar);
  //=============================================================================
  router.post('/updateworkerbasedatabyuserid', controller.worker.updateworkerbasedatabyuserid);
  router.post('/updatetablehis1byuserid', controller.worker.updatetablehis1byuserid);//更新tablehis1表格数据的路由
  router.get('/gettablehis1', controller.worker.gettablehis1);
  router.post('/updatetablehis2byuserid', controller.worker.updatetablehis2byuserid);//更新tablehis2表格数据的路由
  router.get('/gettablehis2', controller.worker.gettablehis2); 
  router.post('/updatetablehis3byuserid', controller.worker.updatetablehis3byuserid);//更新tablehis3表格数据的路由
  router.get('/gettablehis3', controller.worker.gettablehis3);  
  //==================================================================
  router.get('/changeuserisfirstlogin', controller.worker.changeuserisfirstlogin);  
  //=====================================
  router.get('/getuserdataforangongselect', controller.worker.getuserdataforangongselect);//根据登录账号的区域zone获取数据库user表数据
};

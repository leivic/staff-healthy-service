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
  config.keys = appInfo.name + '_1648864765999_3925';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    uploadAvatarDir: '/Users/luoyibu/piccc', // 上传头像路径
  };
  config.multipart = {
    mode:'file'
  };

  config.mysql = {
    // database configuration
    client: {
      // host
      host: 'localhost',
      // port
      port: '3307',
      // username
      user: 'root',
      // password
      password: '',
      // database
      database: 'staff_healthy',    
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };
  config.security = { //egg自带的安全拦截器 默认开启 除非配置false  开启后如post请求如不带token则拒绝访问
    csrf: {
      enable: false
    },
  }

  config.cors = {
    origin: 'http://localhost:3000',//前端服务路径
    credentials: true,//解决跨域问题
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  
  config.jwt = {
    secret: '123456',	//自定义token的加密条件字符串，可按各自的需求填写
  };
  
  return {
    ...config,
    ...userConfig,
  };
};

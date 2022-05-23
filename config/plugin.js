'use strict';

/** @type Egg.EggPlugin */
exports.mysql = { //连接mysql使用的插件
  enable: true,
  package: 'egg-mysql'
}

exports.cors = { //请求跨域处理的插件
  enable: true,
  package: 'egg-cors'
}

exports.jwt = { //登录鉴权 token使用的插件
  enable: true,
  package: 'egg-jwt',
};

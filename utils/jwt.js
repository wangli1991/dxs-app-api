/*
 * @Author: wangli
 * @Date: 2020-07-19 16:35:22
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-10 11:26:02
 */
const expressJwt = require("express-jwt");

// jwt 配置信息
const config = {
  PRIVATE_KEY: "jwt",
  JWT_EXPIRED: 5 * 60 * 60, // token失效时间 单位：秒 以秒表示或描述时间跨度zeit / ms的字符串。如60，"2 days"，"10h"，"7d"
};
//jwt 中间件
const auth = expressJwt({
  secret: config.PRIVATE_KEY, //加密密钥
  algorithms: ["HS256"],
  credentialsRequired: true, // 设置为false就不进行校验了，游客也可以访问
}).unless({
  path: ["/user/wxLogin"], // 设置 jwt 认证白名单
});

module.exports = {
  config,
  auth,
};

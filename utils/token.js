/*
 * @Author: WangLi
 * @Date: 2021-04-12 11:21:31
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-03 15:18:20
 */
const jwt = require("jsonwebtoken");
const { config } = require("./jwt");

/**
 * 创建token
 * @param {type}
 * @return: {String}
 */
function creatToken(payload) {
  const token = jwt.sign(payload, config.PRIVATE_KEY, {
    expiresIn: config.JWT_EXPIRED,
  });
  return token;
}

/**
 * 校验token
 * @param {type}
 * @return: {Boolen}
 */
function verifyToken(req) {
  const authorization = req.get("Authorization");
  let token = authorization;
  if (authorization.indexOf("Bearer") >= 0) {
    token = authorization.replace("Bearer ", "");
  }
  return jwt.verify(token, config.PRIVATE_KEY);
}
module.exports = {
  creatToken,
  verifyToken,
};

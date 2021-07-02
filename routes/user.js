/*
 * @Author: wangli
 * @Date: 2020-06-14 17:40:23
 * @Last Modified by: wangli
 * @Last Modified time: 2020-07-10 18:29:59
 */
const express = require("express");
const router = express.Router();
const {
  getUserInfo,
  wxLogin,
  setReceiver,
  getReceiver,
} = require("../controller/user");
const { creatToken } = require("../utils/token");
const { SuccessModel, ErrorModel } = require("../model/resModel");
// 微信登录接口
router.post("/wxLogin", function (req, res, next) {
  const { code } = req.body;
  const result = wxLogin(code);
  return result.then((data) => {
    if (data) {
      data = JSON.parse(data);
      const token = creatToken(data);
      req.session.jwt = token;
      res.json(
        new SuccessModel({
          token: token,
          openid: data.openid,
        })
      );
    } else {
      res.json(new ErrorModel([], "获取用户信息失败", data.code));
    }
  });
});

//设置默认提货人信息
router.post("/receiver/creat", function (req, res, next) {
  const result = setReceiver(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel(""));
    }
  });
});

//获取默认提货人信息
router.get("/receiver/info", function (req, res, next) {
  const { userId } = req.query;
  const result = getReceiver(userId);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel(""));
    }
  });
});

router.post("/info", function (req, res, next) {
  const result = getUserInfo(req.session.jwt);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel(""));
    }
  });
});
module.exports = router;

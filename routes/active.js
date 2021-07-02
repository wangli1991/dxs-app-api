/*
 * @Author: WangLi
 * @Date: 2021-04-12 13:25:31
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-28 16:12:25
 */
const express = require("express");
const router = express.Router();
const { creatActive, getActiveList } = require("../controller/active");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// 添加限时抢购
router.post("/creat", function (req, res, next) {
  const result = creatActive();
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("创建活动列表失败！"));
    }
  });
});
// 限时抢购
router.post("/list", function (req, res, next) {
  const result = getActiveList();
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("获取活动列表失败！"));
    }
  });
});
module.exports = router;

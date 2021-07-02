/*
 * @Author: 王利
 * @Date: 2020-08-05 10:22:27
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-28 06:39:05
 */
const express = require("express");
const router = express.Router();
const { getRollList, getBannerList } = require("../controller/sys");
const { SuccessModel, ErrorModel } = require("../model/resModel");

//首页banner
router.post("/banner", function (req, res, next) {
  const result = getBannerList();
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("获取数据失败！"));
    }
  });
});

module.exports = router;

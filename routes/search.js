/*
 * @Author: WangLi
 * @Date: 2021-05-26 11:26:41
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-27 09:03:22
 */
const express = require("express");
const router = express.Router();
const {
  creatSearch,
  clearSearch,
  getSearchList,
  getHotSearchList,
} = require("../controller/search");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// 保存搜索历史数据
router.post("/history/creat", function (req, res, next) {
  const result = creatSearch(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("保存搜索历史失败！"));
    }
  });
});

//清空搜索历史数据
router.post("/history/clear", function (req, res, next) {
  const result = clearSearch(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("清空搜索历史失败！"));
    }
  });
});

// 获取搜索历史数据
router.post("/history/list", function (req, res, next) {
  const result = getSearchList(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("获取搜索历史失败！"));
    }
  });
});

// 获取热门搜索数据
router.post("/hot/list", function (req, res, next) {
  const result = getHotSearchList();
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("获取热门搜索失败！"));
    }
  });
});

module.exports = router;

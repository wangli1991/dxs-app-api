/*
 * @Author: WangLi
 * @Date: 2021-04-29 08:15:16
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-20 06:01:12
 */
const express = require("express");
const router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const {
  getPlaceList,
  creatOrder,
  getOrderList,
  getOrderInfo,
} = require("../controller/order");
const { setReceiver } = require("../controller/user");
//查询下单列表
router.post("/placeList", function (req, res, next) {
  const result = getPlaceList(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("获取订单列表失败！"));
    }
  });
});

//下单
router.post("/creat", function (req, res, next) {
  const { list, userId } = req.body;
  const ids = list.map((x) => x.cart_id);
  const result = creatOrder(req.body);
  setReceiver(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("创建订单失败！"));
    }
  });
});

//查询订单列表
router.post("/list", function (req, res, next) {
  const result = getOrderList(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("获取订单列表失败！"));
    }
  });
});

//查询订单详情
router.post("/info", function (req, res, next) {
  const result = getOrderInfo(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("获取订单详情失败！"));
    }
  });
});
module.exports = router;

/*
 * @Author: WangLi
 * @Date: 2021-04-13 19:21:20
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-17 16:06:24
 */
const express = require("express");
const router = express.Router();
const {
  creatCart,
  updateCart,
  deleteCart,
  getCartList,
  getCartCount,
  getProductCartCount,
} = require("../controller/cart");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// 添加购物车
router.post("/creat", function (req, res, next) {
  const result = creatCart(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("添加购物车失败！"));
    }
  });
});
// 更新购物车
router.post("/update", function (req, res, next) {
  const result = updateCart(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("添加购物车失败！"));
    }
  });
});
// 更新购物车
router.post("/delete", function (req, res, next) {
  const result = deleteCart(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("添加购物车失败！"));
    }
  });
});

//查询购物车
router.post("/list", function (req, res, next) {
  const result = getCartList(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("获取购物车列表失败！"));
    }
  });
});

//查询购物车数量
router.post("/count", function (req, res, next) {
  const result = getCartCount(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("获取购物车数量失败！"));
    }
  });
});

//查询商品详情购物车数量
router.post("/product/count", function (req, res, next) {
  const result = getProductCartCount(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("获取购物车数量失败！"));
    }
  });
});
module.exports = router;

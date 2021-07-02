/*
 * @Author: WangLi
 * @Date: 2021-04-29 08:14:19
 * @LastEditors: WangLi
 * @LastEditTime: 2021-07-02 20:15:51
 */
const { exec } = require("../db/mysql");
const { transformDate, getPayDate } = require("../utils/utils");
const getPlaceList = async (params) => {
  const { userId, ids, type } = params;
  let sql;
  if (type === "cart") {
    const idArr = ids.split(",");
    sql = `SELECT a.*,a.id AS cart_id,b.name,b.brand,b.specs,b.unit,b.full_reduction_cost,b.full_reduction_count,b.full_reduction_price,b.main_picture,b.activity_type,b.activity_start_time,b.activity_end_time,b.sales_status,b.stock,b.sales_price AS product_sales_price,b.market_price AS product_market_price FROM tbl_cart a INNER JOIN tbl_product b ON (a.product_id = b.id) WHERE a.id IN (${idArr}) AND a.uid='${userId}'`;
  } else {
    sql = `SELECT *,sales_price AS product_sales_price,market_price AS product_market_price,1 AS count FROM tbl_product WHERE id=${ids}`;
  }
  const res = await exec(sql);
  if (res) {
    const resData = res.map((x) => {
      delete x.creat_user;
      return x;
    });
    return { list: resData, count: resData.length };
  }
  return false;
};

const creatOrder = async (params) => {
  const no = "dxs" + Date.now();
  const {
    orderUser,
    list,
    location,
    userId,
    payStatus,
    type,
    couponCost,
    discountCost,
  } = params;
  const payEndTime = getPayDate();
  let promiseExec = [];
  let sumCost = 0;
  list.forEach((x) => {
    sumCost += x.count * x.sales_price;
  });
  const payCost = sumCost - Number(couponCost) - Number(discountCost);
  const insertSql = `INSERT INTO tbl_order (order_no,uid,receiver,receiver_tel,receive_lat,receive_lon,status,pay_end_time,sum_cost, pay_cost, coupon_cost, discount_cost) VALUES ('${no}','${userId}','${
    orderUser.name
  }','${orderUser.phone}','${location.latitude}','${location.longitude}',${
    payStatus ? 1 : 0
  },'${payEndTime}',${sumCost},${payCost},${couponCost},${discountCost})`;

  const insertRes = await exec(insertSql);
  if (insertRes) {
    list.forEach((x) => {
      const productId = type === "cart" ? x.product_id : x.id;
      const subInsertSql = `INSERT INTO tbl_suborder (parent_id,parent_order_no,uid,product_id,count,market_price,sales_price) VALUES (${insertRes.insertId},'${no}','${userId}',${productId},${x.count},${x.market_price},${x.sales_price})`;
      promiseExec.push(exec(subInsertSql));
    });
    if (type === "cart") {
      const ids = list.map((x) => x.id);
      const deleteSql = `DELETE FROM tbl_cart WHERE id IN (${ids}) AND uid='${userId}'`;
      promiseExec.push(exec(deleteSql));
    }
    const result = await Promise.all(promiseExec);
    if (result) {
      return true;
    }
  }
  return false;
};

const getOrderList = async (params) => {
  const { userId, status, currentPage, pageSize } = params;
  const startCount = (currentPage - 1) * pageSize;
  let countSql = `SELECT COUNT(*) as TOTAL FROM tbl_order WHERE uid='${userId}'`;
  let sql = `SELECT * FROM tbl_order WHERE uid='${userId}'`;
  if (status) {
    countSql += `AND status=${status}`;
    sql += `AND status=${status}`;
  }
  sql += ` ORDER BY creat_time DESC LIMIT ${startCount},${pageSize}`;
  let promiseExec = [];
  const countData = await exec(countSql);

  if (countData) {
    let count = 0,
      resData = [];
    const total = countData[0].TOTAL;
    const res = await exec(sql);
    if (res) {
      resData = res.map((x) => {
        delete x.creat_user;
        return x;
      });
      count = resData.length;
      if (count) {
        resData.forEach((x) => {
          x.creat_time = transformDate(x.creat_time);
          x.update_time = transformDate(x.update_time);
          x.pay_end_time = transformDate(x.pay_end_time);
          let subSql = `SELECT a.*,b.name,b.brand,b.specs,b.unit,b.full_reduction_cost,b.full_reduction_count,b.full_reduction_price,b.main_picture,b.activity_type,b.activity_start_time,b.activity_end_time,b.sales_status,b.stock,b.sales_price AS product_sales_price,b.market_price AS product_market_price FROM tbl_suborder a INNER JOIN tbl_product b ON (a.product_id = b.id) WHERE parent_id='${x.id}'`;
          promiseExec.push(exec(subSql));
        });
        const subData = await Promise.all(promiseExec);
        resData.forEach((x, i) => {
          let sumCount = 0;
          subData[i].forEach((y, i) => {
            y.creat_time = transformDate(y.creat_time);
            y.update_time = transformDate(y.update_time);
            sumCount++;
          });
          const childData = subData[i];
          x.children = childData;
          x.count = sumCount;
        });
      }
    }
    return { list: resData, count, total };
  }
  return false;
};

const getOrderInfo = async (params) => {
  const { orderId } = params;
  const mainSql = `SELECT * FROM tbl_order  WHERE id=${orderId}`;
  const subSql = `SELECT a.*,FORMAT(SUM(a.count * a.sales_price),2) AS sum_price,b.name,b.full_reduction_cost,b.full_reduction_count,b.full_reduction_price,b.main_picture,b.activity_type,b.activity_start_time,b.activity_end_time,b.sales_status,b.stock,b.sales_price AS product_sales_price,b.market_price AS product_market_price FROM tbl_suborder a INNER JOIN tbl_product b ON (a.product_id = b.id) WHERE parent_id=${orderId} 
  GROUP BY a.id`;
  const res = await Promise.all([exec(mainSql), exec(subSql)]);
  if (res) {
    let resData = res[0][0];
    resData.children = res[1];
    resData.creat_time = transformDate(resData.creat_time);
    resData.update_time = transformDate(resData.update_time);
    resData.pay_end_time = transformDate(resData.pay_end_time);
    return resData;
  }
  return false;
};
module.exports = {
  getPlaceList,
  creatOrder,
  getOrderList,
  getOrderInfo,
};

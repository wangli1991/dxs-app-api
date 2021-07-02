/*
 * @Author: WangLi
 * @Date: 2021-04-13 19:21:36
 * @LastEditors: WangLi
 * @LastEditTime: 2021-07-02 20:18:18
 */
const { exec } = require("../db/mysql");
const creatCart = async (params) => {
  const { productId, addCount, userId } = params;
  const countSql = `SELECT COUNT(*) as TOTAL FROM tbl_cart WHERE product_id=${productId} AND uid='${userId}'`;
  const productSql = `SELECT * FROM tbl_product where id=${productId}`;
  const countData = await exec(countSql);
  if (countData) {
    const total = countData[0].TOTAL;
    if (total === 0) {
      //新增
      const productData = await exec(productSql);
      if (productData && productData.length) {
        const { id, market_price, sales_price } = productData[0];
        const insertSql = `INSERT INTO tbl_cart (product_id,market_price,sales_price,count,uid) VALUES (${id},${market_price},${sales_price},${addCount},'${userId}')`;
        const insertRes = await exec(insertSql);
        return insertRes ? true : false;
      }
    } else {
      //更新
      const updateSql = `UPDATE tbl_cart SET count=count+1 WHERE product_id=${productId} AND uid='${userId}'`;
      const updateRes = await exec(updateSql);
      return updateRes ? true : false;
    }
  }
  return false;
};
const updateCart = async (params) => {
  const { cartId, updateCount, userId } = params;
  const updateSql = `UPDATE tbl_cart SET count=${updateCount} WHERE id=${cartId} AND uid='${userId}'`;
  const res = await exec(updateSql);
  return res ? true : false;
};
const deleteCart = async (params) => {
  const { ids, userId } = params;
  const deleteSql = `DELETE FROM tbl_cart WHERE id IN (${ids}) AND uid='${userId}'`;
  const res = await exec(deleteSql);
  return res ? true : false;
};
const getCartList = async (params) => {
  const { userId } = params;
  const sql = `SELECT a.*,b.name,b.full_reduction_cost,b.full_reduction_count,b.full_reduction_price,b.main_picture,b.activity_type,b.activity_start_time,b.activity_end_time,b.sales_status,b.stock,b.sales_price AS product_sales_price,b.market_price AS product_market_price FROM tbl_cart a INNER JOIN tbl_product b ON (a.product_id = b.id) WHERE uid='${userId}'`;
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
const getCartCount = async (params) => {
  const { userId } = params;
  const countSql = `SELECT SUM(count) as TOTAL FROM tbl_cart a INNER JOIN tbl_product b ON (a.product_id = b.id) WHERE b.sales_status=1 and a.uid='${userId}'`;
  const res = await exec(countSql);
  if (res) {
    const total = res[0].TOTAL;
    return { count: total ? total : 0 };
  }
  return false;
};
const getProductCartCount = async (params) => {
  const { productId, userId } = params;
  const countSql = `SELECT SUM(count) as TOTAL,a.id as cart_id FROM tbl_cart a INNER JOIN tbl_product b ON (a.product_id = b.id) WHERE b.sales_status=1 and a.product_id=${productId} and a.uid='${userId}'`;
  const res = await exec(countSql);
  if (res) {
    return { cart_id: res[0].cart_id, count: res[0].TOTAL };
  }
  return false;
};
module.exports = {
  creatCart,
  updateCart,
  deleteCart,
  getCartList,
  getCartCount,
  getProductCartCount,
};

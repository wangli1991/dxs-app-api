/*
 * @Author: WangLi
 * @Date: 2021-05-26 11:26:49
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-02 09:07:43
 */
const { exec } = require("../db/mysql");

const creatSearch = async (params) => {
  const { name, userId } = params;
  const timestamp = new Date().getTime();
  const countSql = `SELECT COUNT(*) as TOTAL FROM tbl_search WHERE name='${name}' AND uid='${userId}'`;
  const insertSql = `INSERT INTO tbl_search (name,uid,timestamp) VALUES ('${name}','${userId}',${timestamp})`;
  const updateSql = `UPDATE tbl_search SET name='${name}',timestamp=${timestamp} WHERE name='${name}' AND uid='${userId}'`;
  const countRes = await exec(countSql);
  if (countRes) {
    const total = countRes[0].TOTAL;
    if (total === 0) {
      const insertRes = await exec(insertSql);
      if (insertRes) {
        return true;
      }
    } else {
      const updateRes = await exec(updateSql);
      if (updateRes) {
        return true;
      }
    }
  }
  return false;
};

const clearSearch = async (params) => {
  const { userId } = params;
  const sql = `DELETE FROM tbl_search WHERE uid='${userId}'`;
  const res = await exec(sql);
  return res ? true : false;
};

const getSearchList = async (params) => {
  const { userId } = params;
  const sql = `SELECT * FROM tbl_search WHERE uid='${userId}' ORDER BY timestamp DESC`;
  const res = await exec(sql);
  if (res) {
    const resData = res.map((x) => {
      delete x.uid;
      return x;
    });
    return { list: resData, count: resData.length };
  }
  return false;
};

const getHotSearchList = async () => {
  const sql = `SELECT * FROM tbl_hot_search ORDER BY creat_time DESC`;
  const res = await exec(sql);
  if (res) {
    const resData = res.map((x) => {
      delete x.uid;
      return x;
    });
    return { list: resData, count: resData.length };
  }
  return false;
};

module.exports = {
  creatSearch,
  clearSearch,
  getSearchList,
  getHotSearchList,
};

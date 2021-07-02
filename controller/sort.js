/*
 * @Author: WangLi
 * @Date: 2021-04-12 13:26:01
 * @LastEditors: WangLi
 * @LastEditTime: 2021-04-12 16:24:47
 */
const { exec } = require("../db/mysql");
const getSortList = async () => {
  const sql = `SELECT * FROM tbl_sort`;
  const res = await exec(sql);
  if (res) {
    return { list: res, count: res.length };
  }
  return false;
};
module.exports = {
  getSortList,
};

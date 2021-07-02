/*
 * @Author: WangLi
 * @Date: 2021-04-12 13:26:01
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-02 06:09:44
 */
const { exec } = require("../db/mysql");
const getClassifyList = async () => {
  const sql = `SELECT * FROM tbl_classify ORDER BY id DESC`;
  const res = await exec(sql);
  if (res) {
    return { list: res, count: res.length };
  }
  return false;
};
module.exports = {
  getClassifyList,
};

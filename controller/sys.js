/*
 * @Author: 王利
 * @Date: 2020-09-30 10:45:59
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-02 06:12:46
 */
const { exec } = require("../db/mysql");
const getBannerList = async () => {
  const sql = `SELECT * FROM tbl_banner`;
  const res = await exec(sql);
  if (res) {
    return { list: res, count: res.length };
  }
  return false;
};
module.exports = { getBannerList };

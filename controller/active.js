/*
 * @Author: WangLi
 * @Date: 2021-04-12 13:26:01
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-02 05:55:49
 */
const { exec } = require("../db/mysql");
const { transformDate } = require("../utils/utils");

const creatActive = () => {};

const getActiveList = async () => {
  const sql = `SELECT * FROM tbl_active`;
  const data = await exec(sql);
  if (data) {
    data.forEach((x) => {
      x.start_time = transformDate(x.start_time);
      x.end_time = transformDate(x.end_time);
    });
    return { list: data, count: data.length };
  }
  return false;
};
module.exports = {
  creatActive,
  getActiveList,
};

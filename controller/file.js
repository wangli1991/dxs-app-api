/*
 * @Author: WangLi
 * @Date: 2021-07-02 14:11:02
 * @LastEditors: WangLi
 * @LastEditTime: 2021-07-02 14:53:08
 */
const { exec } = require("../db/mysql");

const getFile = async (ids) => {
  const sql = `SELECT * FROM tbl_file WHERE id IN (${ids})`;
  const res = await exec(sql);
  const resData = res.map((x) => x.file_path);
  return res ? resData : false;
};

module.exports = {
  getFile,
};

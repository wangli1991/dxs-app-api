/*
 * @Author: WangLi
 * @Date: 2021-04-13 19:21:36
 * @LastEditors: WangLi
 * @LastEditTime: 2021-07-02 20:20:08
 */
const { getFile } = require("./file");
const { exec } = require("../db/mysql");

const getListByClassify = async (params) => {
  const { classify, sort, currentPage, pageSize } = params;
  const startCount = (currentPage - 1) * pageSize;
  const countSql = `SELECT COUNT(*) as TOTAL FROM tbl_product WHERE classify=${classify}`;
  let sql = `SELECT * FROM tbl_product WHERE classify=${classify}`;
  switch (sort) {
    case 1: //按综合排序
      break;
    case 2: //按销量排序
      break;
    case 3: //按价格排序-正序
      sql += ` ORDER BY sales_price ASC`;
      break;
    case -3: //按价格排序-倒序
      sql += ` ORDER BY sales_price DESC`;
      break;
  }
  sql += ` LIMIT ${startCount},${pageSize}`;
  const countData = await exec(countSql);
  if (countData) {
    let listData = [],
      promiseExec = [];
    const total = countData[0].TOTAL;
    if (total) {
      const data = await exec(sql);
      promiseExec = data.map(async (x) => {
        if (x.main_picture) {
          x.main_picture = await getFile(x.main_picture);
        }
        return x;
      });
      listData = await Promise.all(promiseExec);
    }
    return { list: listData, count: listData.length, total };
  }
  return false;
};

const getListByRecommend = async (params) => {
  const { currentPage, pageSize, recommend } = params;
  const startCount = (currentPage - 1) * pageSize;
  const selectSql = `SELECT products FROM tbl_recommend WHERE type=${recommend}`;
  let data = [],
    total = 0,
    listData = [],
    promiseExec = [];
  const selectData = await exec(selectSql);
  if (selectData) {
    if (selectData.length) {
      const ids = selectData[0].products;
      const countSql = `SELECT COUNT(*) as TOTAL FROM tbl_product WHERE id IN (${ids})`;
      const sql = `SELECT * FROM tbl_product WHERE id IN (${ids}) LIMIT ${startCount},${pageSize}`;
      const countData = await exec(countSql);
      if (countData) {
        total = countData[0].TOTAL;
        if (total) {
          data = await exec(sql);
          promiseExec = data.map(async (x) => {
            if (x.main_picture) {
              x.main_picture = await getFile(x.main_picture);
            }
            return x;
          });
          listData = await Promise.all(promiseExec);
        }
      }
    }
    return { list: listData, count: listData.length, total };
  }

  return false;
};

const getProductById = async (id) => {
  const sql = `SELECT * FROM tbl_product where id=${id}`;
  const res = await exec(sql);
  if (res) {
    let data = { ...res[0] };
    if (data.main_picture) {
      data.main_picture = await getFile(data.main_picture);
    }
    if (data.carousel_picture) {
      data.carousel_picture = await getFile(data.carousel_picture);
    }
    if (data.detail_picture) {
      data.detail_picture = await getFile(data.detail_picture);
    }
    return data;
  }
  return false;
};

const getListBySearch = async (params) => {
  const { search, sort, currentPage, pageSize } = params;
  const startCount = (currentPage - 1) * pageSize;
  const countSql = `SELECT COUNT(*) as TOTAL FROM tbl_product WHERE name LIKE '%${search}%'`;
  let sql = `SELECT * FROM tbl_product WHERE name LIKE '%${search}%'`;
  switch (sort) {
    case 1: //按综合排序
      break;
    case 2: //按销量排序
      break;
    case 3: //按价格排序-正序
      sql += ` ORDER BY sales_price ASC`;
      break;
    case -3: //按价格排序-倒序
      sql += ` ORDER BY sales_price DESC`;
      break;
  }
  sql += ` LIMIT ${startCount},${pageSize}`;
  const countData = await exec(countSql);
  let data = [];
  if (countData) {
    let listData = [],
      promiseExec = [];
    const total = countData[0].TOTAL;
    if (total) {
      data = await exec(sql);
      promiseExec = data.map(async (x) => {
        if (x.main_picture) {
          x.main_picture = await getFile(x.main_picture);
        }
        return x;
      });
      listData = await Promise.all(promiseExec);
    }
    return { list: listData, count: listData.length, total };
  }
  return false;
};

const getListByActive = async (params) => {
  const { currentPage, pageSize, activeType } = params;
  const startCount = (currentPage - 1) * pageSize;
  const selectSql = `SELECT products FROM tbl_active WHERE id=${activeType}`;
  let data = [],
    total = 0,
    listData = [],
    promiseExec = [];
  const selectData = await exec(selectSql);
  if (selectData) {
    if (selectData.length) {
      const ids = selectData[0].products;
      const countSql = `SELECT COUNT(*) as TOTAL FROM tbl_product WHERE id IN (${ids})`;
      const sql = `SELECT * FROM tbl_product WHERE id IN (${ids}) LIMIT ${startCount},${pageSize}`;
      const countData = await exec(countSql);
      if (countData) {
        total = countData[0].TOTAL;
        if (total) {
          data = await exec(sql);
          promiseExec = data.map(async (x) => {
            if (x.main_picture) {
              x.main_picture = await getFile(x.main_picture);
            }
            return x;
          });
          listData = await Promise.all(promiseExec);
        }
      }
    }
    return { list: listData, count: listData.length, total };
  }

  return false;
};

module.exports = {
  getListByClassify,
  getListByRecommend,
  getProductById,
  getListBySearch,
  getListByActive,
};

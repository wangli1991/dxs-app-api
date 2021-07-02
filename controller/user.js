/*
 * @Author: wangli
 * @Date: 2020-05-18 15:29:43
 * @Last Modified by: wangli
 * @Last Modified time: 2020-07-10 14:48:35
 */
const { appId, appSecret } = require("../config");
const { exec } = require("../db/mysql");
const request = require("request");
const wxLogin = (code) => {
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const { openid, session_key } = JSON.parse(body);
        let sql = `select*from tbl_wx_user where openid='${openid}'`;
        return exec(sql).then((usersData) => {
          if (usersData.length > 0) {
            return resolve(body);
          } else {
            let insertSql = `insert into tbl_wx_user (openid,session_key) values('${openid}','${session_key}')`;
            return exec(insertSql).then((insertData) => {
              return resolve(body);
            });
          }
        });
      } else {
        reject(error);
      }
    });
  });
};
const register = (mobile, password, usertype) => {
  let sql = `select*from tbl_users where mobile='${mobile}'`;
  return exec(sql).then((usersData) => {
    if (usersData.length > 0) {
      return false;
    } else {
      const salt = bcrypt.genSaltSync(10); //设置加密等级，如果不设置默认为10，最高为10
      const hashPwd = bcrypt.hashSync(password, salt); //将获取到的密码进行加密，得到密文hash
      let insertSql = `insert into tbl_users (username,mobile, password, usertype) values('${mobile}','${mobile}','${hashPwd}','${usertype}')`;
      return exec(insertSql).then((insertData) => {
        return {
          mobile: mobile,
        };
      });
    }
  });
};
const getUserInfo = async (options) => {
  let sql = `select*from tbl_wx_user`;
  const res = await exec(sql);
  if (res) {
    return { list: res, count: res.length };
  }
  return false;
};
const setReceiver = async (params) => {
  const { orderUser, location, userId } = params;
  const receiver = await getReceiver(userId);
  let sql;
  if (JSON.stringify(receiver) === "{}") {
    sql = `INSERT INTO tbl_receiver (name,phone,uid) VALUES ('${orderUser.name}','${orderUser.phone}','${userId}')`;
  } else {
    sql = `UPDATE tbl_receiver SET name='${orderUser.name}',phone='${orderUser.phone}' WHERE uid='${userId}'`;
  }
  const res = await exec(sql);
  return res ? true : false;
};
const getReceiver = async (uid) => {
  const sql = `SELECT * FROM tbl_receiver WHERE uid='${uid}'`;
  const res = await exec(sql);
  if (res) {
    let data = {};
    if (res.length) {
      data = res[0];
      delete data.uid;
    }
    return data;
  }
  return false;
};
module.exports = { getUserInfo, wxLogin, setReceiver, getReceiver };

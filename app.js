/*
 * @Author: 王利
 * @Date: 2020-07-02 19:47:13
 * @LastEditors: WangLi
 * @LastEditTime: 2021-07-02 14:14:37
 */
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const fileStreamRotator = require("file-stream-rotator");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const router = express.Router();
const { auth } = require("./utils/jwt");
const { ErrorModel } = require("./model/resModel");
const app = express();

//设置header 解决session跨域
app.all("*", function (req, res, next) {
  const originHeader = req.headers.origin;
  res.header("Access-Control-Allow-Origin", originHeader); //设置允许跨域域名
  res.header("Access-Control-Allow-Credentials", "true"); //请求携带cookie
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
// 路由列表
const userRouter = require("./routes/user");
const sysRouter = require("./routes/sys");
const sortRouter = require("./routes/sort");
const classifyRouter = require("./routes/classify");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const searchRouter = require("./routes/search");
const activeRouter = require("./routes/active");

// 创建Redis客户端
const redisClient = require("./db/redis");
const sessionStore = new RedisStore({
  client: redisClient,
  prefix: "TOKEN:",
  logErrors: true,
});
// 设置Express的Session存储中间件
app.use(
  session({
    name: "session_id",
    secret: "dxs",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

/*client.HMSET 保存哈希键值*/
redisClient.HMSET("aa", { a: "aa" }, function (err, res) {
  console.log(err, res);
  /*设置过期时间为1天*/
});
/*随机返回当前数据库的一个键*/
redisClient.RANDOMKEY(function (err, key) {
  console.log(err, key);
  /*根据key返回哈希对象*/
  redisClient.HGETALL(key, function (err, val) {
    console.log(err, val);

    /*根据key删除键值*/
    redisClient.DEL(key);
  });
});

//日志
const logsPath = path.join(__dirname, "logs");
// 判断日志文件夹是否存在 不存在则创建
fs.existsSync(logsPath) || fs.mkdirSync(logsPath);
// 创建日志文件
var accessLogStream = fileStreamRotator.getStream({
  date_format: "YYYYMMDD",
  filename: path.join(logsPath, "%DATE%.log"),
  frequency: "daily",
  verbose: false,
});
morgan.format(
  "logger",
  "[logger] :date[iso] :method :url :status :res[content-length] - :response-time ms"
);
app.use(morgan("logger", { stream: accessLogStream }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//缓存设置
app.use("/temp/", express.static("./temp/"));
// 对所有路由进行 jwt 认证
app.use(auth);
//routes handler
app.use("/user", userRouter);
app.use("/sys", sysRouter);
app.use("/sort", sortRouter);
app.use("/classify", classifyRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/search", searchRouter);
app.use("/active", activeRouter);

// error handler
app.use((err, req, res, next) => {
  let errStatus, msg;
  if (err.name === "UnauthorizedError" || err.name === "TokenExpiredError") {
    errStatus = 401;
    msg = "token验证失败";
  } else {
    errStatus = err.status || 500;
    mes = "服务器发生错误";
  }
  res.status(errStatus).send({ code: errStatus, msg });
});

module.exports = app;

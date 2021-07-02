const redis = require("redis");
const { REDIS_CONF } = require("../config/db");

const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);

redisClient.on("ready", (res) => {
  console.log("redis启动成功");
});
redisClient.on("error", (err) => {
  console.error(err);
});

module.exports = redisClient;

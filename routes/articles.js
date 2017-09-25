var express = require('express');
var router = express.Router();
var users=require("../controllers/users.controller");
var articles=require("../controllers/articles.controller");

///articles下添加下级路由
router.route("/")
  .get(articles.list)//get请求，获取文章列表
  //post请求，创建文章，但要求必须先登录
  .post(users.requireLogin,articles.create);
router.route("/:articleId")
  .get(articles.read)//带id的get请求，读取一篇文章，无需登录
  //带id的post请求，更新一篇文章，要求已登录，且是作者
  .post(users.requireLogin,articles.isAuthor,articles.update)
  //带id的delete请求，删除一篇文章，要求已登录，且是作者
  .delete(users.requireLogin,articles.isAuthor,articles.delete)
//只要接收到参数articleId，就提前，自动执行articleById中间件函数
router.param("articleId",articles.articleById);
module.exports = router;

var express = require('express');
var router = express.Router();
var users=require("../controllers/users.controller");

///users下添加下级路由
//注册页的
router.route("/signup")
  .get(users.renderSignup)//get请求
  .post(users.signup);//post请求
//登录页的
router.route("/signin")
  .get(users.renderSignin)//get请求
  .post(users.signin);//post请求
//注销的get请求
router.route("/signout").get(users.signout);

module.exports = router;

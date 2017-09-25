var User=require("mongoose").model("User");

//定义函数，专门用于分析错误信息
var getErrorMessage=function(err){
  if(err.code){//处理mongoose错误
    switch(err.code){
      case 11000:
      case 11001:
        if(err.message.indexOf("username")!=-1)
          return "用户名已被占用";
        else
          return "邮箱已被占用";
      default:
        return "出错啦！";
    }
  }else{//处理Model验证错误，只读取一条错误的信息即可。因为返回错误提示多了，用户实际上也改不过来。
    for(var key in err.errors){
      return err.errors[key].message;
    }
  }
}

//请求登录页面时
exports.renderSignin=(req,res)=>{
  console.log("请求登录页面");
  if(!req.session.uid){//如果用户未登录,才加载登录页
    var msg=req.session.msg;//转存session中可能包含的错误消息
    req.session.msg=null;//清除session中的错误消息
    console.log(msg);
    //加下登录页面，将可能获得的错误提示信息，发送给页面显示
    res.render("signin",{ title:"登录",msg:msg||""});
  }else//如果已登录，就跳转回首页
    return res.redirect('/');
}
//请求注册页面时
exports.renderSignup=(req,res)=>{
  console.log("请求注册页面");
  if(!req.session.uid){//如果用户未登录，才加载注册页
    var msg=req.session.msg;
    req.session.msg=null;
    console.log(msg);
    res.render("signup",{title:"注册",msg:msg||""});
  }else//如果已登录，就跳转回首页
    return res.redirect('/');
}
//post方式提交注册请求时
exports.signup=(req,res)=>{
  console.log("提交注册");
  if(!req.session.uid){//如果用户未登录
    //利用req.body中保存的请求参数们，重新封装一个mongoose User模型的实例
    var user=new User(req.body);
    user.save()//保存到数据库
      .then(user=>{//保存成功后
        req.session.uid=user._id;//_id直接记入session，视为已登录
        res.redirect("/");//跳回首页
      })
      .catch(err=>{//一旦出错
        req.session.msg=getErrorMessage(err);
        res.redirect("/user/signup");//重定向回signup路径
      })
  }
}
//post请求登录时
exports.signin=(req,res)=>{
  var user=new User(req.body);
  User.findOne({username:user.username,password:user.password})
    .then(user=>{
      if(user){
        req.session.uid=user._id;
        res.redirect("/");
      }else{
        req.session.msg="用户名或密码不正确！";
        res.redirect("/user/signin");
      }
    });
}
//post请求注销用户时执行
exports.signout=(req,res)=>{
  req.session.uid=null;
  res.redirect("/");
}
//中间件函数，为文章功能提供的操作前登录检查
exports.requireLogin=(req,res,next)=>{
  //如果未登录，就向当前页返回响应，提示先登录
  if(!req.session.uid){
    return res.status(401).send({msg:"用户未登陆"})
  }else{
    next();//登录后才可继续执行后续操作
  }
}

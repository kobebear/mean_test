var User=require("mongoose").model("User");
//定义函数模块用于处理路由请求，并返回响应
exports.render=(req,res)=>{
  console.log("请求首页");
  if(req.session.uid){//如果session中有uid，说明已登录
    User.findOne({_id:req.session.uid})
      .then(user=>{
        //加载index视图，并传入title参数，以及当前user对象
        res.render('index', {
          title: 'MEAN' ,
          fullName: user.fullName
        })
      });
  }else{//否则，说明没有登录
    //加载index视图，并传入title参数，不再回发user
    res.render('index', { title: 'MEAN' ,fullName:""});
  }
}
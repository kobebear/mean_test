var User=require("mongoose").model("User");
var Article=require("mongoose").model("Article");

//从错误对象中提取错误信息，仅提取一条即可
var getErrorMessage=function(err){
  for(var key in err.errors){
    return err.errors[key].message;
  }
}

//创建新文章的控制器方法
exports.create=(req,res)=>{
  var art=new Article(req.body);
  //查询作者
  User.findOne({_id:req.session.uid})
    .then(user=>{
      art.author = user._id;//保存作者的id
      return art.save();//保存文章
    })
    .then(art=>res.json(art))//返回新文章对象
    .catch(err=>
      res.status(400).send({msg:getErrorMessage(err)})
    );
}

//返回文章列表，要求引入外部关联的User对象
exports.list=(req,res)=>{
  Article.find()
    .sort("-created")
    //强调: 即使关联引用时，要想获得fullName，必须同时引入firstName和lastName才行！
    .populate("author","firstName lastName fullName")
    .exec()
    .then(arts=>res.json(arts))
    .catch(err=>
      res.status(400).send({msg:getErrorMessage(err)})
    );
}

//中间件函数: 专门获取路由中的id参数，从数据库查询出文章对象，保存到req.article中，为后续操作做准备
//后续的read,update,delete方法，都需要先按参数id查询文章对象，再操作找到的文章对象
exports.articleById=(req,res,next,id)=>{
  Article.findById(id)
    .populate("author","firstName lastName fullName")
    .exec()
    .then(art=>{
      if(!art)
        next(new Error("未找到id为"+id+"的文章"))
      else{
        req.article=art;
        next();
      }
    })
    .catch(next);
}

//读取一篇文章，因为有前一步articleById的操作，可直接从req中读取现成的文章对象返回，不必再反复查找
exports.read=(req,res)=>res.json(req.article);

//更新文章
exports.update=(req,res)=>{
  var art=req.article;//获得上一步按id查出的旧文章对象
  //修改文章
  art.title = req.body.title;
  art.content = req.body.content;
  art.save()
    .then(art=>res.json(art))//保存成功，返回新文章
    .catch(err=>
      res.status(400).send({msg: getErrorMessage(err)}));
}

//删除文章
exports.delete=function(req,res){
  var article=req.article;//获得上一步按id获得文章对象
  article.remove()
    .then(art=>res.json(art))//删除成功，返回删除的文章
    .catch(err=>
      res.status(400).send({msg:getErrorMessage(err)}));
}

//专门判断是否有权限修改和删除文章的中间件
exports.isAuthor=(req,res,next)=>{
  //从请求中获得提前查询到的文章对象
  //如果文章作者的id不是session中存的uid，说明不是作者，不能继续
  if(req.article.author.id != req.session.uid){
    return res.status(403).send({message:"用户没有权限"})
  }
  next();//否则，才能继续后续操作
}
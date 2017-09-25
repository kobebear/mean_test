var mongoose=require("mongoose");
mongoose.Promise=global.Promise;
//使用配置信息中的连接字符串对象创建到mongodb的数据库连接
mongoose.connect(require("./config").db,{useMongoClient:true});

require("../models/user.model");//创建user模型
require("../models/article.model");//创建文章模型

var mongoose=require("mongoose"),
  Schema=mongoose.Schema;
var ArticleSchema=new Schema({
  title:{type:String,trim:true,required:"标题不能为空"},
  content:{type:String,default:""},
  author:{type:Schema.ObjectId,ref:"User"},//配置外部引入
  createdDate:{type:Date,default:Date.now}
});
mongoose.model("Article",ArticleSchema);
//为自定义模块articles，添加Article服务，
// 获得与服务器端交互的API
angular.module("articles")
  .factory("Article",["$resource",function($resource){
      //工厂方法使用$resource资源服务，将传入Article方法的对象，封装为一个$resource资源对象
      //这样，凡是传入Articles的普通对象，也就拥有了向服务器提交请求的能力
      //然后，配置$resource提交服务器的路径，参数和更新方法。
      //其中@_id表示使用当前对象的_id键作为发送到服务器的路由参数
    return $resource("/articles/:articleId",{articleId:"@_id"});
  }]);
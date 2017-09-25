//定义整个应用程序级别的模块名
var mainAppName="mean_test";
//创建应用程序级别模块
var mainAppModule=angular.module(
  mainAppName,['ngResource','ngRoute','user','articles']);

//配置路由:使用Hashbangs，将AngularJS的默认路由/#/route方式改为/#!/route
mainAppModule.config(['$locationProvider',function($locationProvider){
  $locationProvider.hashPrefix("!");
}])

//使用angular中jqLite功能，对文档加载完成事件添加处理函数，在文档加载后，自动初始化angular应用
angular.element(document).ready(function(){
  if (!angular.element(document).injector()) {
    angular.bootstrap(document, [mainAppName])
  }
});
//在user模块中添加一个返回user对象的服务，
// 用于将window中user对象，导入到NG中
angular.module("user").factory("getUser",[
  function(){
    return {//当NG引入该服务时，相当于调用该函数并获得返回的对象。
      // 对象中包含一个user字段，保存了从全局导入的user对象
      user:window.user
    }
  }
])
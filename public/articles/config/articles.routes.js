//配置articles模块的路由列表
angular.module("articles").config(["$routeProvider",
  function($routeProvider){//强调: templateUrl的地址是相对于app.js所在目录
    $routeProvider.when(
      "/articles",{templateUrl:"articles/views/list-article.view.html"}
    ).when(
      "/articles/create",{templateUrl:"articles/views/create-article.view.html"}
    ).when(
      "/articles/:articleId",{templateUrl:"articles/views/view-article.view.html"}
    ).when(
      "/articles/:articleId/edit",{templateUrl:"articles/views/edit-article.view.html"}
    )
  }
])
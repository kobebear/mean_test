//为articles模块添加控制器
angular.module("articles").controller("ArticlesController",
  //加载所需的系统服务和自定义模块中的自定义服务
  ["$scope","$routeParams","$location","getUser","Article",
    function($scope,$routeParams,$location,getUser,Article){
      //通过users模块的getUser服务获得window中的user对象用于验证
      $scope.user=getUser.user;
      //定义创建文章的控制器方法
      $scope.create=function(){
        //定义一个普通的文章对象，从当前视图字段中获得title和content
        //使用Article服务，将普通的文章对象封装为一个$resource对象
        var article=new Article({
          title:this.title,
          content:this.content
        });
        //调用$resource对象的$save方法，向服务器提交更新操作。
        article.$save(//将article对象发送给后端接口
          function(response){//如果成功后，跳转到文章显示视图
            $location.path("articles/"+response._id);
          },
          function(errResponse){//如果失败，就在当前视图呈现错误
            $scope.error=errResponse.data.msg;
          }
        );
      };
      //定义查询所有文章的控制器方法
      $scope.find=function(){
        //调用Article服务返回的$resource对象，
        // 再调用$resource对象的query方法，
        // 向服务器发送get请求。
        // 查询所有文章列表，保存到控制器变量articles中。
        // query与get相比，专门用于返回多条记录
        $scope.articles=Article.query();
      };
      //定义仅查询一个文章的方法
      $scope.findOne=function(){
        //调用Article服务返回$resource对象，
        // 向服务器发送带参的get请求，查询一个文章。
        //参数: 定义参数名为articleId,
        // 参数值取自当前NG路由参数中的articleId。
        // 该articleId是从list-article视图单击某个文章标题连接，
        // 跳转时，带过来的
        //最后将从服务器获的对象，保存在控制器变量article中，
        // 用于之后的更新和删除。
        // article得到的也是一个$resource对象。
        $scope.article=
          Article.get({articleId:$routeParams.articleId});
      };
      //定义更新文章的控制器方法
      $scope.update=function() {
        $scope.article.$save(//调用$resource对象的save方法
          function () {//成功: 跳转回显示当前文章的视图
            $location.path("articles/" + $scope.article._id);
          },
          function (errResponse) {//失败: 在当前页面显示错误
            $scope.error = errResponse.data.msg;
          }
        )
      };
      //定义删除文章的方法
      $scope.delete=function(article){
        //删除有两种方法:
        if(article){//如果传入了文章对象
          //就调用文章对象的资源方法$remove
          //向服务器发送delete请求,删除当前文章。
          article.$remove(
            function(){//服务器端删除成功后
              // 通过遍历的方式，删除当前控制器变量articles中的当前文章
              //利用双向绑定，达到更新当前视图的目的。无需重定向。
              for(var i in $scope.articles){
                if($scope.articles[i]==article)
                  $scope.splice(i,1);
              }
            }
          );
        }else{//如果没传入特定的文章对象，默认就删除当前文章对象。
          // 调用当前文章资源对象的remove方法，
          // 向服务器发送delete请求，删除当前文章
          $scope.article.$remove(
              //删除成功后，跳转到文章列表视图，重新加载所有文章。
            function(){$location.path("articles")}
          )
        }
      }
  }])
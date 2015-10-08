(function() {
  var pageModule = angular.module('page-directives', []);
  pageModule.directive("page", function() {
    return {
      restrict: 'E',
      replace:true,
      templateUrl: "templates/page/content.html?"+appUtil.appVersion
    };
  });
})();
appModule.controller('pageController', ['$http','$scope','$sce', function($http,$scope,$sce){
  var pageController=this;

  this.buildContext=function(parameters,initFn){
    $http.get(appName+"/pages/"+parameters+".html?"+appUtil.appVersion).success(function(data){
      try{
        data="<div "+data.split("<body")[1].split("</body>")[0]+"</div>";
        var html=$(data).find(".main").html();
        if(html){
          data=html;
        }
      }catch(e){
      }
      $("#pageContext").html(data);
      initFn();
    }).error(function(data){
      appUtil.ui.autoHideWaiting();
      pathMap._pageNotFound=true;
    });
    appUtil.ui.refreshContent($scope);
  };
  this.setContext=function(key,parameter,initFn){
    if(!parameter){
      key=key.split("/");
      var i=1;
      while(!parameter){
        parameter=key[key.length-i];
        i++;
      }
    }
    if(parameter){
      parameter=parameter.replace("/","");
      pageController.buildContext(parameter,initFn);
    }
  };
}]);
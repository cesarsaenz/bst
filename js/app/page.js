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
appModule.controller('pageController', ['$http','$scope', function($http,$scope){
  var pageController=this;
  this.lastParameters=null;
  this.lastContent=null;
  this.inStaticPage=false;
  
  this.init=function(){
    this.inStaticPage=false;
    this.pagePath=null;
  }
  this.setPagePath=function(html){
    this.pagePath=html;
  }
  
  this.runContent=function(data){
    this.inStaticPage=true;
    this.lastContent=data;
    $("#pageContext").hide();
    $("#pageContext").html("");
    try{
      var ds=$(data);
      for(var i=0;i<ds.length;i++){
        var d=ds[i];
        var t=d.tagName;
        if(t){
          t=t.toLowerCase();
        }
        if(t=="title"){
          pathMap._page._metaTitle=d.innerHTML;
        }else if(t=="meta"){
          if($(d).attr("name") && $(d).attr("name").toLowerCase()=="keywords"){
            pathMap._page._metaKeywords=$(d).attr("content");
          }else if($(d).attr("name") && $(d).attr("name").toLowerCase()=="description"){
            pathMap._page._metaDescription=$(d).attr("content");
          }else if($(d).attr("name") && $(d).attr("name").toLowerCase()=="page-title"){
            pathMap._page._title=$(d).attr("content");
          }
        }else if(t){
          try{
            $("#pageContext").append(d.outerHTML);
            var v=$("#pageContext").find("#page-path").remove()
            if(v.length>0){
              this.pagePath=v[0];
            }
          }catch(e){
            appUtil.log(e.message);
          }
        }else{
          $("#pageContext").append(d);
        }
      }
      pathMap._page._setMetas();
    }catch(e){
    }
    $("#pageContext").show();
  }
  this.buildContext=function(parameters){
    this.inStaticPage=true;
    if(parameters.substring(parameters.length-1)=="/"){
      parameters=parameters.substring(0,parameters.length-1);
    }
    parameters=parameters.split("#")[0];
    if(this.lastParameters==parameters){
      try{
        $scope.app.stopAutoRefreshContent=false;
        staticPageHandler.buildContent();
      }catch(e){
        this.runContent(this.lastContent);
      }
      return;
    }else{
      this.lastParameters==parameters;
    }
    
    $http.get(appName+"/pages/"+parameters+".html?1"+appUtil.appVersion).success(function(data){
      pageController.runContent(data);
    }).error(function(data){
      appUtil.ui.autoHideWaiting();
      pathMap._pageNotFound=true;
      pageController.inStaticPage=false;
    });
    appUtil.ui.refreshContent($scope);
  };
  this.setContext=function(key,parameter){
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
      pageController.buildContext(parameter);
    }
  };
}]);
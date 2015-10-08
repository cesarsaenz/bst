(function() {
  var appTemplates="@head,@footer,$home,$shop,navigator,container,$head_mini,coverage_map,store_map,alert_msg,common_dialog,page_not_found";
  if(appName=="spp"){
    appTemplates+=",$bestbuy";
  }else{
    appTemplates+=",$title,$market";
  }
  
  var app = angular.module('app-directives', []);
  var directiveSetting={
    moduleName:"app",
    items:appTemplates
  };
  appUtil.ui.buildModuleDirective(app,directiveSetting);
})();
var moduleList=['ngDialog','app-directives','phone-directives','plan-directives','cart-directives','checkout-directives','banner-directives','page-directives','nextversion-directives','plan-directives'];
if(appName=="spp"){
  moduleList.push('as-directives');
}
var appModule = angular.module('appSprint', moduleList)

appModule.factory('loadingListener', [function() {
  var loadingListener = {
    request: function(config) {
      appUtil.ui.autoShowWaiting();
      return config;
    },
    response: function(response) {
      appUtil.ui.autoHideWaiting();
      return response;
    }
  };
  return loadingListener;
}]);
appModule.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('loadingListener'); 
}]);
appModule.config(['$locationProvider',function($locationProvider) {
  $locationProvider.hashPrefix('!');
}]);
appModule.config(['ngDialogProvider', function (ngDialogProvider) {
  ngDialogProvider.setDefaults({
    className: 'ngdialog-theme-default',
    plain: false,
    showClose: true,
    closeByDocument: true,
    closeByEscape: true,
    appendTo: false,
    trapFocus:false,
    preCloseCallback: function () {
      console.log('default pre-close callback');
    }
  });
}]);

appModule.controller('appController', ['$sce','$http','$scope','$rootScope','ngDialog', function($sce,$http,$scope,$rootScope,ngDialog){
  var app=this;
  $scope.appUtil=appUtil;
  $scope.appAccount=appAccount;
  appUtil.init(null,$sce,$http,$scope);
  $scope.JSON=JSON;
  $scope.commonData=commonData;
  $scope.pathMap=pathMap;
  $scope.appName=appName;
  this.config={
    DATA_VERSION:"1.0"
  }
  appUtil.net.getData($http,"global_settings").success(function(data){
    for(var i=0;i<data.responses.response.length;i++){
      var d=data.responses.response[i];
      app.config[d["@position"]]=d.$;
    }
  }); 
  
  
  
  this.alertMsg={
    title:"",
    description:"",
    link:"",
    url:"",
    show:function(msg){
      if(!angular.isObject(msg)){
        msg={description:msg};
      }
      this.title=msg.title;
      this.description=msg.description;
      if(!msg.links){
        msg.links=[{title:"Close",url:location.href}];
      }
      this.links=msg.links;
      $(function() {
        $("#alertMsg").modal();
      });
      appUtil.ui.refreshContent(true);
    }
  };
  
  this.commonDialog={
    title:"",
    content:"",
    show:function(dialog){
      this.title=dialog.title;
      this.content=$(dialog.contentTag).html();
      appUtil.ui.refreshContent(true);
      $("#commonDialogOpenner").click();
    }
  }
  $scope.assignContext=function(hashKey){
    if(hashKey[hashKey.length-1]!="/"){
      hashKey+="/";
    }
    
    pathMap._pageNotFound=!pathMap.home._setContext(hashKey);
  }
  this.isCurrentContext=function(hashKey){
    if(hashKey){
      var ps=$scope.pathMap._getCurPath();
      for(var i=ps.length-1;i>=0;i--){
        if(ps[i]._hash){
          return ps[i]._match(hashKey);
        }
      }
    }
    return false;
  }
  
  $scope.showMessage=function(msg,type){
    var dialog = ngDialog.open({
      template: '<p class="'+type+'">'+msg+'</p>',
      plain: true,
      closeByDocument: false,
      closeByEscape: true,
      overlay:false,
      showClose:false,
      type:type
    });
    setTimeout(function () {
      dialog.close();
    }, type=='error'?5000:type=='warning'?3000:2000);
  }
  $scope.autoRefreshFns=[];
  $scope.pushAutoRefresh=function(fn){
    this.autoRefreshFns.push(fn);
  }
  $scope.autoRefresh=function(){
    for(var i=0;i<this.autoRefreshFns.length;i++){
      eval(this.autoRefreshFns[i]);
    }
    appUtil.ui.refreshContent(true);
  }
}]);

//Listen link (hash) update
$(function(){
  $(window).on( "hashchange",function(){
    pathMap._triggerApp();
    pathMap._lastHash=location.hash;
  });
  $(window).focus(function() {
    $("#triggerAutoRefreshTag").click();
  });
});

$(document).ready(function(){
  pathMap._lastHash="";
  if(location.hash){
    setTimeout("pathMap._triggerApp();",100);
  }else{
    location.hash=rootHash;
  }
})
function setAppMenu(){
  if($(".cart").length<1){
    setTimeout(setAppMenu,1);
    return;
  }
  $('.carousel').carousel({
    pause: true,
    interval: false
  })
  $(function(){
  $(".dropdown").hover(
    function() {
      $('.dropdown-menu', this).stop( true, true ).fadeIn("fast");
      $(this).toggleClass('open');
    },
    function() {
      $('.dropdown-menu', this).stop( true, true ).fadeOut("fast");
      $(this).toggleClass('open');
    });
  });
}
setAppMenu();

$(document).on("click", ".coverageMapLink",function(){
    $("#coverageMapLink").click();
});
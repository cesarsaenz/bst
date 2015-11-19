(function() {
  var appTemplates="@head,@footer,$home,$shop,navigator,container,@head_mini,coverage_map,alert_msg,common_dialog,zipcode,page_not_found";
  if(appName=="spp"){
    appTemplates+=",$bestbuy";
  }else{
    appTemplates+=",$title,$market,$search,$search_data";
  }
  
  var app = angular.module('app-directives', []);
  var directiveSetting={
    moduleName:"app",
    items:appTemplates
  };
  appUtil.ui.buildModuleDirective(app,directiveSetting);
})();
var moduleList=['ngDialog','app-directives','phone-directives','cart-directives','checkout-directives','banner-directives','page-directives','nextversion-directives','store-directives'];
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
  
  this.exeInShop=function(){
    $("#mini-shop-checkout").show();
  }
  
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
  
  this.zipCodeHandler={
    storeName:"selectedZipCode",
    value:appUtil.data.retrieveFromLocal("selectedZipCode"),
    update:function(v){
      if(v){
        this.value=v;
      }
      appUtil.data.storeToLocal(this.storeName,this.value);
      if(this.extendFun){
        this.extendFun(this.value);
        this.extendFun=null;
      }
    },
    popDialog:function(fun){
      this.extendFun=fun;
      $("#zipcodeDialog").modal();
      setTimeout("$('#zipcodeDialog').find('input')[0].focus()",1000);
    }
  };
  
  this.commonDialog={
    title:"",
    content:"",
    show:function(dialog){
      var dialogClass = dialog.contentTag.replace('#','');
      // alert(dialogClass);
      $('#commonDialog .modal-dialog').addClass(dialogClass);
      this.title=dialog.title;
      this.content=$(dialog.contentTag).html();
      appUtil.ui.refreshContent(true);
      $("#commonDialogOpenner").click();
    }
  };
  
  $scope.assignContext=function(hashKey){
    if(hashKey[hashKey.length-1]!="/"){
      hashKey+="/";
    }
    
    if(!pathMap.home._setContext(hashKey)){
      appUtil.$scope.pageController.buildContext(location.hash.substring(3));
    }
  }
  this.isCurrentContext=function(hashKey){
    if($scope.pageController && $scope.pageController.inStaticPage){
      return false;
    }else if(pathMap._pageNotFound){
      return false;
    }
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
  
  this.setSearchQuery=function(){
    
    var q=location.hash.toLocaleString().split("/");
    if(q.indexOf("search")>=0){
      q=q[q.indexOf("search")+1];
    }else{
      q=location.hash;
    }
    q=q.replace("%20"," ");
    q=q.replace(/[,\./\\$%&#!~`+$*\(\)\{\}\[\]@-_<>?=-]/g," ").trim();
    var w=$("#searchBox")[0];
    if(w.contentWindow.location.search!="?q="+q || w.contentWindow.stoppedSearch){
      if(this.lastQuery!=q){
        this.lastQuery=q;
        w.src="search.html?q="+q;
      }
    }
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
    if(!this.stopAutoRefreshContent){
      appUtil.ui.refreshContent(true);
    }
  }
  
  $scope.handleUIIssue=function(){
    appUtil.ui.buildToolTip();
    appUtil.ui.buildPopover();
    
    if(app.isCurrentContext(pathMap._phones._formatedHash) || app.isCurrentContext(pathMap._phoneDetails._formatedHash)){
      var classList = $('.ieBackgroundColor');
      $.each(classList, function(index, item) {
        item=$(item);
        var cs=item.attr('class').split(/\s+/);
        for(var i=0;i<cs.length;i++){
          if (cs[i].indexOf("background_")==0) {
            item.css({backgroundColor:cs[i].replace("background_","#")})
            break;
          }
        }
      });
    }
  }  
}]);

//Listen link (hash) update
$(function(){
  $(window).on( "hashchange",function(){
    appUtil.$scope.stopAutoRefreshContent=false;
    appUtil.ui.endIdleReminder("#checkout_help_reminder");
    pathMap._triggerApp();
    pathMap._lastHash=location.hash;
    setTimeout("appUtil.$scope.handleUIIssue();",1000);
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

$(window).on("resize",function(){
  windowResizeObjMap.triggerByResize();
  windowResizeSearchBox.triggerByResize();  
});
$(window).on('load',function(){
  windowResizeSearchBox.triggerByResize(); 
});

var windowResizeObjMap={
  triggerByResize:function(){
    for(var k in windowResizeObjMap){
      if(k!="triggerByResize"){
        windowResizeObjMap[k]();
      }
    }
  },
  mapImgFun:function(){
    var vs=$(".mapImg");
    for(var i=0;i<vs.length;i++){
      var v=vs[i];
      var init=!v._initialWidth;
      if(init){
        $(v).css({"width":"initial","max-width":"initial"});
        v._initialWidth=$(v).width();
        $(v).css({"width":"100%","max-width":"100%"});
      }
      var r =$(v).width()/v._initialWidth;
      
      var os=$($(".mapImg").attr("usemap")+" area");
      if(init){
        v._initialCoords=[];
      }
      for(var n=0;n<os.length;n++){
        var o=os[n];
        if(init){
          v._initialCoords.push(o.coords);
        }
        var coords=v._initialCoords[n].split(",");
        for(var m=0;m<coords.length;m++){
          coords[m]*=r;
        }
        o.coords=coords.toString().replace(/\[\]/g,"");
      }
    }
  }
}

var windowResizeSearchBox={
  triggerByResize:function(){
    $('#searchBox').each(function(index){
      // alert('here');
       var widthHtml =$('html').css('width').slice(0,-2);       
       if(widthHtml < 971){
          $(this).contents().find('html .col_right').hide();
       }
       else {
          $(this).contents().find('html .col_right').show();
       }
       var heightIframeHtml = $(this).contents().find('html').css('height').slice(0,-2);
       var heightIframe = $(this).css('height').slice(0,-2);
       //console.log('iframe:'+heightIframe+', html:'+heightIframeHtml);
       if(heightIframe != heightIframeHtml){
        $(this).css('height', heightIframeHtml+'px');
       }
    });
  }
}
setTimeout("appUtil.$scope.handleUIIssue();",100);
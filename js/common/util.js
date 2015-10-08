var appUtil={
  init:function($route,$sce,$http,$scope){
    this.$route=$route;
    this.$sce=$sce;
    this.$http=$http;
    this.$scope=$scope;
  },
  ui:{
    loadingCount:0,
    styleMap:{},
    createStyleClass:function(name,value){
      if(appUtil.ui.styleMap[name]){
        return;
      }
      $("head").append("<style>"+name+value+"</style>")
      appUtil.ui.styleMap[name]=1;
    },
    setMetaInfo:function(name,value){
      if(name=="title"){
        $('html head title').text(value);    
      }else{
        $('html head meta[name='+name+']').attr("content", value);    
      }
    },
    scrollTopToElement:function(e){
      try{
        if($(e).length && $(e).offset().top){
          if(!this._loadTime){
            this._loadTime=1000;
          }
          setTimeout("appUtil.$scope.$apply();window.scrollTo(0,$('"+e+"').offset().top-100);",this._loadTime);
          this._loadTime=100;
          return;
        }        
      }catch(e){
      }
      setTimeout("appUtil.ui.scrollTopToElement('"+e+"');",100);
    },
    refreshContent:function(noScrollTop){
      if(!noScrollTop){
        setTimeout("appUtil.$scope.$apply();window.scrollTo(0,0);",1);
      }else{
        setTimeout("appUtil.$scope.$apply();",1);
      }
    },
    reload:function(){
      appUtil.$route.reload();
    },
    resizeIframe:function (id,bReadySet) {
      var obj=$(id)[0];
      if(bReadySet){
        obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
      }else if(obj.ready){
        setTimeout("appUtil.ui.resizeIframe('"+id+"',true)",100);
      }else{
        setTimeout("appUtil.ui.resizeIframe('"+id+"',false)",100);
      }
    },
    alert:function(msg){
      appUtil.$scope.app.alertMsg.show(msg);
    },
    autoShowWaiting:function(){
      appUtil.ui.loadingCount++;
      if(appUtil.ui.loadingCount>0){
        $( "#loading" ).show();
      }
    },
    autoHideWaiting:function(){
      appUtil.ui.loadingCount--;
      if(appUtil.ui.loadingCount<=0){
        $( "#loading" ).hide();
        appUtil.ui.loadingCount=0;
      }
    },
    trustAsHtml:function(v){
      return appUtil.$sce.trustAsHtml(v);
    },
    htmlToText:function(v){
      return $("<div>"+v+"</div>").text();
    },
    formatCurrency:function(v){
      v=parseInt(v*100);
      if(v==0){
        return "0.00";
      }else if(v<10){
        return "0.0"+v;
      }else if(v<100){
        return "0."+v;
      }
      v=v+"";
      return v.substring(0,v.length-2)+"."+v.substring(v.length-2);
    },
    generateDirectiveFun:function(moduleName,item,appPath){
      return function() {
        return {
          restrict: 'E',
          replace:true,
          templateUrl: appPath+"templates/"+moduleName+"/"+item+".html?"+appUtil.appVersion
        };
      }
    },
    buildModuleDirective:function(module,directiveSetting){
      directiveSetting.items=directiveSetting.items.split(",");
      for(var i=0;i<directiveSetting.items.length;i++){
        var item=directiveSetting.items[i];
        var appPath="";
        if(item[0]=="$"){
          item=item.substring(1);
          appPath=appName+"/";
        }else if(item[0]=="@"){
          if(location.host.indexOf("localhost")>=0 || location.host.indexOf("127.0.0.1")>=0 ){
            item=item.substring(1);
            appPath=appName+"/";
          }else{
            //TODO:
            item=item.substring(1);
            appPath=appName+"/";
          }
        }
        
        var key=directiveSetting.moduleName;
        var names=item.split("_");
        for(var n=0;n<names.length;n++){
          key+=appUtil.data.capitalize(names[n]);
        }
        module.directive(key, appUtil.ui.generateDirectiveFun(directiveSetting.moduleName,item,appPath));
      }
    }
  },
  net:{
    headersSetting:{
      headers:{
        name:"sprint",
        accept:"application/json"
      }
    },
    setUrlHash:function(v){
      location.hash=v;
    },
    postData:function($http,url,data){
      return $http.post(appUtil.net.formatDataUrl(url),data,appUtil.net.headersSetting).error(function(data,status,headers,config){
        appUtil.ui.alert("There is a temporary issue while accessing the Portal. Please contact Sprint Customer Support for further assistance.");
        appUtil.ui.autoHideWaiting();
      });
    },
    getLocalData:function($http,url){
      var begin=location.href.indexOf(location.host)+location.host.length;
      var end=location.href.indexOf("#!") - begin;
      var subURL=location.href.substr(begin,end-1);
      return $http.get(subURL+url).error(function(data,status,headers,config){
        appUtil.ui.alert("There is a temporary issue while accessing the Portal. Please contact Sprint Customer Support for further assistance.");
        appUtil.ui.autoHideWaiting();
      });;
    },
    getData:function($http,url,parameters,extraheaders){
      var headers=angular.copy(appUtil.net.headersSetting);
      if(extraheaders){
        for(var k in extraheaders){
          headers.headers[k]=extraheaders[k];
        }
      }
      return $http.get(appUtil.net.formatDataUrl(url,parameters),headers).error(function(data,status,headers,config){
        appUtil.ui.alert("There is a temporary issue while accessing the Portal. Please contact Sprint Customer Support for further assistance.");
        appUtil.ui.autoHideWaiting();
      });;
    },
    formatDataUrl:function(url,remoteParameters){
      if(location.host.indexOf("localhost")==0 || location.host.indexOf("127.0.0.1")==0){
        if(url.indexOf(0)!="/"){
          url="/"+url;
        }
        return "data"+url+".json?"+appUtil.appVersion;
      }else{
        if(remoteParameters){
          url=url+remoteParameters+"&"
        }else{
          url=url+"?"
        }
        return "/primary-rest/"+url+"brandId="+appName;
      }
    }
  },
  data:{
    sessionKey:null,
    lastId:new Date().getTime(),
    generateId:function(){
      return this.lastId++;
    },
    storeToLocal:function(name,value){
      var data=JSON.parse(localStorage.getItem( "sprintShop-data" ));
      value=angular.copy(value);
      data[name]=value;
      data=JSON.stringify(data);
      localStorage.setItem( "sprintShop-data" , data);    
    },
    retrieveFromLocal:function(name){
      var data=localStorage.getItem( "sprintShop-data" );
      if(data){
        data=JSON.parse(data);
        if(data.sessionKey == appUtil.data.sessionKey){
          return data[name];
        }
      }
      localStorage.setItem( "sprintShop-data" , "{\"sessionKey\":"+appUtil.data.sessionKey+"}");    
      return null;
    },
    retrieveFromCookie:function(cname){
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i=0; i<ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1);
          if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
      }
      return "";
    },
    simplifyObject:function(o){
      if(typeof o=="object"){
        if(jQuery.isEmptyObject(o)){
          return "";
        }
        for(var k in o){
          if(k=="$"){
            if(o.$=="true"){
              return true;
            }else if(o.$=="false"){
              return false;
            }else if($.isNumeric(o.$)){
              return parseFloat(o.$);
            }else{
              return o.$;
            }
          }else{
            o[k]=appUtil.data.simplifyObject(o[k]);
          }
        }
        return o;
      }else{
        return o;
      }
    },
    rename:function(obj,oldName,newName){
      if(obj.hasOwnProperty(oldName)){
        obj[newName]=obj[oldName];
        delete obj[oldName];
      }
    },
    toArray:function(v){
      if(v==null){
        return [];
      }
      if(!angular.isArray(v)){
        return [v];
      }
      return v;
    },
    removeItemFromArray:function(items,item){
      for(var i=0;i<items.length;i++){
        if(items[i]==item){
          items.splice(i,1);
          return;
        }
      }
    },
    retrieveIntersection:function(d1,d2){
      var d={};
      for(var k in d1){
        if(d2[k]==d1[k]){
          d[k]=d2[k];
        }
      }
      return d;
    },
    retrieveUnion:function(d1,d2){
      var d={};
      if(d1!=null){
        for(var k in d1){
          d[k]=d1[k];
        }
      }
      if(d2!=null){
        for(var k in d2){
          d[k]=d2[k];
        }
      }
      return d;
    },
    hasIntersection:function(d1,d2){
      for(var k in d1){
        if(d2[k]==d1[k]){
          return true;
        }
      }
      return false;
    },
    capitalize:function(txt,all) {
      if( (typeof all !== "undefined") && (all == "true") ){
        return txt.replace(/([^\W_]+[^\s-]*) */g);
      }else{
        return txt.charAt(0).toUpperCase() + txt.substr(1);
      }
    },
    keyToTitle:function(k){
      var t="";
      var bFirst=true;
      var last="";
      for(var i=0;i<k.length;i++){
        var v=k[i];
        if(i==0){
          v=v.toUpperCase();
        }
        if(v>="A" && v<="Z" && !bFirst){
          bFirst=true;
          t+=" ";
        }else if(v>="A" && v<="Z"){
          if(i+1<k.length){
            var vv=k[i+1];
            if(!(vv>="A" && vv<="Z")){
              t+=" ";
            }
          }
        }else{
          bFirst=false;
        }
        
        t+=v;
        last=v;
      }
      return t;
    },
    initObjValue:function(souData,valueObj,path,valueName,initValue){
      if(!angular.isObject(souData) || angular.isDate(souData) || angular.isArray(souData)){
        eval(path+"."+valueName+"="+initValue+";");
        return;
      }
      for(var k in souData){
        eval(path+"."+k+"={}");
        appUtil.data.initObjValue(souData[k],valueObj,path+"."+k,valueName,initValue);
      }
    },
    formatImagePath:function(v){
      try{
        return v.substring(v.indexOf("/repository"));
      }catch(e){
        return v;
      }
    },
    attachData:function(dFrom,dTo){
      for(var k in dFrom){
        if(!k){
          continue;
        }
        if(dTo[k] && angular.isObject(dTo[k]) && !angular.isArray(dTo[k])){
          appUtil.data.attachData(dFrom[k],dTo[k]);
        }else{
          dTo[k]=dFrom[k];
        }
      }
      return dTo;
    }
  },
  log:function(msg){
    try{
      if(appUtil.bDev){
        console.log(msg);
      }
    }catch(e){
      
    }
  },
  showDialog:function(dialog){
    appUtil.$scope.app.commonDialog.show(dialog);
  }
};
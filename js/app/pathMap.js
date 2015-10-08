var pathMap={
  _curNav:"",
  home:{
    _title:"Home",
    _controller:"app",
    _metaTitle:"Prepaid Phones & No Contract Phones from Sprint Prepaid",
    _metaDescription:"Find all your favorite phones without the hassle of a contract. Get savings without sacrificing your network and choose Sprint Prepaid.",
    _metaKeywords:"prepaid phones, no contract phones, sprint prepaid",
    _adobeData:{
      page : {
        channel : 'Home',
        subSection : 'Home', 
        name : 'Home Page'
      }
    },
    coveragemap:{
      _title:"Coverage Map",
      _controller:"app",
      _metaTitle:"Prepaid Phones & No Contract Phones from Sprint Prepaid",
      _metaDescription:"Find all your favorite phones without the hassle of a contract. Get savings without sacrificing your network and choose Sprint Prepaid.",
      _metaKeywords:"prepaid phones, no contract phones, sprint prepaid",
      _shortcut:"coverageMap",
      _adobeData:{
        page : {
          channel : 'Coverage Map',
          subSection : 'Home', 
          name : 'Coverage Map Page'
        }
      },
    },
    storemap:{
      _title:"Store Map",
      _controller:"app",
      _metaTitle:"Prepaid Phones & No Contract Phones from Sprint Prepaid",
      _metaDescription:"Find all your favorite phones without the hassle of a contract. Get savings without sacrificing your network and choose Sprint Prepaid.",
      _metaKeywords:"prepaid phones, no contract phones, sprint prepaid",
      _shortcut:"storeMap",
      _adobeData:{
        page : {
          channel : 'Store Map',
          subSection : 'Home', 
          name : 'Store Map Page'
        }
      },
    },
    shop:{
      _title:"Shop",
      _controller:"app",
      _metaTitle:"Sprint Prepaid No Contract Plans & Phones",
      _metaDescription:"Shop Sprint Prepaid for no contract phone plans, smartphones at great prices and nationwide coverage.",
      _metaKeywords:"no contract plans, prepaid cell phones, nationwide coversage, sprint prepaid",
      _adobeData:{
        page : {
          channel : 'eStore',
          subSection : 'Shop', 
          name : 'Shop Main'
        }
      },
      phones:{
        _title:"Phones",
        _controller:"phoneController",
        _metaTitle:"No Contract Cell Phones & Smartphones from Sprint Prepaid",
        _metaDescription:"Sprint Prepaid has great cell phone options including iPhones and Android phones. Get that new phone on your list without worrying about a contract.",
        _metaKeywords:"prepaid cell phones, prepaid smartphones, no contract cell phones, no contract smartphones",
        _adobeData:{
          page : {
            channel : 'eStore',
            subSection : 'Phones', 
            name : 'Phones Wall'
          }
        },
        _match:function(hash){
          if(hash==this._formatedHash){
            return true;
          }else if(hash.indexOf(this._formatedHash)!=0){
            return false;
          }
          var v = hash.replace(this._formatedHash,"").split("/")[0];
          return v!="details" && v!="compare" && v!="accessories" && v!="deals";
        },
        _generateExtendTitle:function(ps){
          this._extendTitle= "";
        },
        details:{
          _controller:"phoneController",
          _shortcut:"phoneDetails",
          _metaTitle:"No Contract Cell Phones & Smartphones from Sprint Prepaid",
          _metaDescription:"Sprint Prepaid has great cell phone options including iPhones and Android phones. Get that new phone on your list without worrying about a contract.",
          _adobeData:{
            page : {
              channel : 'eStore',
              subSection : 'Phones', 
              subSubSection : '<<Manufacturer>>',
              name : 'Phone Details'
            },
            shop : {
              prodView : '<<SKU of Device>>'
            }
          },
          _generateExtendTitle:function(){
            
          },
          _sendAnalysisData:function(item){
            this._adobeData.page.subSubSection=item.brand;
            this._adobeData.shop.prodView=item.selectedVariant.sku;
            pathMap._insertCommonAdobeData(this._adobeData);
            analysisManager.sendData();
          },
          _match:function(hash){
            return !pathMap._pageNotFound && hash.indexOf(this._formatedHash)==0;
          },
          _setMetas:function(para){
            if(!para){
              para="";
            }else{
              para=para.replace("/"," ");
            }
            appUtil.ui.setMetaInfo("title",this._metaTitle+" - "+para);
            appUtil.ui.setMetaInfo("description",this._metaTitle+ " for "+para);
          }
        },
        compare:{
          _title:"Compare",
          _metaTitle:"Sprint - Compare",
          _metaKeywords:"",
          _adobeData:{
            page : {
              channel : 'eStore',
              subSection : 'Phones', 
              name : 'Comparison'
            },
            shop : {
              comparisons : '<<phone name 1>>,<<phone name 2>>,<<phone name 3>>,<<phone name 4>>'
            }
          },
          _generateAnalysisData:function(items){
            var vs=""
            for(var i=0;i<items.length;i++){
              vs+=","+items[i].name;
            }
            if(vs){
              vs=vs.substring(1);
            }
            this._adobeData.shop.comparisons=vs;
          },
          _metaDescription:"Sprint Compare",          
          _controller:"phoneController",
          _shortcut:"phoneCompare"
        },
        accessories:{
          _title:"Accessories",
          _controller:"phoneController",
          _shortcut:"phoneAccessories",
          _metaDescription:"Sprint Accessories",          
          _metaTitle:"Sprint - Accessories",
          _metaKeywords:"",
          _adobeData:{
            page : {
              channel : 'eStore',
              subSection : 'Phones', 
              name : 'Accessories'
            },
          },
          _generateAnalysisData:function(items){
            var vs=""
            for(var i=0;i<items.length;i++){
              vs+=","+items[i].name;
            }
            if(vs){
              vs=vs.substring(1);
            }
            this._adobeData.shop.comparisons=vs;
          },
          _match:function(hash){
            return !pathMap._pageNotFound && hash.indexOf(this._formatedHash)==0;
          }
        },
        deals:{
          _title:"Deals",
          _controller:"phoneController",
          _shortcut:"phoneDeals",
          _metaDescription:"Sprint Deals",          
          _metaTitle:"Sprint - Deals",
          _metaKeywords:"",
          _adobeData:{
            page : {
              channel : 'eStore',
              subSection : 'Phones', 
              name : 'Deals'
            },
          },
          _generateAnalysisData:function(items){
            var vs=""
            for(var i=0;i<items.length;i++){
              vs+=","+items[i].name;
            }
            if(vs){
              vs=vs.substring(1);
            }
            this._adobeData.shop.comparisons=vs;
          },
          _match:function(hash){
            return !pathMap._pageNotFound && hash.indexOf(this._formatedHash)==0;
          }
        }
      },
      checkout:{
        _title:"Checkout",
        _controller:"checkoutController",
        _metaTitle:"Sprint - Checkout",
        _metaDescription:"",
        _metaKeywords:"Sprint Checkout",
        _adobeData:{
          page : {
            channel : 'eStore',
            subSection : 'Checkout', 
            name : 'Shipping and Billing'
          }
        },
        _analysisInteractionData:{
          pageEvent : 'transactionStart',
          transactionName : 'checkout'
        },
        _generateAnalysisProductList:function(list,quantity){
          var vs=[];
          for(var i=0;i<list.length;i++){
            var discount=list[i].discountTotal;
            if(!discount){
              discount="0.00";
            }else{
              discount=appUtil.ui.formatCurrency(discount)
            }
            vs.push("Phone;"+list[i].sku+";"+(quantity?quantity:list[i].quantity)+";"+list[i].modelPrice+";"+discount);
          }
          return vs;
        },
        _generateAnalysisData:function(data){
          appUtil.data.attachData(data,this._adobeData);
          pathMap._insertCommonAdobeData(this._adobeData);
        },
        _resetAnalysisData:function(){
          this._adobeData={
            page : {
              channel : 'eStore',
              subSection : 'Checkout', 
              name : 'Shipping and Billing',
            }
          }
          return this._adobeData;
        }
      },
      market:{
        _title:"Boost Market",
        _controller:"app",
        _shortcut:"market",
        _metaDescription:"Boost Market",          
        _metaTitle:"Boost - Market",
        _metaKeywords:"",
        _adobeData:{
          page : {
            channel : 'eStore',
            subSection : 'market', 
            name : 'Boost Market'
          }
        },
        _generateAnalysisData:function(items){
          var vs=""
          for(var i=0;i<items.length;i++){
            vs+=","+items[i].name;
          }
          if(vs){
            vs=vs.substring(1);
          }
          this._adobeData.shop.comparisons=vs;
        }
      },
      orderStatus:{
        _title:"Order Status",
        _controller:"checkoutController",
        _shortcut:"orderStatus",
        _metaDescription:"Sprint Order Status",          
        _metaTitle:"Sprint - Order Status",
        _metaKeywords:"",
        _adobeData:{
          page : {
            channel : 'eStore',
            subSection : 'Checkout', 
            name : 'Order Status'
          },
        },
        _generateAnalysisData:function(items){
          var vs=""
          for(var i=0;i<items.length;i++){
            vs+=","+items[i].name;
          }
          if(vs){
            vs=vs.substring(1);
          }
          this._adobeData.shop.comparisons=vs;
        }
      }

    },
    page:{
      _title:"",
      _controller:"pageController",
      _match:function(hash){
        return hash.indexOf(this._formatedHash)==0;
      },
      _generateExtendTitle:function(ps){
        this._extendTitle= appUtil.ui.htmlToText(appUtil.data.keyToTitle(ps[ps.length-1]));
      },
      _setMetas:function(para){
      }
    },
    nextversion:{
      _controller:"nextversionController"
    },
    pagenotfound:{
      _title:"Page Not Found",
      _controller:"app"
    }
  },
  _getCurPath:function(){
    if(!pathMap._formatedLocationHash){
      return [];
    }
    if(pathMap._formatedLocationHash==this._cacheHash){
      return this._cachePath;
    }
    this._cacheHash=pathMap._formatedLocationHash;
    this._pageNotFound=this._pageNotFound || this._cacheHash==this._pagenotfound._formatedHash
    if(this._pageNotFound){
      this._cacheHash=this._pagenotfound._formatedHash;
    }
    this._cachePath=[];
    var hash=this._cacheHash.split("#")[1].replace("!","").split("/");
    var lastNode=this;
    for(var i=0;i<hash.length;i++){
      var h=hash[i];
      if(h){
        var n=lastNode[h];
        
        if(n){
          this._cachePath.push(n);
          //n._extendTitle="";
          lastNode=n;
        }else{
          if(lastNode._generateExtendTitle){
            if(!hash[hash.length-1]){
              hash.splice(hash.length-1);
            }
            lastNode._generateExtendTitle(hash.splice(i));
          }else{
            lastNode._extendTitle=(lastNode._title?", ":"")+h;
          }
          break;
        }
      }
    }
    if(this._cachePath.length==0 || !this._cachePath[0]._formatedHash){
      this._pageNotFound=true;
    }
    return this._cachePath;
  },
  _insertCommonAdobeData:function(d){
    d.page.language = 'EN';
    d.page.app = 'SprintPrepaid'
    d.login = {status: 'not logged-in'};
    d.account = {BAN : ''};    
    d.subscription = { 
      subscriberID : '',
      currentDeviceID : ''
    };
    return d;
  },
  _formatHash:function(){
    this._formatedLocationHash=location.hash.replace("#!","#!/home");
    if(this._formatedLocationHash.indexOf(pathMap._phones._formatedHash)==0){
      var v = this._formatedLocationHash.replace(pathMap._phones._formatedHash,"").split("/")[0];
      if(v && v[0]!="@" && v!="compare" && v!="accessories" && v!="deals"){
        this._formatedLocationHash = this._formatedLocationHash.replace(pathMap._phones._formatedHash,pathMap._phones._formatedHash+"details/");
      }
    }
    return this._formatedLocationHash;
  },
  _triggerApp:function(){
    try{
      //check url query
      if(location.hash.indexOf("?")>0){
        var vs1=location.hash.split("?");
        var vs2=location.href.split("#!");
        location.href=vs2[0]+"?"+vs1[1]+vs1[0];
        return;
      }
      var v = location.hash.split("|");
      if(v.length>1){
        this._curNav=v[1];
        location.replace(v[0]);
        return;
      }
      if(location.hash=="#" || location.hash=="#!"){
        location.replace(pathMap._home._hash);
        return;
      }else if(location.hash.substring(location.hash.length-1)!="/"){
        location.replace(location.hash+"/");
        return;
      }
      
      this._formatHash();
      angular.element("#appController").scope().assignContext(pathMap._formatedLocationHash);
    }catch(e){
      setTimeout("pathMap._triggerApp()",10);
    }
    //for hidding menu on small screen.
    $(document).click();    
  },
  _init:function(){
    this._tmpShortcut={};
    this._hash="#!/";
    this._build(this,this);
    for(var k in this._tmpShortcut){
      this[k]=this._tmpShortcut[k];
    }
    delete this._tmpShortcut;
    return this;
  },
  _scrollPage:function(hash,item){
    if(location.hash.indexOf(item._hash)==0){
      if(pathMap._lastHash.indexOf(item._hash)<0) {
        if(item._flag){
          appUtil.ui.scrollTopToElement("#"+item._flag);
        }
        appUtil.ui.refreshContent();
      }else{
        appUtil.ui.refreshContent(true);
      }
    }else{
      appUtil.ui.refreshContent();
    }
  },
  _build:function(map,node){
    for(var k in node){
      if(k.indexOf("_")!=0){
        if(k=="home" || k=="details"){
          node[k]._hash=node._hash;
        }else{
          node[k]._hash=node._hash+k+"/";
        }
        if(node._formatedHash){
          node[k]._formatedHash=node._formatedHash+k+"/";
        }else{
          node[k]._formatedHash=node._hash+k+"/";
        }
        var shortcut="_"+(node[k]._shortcut || k);
        if(map._tmpShortcut[shortcut]){
          alert("Parse error! Duplicate short-cut,"+shortcut+" in pathMap setting.");
        }else{
          map._tmpShortcut[shortcut]=node[k];
        }
        if(!node[k]._match){
          node[k]._match=function(hash){
            return hash==this._formatedHash;
          };
        }
        if(!node[k]._setContext){
          node[k]._setContext=function(hash){
            if(this._match(hash)){
              var key=this._formatedHash;
              var para=hash.replace(key,"");
              if(this._setMetas){
                this._setMetas(para);
              }else{
                appUtil.ui.setMetaInfo("title",this._metaTitle);
                appUtil.ui.setMetaInfo("description",this._metaDescription);
                appUtil.ui.setMetaInfo("keywords",this._metaKeywords);
              }
              var scope=angular.element("#appController").scope();
              if(eval("scope."+this._controller+".setContext")){
                eval("scope."+this._controller+".setContext(key,para);");
              }else if(this._finalArrange){
                this._finalArrange(hash);
              }else{
                appUtil.ui.refreshContent();
              }
              if(!this._sendAnalysisData && this._adobeData){
                pathMap._insertCommonAdobeData(this._adobeData);
                analysisManager.sendData();
              }
              return true;
            }
            for(var kk in this){
              if(kk.indexOf("_")!=0 && kk.indexOf("$")!=0){
                if(this[kk]._setContext(hash)){
                  return true;
                }
              }
            }
            return false;
          };
        }
        this._build(map,node[k]);
      }
    }
  }
};
(function() {
  var phoneModule = angular.module('phone-directives', []);
  var directiveSetting={
    moduleName:"phone",
    items:"container,deals,accessories,list,list_banner,list_legal,list_reason,list_filter,list_sort,list_item,details,details_accessories,details_images,details_base,details_other,details_features,details_legal,compare,genie,list_compare_mini"
  };
  appUtil.ui.buildModuleDirective(phoneModule,directiveSetting);
})();
appModule.controller('phoneController', ['$http','$scope','$sce', function($http,$scope,$sce){
  var phoneController=this;
  var filterOptions={
    onSale:{label:"On Sale",matchExp:"item.hasDiscount"},
    New:{},
    PreOwned:{label:"Pre-Owned"},
    Bar:{},
    Slider:{},
    Flip:{},
    rate1:{label:"&#9733; & Up",value:1,matchExp:"item.rate>1"},
    rate2:{label:"&#9733; &#9733; & Up",value:2,matchExp:"item.rate>2"},
    rate3:{label:"&#9733; &#9733; &#9733; & Up",value:3,matchExp:"item.rate>3"},
    rate4:{label:"&#9733; &#9733; &#9733; &#9733; & Up",value:4,matchExp:"item.rate>4"},
    TouchScreen:{label:"Touchscreen"},
    QWERTRYKeyboard:{label:"QWERTRY Keyboard"},
    Camera:{hiddenOnUnexist:true},
    FrontFacingCamera:{label:"Front-facing Camera"},
    GPS:{label:"GPS/Navigation"},
    Music:{hiddenOnUnexist:true},
    Wifi:{label:"Wi-Fi"},
    Bluetooth:{hiddenOnUnexist:true},
    SpeakerPhone:{label:"Speakerphone"},
    "4GLTE":{label:"4G LTE"},
    Text:{label:"Text Messaging"},
    Video:{hiddenOnUnexist:true},
    HotSpot:{hiddenOnUnexist:true},
    HtmlBrowser:{label:"HTML Browser"},
    UleCertified:{label:"ULE Certified"}
  }
  for(var k in filterOptions){
    var o=filterOptions[k];
    if(!o.label){
      o.label=k;
      o.value=k;
      o.matchMap={};
    }
    o.id=k;
  }
  
  this.sortList=function(sort,listData){
    if(sort){
      var sortFn=null;
      if(sort=="featured"){
        sortFn="a.genieOrder>b.genieOrder?1:-1";
      }else if(sort=="timeZA"){
        sortFn="a.generalAvailabilityDate>b.generalAvailabilityDate?-1:1";
      }else if(sort=="priceAZ"){
        sortFn="a.selectedVariant.price>b.selectedVariant.price?1:-1";
      }else if(sort=="priceZA"){
        sortFn="a.selectedVariant.price>b.selectedVariant.price?-1:1";
      }else if(sort=="rateZA"){
        sortFn="a.rate>b.rate?-1:1";
      }else if(sort=="nameAZ"){
        sortFn="(a.brand + ' ' + a.name).toLowerCase()>(b.brand + ' ' + b.name).toLowerCase()?1:-1";
      }else{
        return listData;
      }
      var sortMethod=function(a,b){
        return eval(sortFn);
      }
      listData.sort(sortMethod);
//      analysisManager.sendWidgetData("Order by phone <"+sort+">");
    }
    return listData;
  }
    
  this.list={
    data:[],
    filter:{
      urlHash:{
        value:null,
        updateTimestamp:new Date().getTime(),
        initSelectedOptions:function(filterHash){
          
          var hasExtend=false;
          var hash=","+filterHash+",";
          for(var k in phoneController.list.filter.data.map){
            var group=phoneController.list.filter.data.map[k];
            group.extend=false;
            for(var i=0;i<group.options.length;i++){
              var id=encodeURIComponent(group.options[i].id)
              if(hash.indexOf(","+group.options[i].id+",")>=0 || hash.indexOf(","+id+",")>=0){
                group.options[i].checked=true;
                group.extend=true;
                hasExtend=true;
              }else{
                group.options[i].checked=false;
              }
            }
          }
          if(!hasExtend){
            phoneController.list.filter.data.map.condition.extend=true;
          }
        },
        needLoadData:function(){
          return location.hash!=this.value || new Date().getTime()-this.updateTimestamp>5000;
        }
      },
      selectedItems:[],
      data:{
        noFilter:true,
        map:{
          special:{options:[filterOptions.onSale]},
          condition:{title:"Condition",extend:true,options:[filterOptions.New,filterOptions.PreOwned]},
          phoneTypes:{title:"Phone Type",buildByData:true,options:[],matchField:"item.type"},
          customerRating:{title:"Customer Rating",styleClass:"rating",selectSingle:true,options:[
            filterOptions.rate4,
            filterOptions.rate3,
            filterOptions.rate2,
            filterOptions.rate1
          ]},
          brands:{title:"Brands",buildByData:true,relation:"or",options:[],matchField:"item.brand"},
          features:{title:"Features",relation:"and",options:[
            filterOptions.TouchScreen,
            filterOptions.QWERTRYKeyboard,
            filterOptions.Camera,
            filterOptions.FrontFacingCamera,
            filterOptions.GPS,
            filterOptions.Music,
            filterOptions.Wifi,
            filterOptions.Bluetooth,
            filterOptions.SpeakerPhone,
            filterOptions["4GLTE"],
            filterOptions.Text,
            filterOptions.Video,
            filterOptions.HotSpot,
            filterOptions.HtmlBrowser,
            filterOptions.UleCertified
          ]},
          phoneStyles:{title:"Phone Styles",relation:"or",options:[filterOptions.Bar,filterOptions.Slider,filterOptions.Flip]}
        },
        init:function(){
//          this.uiSort=[this.map.condition,this.map.phoneTypes,this.map.customerRating,this.map.brands,this.map.features,this.map.phoneStyles]
          this.uiSort=[this.map.condition,this.map.phoneTypes,this.map.brands,this.map.features,this.map.phoneStyles]
          this.filterAnd=[this.map.special,this.map.customerRating,this.map.features];
          this.filterOr=[this.map.condition,this.map.phoneTypes,this.map.brands,this.map.phoneStyles];
        }
      },
      init:function(phoneList,filterHash){
        //init filter data
        if(!this.data.uiSort){
          this.data.init();
        }

        for(var k in this.data.map){
          for(var n=0;n<this.data.map[k].options.length;n++){
            this.data.map[k].options[n].matchMap={};
          }
        }
        
        //assign match data
        this.phoneMap={};
        for(var p=0;p<phoneList.length;p++){
          var item=phoneList[p];
          this.phoneMap[item.id]=item;
          
          for(var k in filterOptions){
            try{
              if (filterOptions[k].matchExp && eval(filterOptions[k].matchExp)){
                this.addMatchData(filterOptions[k],item);
              }
            }catch(e){}
          }
          for(var k in this.data.map){
            if(this.data.map[k].matchField){
              var v=eval(this.data.map[k].matchField);
              var option=null;
              for(var i= 0;i<this.data.map[k].options.length;i++){
                if(this.data.map[k].options[i].label==v){
                  option=this.data.map[k].options[i];
                }
              }
              if(option==null){
                option={label:v,matchMap:{},id:v.replace(/ /g,'_')};
                this.data.map[k].options.push(option);
              }
              this.addMatchData(option,item);
            }
          }

          for(var i=0;i<item.filters.length;i++){
            var f = item.filters[i];
            if(filterOptions[f]){
              this.addMatchData(filterOptions[f],item);
            }
          }
          if(!filterOptions.PreOwned.matchMap[item.id]){
            this.addMatchData(filterOptions.New,item);
          }
        }
        
        //hidden unexist options
        for(var k in this.data.map){
          var group=this.data.map[k];
          var removeList=[];
          for(var i=0;i<group.options.length;i++){
            var o=group.options[i];
            if(JSON.stringify(o.matchMap)=="{}"){
              if(group.buildByData){
                removeList.push(i);
              }else{
                o.disabled=true;
              }
              o.checked=false;
            }else{
              o.hidden=false;
            }
          }
          for(var i=removeList.length-1;i>=0;i--){
            group.options.splice(removeList[i],1);
          }
        }
        this.urlHash.initSelectedOptions(filterHash);
      },
      getFilterResult:function(){
        if(!this.phoneMap){
          return;
        }
        this.urlHash.value="";
        this.data.noFilter=true;
        var map=this.phoneMap;
        //get filter result by "And" option groups
        for(var i=0;i<this.data.filterAnd.length;i++){
          var andGroup=this.data.filterAnd[i];
          for(var n=0;n<andGroup.options.length;n++){
            var option=andGroup.options[n];
            if(option.checked){
              if(andGroup.selectSingle){
                if(andGroup.lastSelection==null){
                  andGroup.lastSelection=option;
                }else if(andGroup.lastSelection!=option){
                  andGroup.lastSelection.checked=false;
                  andGroup.lastSelection=option;
                }
              }
              this.data.noFilter=false;
              this.urlHash.value+=","+encodeURIComponent(option.id);
              map=appUtil.data.retrieveIntersection(map,option.matchMap);
            }else if(option==andGroup.lastSelection){
              andGroup.lastSelection=null;
            }
          }
        }
        
        //get filter result by "Or" option groups
        for(var i=0;i<this.data.filterOr.length;i++){
          var orGroup=this.data.filterOr[i];
          //disable each "Or" group option by current filter result and other "Or" group options
          var tmpUnionMap=map;
          for(var ii=i+1;ii<this.data.filterOr.length;ii++){
            var tmpOrGroup=this.data.filterOr[ii];
            if(tmpOrGroup==orGroup){
              continue;
            }
            tmpUnionMap=this.retrieveOptionsUnion(tmpOrGroup.options,tmpUnionMap);
          }
          for(var n=0;n<orGroup.options.length;n++){
            var option=orGroup.options[n];
            if(appUtil.data.hasIntersection(tmpUnionMap,option.matchMap)){
              option.disabled=false;
            }else{
              option.disabled=true;
              option.checked=false;
            }
            if(option.checked){
              this.data.noFilter=false;
              this.urlHash.value+=","+encodeURIComponent(option.id);
            }
          }
          //get union result
          map=this.retrieveOptionsUnion(orGroup.options,map);
        }

        //disable "And" group options by final result
        for(var i=0;i<this.data.filterAnd.length;i++){
          var andGroup=this.data.filterAnd[i];
          for(var n=0;n<andGroup.options.length;n++){
            var option=andGroup.options[n];
            if(!option.checked){
              option.disabled=!appUtil.data.hasIntersection(map,option.matchMap);
            }
          }
        }
        //transfer to array 
        var list=[];
        for(var k in map){
          list.push(map[k]);
        }
        if(this.urlHash.value){
          this.urlHash.value=pathMap._phones._hash+"@"+this.urlHash.value.substring(1)+"/";
        }else{
          this.urlHash.value=pathMap._phones._hash;
        }
        this.urlHash.updateTimestamp=new Date().getTime();
        appUtil.net.setUrlHash(this.urlHash.value);
        
        
        while(phoneController.list.filter.selectedItems.length>0){
          phoneController.list.filter.selectedItems.splice(0,1);
        }
        for(var k in phoneController.list.filter.data.map){
          var group=phoneController.list.filter.data.map[k];
          for(var i=0;i<group.options.length;i++){
            var id=encodeURIComponent(group.options[i].id)
            if(group.options[i].checked){
              phoneController.list.filter.selectedItems.push(group.options[i].label);
            }
          }
        }
        return list;
      },
      retrieveOptionsUnion:function(options,map){
        var tmpUnion=null;
        for(var i=0;i<options.length;i++){
          if(options[i].checked){
            tmpUnion=appUtil.data.retrieveUnion(options[i].matchMap,tmpUnion);
          }
        }
        if(tmpUnion!=null){
          map=appUtil.data.retrieveIntersection(tmpUnion,map);
        }
        return map;
      },
      addMatchData:function(filterOption,data){
        filterOption.matchMap[data.id]=data;
      },
      removeAll:function(){
        noFilter=true;
        
        for(var k in this.data.map){
          var group=this.data.map[k];
          if(group.selectSingle){
            group.lastSelection=null;
          }
          for(var n=0;n<group.options.length;n++){
            var option = group.options[n];
            option.checked=false;
            option.disabled=JSON.stringify(option.matchMap)=="{}";
          }
        }
      }
    },
    sort:"featured",
    getResultList:function(){
      if(location.hash.indexOf(pathMap._phones._hash)!=0 || !pathMap._phones._match(pathMap._formatedLocationHash) || phoneController.status=="init"){
        return;
      }
      return this.getSortedList(this.filter.getFilterResult());
    },
    getSortedList:function(listData){
      phoneController.sortList(this.sort,listData);
      return listData;
    }
  }

  this.onlineDeals={
    data:[],
    addToList:function(item){
      for(var i=0;i<item.variants.length;i++){
        // this needs to be changed to actually look for variants.discount ... our test data doesn't have any does this will do for now
        if(item.variants[i].cartLabel=="Back Order"){
          //item.instantSavings=item.variants[i].price-item.variants[i].discount;
          item.instantSavings="40";
          this.data.push(item);
        }
      }
    },
    getList:function(){
      return this.data;
    }
  }

  this.inStoreOffers={
    data:[],
    getList:function(){
      return this.data;
    }
  }

  this.scrubPhoneData= function(item) {
    item=appUtil.data.simplifyObject(item);
    appUtil.data.rename(item,"externalUrl","id");
    appUtil.data.rename(item,"phoneName","name");
    appUtil.data.rename(item,"phoneType","type");
    appUtil.data.rename(item,"manufacturerName","brand");
    appUtil.data.rename(item,"associatedAccessoryId","accessoryIds");
    item.rate=null;
    item.review=null;
    if(item.ReviewStatistics){
      item.rate=item.ReviewStatistics.AverageOverallRating;
      item.review=item.ReviewStatistics.TotalReviewCount;
      delete item.ReviewStatistics;
    }
    if(item.phoneViewImages){
      appUtil.data.rename(item,"phoneViewImages","images");
      item.images=appUtil.data.toArray(item.images.phoneViewImage);
      for(var i=0;i<item.images.length;i++){
        item.images[i]=appUtil.data.formatImagePath(item.images[i].uRI);
      }
    }
    if(item.filters){
      item.filters=appUtil.data.toArray(item.filters.feature);
    }
    appUtil.data.rename(item,"phoneVariants","variants");
    item.variants=appUtil.data.toArray(item.variants.phoneVariant);
    if(!item.features){
      item.features={};
    }
    if(!item.accessories){
      item.accessories={};
    }

    var tmpMemoryOptions = {};
    item.colorOptions = [];
    item.colorValues = {};
    item.memoryOptions = [];
    
    item.variantMap={};
    var selectedVariant=null;
    var selectedWeight = -1;
    for(j=0; j<item.variants.length; j++) {
      var variant=item.variants[j];
      appUtil.data.rename(variant,"shopGridPicture","gridImage");
      if(variant.gridImage){
        variant.gridImage=appUtil.data.formatImagePath(variant.gridImage.uRI);
      }
      if( variant.colorVariant && variant.gradientColor ){
        appUtil.data.rename(variant,"colorVariant","color");
        variant.color = appUtil.data.capitalize(variant.color);
        item.colorValues [ variant.color ] = variant.gradientColor;
      }
      if( variant.memoryVariant ){
        appUtil.data.rename(variant,"memoryVariant","memory");
        //variant.memory = appUtil.data.capitalize(variant.memory,"true");
        //variant.memory = variant.memory.toUpperCase();
        tmpMemoryOptions[ variant.memory ] = variant.memory;
      }
      
      var tmpWeight=0;
      if(variant.discount){
        item.hasDiscount=true;
        tmpWeight+=1;
      }
      if(variant.isDefault){
        tmpWeight+=2;
      }
      if(variant.inventory=="in-stock"){
        tmpWeight+=4;
      }
      
      if(selectedWeight<tmpWeight){
        selectedWeight=tmpWeight;
        item.selectedVariant=variant;
      }

      if(variant.inventory=="out-of-stock" || variant.inventory=="end-of-life"){
        variant.noMore=true;
        variant.cartLabel="Out of Stock";
      } else if( variant.inventory=="pre-order") {
        variant.cartLabel="Pre Order";
      } else if( variant.inventory=="back-order") {
        variant.cartLabel="Back Order";
      } else {
        if(variant.hiddenPrice){
          variant.cartLabel="Add to Cart to see price";
        }else{
          variant.cartLabel="Add to Cart";
        }
      }

    }
    if(item.selectedVariant){
      item.selectedColor=item.selectedVariant.color;
      item.selectedMemory=item.selectedVariant.memory;
    }
    
    item.colorOptions = Object.keys(item.colorValues).sort();
    item.memoryOptions = Object.keys(tmpMemoryOptions).sort();
    
    item.updateSelectedVariant = function() {
      for( var i=0; i<this.variants.length; i++ ) {
        if( this.selectedColor == this.variants[i].color && (this.selectedMemory == this.variants[i].memory)) {
          this.selectedVariant = this.variants[i];
          pathMap._phoneDetails._sendAnalysisData(this);
        }
      }
    }
    if(item.compareImages){
      var cImages=appUtil.data.toArray(item.compareImages.compareImage);
      for(var i=0;i<cImages.length;i++){
        item[cImages[i].fileName+"_img"]=appUtil.data.formatImagePath(cImages[i].uRI);
      }
      delete item.compareImages;
    }
  }

  this.scrubFeaturesData=function(data){
    appUtil.data.rename(data,"generalFeatures","general");
    appUtil.data.simplifyObject(data.general);
    for(var i=0;i<data.general.length;i++){
      var d = data.general[i];
      if(d.ule){
        d.ule.average*=10;
        for(var n=0;n<d.ule.items.entry.length;n++){
          var v=d.ule.items.entry[n];
          d.ule[v.key]=v.value*10;
          if(d.ule[v.key]<10){
            d.ule[v.key]="0"+d.ule[v.key];
          }
        }
        delete d.ule.items;
        break;
      }
    }
    appUtil.data.rename(data,"specialFeatures","special");
    appUtil.data.simplifyObject(data.special);
    
    appUtil.data.rename(data,"technicalFeatures","technical");
    var group=appUtil.data.toArray(data.technical.group);
    var os=data.technical.os?appUtil.ui.htmlToText(data.technical.os.$):null;
    var processor=data.technical.processor?appUtil.ui.htmlToText(data.technical.processor.$):null;
    var memory=data.technical.memory?appUtil.ui.htmlToText(data.technical.memory.$):null;
    
    var tmpTechnical={os: os,processor:processor,memory:memory};
    for(var i=0;i<group.length;i++){
      var tmpSpecs = tmpTechnical[group[i]["@id"]]={};
      var specs=appUtil.data.toArray(group[i].specs.spec);
      if("whats_included"==group[i]["@id"]){
        tmpTechnical.whats_included=appUtil.data.simplifyObject(specs);
      }else{
        for(var n=0;n<specs.length;n++){
          tmpSpecs[specs[n]["@type"]]=appUtil.ui.htmlToText(specs[n].$);
        }
      }
    }
    
    data.technical=tmpTechnical;
    if(data.specifationImage){
      data.specifationImage=appUtil.data.formatImagePath(data.specifationImage.uRI.$);
    }
  }

  this.scrubAccessoriesData=function(data){
    data.accessory=appUtil.data.toArray(data.accessory);
    appUtil.data.simplifyObject(data);
    for(var i=0;i<data.accessory.length;i++){
      data.accessory[i].accessoryInd=true;
      if(data.accessory[i].inventory=="out-of-stock" || data.accessory[i].inventory=="end-of-life"){
        data.accessory[i].noMore=true;
        data.accessory[i].cartLabel="Out of Stock";
      } else if( data.accessory[i].inventory=="pre-order") {
        data.accessory[i].cartLabel="Pre Order";
      } else if( data.accessory[i].inventory=="back-order") {
        data.accessory[i].cartLabel="Back Order";
      } else {
        if(data.accessory[i].hiddenPrice){
          data.accessory[i].cartLabel="Add to Cart to see price";
        }else{
          data.accessory[i].cartLabel="Add to Cart";
        }
      }
      if(data.accessory[i].shopImage.uRI){
        data.accessory[i].shopImage.uRI=appUtil.data.formatImagePath(data.accessory[i].shopImage.uRI);
      }
      if(data.accessory[i].checkoutIMage.uRI){
        data.accessory[i].checkoutIMage.uRI=appUtil.data.formatImagePath(data.accessory[i].checkoutIMage.uRI);
      }
      appUtil.data.rename(data.accessory[i],"checkoutIMage","checkoutImage");
    }
  }
  
  this.attachAccessories=function(item){
    if(jQuery.isEmptyObject(item.accessories)){
      appUtil.net.getData($http,"shop_get_accessory_list","?phoneId="+item.id).success(function(data){
        if(data.responses.response[0].accessoryResponse){
          if(jQuery.isEmptyObject(item.accessories)){
            angular.extend(item.accessories,data.responses.response[0].accessoryResponse.accessories);
          }
          phoneController.scrubAccessoriesData(item.accessories);
        } else { 
          item.accessories = {"accessory":[]}; 
        };
      }); 
    }
  }
  
  this.attachFeatures=function(item){
    if(jQuery.isEmptyObject(item.features)){
      appUtil.net.getData($http,"shop_get_features_by_external_url","?phoneId="+item.id).success(function(data){
        if(data.responses.response[0].getFeaturesResponse){
          if(jQuery.isEmptyObject(item.features)){
            angular.extend(item.features,data.responses.response[0].getFeaturesResponse.phoneFeatures);
            phoneController.scrubFeaturesData(item.features);
          }
        }
      }); 
    }
  }
  
  this.attachPhoneData=function(obj,id,bAttachFeatures){
    if(jQuery.isEmptyObject(obj)){
      appUtil.net.getData($http,"shop_get_phone_by_external_url","?phoneId="+id).success(function(data){
        if(jQuery.isEmptyObject(obj)){
          try{
            var tmpObj=appUtil.data.simplifyObject(data.responses.response[0].getPhoneDetailsResponse.phoneDetails.phoneDetail);
            if(angular.isArray(tmpObj)){
              for(var i=0;i<tmpObj.length;i++){
                if(angular.isArray(tmpObj[i].phoneVariants.phoneVariant)){
                  tmpObj=tmpObj[i];
                  break;
                }
              }
              if(angular.isArray(tmpObj)){
                tmpObj=tmpObj[0];
              }
            }
            angular.extend(obj,tmpObj);
            phoneController.scrubPhoneData(obj);
            appUtil.ui.refreshContent();
            obj.id=id;
            pathMap._phoneDetails._sendAnalysisData(obj);
            if(bAttachFeatures){
              phoneController.attachFeatures(obj);
              phoneController.attachAccessories(obj);
            }
          }catch(e){
            pathMap._pageNotFound=true;
            appUtil.refreshContent();
            return;
          }
        }
        phoneController.details.updateMeta();
      }); 
    }
  }

  this.scrubCompareFeaturesData=function(data){
    var group=appUtil.data.toArray(data.technicalFeatures.group);    
    var tmpTechnical=[];
    for(var i=0;i<group.length;i++){
      if(group[i]["@id"]=="dimensions" || group[i]["@id"]=="battery"){
        var tmpSpecs = tmpTechnical[group[i]["@id"]] = [];
        var specs=appUtil.data.toArray(group[i].specs.spec);
        for(var j=0;j<specs.length;j++){
          tmpTechnical.push({"title":appUtil.ui.htmlToText(specs[j].$),"type":appUtil.ui.htmlToText(specs[j]["@type"])});
        }
      }
    }
    data.technicalFeatures=tmpTechnical;
    appUtil.data.simplifyObject(data);

    for(var i=0;i<data.generalFeatures.length;i++){
      if(data.generalFeatures[i].type == "android") data.generalFeatures[i].type="os";
      else if( data.generalFeatures[i].type == "mobilehotspot") data.generalFeatures[i].type="hotspot";
      else if( data.generalFeatures[i].type == "flash-player") data.generalFeatures[i].type="flashPlayer";
      else if( data.generalFeatures[i].type == "music-player") data.generalFeatures[i].type="musicPlayer";
      else if( data.generalFeatures[i].type == "web-browser") data.generalFeatures[i].type="webBrowser";
      else if( data.generalFeatures[i].type == "qwerty-keyboard") data.generalFeatures[i].type="qwertyKeyboard";
      else if( data.generalFeatures[i].type == "4g") data.generalFeatures[i].type="fourG";
      else if( data.generalFeatures[i].type == "3g") data.generalFeatures[i].type="threeG";
      else if( data.generalFeatures[i].type == "touchscreen") data.generalFeatures[i].type="display";
    }
  }
  
  this.attachCompareFeatures=function(item){
    appUtil.net.getData($http,"shop_phone_compare","?phones="+item.id).success(function(data){
      data = data.responses.response[0].comparePhoneResponse.comparePhoneList.comparePhone;
      phoneController.scrubCompareFeaturesData(data);
      phoneController.compareItems.fillData(item,data);
    }); 
  }
  this.details={
    data:{},
    planPage:null,
    updateMeta:function(){
      appUtil.ui.setMetaInfo("title",this.data.meta.title);
      appUtil.ui.setMetaInfo("description",this.data.meta.description);
      appUtil.ui.setMetaInfo("keywords",this.data.meta.keywords);
      pathMap._phoneDetails._extendTitle=this.data.brand+" "+this.data.name;
    },
    init:function(id,tab){
      this.selectedTab=tab;
      if(id==this.data.id){
        appUtil.ui.refreshContent(true);
        phoneController.details.updateMeta();
        return;
      }
      $http.get("/primary/shop_plans?version="+appUtil.data.generateId()).success(function(data){
        try{
          phoneController.details.planPage=$sce.trustAsHtml($("<div "+data.split("<body ")[1].split("</body>")[0]+"</div>").find(".tab-pane").html());
        }catch(e){}
      }).error(function(){
        appUtil.ui.alert("There is a temporary issue while accessing the Portal. Please contact Sprint Customer Support for further assistance.");
        appUtil.ui.autoHideWaiting();
      });
      this.data={};
      phoneController.attachPhoneData(this.data,id,true);
    }
  };
  
  this.compareItems={
    COMPARE_SIZE:4,
    featureItems:[
      {
        key:"os",
        title:"Phone Type/OS",
        description:"Your phone's operating system is what makes it work. A more advanced OS lets your phone do more - so you can make it work for you."
      },
      {
        key:"display.value",
        title:"Display",
        description:"Backlit display phones use keys and buttons, while touchscreens let you swipe and tap your way around."
      },
      {
        key:"camera.value",
        title:"Camera",
        description:"Take pictures with your phone. Look for higher megapixels (MP) for better image quality."
      },
      {
        key:"wifi",
        booleanType:true,
        title:"Wi-Fi",
        description:"A Wi-Fi®-enabled phone lets you link to the same high-speed wireless networks used by laptops and tablets."
      },
      {
        key:"fourG.value",
        title:"Sprint 4G Network",
        description:"Connect superfast on the Sprint 4G Network available in select cities."
      },
      {
        key:"hotspot",
        booleanType:true,
        title:"Hotspot",
        description:"Turn your phone into a Wi-Fi® hotspot. Add-ons start at $3/day."
      },
      {
        key:"qwertyKeyboard.value",
        title:"QWERTY Keyboard",
        description:"A QWERTY keyboard looks just like your computer keyboard, but in miniature. With a 'physical' keyboard, you're actually pushing real buttons. With the 'virtual' version, it's a touchscreen."
      },
      {
        key:"webBrowser.value",
        title:"Web Browser",
        description:"HTML browsers display websites the same way they'd appear on a computer screen. WAP browsers show those same web pages but in a more phone-friendly version."
      },
      {
        key:"flashPlayer",
        booleanType:true,
        title:"Flash Player",
        description:"Some of the coolest videos and online content only work on phones with a Flash Player."
      },
      {
        key:"email",
        booleanType:true,
        title:"Email",
        description:"Most phones let you send and receive emails - but some make it super easy by linking directly to your email for one-click access."
      },
      {
        key:"video",
        booleanType:true,
        title:"Video",
        description:"Turn your phone into a mini video camera with the touch of a button."
      },
      {
        key:"musicPlayer",
        title:"Music Player",
        description:"Play your music right from your phone. Create playlists and listen through earbuds or even stereo Bluetooth®, depending on the phone."
      },
      {
        key:"gps",
        booleanType:true,
        title:"Navigation Services",
        description:"GPS navigation gives you interactive maps and turn-by-turn instructions to keep you on the right path."
      },
      {
        key:"speakerphone",
        booleanType:true,
        title:"Speakerphone",
        description:"Put your phone on speaker and free up your hands for other things. Some phones even have voice recognition, so you can make calls just by telling it who to dial."
      },
      {
        key:"memory",
        title:"Memory",
        description:"Portion of memory occupied by existing content."
      },
      {
        key:"processor.value",
        title:"Processor",
        description:"A good processor makes your phone work fast. A great one lets it work even faster and play cool games and videos."
      },
      {
        key:"calendar",
        booleanType:true,
        title:"Calendar",
        description:"A calendar right on your phone helps you track appointments, tasks and important dates."
      },
      {
        key:"voicemail",
        booleanType:true,
        title:"Visual Voicemail",
        description:"Get a text version of your voice messages sent right to your phone's screen. This saves you from listening to calls you'd rather skip or replaying messages to hear key details."
      },
      {
        key:"threeG",
        booleanType:true,
        title:"Sprint 3G Network",
        description:"3G makes your phone work lightning-fast with high-speed wireless service. Because who has time to wait around?"
      }
    ],
    data:{version:$scope.app.config.DATA_VERSION, updateTime:new Date().getTime(),items:[]},
    ItemData:{
      id:null,
      sku:null,
      brand:null,
      name:null,
      compare_th_img:null,
      compare_img:null,
      price:null,
      rate:0,
      review:"N/A",
      os:"N/A",
      android:"N/A",
      display:{value:"N/A"},
      touchscreen:{value:"N/A"},
      camera:{value:"N/A"},
      wifi:"No",
      webBrowser:{value:"N/A"},
      email:"No",
      video:"No",
      musicPlayerBAD:"No",
      speakerphone:"No",
      memory:"N/A",
      processor:{value:"N/A"},
      calendar:"No",
      voicemail:"No",
      bluetooth:{value:"N/A"},
      width:"N/A",
      height:"N/A",
      weight:"N/A",
      depth:"N/A",
      screen_size:"N/A",
      battery_type:"N/A",
      talking_time:"N/A",
      fourG:{value:"N/A"},
      hotspot:"No",
      mobilehotspot:"No",
      qwertyKeyboard:{value:"N/A"},
      flashPlayer:"No",
      gps:"No",
      threeG:"No"
    },
    setItemAttr:function(item,data){
      if(data.type ){
        var t=data.type;
      }else if(data["@type"]){
        var t=data["@type"];
      }else{
        return;
      }
      var v = item[t];
      if(angular.isObject(v)){
        if(data.title){
          v.value=data.title;
        }
        if(data.description){
          v.description=data.description;
        }
      }else if(v=="No"){
        item[t]="Yes";
      }else{
        if(data.title){
          item[t]=data.title;
        }else if(data){
          item[t]=data;
        }
      }  
    },
    fillData:function(item,data){
      if(data.generalFeatures){
        data.generalFeatures=appUtil.data.toArray(data.generalFeatures);
        for(var i=0;i<data.generalFeatures.length;i++){
          var d=data.generalFeatures[i];
          if(!d.type){
            continue;
          }
          this.setItemAttr(item,d);
        }
      }
      if(data.technicalFeatures ){
        data.technicalFeatures=appUtil.data.toArray(data.technicalFeatures);
        for(var i=0;i<data.technicalFeatures.length;i++){
          var d=data.technicalFeatures[i];
          if(!d.type){
            continue;
          }
          this.setItemAttr(item,d);
        }
      }
      this.save()
    },
    init:function(){
      var data = appUtil.data.retrieveFromLocal("phones_compare");
      if(this.data){
        while(this.data.items.length>0){
          this.data.items.splice(0,1);
        }
      }else{
        this.data = {items:[],version:$scope.app.config.DATA_VERSION,updateTime:new Date().getTime()};        
      }
      if( data && data.version==$scope.app.config.DATA_VERSION) {
        for(var i=0;i<data.items.length;i++){
          this.data.items.push(data.items[i]);
        }
      }
      this.save();
    },
    getTitle:function(){
      var title="";
      for(var i=0;i<this.data.items.length;i++){
        title+=this.data.items[i].getPhone().name;
        if(this.data.items.length>1){
          if(i<this.data.items.length-2){
            title+=", ";
          }else if(i==this.data.items.length-2){
            title+=" and ";
          }
        }
      }
      if(!title){
        title="No comparing item";
      }else{
        title="Compare the "+title;
      }
      return title;
    },
    getValueById:function(idx,attrs,true_false){
      var item=this.data.items[idx];
      var value=null;
      attrs=appUtil.data.toArray(attrs);
      if(item){
        for(var i=0;i<attrs.length;i++){
          try{
            if(attrs[i].indexOf("[")>=0){
              value=eval("item"+attrs[i]);
            }else{
              value=eval("item."+attrs[i]);
            }
            if(value!="No" && value!="N/A"){
              break;
            }
          }catch(e){
            value=undefined;
          }
        }
        if(value==undefined){
          value="N/A";
        }else if(true_false){
          value="yes";
        }
      }
      if(value){
        value=$("<div>"+value+"</div>").text();
      }
      return value;
    },
    addItem:function(item){
      if(this.isInclude(item)){
        return;
      }
      if(this.hasSpace()){
        if(!item.compareFeatures){
          item.compareFeatures=angular.copy(this.ItemData);
          var d=item.compareFeatures;
          d.id=item.id;
          d.sku=item.selectedVariant.sku;
          d.brand=item.brand;
          d.name=item.name;
          d.price=item.selectedVariant.price;
          d.compare_th_img=item.compare_th_img;
          d.compare_img=item.compare_img;
          
          d.rate=item.rate;
          d.review=item.review;
          
          phoneController.attachCompareFeatures(d);
        }
        this.data.items.push(item.compareFeatures);
        this.save();
      }else{
        $scope.showMessage("You can only compare up to "+this.COMPARE_SIZE+" items","warning");
        var chks=$("#phoneListArea").find("input[type='checkbox']");
        for(var i=0;i<chks.length;i++){
          var chk=$("#phoneListArea").find("input[type='checkbox']")[i];
          txt=$(chk).parent().text();
          if($(chk).prop('checked') && txt!="Remove"){
            $(chk).prop('checked',false);
          }
        }
      }
    },
    removeItem:function(item){
      for(var i=0;i<this.data.items.length;i++){
        if(this.data.items[i].id==item.id){
          this.data.items.splice(i,1);
        }
      }
      this.save();
    },
    clean:function(){
      while(this.data.items.length>0){
        this.data.items.splice(0,1);
      }
      this.save();
    },
    handleItem:function(item){
      if(this.isInclude(item)){
        this.removeItem(item);
      }else{
        this.addItem(item);
      }
    },
    save:function(){
      this.data.updateTime=new Date().getTime();
      appUtil.data.storeToLocal("phones_compare",this.data);
      pathMap._phoneCompare._generateAnalysisData(this.data.items);
    },
    hasSpace:function(){
      return this.data.items.length<this.COMPARE_SIZE;
    },
    isInclude:function(item){
      for(var i=0;i<this.data.items.length;i++){
        if(this.data.items[i].id==item.id){
          return true;
        }
      }
      return false;
    }
  };
  this.compareItems.init();
  $scope.pushAutoRefresh("$scope.phoneController.compareItems.init()");
  
  this.loadList=function(parameter){
    if(!phoneController.list.filter.urlHash.needLoadData()){
      appUtil.ui.refreshContent(true);
      return;
    }
    if( phoneController.status=="init"){
      return;
    }
    phoneController.status="init";
    appUtil.net.getData($http,"shop_get_phones_by_brand_id").success(function(data){
      phoneController.status="ready";
      phoneController.list.data=data.responses.response[0].getListPhonesResponse.phones.phone;
      phoneController.list.data=appUtil.data.toArray(phoneController.list.data);
      for(var i=0; i<phoneController.list.data.length; i++) {
        phoneController.scrubPhoneData(phoneController.list.data[i]);
      }
      phoneController.list.filter.init(phoneController.list.data, parameter.replace("@",""));
      appUtil.ui.refreshContent();
    }); 
  }
  
  //Filter Menu
  this.hasAndroid=false;
  this.hasIphone=false;
  this.filterMenu=function(){
    appUtil.net.getData($http,"shop_get_phones_by_brand_id").success(function(data){
      data=data.responses.response[0].getListPhonesResponse.phones.phone;
      data=appUtil.data.toArray(data);
      for(var i=0; i<data.length; i++) {
        phoneController.scrubPhoneData(data[i]);        
        phoneController.hasAndroid=phoneController.hasAndroid || data[i].type=="Android";
        phoneController.hasIphone=phoneController.hasIphone || data[i].type=="iPhone";
        phoneController.onlineDeals.addToList(data[i]);
      }
    }); 
  };
  this.filterMenu();
  
  this.setContext=function(key,parameter){
    parameter=parameter.split("/");
    if(key==pathMap._phones._formatedHash){
      this.loadList(parameter[0]);
    }else if(key==pathMap._phoneDetails._formatedHash){
      var tabs=["features","plans","reviews","accessories"];
      if(parameter.length<2 || tabs.indexOf(parameter[1])<0 ){
        appUtil.net.setUrlHash(pathMap._phoneDetails._hash+parameter[0]+"/"+tabs[0]+"/");
        return;
      }
      
      phoneController.details.init(parameter[0],parameter[1]);
    }else if(key==pathMap._phoneCompare._formatedHash){
      phoneController.compareItems.init();
      appUtil.ui.refreshContent();
      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })
      $('.sticker').affix({
        offset: {
          top: $('.sticker').offset().top-125
        }
      });
    }else if(key==pathMap._phoneAccessories._formatedHash){
      this.loadList(parameter[0]);
    }else if(key==pathMap._phoneDeals._formatedHash){
      appUtil.ui.refreshContent();
    }
  };
  this.getRateStarClass=function(r){
    var v=""
    for(var i=0;i<r;i++){
      v+="★";
    }
    return v;
  };
  this.getDiscountClass=function(data){
    var discount=0;
    var name="";
    try{
      if(!data.selectedVariant.hiddenPrice){
        discount=parseInt(data.selectedVariant.discount*100)/100;
        if(discount){
          discount_name=(""+discount).replace("\.","_");
          name=".discount_"+discount_name+":before";
          appUtil.ui.createStyleClass(name,"{content:\"$"+discount+" OFF!\" !important}");
          name=" onSale "+"discount_"+discount_name;
        }
      }
    }catch(e){
    }
    return name;
  }
  
  this.genie={
    data:[],
    pages:null,
    sort:"featured",
    lastSort:null,
    loadGenieList:function(){
      if(this.pages==null){
        this.pages=[];
        appUtil.net.getData($http,"shop_phone_get_genie").success(function(data){
          if( data.responses.response[0].phoneGenieListResponse.phone){
            phoneController.genie.data=appUtil.data.simplifyObject(appUtil.data.toArray(data.responses.response[0].phoneGenieListResponse.phone));
            for(var i=0;i<phoneController.genie.data.length;i++){
              phoneController.scrubPhoneData(phoneController.genie.data[i])
            }
            phoneController.genie.getSortPages();
          }
        }); 
      }
    },
    getSortPages:function(){
      if(this.lastSort==this.sort){
        return this.pages;
      }
      this.lastSort=this.sort;
      phoneController.sortList(this.sort,this.data);
      var page=[];
      this.pages=[];
      for(var i=0;i<this.data.length;i++){
        if(i%3==0){
          page=[];
          this.pages.push(page);
        }
        page.push(this.data[i]);
      }
      return this.pages;
    }
  }
}]);
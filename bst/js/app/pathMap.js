pathMap.home.plans={
  _title:"Plans",
  _controller:"app",
  _metaTitle:"No Contract & Prepaid Phone Plans from Sprint Prepaid",
  _metaDescription:"See how much you can save by choosing a no contract phone plan from Sprint Prepaid. Get the same great network without the hassle of a contract.",
  _metaKeywords:"prepaid phone plans, prepaid cell phone plans, no contract phone plans, no contract cell phone plans",
  _shortcut:"plan",
  _adobeData:{
    page : {
      channel : 'eStore',
      subSection : 'Plans', 
      name : 'Plans Wall'
    }
  },
  _match:function(hash){
    if(hash==this._formatedHash){
      if(location.hash.indexOf("#!/plans/faq")<0) {
        this._flag="";
      }
      return true;
    }
    var vs=hash.split("/");
    if(hash.indexOf("#!/home/plans/faq")==0){
      this._flag=vs[3];
      return true;
    }
    return false;
  },
  _generateExtendTitle:function(){
  },
  _finalArrange:function(hash){
    pathMap._scrollPage(hash,this);
  }
};

pathMap=pathMap._init();
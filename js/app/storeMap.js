$(document).ready(function(){
  appUtil.$scope.app.storeMap={
    searchData:{},
    search:function(){
      var params="";
      $.each(this.searchData, function(key,value){
        params += '&' + key + '=' + value;
      });
      //Fetch the location data from the location API
      appUtil.net.getData(appUtil.$http,"get_location_stores","?"+params.substring(1)).success(function(data){
        if (data.length > 1) {
          //Show the map
          $('#map').slideDown(function(){
            appUtil.$scope.app.storeMap.loadMap(data);
          });
        }
      })
    },
    loadMap:function(data) {
      //Create the map entity
      $("#map").gmap3({
        map: {},
        //Create map markets for each entry in the data objt
        marker: {
          values: data,
          options: {
            draggable: false
          },
          events: {
            //On clickevent, show a tooltip
            click: function(marker, event, context) {
              var map = $(this).gmap3("get");
              var infowindow = $(this).gmap3({get: {name: "infowindow"}});
              if (infowindow) {
                infowindow.open(map, marker);
                infowindow.setContent(context.data);
              } else {
                $(this).gmap3({
                  infowindow: {
                    anchor: marker,
                    options: {content: context.data}
                  }
                });
              }
            },
            //Close tooltip on mouseout        
            mouseout: function() {
              var infowindow = $(this).gmap3({get: {name: "infowindow"}});
              if (infowindow) {
                //infowindow.close();
              }
            }
          }
        }
      }, "autofit"); //Center and size map to contain map points
    }
  }  
})

/**
 * This is src/locations/marker.jsx
 */

var get_marker = function(doc, page){
  get_or_create_objectstyles(doc);
  var marker = page.ovals.add({
    geometricBounds:[0,-2,2,0],
    fillColor: doc.swatches.item(4)
    });
    marker.appliedObjectStyle = doc.objectStyles.item("marker basic");

  return marker;
};


var place_markers = function (doc, page, marker,coordinates,settings){
  var layer;

  if(settings.new_layer === true){
    layer = doc.layers.item(settings.new_layer_name);
    try{
    var name = layer.name;
    }catch(e){
    layer = doc.layers.add({name:settings.new_layer_name});
    }
  }else{
    layer = doc.activeLayer;
  }

  for(var i = 0; i < coordinates.length; i ++){
    var currentmarker = marker.duplicate();
    currentmarker.move([coordinates[i].x,coordinates[i].y]);
    currentmarker.itemLayer = layer;
  }
};
/**
 * End of marker.jsx
 */
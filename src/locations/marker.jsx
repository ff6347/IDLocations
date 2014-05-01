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

/**
 * End of marker.jsx
 */
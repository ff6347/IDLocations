/**
 * This is src/locations/selection.jsx
 */
/**
 * [selector description]
 * @param  {[type]} doc  [description]
 * @param  {[type]} page [description]
 * @return {[type]}      [description]
 */
var selector = function(doc, page){
  var selection = doc.selection;
  var marker = null;
  if(selection.length < 1 ){
    $.writeln("no selection will fall back to basic marker");
    marker = get_marker(doc, page);
  }else{
    marker = selection[0];
  }
  return marker;
};


// end of selction.jsx
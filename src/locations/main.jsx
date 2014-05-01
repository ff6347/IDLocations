/**
 *
 * This is main.jsx
 */

var draw = function() {
  var doc = doc_setup(settings);
  var page = doc.layoutWindows[0].activePage;
  var geodata = importer();
  if (geodata === null){
    alert("There was an error transforming your csv to json.\n"+
      "Please inspect your csv file");
    return 0;
  }
  var currMarker = selector(doc, page);

};

draw();

/**
 * end of main.jsx
 */
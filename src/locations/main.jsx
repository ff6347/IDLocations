/**
 *
 * This is main.jsx
 */

var draw = function() {
  doc_setup(settings);
  var doc = settings.doc;
  var page = doc.layoutWindows[0].activePage;
  var geodata = importer();
  if (geodata === null){
    alert("There was an error transforming your csv to json.\n"+
      "Please inspect your csv file");
    return 0;
  }
  var marker = selector(doc, page);
  // alert(geodata.toSource());
  var coordinates = geodata_to_indesign_coords(settings, geodata, doc, page);
  // alert(coordinates.toSource());
  place_markers(doc, page, marker, coordinates,settings);
};

draw();

/**
 * end of main.jsx
 */
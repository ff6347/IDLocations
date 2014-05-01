// this is src/locations/document.jsx
var get_doc_infos = function() {
  if (app.documents.length < 1) {
    alert("You need a document. Best it was build with the IDMap script");
    return "no doc";
  } else {
    // for now we only work with an exsisting doc.
    // this doc has to be build with IDMap
    var info = Geo.Utilities.ind.info.get(app.activeDocument);
    // alert(info.toSource());
    if (info === undefined) {
      alert("Right now this works only with documents build by IDMap");
      return 'wrong doc';
    }
    return {
      "doc": app.activeDocument,
      "ph": app.activeDocument.documentPreferences.pageWidth,
      "pw": app.activeDocument.documentPreferences.pageHeight,
      "bounds": info.bounds,
      "ptype": info.ptype,
      "zoomed": info.zoomed
    };
  }
};

var doc_setup = function(settings) {
  var info = get_doc_infos();
  settings.doc = info.doc;
  settings.pw = info.pw;
  settings.ph = info.ph;
  settings.ptype = info.ptype;
  settings.boundingBox.bounds = info.bounds;
  settings.boundingBox.zoomed = info.zoomed;

  return settings.doc;
};

// end of document.jsx
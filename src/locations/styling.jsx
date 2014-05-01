/**
 * This is src/locations/styling.jsx
 */

var get_or_create_objectstyles = function(doc) {

  var objectstyle = doc.objectStyles.item("marker basic");

  try {
    var name = objectstyle.name;
  } catch (e) {
    objectstyle = doc.objectStyles.add();

    objectstyle.properties = {
      name: "marker basic",
      fillColor: doc.swatches.item(4),
      /* could also be doc.swatches[3] */
      fillTint: 50,
      strokeColor: doc.swatches.item(5),
      strokeTint: 70,
      strokeWeight: 0.5,
      // bottomLeftCornerOption: CornerOptions.FANCY_CORNER,
      transparencySettings: {
        blendingSettings: {
          opacity: 50,
          blendMode: BlendMode.COLOR
        }
      }
    };
  }
  return objectstyle;
};



/**
 * End of styling.jsx
 */
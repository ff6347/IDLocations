(function(thisObj) {

/*! IDLocations.jsx - v0.1.0 - 2014-05-04 */
/*
 * IDLocations
 * https://github.com/fabiantheblind/IDLocations
 *
 * Copyright (c) 2014 fabiantheblind
 * Copyright (c)  2014
 * Fabian "fabiantheblind" Morón Zirfas
 * Permission is hereby granted, free of charge, to any
 * person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to  permit persons to
 * whom the Software is furnished to do so, subject to
 * the following conditions:
 * The above copyright notice and this permission notice
 * shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF  CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTIO
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * see also http://www.opensource.org/licenses/mit-license.php
*/
////////////////////////////////
// This is globals.jsx
///////////////////////////////
var DEBUG = true; // just for debugging to the console
var settings = {
  new_layer: true,
  new_layer_name: 'marker',
  latitude_key:"",
  longitude_key:"",
  text_key:"",
  possible_lat_keys : ["latitude","Latitude","LATITUDE","lat", "Lat","LAT"],
  possible_lon_keys : ["longitude","Longitude","LONGITUDE","lon", "Lon","LON"],
  /**
   * orientation possibilites are:
   * DEFAULT
   * CENTER
   * TOP
   * BOTTOM
   * LEFT
   * RIGHT
   * UPPER_LEFT
   * LOWER_LEFT
   * UPPER_RIGHT
   * LOWER_RIGHT
   */
  default_marker_orientation: "CENTER",
  /*
  The script will set these infos below by itself. Don't change them.
  It reads data written by IDMap into the document.label
  equirectangular = 0
  mercator = 1
  gallpeters = 2
  hammer = 3
  sinusoidal = 4
  aitoff = 5
   */
  projection_type:null,
  ptype:null,
  doc:null,
  pw:null,
  ph:null,
  // check out http://dbsgeo.com/latlon/
  // to get lat lon coordinates
};

// this is the world bounding box
// will also be set by the script from the info of the doc
settings.boundingBox = {
  zoomed: null,
  bounds:null
};


//  set a different bbox
//  this is just for reference it will be set by the doc info
//
// this is berlin potsdam bounding box
//
// settings.boundingBox = {
//    zoomed: true,
//    bounds:{
//   ul_lon: 12.9638671875, // the most left point
//   ul_lat: 52.70468296296834, // the most top point
//   lr_lon: 13.8153076171875, // the most right point
//   lr_lat: 52.338695481504814 // the most bottom point
//   }
// };
//
// this is for testing purpose and use with tilemill
// europe
// UL  Latitude, Longitude: 60.965109923019, -27.476806640625
// LR Latitude, Longitude: 43.12103377575541, 49.515380859375
// settings.boundingBox = {
//    zoomed: true,
//    bounds:{
//   ul_lon: -27.476806640625, // the most left point
//   ul_lat: 60.965109923019, // the most top point
//   lr_lon: 49.515380859375, // the most right point
//   lr_lat: 43.12103377575541 // the most bottom point
//   }
// };

// this is a part of Cuba
// settings.boundingBox = {
//    zoomed: true,
//    bounds:{
//   ul_lon: -85.87600708007812, // the most left point
//   ul_lat: 24.265745335010493, // the most top point
//   lr_lon:  -78.66897583007812, // the most right point
//   lr_lat:  19.76541117325592 // the most bottom point
//   }
// };
/////////////////////////////
// end of globals.jsx
/////////////////////////////
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
      "ptype": info.projectionType,
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

};

// end of document.jsx

/*! extendscript.prototypes.jsx - v0.0.1 - 2014-04-29 */
// A collection of usefull prototypes
// Copyright (c) 2014 Fabian Moron Zirfas

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


/**
 * This is Prototypes.jsx
 */

var lambda = function (l) {
  var fn = l.match(/\((.*)\)\s*=>\s*(.*)/);
  var p = [];
  var b = "";

  if (fn.length > 0) fn.shift();
  if (fn.length > 0) b = fn.pop();
  if (fn.length > 0) p = fn.pop()
    .replace(/^\s*|\s(?=\s)|\s*$|,/g, '')
    .split(' ');

  // prepend a return if not already there.
  fn = ((!/\s*return\s+/.test(b)) ? "return " : "") + b;

  p.push(fn);

  try {
    return Function.apply({}, p);
  } catch (e) {
    return null;
  }
};

/**
 * from here
 * http://www.paulfree.com/28/javascript-array-filtering/#more-28
 */
if (typeof (Array.prototype.where) === 'undefined') {
  Array.prototype.where = function (f) {
    var fn = f;
    // if type of parameter is string
    if (typeof f == "string")
    // try to make it into a function
      if ((fn = lambda(fn)) === null)
      // if fail, throw exception
        throw "Syntax error in lambda string: " + f;
      // initialize result array
    var res = [];
    var l = this.length;
    // set up parameters for filter function call
    var p = [0, 0, res];
    // append any pass-through parameters to parameter array
    for (var i = 1; i < arguments.length; i++) {
      p.push(arguments[i]);
    }
    // for each array element, pass to filter function
    for (var j = 0; j < l; j++) {
      // skip missing elements
      if (typeof this[j] == "undefined") continue;
      // param1 = array element
      p[0] = this[j];
      // param2 = current indeex
      p[1] = j;
      // call filter function. if return true, copy element to results
      if ( !! fn.apply(this, p)) res.push(this[j]);
    }
    // return filtered result
    return res;
  };
}
if (typeof (String.prototype.localeCompare) === 'undefined') {
  String.prototype.localeCompare = function (str, locale, options) {
    return ((this == str) ? 0 : ((this > str) ? 1 : -1));
  };
}


/*! extendscript.csv.jsx - v0.0.1 - 2014-05-01 */
/*!
 * This is CSV.jsx
 * A collection of functions for reading CSV.
 * As used in Locations.jsx
 *
 * License
 * Copyright (c) 2014 Fabian "fabiantheblind" Morón Zirfas
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify
 * copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALNGS IN THE SOFTWARE.
 *
 * see also http://www.opensource.org/licenses/mit-license.php
 */
if(DEBUG === undefined){
  var DEBUG = true;
}else{
  DEBUG = true;
}
CSV = function() {};
// END OF CSV.js

/**
 * This is a string prototype function
 * found here http://www.greywyvern.com/?post=258
 * @param  {String} sep is the separator we use only ,
 * @return {Array}     returns an Array of strings
 */
// String.prototype.splitCSV = function(sep) {
//   for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
//     if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) === '"') {
//       if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) === '"') {
//         foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
//       } else if (x) {
//         foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
//       } else foo = foo.shift().split(sep).concat(foo);
//     } else foo[x].replace(/""/g, '"');
//   } return foo;
// };


// Dont use prototypes?
// for the time beeing YES
// Makes problems with other scripts
// or we need to use a unique prefix! like ftb_splitCSV
CSV.Utilities = {};

CSV.Utilities.split_csv = function(sep, the_string) {

  for (var foo = the_string.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
    if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) === '"') {
      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) === '"') {
        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
      } else if (x) {
        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
      } else foo = foo.shift().split(sep).concat(foo);
    } else foo[x].replace(/""/g, '"');
  }
  return foo;
};


CSV.toJSON = function(csvFile, useDialog, separator) {
  var textFile;
  var result = [];
  if (useDialog) {
    textFile = File.openDialog("Select a CSV or TSV file to import.", "*.*", false);
  } else {
    textFile = csvFile;
  }
  var textLines = [];
  if (textFile !== null) {
    textFile.open('r', undefined, undefined);
    while (!textFile.eof) {
      textLines[textLines.length] = textFile.readln();
    }
    textFile.close();
  }
  if (textLines.length < 1) {
    alert("ERROR Reading file");
    return null;
  } else {

    $.writeln(textLines);
    // var lines=csv.split("\n");
    var headers = CSV.Utilities.split_csv(separator, textLines[0]);
    if(DEBUG) $.writeln(headers);
    for (var i = 1; i < textLines.length; i++) {

      var obj = {};
      var currentline = CSV.Utilities.split_csv( separator, textLines[i]);

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      if (DEBUG) $.writeln(obj.toSource());
      result.push(obj);

    }

  }
  // alert(result[0].toSource());
  //return result; //JavaScript object
  return result; //JSON
};

/**
 * this reads in a file
 * line by line
 * @return {Array of String}
 */

CSV.reader = {
  read_in_txt: function() {

    var textFile = File.openDialog("Select a text file to import.", "*.*", false);
    var textLines = [];
    if (textFile !== null) {
      textFile.open('r', undefined, undefined);
      while (!textFile.eof) {
        textLines[textLines.length] = textFile.readln();
      }
      textFile.close();
    }
    if (textLines.length < 1) {
      alert("ERROR Reading file");
      return null;
    } else {
      return textLines;
    }
  },

  /**
   * gets lines of strings and creates the data we need from
   * CSV Header and content
   * @param  {Array of String} textLines are , or \t separated values
   * @return {Object}
   */
  textlines_to_data: function(textLines, separator) {

    var data = {};
    data.fields = [];
    data.keys = [];

    for (var i = 0; i < textLines.length; i++) {

      var line_arr = CSV.Utilities.split_csv(separator, textLines[i]);
      if (i === 0) {
        for (var j = 0; j < line_arr.length; j++) {
          data.keys[j] = line_arr[j];
        }

      } else {
        var obj_str = "";
        for (var k = 0; k < line_arr.length; k++) {
          if (k !== line_arr.length - 1) {
            obj_str += 'field_' + k + ':"' + line_arr[k] + '",';
          } else {
            obj_str += 'field_' + k + ':"' + line_arr[k] + '"';
          }
        }
        // var parsedData = JSON.parse("{"+ obj_str+"}");
        data.fields.push(eval("({" + obj_str + "})")); // jshint ignore:line

      }
    }
    return data;
  }


};

/*! extendscript.geo.jsx - v0.0.1 - 2014-05-01 */
/*!
 * This is Geo.js
  * A collection of functions for calculating geo locations.
 * As used in AEMap.jsx and Locations.jsx
 * These functions are heavily based on mbostocks protoviz.
 * Why protoviz and not D3? because extracting some projection types from D3
 * is much more complex then using protoviz
 * https://github.com/mbostock/protovis
 *
 * License
 * Copyright (c) 2014 Fabian "fabiantheblind" Morón Zirfas
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify
 * copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALNGS IN THE SOFTWARE.
 *
 * see also http://www.opensource.org/licenses/mit-license.php
 */
Geo = function () {};
// END OF Geo.js

Geo.Utilities = {
};

Geo.Utilities.radians = function (degrees) {
  return degrees * Math.PI / 180;
};

Geo.Utilities.map = function (value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

Geo.projections = {
  /** The identity or "none" projection. */
  equirectangular: {

    project: function (latlng) {
      return {
        x: latlng.lng,
        y: latlng.lat
      };
    },
    invert: function (xy) {
      return {
        lng: xy.x,
        lat: xy.y
      };
    }
  },
  /** @see http://en.wikipedia.org/wiki/Mercator_projection */
  mercator: {

    project: function (latlng) {

      return {
        x: latlng.lng,
        y: latlng.lat > 85 ? 1 : latlng.lat < -85 ? -1 : Math.log(Math.tan(Math.PI / 4 + Geo.Utilities.radians(latlng.lat) / 2)) / Math.PI
      };
    },
    // invert: function (xy) {
    //   return {
    //     lng: xy.x * 180,
    //     lat: Geo.Utilities.degrees(2 * Math.atan(Math.exp(xy.y * Math.PI)) - Math.PI / 2)
    //   };
    // }
  },

  // /** @see http://en.wikipedia.org/wiki/Gall-Peters_projection */
  gallpeters: {

    project: function (latlng) {
      return {
        x: latlng.lng / 180,
        y: Math.sin(Geo.Utilities.radians(latlng.lat))
      };
    },

    // invert: function (xy) {
    //   return {
    //     lng: xy.x * 180,
    //     lat: Geo.Utilities.degrees(Math.asin(xy.y))
    //   };
    // }
  },

  // /** @see http://en.wikipedia.org/wiki/Sinusoidal_projection */
  sinusoidal: {

    project: function (latlng) {
      return {
        x: Geo.Utilities.radians(latlng.lng) * Math.cos(Geo.Utilities.radians(latlng.lat)) / Math.PI,
        y: latlng.lat / 90
      };
    },
    // invert: function (xy) {
    //   return {
    //     lng: Geo.Utilities.degrees((xy.x * Math.PI) / Math.cos(xy.y * Math.PI / 2)),
    //     lat: xy.y * 90
    //   };
    // }
  },

  // /** @see http://en.wikipedia.org/wiki/Aitoff_projection */
  aitoff: {

    project: function (latlng) {
      var l = Geo.Utilities.radians(latlng.lng),
        f = Geo.Utilities.radians(latlng.lat),
        a = Math.acos(Math.cos(f) * Math.cos(l / 2));
      return {
        x: 2 * (a ? (Math.cos(f) * Math.sin(l / 2) * a / Math.sin(a)) : 0) / Math.PI,
        y: 2 * (a ? (Math.sin(f) * a / Math.sin(a)) : 0) / Math.PI
      };
    },
    // invert: function (xy) {
    //   var x = xy.x * Math.PI / 2,
    //     y = xy.y * Math.PI / 2;
    //   return {
    //     lng: Geo.Utilities.degrees(x / Math.cos(y)),
    //     lat: Geo.Utilities.degrees(y)
    //   };
    // }
  },

  // eckert1: {
  //   project: function (latlng) {

  //     var alpha = Math.sqrt(8 / (3 * Math.PI));
  //     return {

  //       x: alpha * latlng.lat * (1 - Math.abs(latlng.lng) / Math.PI),
  //       y: alpha * latlng.lng
  //     };

  //   }
  // },

  // /** @see http://en.wikipedia.org/wiki/Hammer_projection */
  hammer: {

    project: function (latlng) {
      var l = Geo.Utilities.radians(latlng.lng),
        f = Geo.Utilities.radians(latlng.lat),
        c = Math.sqrt(1 + Math.cos(f) * Math.cos(l / 2));
      return {
        x: 2 * Math.SQRT2 * Math.cos(f) * Math.sin(l / 2) / c / 3,
        y: Math.SQRT2 * Math.sin(f) / c / 1.5
      };
    },
    // invert: function (xy) {
    //   var x = xy.x * 3,
    //     y = xy.y * 1.5,
    //     z = Math.sqrt(1 - x * x / 16 - y * y / 4);
    //   return {
    //     lng: Geo.Utilities.degrees(2 * Math.atan2(z * x, 2 * (2 * z * z - 1))),
    //     lat: Geo.Utilities.degrees(Math.asin(z * y))
    //   };
    // }
  },

};

// END OF Projections.js
Geo.projections.ind = function () {};
Geo.projections.ind.equirectangular = {
  "name": "equirectangular",
  toIDPage: function (doc, latlng, page) {
    var w = doc.documentPreferences.pageWidth;
    var h = doc.documentPreferences.pageHeight;
    var xoff = (w / 2);
    var yoff = (h / 2);
    var x = (latlng.lng) + xoff;
    var y = (latlng.lat * -1) + yoff;
    return {
      "x": x,
      "y": y
    };
  }
};


/** @see http://en.wikipedia.org/wiki/Mercator_projection */
Geo.projections.ind.mercator = {
  name: "mercator",
  toIDPage: function (doc, latlng, page) {
    var w = doc.documentPreferences.pageWidth;
    var h = doc.documentPreferences.pageHeight;
    // taken from here http://stackoverflow.com/questions/1019997/convert-lat-longs-to-x-y-co-ordinates/1020681#1020681
    // Mercator projection
    // longitude: just scale and shift
    var x = (180 + latlng.lng) * (w / 360);

    // latitude: using the Mercator projection
    var latrad = Geo.Utilities.radians(latlng.lat); // convert from degrees to radians

    var mercN = Math.log(Math.tan((Math.PI / 4) + (latrad / 2))); // do the Mercator projection (w/ equator of 2pi units)
    var y = (h / 2) - (w * mercN / (2 * Math.PI)); // fit it to our map

    return {
      "x": x,
      "y": y
    };
  }
};

// /** @see http://en.wikipedia.org/wiki/Gall-Peters_projection */
Geo.projections.ind.gallpeters = {
  name: "gallpeters",
  toIDPage: function (doc, latlng, page) {
    var w = doc.documentPreferences.pageWidth;
    var h = doc.documentPreferences.pageHeight;
    // based on this
    // https://developers.google.com/maps/documentation/javascript/examples/map-projection-simple
    var xoff = (w / 2);
    var yoff = (h / 2);
    // var _scale = scale * 1000;
    // var x = ((latlng.lng) * scale) + xoff;
    var x = xoff + (((w / 360) * latlng.lng));
    // var y = ((latlng.lat * -1) * scale) + yoff;
    var latRadians = Geo.Utilities.radians(latlng.lat);
    var y = yoff - ((h / 2) * Math.sin(latRadians));
    return {
      "x": x,
      "y": y
    };
  }

};

// /** @see http://en.wikipedia.org/wiki/Sinusoidal_projection */
Geo.projections.ind.sinusoidal = {
  name: "sinusoidal",
  toIDPage: function (doc, latlng, page) {
    var w = doc.documentPreferences.pageWidth;
    var h = doc.documentPreferences.pageHeight;

    var xy = {
      x: Geo.Utilities.radians(latlng.lng) * Math.cos(Geo.Utilities.radians(latlng.lat)) / Math.PI,
      y: latlng.lat / 90
    };

    xy.x = Geo.Utilities.map(xy.x, -1, 1, 0, w);
    xy.y = Geo.Utilities.map(xy.y * -1, -1, 1, 0, h);
    return xy;
  }

};

// /** @see http://en.wikipedia.org/wiki/Aitoff_projection */
Geo.projections.ind.aitoff = {
  name: "aitoff",
  toIDPage: function (doc, latlng, page) {
    var w = doc.documentPreferences.pageWidth;
    var h = doc.documentPreferences.pageHeight;
    var l = Geo.Utilities.radians(latlng.lng),
      f = Geo.Utilities.radians(latlng.lat),
      a = Math.acos(Math.cos(f) * Math.cos(l / 2));

    var xy = {
      x: 2 * (a ? (Math.cos(f) * Math.sin(l / 2) * a / Math.sin(a)) : 0) / Math.PI,
      y: 2 * (a ? (Math.sin(f) * a / Math.sin(a)) : 0) / Math.PI
    };
    xy.x = Geo.Utilities.map(xy.x, -1, 1, 0, w);
    xy.y = Geo.Utilities.map(xy.y * -1, -1, 1, 0, h);
    return xy;
  },
};


// /** @see http://en.wikipedia.org/wiki/Hammer_projection */
Geo.projections.ind.hammer = {
  name: "hammer",
  toIDPage: function (doc, latlng, page) {
    var w = doc.documentPreferences.pageWidth;
    var h = doc.documentPreferences.pageHeight;
    var l = Geo.Utilities.radians(latlng.lng),
      f = Geo.Utilities.radians(latlng.lat),
      c = Math.sqrt(1 + Math.cos(f) * Math.cos(l / 2));
    var xy = {
      x: 2 * Math.SQRT2 * Math.cos(f) * Math.sin(l / 2) / c / 3,
      y: Math.SQRT2 * Math.sin(f) / c / 1.5
    };
    xy.x = Geo.Utilities.map(xy.x, -1, 1, 0, w);
    xy.y = Geo.Utilities.map(xy.y * -1, -1, 1, 0, h);

    return xy;
  }

};

Geo.projections.ind.transform = function(doc, page, locations, zoomed, boundingBox, projectionType) {
  var latlng;
  if(zoomed === true){

  //  float x = width * ((BPM_westlon - loc.lon) / (BPM_westlon - BPM_eastlon));
  // float y = ( height * ((BPM_northlat - loc.lat)/(BPM_northlat - BPM_southlat)));
  // This is still in an experimanteal state
  // should be merged into the extendscript.geo lib
  var w = doc.documentPreferences.pageWidth;
  var h = doc.documentPreferences.pageHeight;
  latlng = {
    "lng": locations[0],
    "lat": locations[1]
  };
  //   boundingBox: {
  //   ul_lat: 90,
  //   ul_lon: -180,
  //   lr_lat: -90,
  //   lr_lon: 180
  // },
  var x = w * ((boundingBox.ul_lon - latlng.lng) / (boundingBox.ul_lon - boundingBox.lr_lon));
  var y = (h * ((boundingBox.ul_lat - latlng.lat) / (boundingBox.ul_lat - boundingBox.lr_lat)));
  if (x < 0) {
    x = 0;
  } else if (x > w) {
    x = w;
  }
  if (y < 0) {
    y = 0;
  } else if (y > h) {
    y = h;
  }
  return {
    "x": x,
    "y": y
  };

  }else if(zoomed !== true){
  latlng = {
    "lng": locations[0],
    "lat": locations[1]
  };
  var xy = null;
  if ((projectionType)
    .localeCompare('equirectangular') === 0) {
    xy = Geo.projections.ind.equirectangular.toIDPage(doc, latlng, page);
  } else if ((projectionType)
    .localeCompare('mercator') === 0) {
    xy = Geo.projections.ind.mercator.toIDPage(doc, latlng, page);
  } else if ((projectionType)
    .localeCompare('gallpeters') === 0) {
    xy = Geo.projections.ind.gallpeters.toIDPage(doc, latlng, page);
  } else if ((projectionType)
    .localeCompare('hammer') === 0) {
    xy = Geo.projections.ind.hammer.toIDPage(doc, latlng, page);
  } else if ((projectionType)
    .localeCompare('sinusoidal') === 0) {
    xy = Geo.projections.ind.sinusoidal.toIDPage(doc, latlng, page);
  } else if ((projectionType)
    .localeCompare('aitoff') === 0) {
    xy = Geo.projections.ind.aitoff.toIDPage(doc, latlng, page);
  } else {

    alert("Could not identify the selected projection type");
    return;
  } // end of projection type check
  // $.writeln(xy.x + " <--x || y--> " +xy.y);
  return xy;

  }
};

// indesign specific utilites

Geo.Utilities.ind = {

  info : {
    set : function(doc, bounds, ptype, zoomed){
      var info = {"bounds":bounds,"projectionType":ptype, "zoomed":zoomed};
      doc.label = info.toString();
    },
    get: function(doc){

      return eval(doc.label);
    }
  }
};


// END OF InDesign.js
"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function quote(t){return escapable.lastIndex=0,escapable.test(t)?'"'+t.replace(escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,f,u,p=gap,a=e[t];switch(a&&"object"==typeof a&&"function"==typeof a.toJSON&&(a=a.toJSON(t)),"function"==typeof rep&&(a=rep.call(e,t,a)),typeof a){case"string":return quote(a);case"number":return isFinite(a)?a+"":"null";case"boolean":case"null":return a+"";case"object":if(!a)return"null";if(gap+=indent,u=[],"[object Array]"===Object.prototype.toString.apply(a)){for(f=a.length,r=0;f>r;r+=1)u[r]=str(r,a)||"null";return o=0===u.length?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+p+"]":"["+u.join(",")+"]",gap=p,o}if(rep&&"object"==typeof rep)for(f=rep.length,r=0;f>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],o=str(n,a),o&&u.push(quote(n)+(gap?": ":":")+o));else for(n in a)Object.prototype.hasOwnProperty.call(a,n)&&(o=str(n,a),o&&u.push(quote(n)+(gap?": ":":")+o));return o=0===u.length?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+p+"}":"{"+u.join(",")+"}",gap=p,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var cx,escapable,gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,JSON.parse=function(text,reviver){function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n=walk(o,r),void 0!==n?o[r]=n:delete o[r]);return reviver.call(t,e,o)}var j;if(text+="",cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();
// this is src/lib/importer.jsx

var importer = function (){
  var csvfile = File.openDialog("Select your csv file.","*.*",false);
  if(csvfile === null){
    // nothing selected or dialog aborted
    return null;
  }else{
    var geodata = CSV.toJSON(csvfile ,  useDialog = false, separator = ",");
    return geodata;
  }

};


// end of importer.jsx
/**
 * This is src/locations/geo.jsx
 */
var geodata_to_indesign_coords = function(settings, geodata, doc, page) {

  var geojson_analyzer = function(settings, element) {
    var found_lat = false;
    var found_lon = false;
    var keys = {
      lon: null,
      lat: null
    };
    if (element.hasOwnProperty(settings.latitude_key)) {
      found_lat = true;
    }
    if (element.hasOwnProperty(settings.longitude_key)) {
      found_lon = true;
    }

    if (found_lat === true && found_lon === true) {
      keys.lon = settings.longitude_key;
      keys.lat = settings.latitude_key;
      return keys;
    }
    // if we are here we didn't match the right element
    // lets loop the possible keys
    for (var i = 0; i < settings.possible_lat_keys.length; i++) {
      for (var k in element) {
        if (element.hasOwnProperty(k)) {
          if ((settings.possible_lat_keys[i]).localeCompare(k) === 0) {
            keys.lat = k;
            found_lat = true;
            continue;
          }
        }
      }
      if (found_lat === true) {
        continue;
      }
    }
    for (var j = 0; j < settings.possible_lon_keys.length; j++) {
      for (var l in element) {
        if (element.hasOwnProperty(l)) {
          if ((settings.possible_lon_keys[j]).localeCompare(l) === 0) {
            keys.lon = l;
            found_lon = true;
            continue;
          }
        }
      }
      if (found_lon === true) {
        continue;
      }
    }
    if (found_lat === true && found_lon === true) {
      return keys;
    } else {
      alert("I could not find the right keys for your latitude and longitude fields\n" +
        "Please set them in the settings or call them:\n" +
        settings.possible_lat_keys + "\n\n" +
        settings.possible_lon_keys + "\n\n");
      return null;
    }
  };

  var keys = geojson_analyzer(settings, geodata[0]);
  if (keys === null) {
    return 'no possible fields detected';
  }

var transformer = Geo.projections.ind.transform;
var bounds = settings.boundingBox.bounds;
var ptype = settings.ptype;
var zoomed = settings.boundingBox.zoomed;

  var coordinates = [];
  if(DEBUG) $.writeln(geodata[0][keys.lat.constructor.name]);
  for (var i = 0; i < geodata.length; i++) {

    var xy = null;
    var lat = geodata[i][keys.lat];
    var lon = geodata[i][keys.lon];
    var locations = [];
    locations[0] = parseFloat(lon);
    locations[1] = parseFloat(lat);
    xy = transformer(doc, page, locations, zoomed, bounds ,ptype);
    coordinates.push(xy);
  }
  return coordinates;
};
/**
 * End of geo.jsx
 */
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

// This is src/locations/marker.jsx

var set_transformation = function(doc, orientation) {
  // CENTER_ANCHOR
  // TOP_CENTER_ANCHOR
  doc.layoutWindows[0].transformReferencePoint = AnchorPoint.CENTER_ANCHOR;
};
var get_marker = function(doc, page) {
  get_or_create_objectstyles(doc);
  var marker = page.ovals.add({
    geometricBounds: [0, -2, 2, 0],
    fillColor: doc.swatches.item(4)
  });
  marker.appliedObjectStyle = doc.objectStyles.item("marker basic");
  return marker;
};


var offset_marker = function(orientation, pItem, x, y) {
  // orientaation possibilites are:
  // DEFAULT
  // CENTER
  // TOP
  // BOTTOM
  // LEFT
  // RIGHT
  // UPPER_LEFT
  // LOWER_LEFT
  // UPPER_RIGHT
  // LOWER_RIGHT

  var dim = naive_getDims(pItem, true);
  var mwidth = dim[0];
  var mheight = dim[1];

  if ((orientation).localeCompare('CENTER') === 0) {
    x = x - mwidth / 2;
    y = y - mheight / 2;
  } else if ((orientation).localeCompare('TOP') === 0) {
    x = x - mwidth / 2;
    // y = y - mheight / 2;
  } else if ((orientation).localeCompare('BOTTOM') === 0) {
    x = x - mwidth / 2;
    y = y - mheight;
  } else if ((orientation).localeCompare('LEFT') === 0) {
    // x = x - mwidth / 2;
    y = y - mheight / 2;
  } else if ((orientation).localeCompare('RIGHT') === 0) {
    x = x - mwidth;
    y = y - mheight / 2;
  } else if ((orientation).localeCompare('DEFAULT') === 0) {
    x = x - mwidth / 2;
    y = y - mheight / 2;
  }else if ((orientation).localeCompare('UPPER_LEFT') === 0) {
    x = x - mwidth;
    y = y - mheight;
  }else if ((orientation).localeCompare('LOWER_LEFT') === 0) {
    x = x -  mwidth;
    // y = y + mheight;
  }else if ((orientation).localeCompare('UPPER_RIGHT') === 0) {
    // x = x + mwidth/2;
    y = y - mheight;
  }else if ((orientation).localeCompare('LOWER_RIGHT') === 0) {
    // x = x + mwidth /2 ;
    // y = y;
  } else {
    // fall back to default
    x = x - mwidth / 2;
    y = y - mheight / 2;
  }

  return [x, y];
};

var place_markers = function(doc, page, marker, coordinates, settings) {
  var layer;
  var orientation = settings.default_marker_orientation;
  set_transformation(doc, null);
  if (settings.new_layer === true) {
    layer = doc.layers.item(settings.new_layer_name);
    try {
      var name = layer.name;
    } catch (e) {
      layer = doc.layers.add({
        name: settings.new_layer_name
      });
    }
  } else {
    layer = doc.activeLayer;
  }

  for (var i = 0; i < coordinates.length; i++) {
    var currentmarker = marker.duplicate();
    var xy = offset_marker(orientation, currentmarker,coordinates[i].x,coordinates[i].y);
    currentmarker.move(xy);
    currentmarker.itemLayer = layer;
  }
};

// take a look at this indiscripts blog post
// I stay with the first version. because its easy and the other versions
// dont take in account that the marker could be outside of the page
// http://www.indiscripts.com/post/2009/10/work-around-the-width-height-gap
// TRACK 1 -- naive "getDims" function

// return the [width,height] of <obj>
// according to its (geometric|visible)Bounds
//
// // sample code
// var pItem = app.selection[0]; // get the selected object
// alert('Geometric Dims: ' + naive_getDims(pItem));
// alert('Visible Dims: ' + naive_getDims(pItem, true));

function naive_getDims( /*PageItem*/ obj, /*bool*/ visible) {
  var boundsProperty = ((visible) ? 'visible' : 'geometric') + 'Bounds';
  var b = obj[boundsProperty];
  // width=right-left , height = bottom-top
  return [b[3] - b[1], b[2] - b[0]];
}





 // End of marker.jsx

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
})(this);

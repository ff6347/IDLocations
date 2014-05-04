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
/***************************
// This is globals.jsx
****************************/
var DEBUG = true; // just for debugging to the console
var settings = {
  new_layer: true,
  new_layer_name: 'marker',
  latitude_key:"",
  longitude_key:"",
  text_key:"",
  possible_lat_keys : ["latitude","Latitude","LATITUDE","lat", "Lat","LAT"],
  possible_lon_keys : ["longitude","Longitude","LONGITUDE","lon", "Lon","LON"],
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
settings.boundingBox = {
  zoomed: null,
  bounds:null
};


//  set a different bbox
// this is berlin potsdam bounding box
//
// settings.boundingBox = {
//    zoomed: true,
//    bounds:{
//   ul_lon: 12.9638671875, // the most left point
//   ul_lat: 52.70468296296834, // the most top point
//   lr_lat: 52.338695481504814, // the most bottom point
//   lr_lon: 13.8153076171875 // the most right point
//   }
// };
//
// this is for testing purpose and use with tilemill
// settings.boundingBox = {
//    zoomed: true,
//    bounds:{
//   ul_lon: 13.027, // the most left point
//   ul_lat: 52.7138, // the most top point
//   lr_lat: 52.3160, // the most bottom point
//   lr_lon: 13.7769 // the most right point
//   }
// };

// this is a part of Cuba
// settings.boundingBox = {
//    zoomed: true,
//    bounds:{
//   ul_lon: -85.87600708007812, // the most left point
//   ul_lat: 24.265745335010493, // the most top point
//   lr_lat:  19.76541117325592, // the most bottom point
//   lr_lon:  -78.66897583007812 // the most right point
//   }
// };
/***************************
// end of globals.jsx
****************************/
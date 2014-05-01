/*global module:false*/
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '0.1.0'
    },
    minified : {
      files: {
        src: [
    'src/lib/JSON-js/json2.js',
    ],
    dest: 'src/tmp/'
  },
  options : {
    sourcemap: false,
    allinone: false
  },
},

    concat: {
      options: {
    banner: '\n/*! <%= pkg.name %>.jsx - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
        stripBanners: false
      },
      scripts: {
        src: ['src/locations/license.jsx',
        'src/locations/globals.jsx',
        'src/locations/document.jsx',
        'src/locations/utilites.jsx',
        'src/lib/extendscript.prototypes/dist/extendscript.prototypes.0.0.1.jsx',
        'src/lib/extendscript.csv/dist/extendscript.csv.jsx',
        'src/lib/extendscript.geo/dist/extendscript.geo.id.jsx',
        'src/tmp/json2.js',
        'src/locations/importer.jsx',
        'src/locations/geo.jsx',
        'src/locations/styling.jsx',
        'src/locations/selection.jsx',
        'src/locations/marker.jsx',
        'src/locations/main.jsx'],
        dest: 'src/tmp/<%= pkg.name %>.concat.<%= pkg.version %>.jsx'
      }
    },

    copy: {
      "json-js":{
        src:"src/lib/JSON-js/json2.js",
        dest:"src/tmp/json2.min.js"
      },
      "script": {
        src: "src/tmp/<%= pkg.name %>.concat.wrap.<%= pkg.version %>.jsx",
        dest: "dist/<%= pkg.name %>.<%= pkg.version %>.jsx",
      },
    },
     /**
     * wrap it
     */
    wrap: {
      'script': {
        src: ['src/tmp/<%= pkg.name %>.concat.<%= pkg.version %>.jsx'],
        dest: 'src/tmp/<%= pkg.name %>.concat.wrap.<%= pkg.version %>.jsx',
        options: {
          wrapper: ['(function(thisObj) {', '})(this);\n']
        },
      },
    },
    watch: {
      files: ['src/locations/*.jsx', 'src/locations/*.js', 'src/lib/*'],
      tasks: ['minified','concat:scripts', 'wrap:script','copy:script']
    }

  });
  grunt.registerTask('build-dist', ['concat:scripts', 'wrap:script','copy:script']);

  grunt.registerTask('default', ['watch']);

};

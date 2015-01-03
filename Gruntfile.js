'use strict';

module.exports = function (grunt) {


  var dep = [
    'src/js/*.js'
    ,'src/js/*/*.js'
  ];
  
  var dest = 'asset';
  var csses = [
    'src/css/*.css'
  ];
  // Project configuration.
  grunt.initConfig({
      // Metadata.
      pkg: grunt.file.readJSON('package.json'),
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %>\n'
      //,clean: {
      //  build: {
      //    src: ['asset/']
      //  }
      //}
      ,copy: {
        main: {
          files: [
            {
              expand: true,
              cwd: 'src/',
              src: ['mobile/**','main/**'],
              dest: 'asset/'
            }
          ]
        }
      }
      ,less: {
        compile: {
          files: [{
            'asset/css/main.css': 'src/less/main/*.less'
          },{
            'asset/css/mobile.css': 'src/less/mobile/*.less'
          }]
        }
      }
      ,concat_sourcemap: {
        options: {
          banner: '<%= banner %>',
          sourcesContent: true,
          stripBanners: true
        }
        ,script: {
          files: {
            'asset/js/app.js': dep
          }
        }
      }
      ,coffee: {
        compile: {
          options: {
            sourceMap: false
          },
          files:
            {
              'asset/js/app.js': ['src/js/main/*.coffee', 'src/js/main/*/*.coffee']
              ,'asset/js/mobile.js': ['src/js/mobile/*.coffee', 'src/js/mobile/*/*.coffee']
            }
            //{'asset/js/mobile.js': ['src/js/mobile/*.coffee', 'src/js/mobile/*/*.coffee']}

        }
      }
      ,'http-server':{
        dev: {
            // the server root directory
            root: 'asset/',
            port: 8001,
            // port: function() { return 8282; }
            host: "127.0.0.1",
            cache: 1000,
            showDir : true,
            autoIndex: true,
            // server default file extension
            ext: "html",
            // run in parallel with other tasks
            runInBackground: true
        }

    }
      ,watch: {
        html : {
          files:['src/mobile/**','src/main/**'],
          tasks:['copy:main']
        },
        jsfile: {
          files: ['src/js/*/*.js','src/js/*/*/*.js'],
          tasks: ['concat_sourcemap:script']
        }
        ,coffee : {
          files: ['src/js/*/*.coffee','src/js/*/*/*.coffee'],
          tasks: ['coffee:compile']
        }
        ,css: {
          files: 'src/less/*/*.less',
          tasks: ['less:compile']
        }
      }

    }
  )
  ;

// These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-concat-sourcemap');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['copy','less','concat_sourcemap','coffee','watch']);
}
;

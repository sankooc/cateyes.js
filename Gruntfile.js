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
              flatten: true,
              src: ['src/*.html'],
              dest: 'asset/'
            }
          ]
        }
      }
      ,less: {
        compile: {
          options: {
            paths: ['src/css/include']
          },
          files: {
            'asset/css/main.css': 'src/css/*.less'
          }
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
            sourceMap: true
          },
          files: {
            'asset/js/app.js': ['src/js/*.coffee', 'src/js/*/*.coffee']
          }
        }
      }
      ,watch: {
        html : {
          files:'src/*.html',
          tasks:['copy:main']
        },
        jsfile: {
          files: 'src/js/*.js',
          tasks: ['concat_sourcemap:script']
        }
        ,jsfile2: {
          files: 'src/js/*/*.js',
          tasks: ['concat_sourcemap:script']
        }
        ,coffee : {
          files: ['src/js/*.coffee','src/js/*/*.coffee'],
          tasks: ['coffee:compile']

        }
        ,css: {
          files: 'src/css/*.less',
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
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['copy','less','concat_sourcemap','coffee', 'watch']);
}
;

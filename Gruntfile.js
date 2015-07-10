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
      copy: {
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
      ,nodemon: {
        dev: {
          script: 'server/app.js'
        }
      }
      ,concurrent: {
        dev: {
          tasks: ['nodemon', 'watch'],
          options: {
            logConcurrentOutput: true
          }
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
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  //grunt.loadNpmTasks('grunt-contrib-connect');
  //grunt.loadNpmTasks('grunt-connect-proxy');
  //grunt.loadNpmTasks('grunt-exec');
  grunt.registerTask('default', ['copy','less','concat_sourcemap','coffee','concurrent']);
}
;

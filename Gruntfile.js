'use strict';

module.exports = function (grunt) {


  var dep = [
    'src/js/*.js'
    ,'src/js/*/*.js'
  ];

  var dest = 'dest';
  var csses = [
    'src/css/*.css'
  ];
  // Project configuration.
  grunt.initConfig({
      // Metadata.
      pkg: grunt.file.readJSON('package.json'),
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

      less: {
        compile: {
          options: {
            paths: ['src/css/include']
          },
          files: {
            'dest/css/main.css': 'src/css/*.less'
          }
        }
      }
      //,dirs: {
      //  src: 'src/view',
      //  dest: dest+'/view'
      //}
      //,html2js: {
      //  options: {
      //    quoteChar: '\'',
      //    indentString: '    ',
      //    module: 'ganttTemplates',
      //    singleModule: true
      //  },
      //  main: {
      //    src: ['src/template/**/*.html'],
      //    dest: '.tmp/generated/html2js.js'
      //  }
      //}
      ,concat_sourcemap: {
        options: {
          banner: '<%= banner %>',
          sourcesContent: true,
          stripBanners: true
        }
        ,script: {
          files: {
            'dest/js/app.js': dep
          }
        }
      }
      ,watch: {
        jsfile: {
          files: 'src/js/*.js',
          tasks: ['concat_sourcemap:script']
        }
        ,jsfile2: {
          files: 'src/js/*/*.js',
          tasks: ['concat_sourcemap:script']
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
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-concat-sourcemap');
//  grunt.loadNpmTasks('grunt-contrib-concat');
// grunt.loadNpmTasks('grunt-contrib-uglify');
// grunt.loadNpmTasks('grunt-contrib-nodeunit');
// grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  //grunt.loadNpmTasks('grunt-html2js');
//  grunt.loadNpmTasks('grunt-css');
// Default task.
// grunt.registerTask('default', ['jshint', 'nodeunit', 'concat', 'uglify']);
  grunt.registerTask('default', ['less','concat_sourcemap', 'watch']);
}
;

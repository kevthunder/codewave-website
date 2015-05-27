module.exports = function (grunt) {
  grunt.initConfig({
    coffee: {
      compile: {
        options: {
          sourceMap: true
        },
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'js/src/',
            src: ['*.coffee'],
            dest: 'js/',
            ext: '.js'
          },
        ]
      }
    },
    sass: {
      dist: {
        files: {
          'css/app.css': 'sass/app.sass'
        }
      }
    },
    watch: {
        options: {
          atBegin: true,
          livereload: true
        },
        sass:  { files: 'sass/*.sass', tasks: [ 'sass' ] },
        coffee:  { files: ['js/src/**/*.coffee'], tasks: [ 'coffee' ] }
    }
  });

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // register at least this one task
  grunt.registerTask('default', [ 'coffee', 'sass' ]);


};
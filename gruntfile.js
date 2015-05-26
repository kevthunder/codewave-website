module.exports = function (grunt) {
    grunt.initConfig({

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
        // js:  { files: 'js/*.js', tasks: [ 'uglify' ] },
        sass:  { files: 'sass/*.sass', tasks: [ 'sass' ] },
    }
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-sass');

// register at least this one task
grunt.registerTask('default', [ 'sass' ]);


};
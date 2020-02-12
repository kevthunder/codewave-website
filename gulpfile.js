const gulp = require('gulp');
const sass = require('gulp-sass');
var gls = require('gulp-live-server')
var open = require('gulp-open')
 
sass.compiler = require('node-sass');

function swallowError (error) {
  console.log(error.toString())
  this.emit('end')
}
 
gulp.task('sass', function () {
  return gulp.src('./sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('watch', function () {
  return gulp.watch(['./sass/**/*.sass'], function (done) {
    gulp.series('sass')(function () { done() })
  })
    .on('error', swallowError)
})


gulp.task('serve', function (done) {
  var server = gls.static('.')
  server.start()

  var watcher = gulp.watch(['./**/*.*'])
    .on('error', swallowError)
  watcher.on('all', function (event, path, stats) {
    console.log('notify', path)
    server.notify({ path: path })
  })

  done()
})

gulp.task('open', function () {
  var options = {
    uri: 'http://localhost:3000/index.html'
  }
  return gulp.src(__filename)
    .pipe(open(options))
})

gulp.task('build', gulp.series('sass', function (done) {
  console.log('Build Complete')
  done()
}))

gulp.task('demo', gulp.series('build', 'serve', 'open', 'watch'))
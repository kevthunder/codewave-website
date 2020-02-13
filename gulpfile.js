require('dotenv').config()
const gulp = require('gulp');
const sass = require('gulp-sass');
const gls = require('gulp-live-server')
const open = require('gulp-open')
const log = require('fancy-log');
const ftp = require( 'vinyl-ftp' );
 
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

gulp.task('copyLib', function() {
  return gulp.src([
    require.resolve('codewave/dist/codewave.min.js')
  ], {allowEmpty:true})
    .pipe(gulp.dest('./js'));
});

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

gulp.task('build', gulp.series('copyLib', 'sass', function (done) {
  console.log('Build Complete')
  done()
}))

gulp.task('demo', gulp.series('build', 'serve', 'open', 'watch'))

gulp.task( 'deploy', gulp.series('build', function () {

	var conn = ftp.create( {
		host:     process.env.FTP_HOST,
		user:     process.env.FTP_USER,
		password: process.env.FTP_PASS,
		parallel: 10,
		log:      log
	} );

	var globs = [
		'css/**',
		'font/**',
		'img/**',
		'js/**',
		'index.html',
		'favicon.ico'
	];

	// using base = '.' will transfer everything to /public_html correctly
	// turn off buffering in gulp.src for best performance

	return gulp.src( globs, { base: '.', buffer: false } )
		.pipe( conn.newer( '/' ) ) // only upload newer files
		.pipe( conn.dest( '/' ) );

}));
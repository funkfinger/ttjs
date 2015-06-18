var gulp = require('gulp');
var karma = require('karma').server;
var mocha = require('gulp-mocha');


/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('watch-mocha', function() {
  gulp.watch(['src/server/**'], ['mocha']);
});

gulp.task('mocha', function(done){
  return gulp.src(['src/server/__tests__/*.js'], { read: false })
  .pipe(mocha({ reporter: 'list' }));
    // .on('error', gutil.log);
});
var gulp = require('gulp');
var karma = require('karma').server;
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');



gulp.task('test', ['karma', 'mocha']);

gulp.task('watch-mocha', function() {
  gulp.watch(['src/server/**'], ['mocha']);
});

gulp.task('mocha', function(done){
  return gulp.src(['src/server/__tests__/*.js'], { read: false })
  .pipe(mocha({ reporter: 'list' }))
  .once('end', function () {
    process.exit();
  });
  // .on('error', gutil.log);
});

gulp.task('karma', function(done){
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);  
});

gulp.task('eslint', function() {
  return gulp.src([
    'src/**/*.js',
    '!**/__tests__/*.*'
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failOnError());
});  

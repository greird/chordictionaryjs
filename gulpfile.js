// Load plugins
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    qunit = require('gulp-qunit');

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('src/*.js')
        .pipe(gulp.dest('build'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify({ preserveComments: "license" }))
        .pipe(gulp.dest('build'))
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Test Task
gulp.task('test', function() {
    return gulp.src('./_testfiles/index.html')
        .pipe(qunit());
});

// Default task
 gulp.task('default', ['watch'], function() {
   gulp.start('lint', 'test', 'scripts');
 });

// Watch
gulp.task('watch', function() {
  // Watch .js files
  gulp.watch('src/*.js', ['lint', 'scripts']);
});

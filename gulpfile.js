// Load plugins
var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify'),
    csso = require('gulp-csso'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    qunit = require('gulp-qunit'),
    babel = require("gulp-babel");

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('./src/*.js')
        .pipe(babel())
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify({ preserveComments: "license" }))
        .pipe(gulp.dest('./build'))
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('./src/*.js')
        .pipe(eslint({
            'rules': {
                'quotes': [1, 'double', {'avoidEscape': true}],
                'semi': [2, 'always'],
                'eqeqeq': [1, 'smart'],
                'strict': [2, 'safe'], 
                'no-redeclare': 2
            },
            envs: [
                'browser',
                'es6'
            ]
        }))
        .pipe(eslint.format())
});

// CSS task
gulp.task('css', function () {
    return gulp.src('./src/chordictionary.css')
        .pipe(csso())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./build'));
});

// Test Tasks
gulp.task('test', function() {
    return gulp.src('./_testfiles/test_dev.html') // check the src file
        .pipe(qunit());
});
gulp.task('testbuild', function() {
    return gulp.src('./_testfiles/test_build.html') // check the builded file
        .pipe(qunit());
});

// Default task
 gulp.task('default', ['watch'], function() {
   gulp.start('lint', 'scripts');
 });

 // Build task
 gulp.task('build', function() {
   gulp.start('css', 'lint', 'scripts', 'testbuild');
 });

// Watch
gulp.task('watch', function() {
  gulp.watch('./src/*.js', ['lint', 'scripts']);
  gulp.watch('./src/chordictionary.css', ['css']);
});

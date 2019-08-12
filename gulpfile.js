// Load plugins
var gulp = require('gulp'),
eslint = require('gulp-eslint'),
csso = require('gulp-csso'),
rename = require('gulp-rename'),
qunit = require('gulp-qunit'),
babel = require("gulp-babel");
minify = require("gulp-babel-minify");

// Concatenate & Minify JS
gulp.task('scripts', function() {
	return gulp.src('./src/chordictionary.js')
	.pipe(babel())
	.pipe(rename({ suffix: '.min' }))
	.pipe(minify())
	.pipe(gulp.dest('./build'))
});

// Lint Task
gulp.task('lint', function() {
	return gulp.src('./src/*.js')
	.pipe(eslint())
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
	return gulp.src('./_tests/index.html') // check the src file
	.pipe(qunit());
});

// Default task
gulp.task('default', ['watch'], function() {
	gulp.start('lint', 'scripts', 'css');
});

 // Build task
 gulp.task('build', function() {
 	gulp.start('css', 'lint', 'scripts', 'test');
 });

// Watch
gulp.task('watch', function() {
	gulp.watch('./src/*.js', ['lint', 'scripts']);
	gulp.watch('./src/chordictionary.css', ['css']);
});

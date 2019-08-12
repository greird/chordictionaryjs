// Load plugins
var gulp = require('gulp'),
eslint = require('gulp-eslint'),
csso = require('gulp-csso'),
rename = require('gulp-rename'),
qunit = require('gulp-qunit'),
babel = require("gulp-babel");
minify_babel = require("gulp-babel-minify");
minify = require('gulp-minify');

// Lint Task
gulp.task('lint', function() {
	return gulp.src('./src/*.js')
	.pipe(eslint())
	.pipe(eslint.format())
});

//  Transpile for ES6, commonJS and IIFE compatibility, then minify JS
gulp.task('build_es6', function() {
	return gulp.src('./src/chordictionary.js')
	.pipe(minify({
		ext: {
			src:'.js',
			min:'_es6.min.js'
			}, 
		noSource: true
		}))
	.pipe(gulp.dest('./build'))
});
gulp.task('build_commonJS', function() {
	return gulp.src('./src/chordictionary.js')
	.pipe(babel())
	.pipe(rename('chordictionary_commonjs.min.js'))
	.pipe(minify_babel())
	.pipe(gulp.dest('./build'))
});
gulp.task('build_iife', function() {
	/* NOTE: need to build IIFE file first with Rolloup 
		> npm install --global rollup
		> rollup src/chordictionary.js --file src/chordictionary_iife.js --format iife --name chordictionary
		*/
		return gulp.src('./src/chordictionary_iife.js')
		.pipe(babel())
		.pipe(rename({ suffix: '.min' }))
		.pipe(minify_babel())
		.pipe(gulp.dest('./build'))
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
gulp.task('default', function() {
	gulp.start('lint', 'build_es6', 'build_commonJS', 'build_iife', 'css');
});

 // Build task
 gulp.task('build', function() {
 	gulp.start('css', 'lint', 'build_es6', 'build_commonJS', 'build_iife', 'test');
 });

// Watch
gulp.task('watch', function() {
	gulp.watch('./src/*.js', ['lint', 'build_es6', 'build_commonJS', 'build_iife']);
	gulp.watch('./src/chordictionary.css', ['css']);
});

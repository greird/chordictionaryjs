// require(d) gulp for compatibility with sublime-gulp.
var gulp = require('gulp');

const { src, dest, series, parallel } = require('gulp');
const clean = require('gulp-clean');
const eslint = require('gulp-eslint');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const babel = require("gulp-babel");
const minify_babel = require("gulp-babel-minify");
const minify = require('gulp-minify');
const rollup = require('rollup');

// Erase build directory
function cleandist() {
	return gulp.src(['build/*'], {read: false, allowEmpty: true})
	.pipe(clean())
}

// Lint Task
function lint() {
	return gulp.src('./src/*.js')
	.pipe(eslint())
	.pipe(eslint.format())
}

//  Build ES6 module
function build_es6() {
	return gulp.src('./src/*.js')
	.pipe(minify({
		ext: {
			src:'.js',
			min:'.min.js'
		}, 
		preserveComments: 'some',
		noSource: true
	}))
	.pipe(gulp.dest('./build/es6/chordictionary'))
}

// Build CommonJS module
async function build_commonjs() {
	const bundle = await rollup.rollup({
		input: './src/main.js'
	});
	await bundle.write({
		file: './tmp/chordictionary_cjs.js',
		format: 'cjs',
		name: 'chordictionary'
	});
	await gulp.src('./tmp/chordictionary_cjs.js', { allowEmpty: true })
	.pipe(clean())
	.pipe(babel())
	.pipe(rename('chordictionary.min.js'))
	.pipe(minify_babel())
	.pipe(gulp.dest('./build/commonjs'))
}

// Build IIFE script
async function build_iife() {
	const bundle = await rollup.rollup({
		input: './src/main.js'
	});
	await bundle.write({
		file: './tmp/chordictionary_iife.js',
		format: 'iife',
		name: 'chordictionary'
	});
	await gulp.src('./tmp/chordictionary_iife.js', { allowEmpty: true })
	.pipe(clean())
	.pipe(babel())
	.pipe(rename('chordictionary.min.js'))
	.pipe(minify_babel())
	.pipe(gulp.dest('./build/iife'));
}

// CSS task
function css() {
	return gulp.src('./src/chordictionary.css')
	.pipe(csso())
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('./build'));
}

const build = gulp.series(cleandist, gulp.parallel(css, lint), gulp.parallel(build_es6, build_commonjs, build_iife));

exports.lint = lint;
exports.css = css;
exports.clean = cleandist;
exports.build = build;
exports.default = build;

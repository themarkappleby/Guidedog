//-- Includes -----------------------------------------------------
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    stylus = require('gulp-stylus'),
    minify = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    order = require('gulp-order'),
    wrap = require('gulp-wrap'),
    declare = require('gulp-declare'),
    jade = require('gulp-jade'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    handlebars = require('gulp-handlebars'),
    notify = require('gulp-notify');

//-- Vendor Dependencies -----------------------------------------------------
var vendorJSDependencies = [
  './bower_components/js-beautify/js/lib/beautify-html.js',
  './bower_components/jade/jade.js',
  './bower_components/markdown/lib/markdown.js',
  './bower_components/handlebars/handlebars.runtime.js',
  './bower_components/prism/prism.js',
  './bower_components/prism/components/prism-haskell.js',
  './bower_components/prism/plugins/line-numbers/prism-line-numbers.js',
  './bower_components/zeroclipboard/dist/ZeroClipboard.js',
  './bower_components/js-yaml/dist/js-yaml.js'
];
var vendorCSSDependencies = [ 
  './bower_components/prism/themes/prism-coy.css',
  './bower_components/prism/plugins/line-numbers/prism-line-numbers.css'
];
var vendorSWFDependencies = [
  './bower_components/zeroclipboard/dist/ZeroClipboard.swf'
]

//-- Compile JS -----------------------------------------------------
gulp.task('guidedog-js', function(){
  vendorJSDependencies.push('./src/template/guidedog.js');
  vendorJSDependencies.push('./src/js/guidedog.js');
  gulp.src(vendorJSDependencies)
    .pipe(concat('guidedog.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});
gulp.task('example-js', function(){
  gulp.src('./example/src/js/**/*.js')
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./example/js/'));
});

//-- Move SWFs -----------------------------------------------------
gulp.task('guidedog-swf', function(){
  gulp.src(vendorSWFDependencies)
    .pipe(gulp.dest('./dist/'));
});

//-- Compile Styles -----------------------------------------------------
gulp.task('guidedog-css', function(){
  // compile guidedog stylus
  gulp.src('./src/styl/**/*.styl')
    .pipe(stylus())
    .on("error", notify.onError(function (error) {
      return "Stylus error: " + error.message;
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minify())
    .pipe(gulp.dest('./src/css/'));
  // merge compiled guidedog stylus with vendor CSS
  vendorCSSDependencies.push('./src/css/guidedog.css')
  gulp.src(vendorCSSDependencies)
    .pipe(concat('guidedog.css'))
    .pipe(minify())
    .pipe(gulp.dest('./dist/'));
});
gulp.task('example-css', function(){
  gulp.src('./example/src/styl/**/*.styl')
    .pipe(stylus())
    .on("error", notify.onError(function (error) {
      return "Stylus error: " + error.message;
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minify())
    .pipe(gulp.dest('./example/css/'));
});

//-- Compile Views -----------------------------------------------------
gulp.task('guidedog-views', function(){
  gulp.src('./src/template/guidedog.handlebars')
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'Guidedog.templates',
      noRedeclare: true,
    }))
    .pipe(gulp.dest('./src/template/'));
});
gulp.task('example-views', function(){
  gulp.src('./example/src/jade/index.jade')
    .pipe(jade({
      pretty: true
    }))
    .on("error", notify.onError(function (error) {
      return "Jade error: " + error.message;
    }))
    .pipe(gulp.dest('./example/'));
});

//-- Start local server -----------------------------------------------------
gulp.task('server', function() {
  nodemon({
    verbose: false,
    script: 'server.js',
    watch: ['source', 'server.js'],
    ext: 'js json',
    env: {
      NODE_ENV: 'development'
    }
  })
})

//-- Watch Files for Changes -----------------------------------------------------
gulp.task('watch', function(){
  gulp.watch('./example/src/jade/index.jade', ['example-views']);
  gulp.watch('./example/src/js/**/*.js', ['example-js']);
  gulp.watch('./example/src/styl/**/*.styl', ['example-css']);

  gulp.watch('./src/template/guidedog.handlebars', ['guidedog-views']);
  gulp.watch('./src/js/guidedog.js', ['guidedog-js']);
  gulp.watch('./src/styl/**/*.styl', ['guidedog-css']);
})

//-- Default Task -----------------------------------------------------
gulp.task('default', ['example-views', 'example-js', 'example-css', 'guidedog-swf', 'guidedog-views', 'guidedog-js', 'guidedog-css', 'watch', 'server']);

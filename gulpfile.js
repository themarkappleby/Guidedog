//-- Includes -----------------------------------------------------
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    stylus = require('gulp-stylus'),
    minify = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    order = require('gulp-order'),
    jade = require('gulp-jade'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    notify = require('gulp-notify');

//-- Vendor Dependencies -----------------------------------------------------
var vendorJSDependencies = [
  './vendor/beautify-html/beautify-html.js',
  './vendor/jade/jade.js',
  './vendor/markdown/markdown.js',
  './vendor/mustache/mustache.js',
  './vendor/prism/prism.js',
  './vendor/zeroclipboard/ZeroClipboard.js',
  './vendor/yaml/js-yaml.js',
];
var vendorCSSDependencies = [ 
  './vendor/prism/prism.css'
];
var vendorSWFDependencies = [
  './vendor/zeroclipboard/ZeroClipboard.swf'
]

//-- Compile JS -----------------------------------------------------
gulp.task('guidedog-js', function(){
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
    .pipe(gulp.dest('./vendor/guidedog/'));
  // merge compiled guidedog stylus with vendor CSS
  
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //vendorCSSDependencies.push('./vendor/guidedog/guidedog.css')
  //gulp.src(vendorCSSDependencies)
  gulp.src(['./vendor/guidedog/guidedog.css', './vendor/prism/prism.css'])
  
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
  gulp.src('./src/html/template.html')
    .pipe(gulp.dest('./dist/'));
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

  gulp.watch('./src/html/template.html', ['guidedog-views']);
  gulp.watch('./src/js/guidedog.js', ['guidedog-js']);
  gulp.watch('./src/styl/**/*.styl', ['guidedog-css']);
})

//-- Default Task -----------------------------------------------------
gulp.task('default', ['example-views', 'example-js', 'example-css', 'guidedog-swf', 'guidedog-views', 'guidedog-js', 'guidedog-css', 'watch', 'server']);

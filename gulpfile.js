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
    notify = require('gulp-notify'),
    fs = require('fs'),
    s3 = require("gulp-s3"),
    db = require('./db');

//-- Bower Dependencies -----------------------------------------------------

var bowerJsDependencies = [
  './bower_components/jquery/dist/jquery.js',
  './vendor/javascript/jquery.bxslider.min.js',
  './vendor/javascript/jquery.accordion.js',
  './vendor/javascript/jquery-ui.min.js'
];

var bowerCSSDependencies = [
  './vendor/css/jquery.bxslider.css',
  './vendor/css/jquery-ui.css'
];

//-- Icons -----------------------------------------------------

gulp.task('icons', function() {
  gulp.src('./source/icons/fonts/*')
    .pipe(gulp.dest('./dist/css/fonts'));

  gulp.src('./source/icons/style.css')
    .pipe(rename('_icons.styl'))
    .pipe(gulp.dest('./source/stylus/initializers/'));
});

//-- Staging Deploy -----------------------------------------------------

gulp.task('deploy', function() {
  aws = JSON.parse(fs.readFileSync('./aws.json'));
  gulp.src('./dist/**')
      .pipe(s3(aws));
  gulp.src('./source/icons/**')
      .pipe(s3(aws, {
        uploadPath: 'source/icons/'
      }));
  gulp.src('./bower_components/**')
      .pipe(s3(aws, {
        uploadPath: 'bower_components/'
      }));
});

//-- Convert Jade to HTML -----------------------------------------------------

gulp.task('jade', function() {
  return gulp.src('./source/jade/*.jade')
    .pipe(jade({
      locals: db,
      pretty: true
    }))
    .on("error", notify.onError(function (error) {
      return "Jade error: " + error.message;
    }))
    .pipe(gulp.dest('./dist/'));
});

//-- Concat & Minify Stylus -----------------------------------------------------

gulp.task('styl', function() {
  return gulp.src('./source/stylus/urbanadventures.styl')
    .pipe(stylus())
    .on("error", notify.onError(function (error) {
      return "Stylus error: " + error.message;
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minify())
    .pipe(gulp.dest('./dist/css'));
});

//-- Concat & Minify JS -----------------------------------------------------
gulp.task('js', function() {
  return gulp.src('./source/js/*.js')
    .pipe(order([
      'urbanadventures.js',
      '*.js'
    ]))
    .pipe(concat('urbanadventures.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

//-- Manage vendor JS -----------------------------------------------------
gulp.task('vendor-js', function() {
  return gulp.src(bowerJsDependencies)
    .pipe(order([
      'jquery.js',
      '*.js'
    ]))
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

//-- Manage vendor CSS -----------------------------------------------------
gulp.task('vendor-css', function() {
  return gulp.src(bowerCSSDependencies)
    .pipe(minify())
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest('./dist/css'));
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
  gulp.watch('./source/jade/**/*.jade', ['jade']);
  gulp.watch('./source/js/**/*.js', ['js']);
  gulp.watch('./source/stylus/**/*.styl', ['styl']);
})

//-- Default Task -----------------------------------------------------

gulp.task('default', ['icons', 'styl', 'js', 'jade', 'vendor-js', 'vendor-css', 'server', 'watch']);

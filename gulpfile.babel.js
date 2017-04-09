import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'

const $ = gulpLoadPlugins()

gulp.task('script', () =>
  gulp.src('es6/**/*.js')
    .pipe($.babel())
    .pipe(gulp.dest('src'))
)

//var gulp = require('gulp');
//var babel = require('gulp-babel');
//
//gulp.task('default', function () {
//    return gulp.src(['src/*.js', 'src/**/*.js'])
//        .pipe(babel())
//        .pipe(gulp.dest('dist'));
//});

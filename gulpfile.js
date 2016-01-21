var gulp = require('gulp');
var tsc = require('gulp-typescript');
var merge = require('merge2');
var del = require('del');

gulp.task('clean', function() {
  del('dist');
})

gulp.task('copy', ['clean'], function() {
  return gulp.src(['app/**/*', '!app/**/*.ts']).pipe(gulp.dest('dist/app'));
})

gulp.task('compile', ['clean'], function() {
  var proj = tsc.createProject('tsconfig.json');
  var result = gulp.src(['app/**/*.ts', 'typings/**/*.d.ts'])
                   .pipe(tsc(proj, { typescript: require('typescript') }));

  return merge([
    result.dts.pipe(gulp.dest('dist/definitions')),
    result.js.pipe(gulp.dest('dist/app'))
  ])
});

gulp.task('default', ['copy', 'compile']);

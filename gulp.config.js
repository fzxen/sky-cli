const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');
// const concat = require('gulp-concat')
const del = require('del');

const path = './packages/**/*.ts';

const tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', async () => {
  await del(['./dist']);
});

gulp.task('eslint', async () => {
  await gulp
    .src(path)
    .pipe(eslint())
    .pipe(eslint.format());
  // .pipe(eslint.failAfterError())
});

gulp.task('compress', async () => {
  await tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(babel())
    // .pipe(concat('cli.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', async () => {
  await gulp.watch(path, gulp.series('eslint', 'compress'));
});

gulp.task('default', gulp.series('clean', 'eslint', 'compress', 'watch'));

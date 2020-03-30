const gulp = require('gulp')
const eslint = require('gulp-eslint')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
// const concat = require('gulp-concat')
const del = require('del')

const path = './packages/**/*.js'

gulp.task('clean', async () => {
  await del(['./dist'])
})

gulp.task('eslint', async () => {
  await gulp
    .src(path)
    .pipe(eslint())
    .pipe(eslint.format())
  // .pipe(eslint.failAfterError())
})

gulp.task('compress', async () => {
  await gulp
    .src(path)
    .pipe(babel())
    // .pipe(concat('cli.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
})

gulp.task('watch', async () => {
  await gulp.watch(path, gulp.series('eslint', 'compress'))
})

gulp.task('default', gulp.series('clean', 'eslint', 'compress', 'watch'))

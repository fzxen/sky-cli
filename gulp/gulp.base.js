const gulp = require('gulp');
const eslint = require('gulp-eslint');
const ts = require('gulp-typescript');
const del = require('del');

const pathMap = {
  sli: '../packages/sli',
  'sli-vue': '../packages/sli-vue',
  'sli-react': '../packages/sli-react',
  'sli-electron': '../packages/sli-electron',
};

module.exports = async key => {
  const rootPath = pathMap[key];
  const path = `${rootPath}/lib/**/*.ts`;
  const outputPath = `${rootPath}/dist/`;

  const tsProject = ts.createProject('../tsconfig.json');

  gulp.task('clean', async () => {
    await del([outputPath], { force: true });
  });

  gulp.task('eslint', async () => {
    await gulp.src(path).pipe(eslint()).pipe(eslint.format());
    // .pipe(eslint.failAfterError())
  });

  gulp.task('compress', async () => {
    await gulp.src(path).pipe(tsProject()).js.pipe(gulp.dest(outputPath));
  });

  gulp.task('watch', async () => {
    await gulp.watch(path, gulp.series('eslint', 'compress'));
  });

  gulp.task('default', gulp.series('clean', 'eslint', 'compress', 'watch'));
};

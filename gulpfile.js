import gulp from 'gulp';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
// import path from 'path';

function processESMCSS() {
  return gulp.src('src/components/**/style/*.css')
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest((file) => 'dist/esm/components'));
}

function processCJSCSS() {
  return gulp.src('src/components/**/style/*.css')
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest((file) => 'dist/cjs/components'));
}

export default gulp.series(
  gulp.parallel(processESMCSS, processCJSCSS)
);
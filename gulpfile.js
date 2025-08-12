const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const terser = require("gulp-terser");
const browserSync = require("browser-sync").create();

//compile scss
function styles() {
  return gulp.src("./scss/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./css"))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.stream());
}

//minify js
function scripts() {
  return gulp.src("./js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./js/min"))
    .pipe(browserSync.stream());
}

//dev server
function serve() {
  browserSync.init({
    server: { baseDir: "./" }
  });
  gulp.watch("./scss/**/*.scss", styles);
  gulp.watch("./js/**/*.js", scripts);
  gulp.watch("./*.html").on("change", browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.serve = gulp.series(styles, scripts, serve);
exports.default = gulp.series(styles, scripts, serve);

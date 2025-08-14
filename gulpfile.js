const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const terser = require("gulp-terser");
const browserSync = require("browser-sync").create();
const fileInclude = require('gulp-file-include');

// HTML con includes (sections)
function html() {
  return gulp.src(['src/*.html', '!src/sections/**'])
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
}

// SCSS → CSS minificado
function styles() {
  return gulp.src("./scss/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./dist/css"))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
}

// JS minificado
function scripts() {
  return gulp.src("./js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/js/min"))
    .pipe(browserSync.stream());
}

// Servidor local y watcher
function serve() {
  browserSync.init({
    server: { baseDir: "./dist" }
  });

  gulp.watch("src/**/*.html", html);
  gulp.watch("./scss/**/*.scss", styles);
  gulp.watch("./js/**/*.js", scripts);
}

exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.serve = gulp.series(html, styles, scripts, serve);
exports.default = gulp.series(html, styles, scripts, serve);

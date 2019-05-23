const paths = {
  src: {
    js: ['src/js/**/*.js', '!src/js/lib/**/*'],
    jsLibs: 'src/js/lib/**/*.js',
    css: 'src/styles/**/*.css',
    scss: 'src/styles/sass/*.scss',
  },
  build: {
    js: 'public/javascripts',
    jsLibs: 'public/javascripts/lib',
    styles: 'public/stylesheets',
  },
  watch: {
    js: ['src/js/**/*.js', '!src/js/lib/**/*'],
    jsLibs: 'src/js/lib/**/*.js',
    css: 'src/styles/**/*.css',
    scss: 'src/styles/sass/**/*.scss',
  },
};

const browserSync = require('browser-sync');
const server = browserSync.create();

const gulp = require('gulp');
const sass = require('gulp-sass');
const mode = require('gulp-mode')();
const minify = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');

const autoprefixerConfig = {
  browsers: [
    'last 4 version',
  ],
  grid: 'autoplace',
  cascade: false
}

// Build js uglifier
const uglifyComposer = require('gulp-uglify/composer');
const uglifyEs = require('uglify-es');
const uglify = uglifyComposer(uglifyEs, console);

const buildSass = () => {
  return gulp.src(paths.src.scss)
    .pipe(mode.development(sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(minify({
      forceMediaMerge: false,
    }))
    .pipe(autoprefixer(autoprefixerConfig))
    .pipe(mode.development(sourcemaps.write()))
    .pipe(gulp.dest(paths.build.styles))
    .pipe(browserSync.stream());
}

const buildStyles = () => {
  return gulp.src(paths.src.css)
    .pipe(mode.development(sourcemaps.init()))
    .pipe(minify())
    .pipe(autoprefixer(autoprefixerConfig))
    .pipe(mode.development(sourcemaps.write()))
    .pipe(gulp.dest(paths.build.styles))
    .pipe(browserSync.stream());
};

const clearBuild = (cb) => {
  del(['public/js', 'public/styles'], cb);
};

const buildJs = () => {
  return gulp.src(paths.src.js)
    .pipe(mode.development(sourcemaps.init()))
    .pipe(mode.production(uglify()))
    .pipe(mode.development(sourcemaps.write()))
    .pipe(gulp.dest(paths.build.js))
    .pipe(browserSync.stream());
};

const buildJsLibs = () => {
  return gulp.src(paths.src.jsLibs)
    .pipe(gulp.dest(paths.build.jsLibs))
    .pipe(browserSync.stream());
};

/**
 * WATCHERS SECTION
 */
const watch = () => {
  const bs = server.init({
    proxy: "localhost:3000",
    port: 5000, 
    files: [ 
      'public/**/*.*',
      'views/**/*.pug'
    ],
    browser: 'google chrome',
    notify: true
  })

  gulp.watch(paths.watch.js, buildJs)
  gulp.watch(paths.watch.jsLibs, buildJsLibs);
  gulp.watch(paths.watch.css, buildStyles);
  gulp.watch(paths.watch.scss, buildSass);
};

const build = gulp.parallel(buildStyles, buildSass, buildJs, buildJsLibs);

const dev = gulp.series(
  build,
  watch,
);

module.exports = {
  default: build,
  watch,
  build,
  buildStyles,
  buildSass,
  buildJs,
  buildJsLibs,
  dev
}
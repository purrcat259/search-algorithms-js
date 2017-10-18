import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';

let vacuumWorldFile = './src/js/demo-vacuum-world.js';


let stripDirectory = (path) => {
    path.dirname = '';
};

gulp.task('build_js_dist', () => {
    let b = browserify(vacuumWorldFile);

    return b
        .transform(babelify)
        .bundle()
        .pipe(source(vacuumWorldFile))
        .pipe(buffer())
        .pipe(rename(stripDirectory))
        .pipe(gulp.dest('./dist'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('build_js', () => {
    let b = browserify(vacuumWorldFile);
    return b.transform(babelify)
        .bundle()
        .pipe(source(vacuumWorldFile))
        .pipe(buffer())
        .pipe(rename(stripDirectory))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'));
});

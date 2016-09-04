var
    gulp         = require('gulp'),
    del          = require('del'),
    sourcemaps   = require('gulp-sourcemaps'),
    jade         = require('gulp-jade'),
    postcss      = require('gulp-postcss'),
    cssnext      = require('postcss-cssnext'),
    cssimport    = require('postcss-import'),
    extend       = require('postcss-extend'),
    cssnano      = require('cssnano'),
    plumber      = require('gulp-plumber'),
    imageMin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    browserSync  = require('browser-sync').create();

/*------------------------ paths --------------------------*/

var
    paths = {
        jade : {
            location    : './src/markups/**/*.jade',
            compiled    : './src/markups/pages/*.jade',
            destination : './dist/'
        },

        css : {
            location    : './src/style/**/*.css',
            compiled    : './src/style/main.css',
            destination : './dist/css/'
        },

        js : {
            location    : './src/js/main.js',
            destination : './dist/js/'
        },

        img : {
            location    : './src/img/**/*',
            images      : './src/img/images/*',
            logos       : './src/img/logos/*',
            icons       : './src/img/icons/*',
            destination : './dist/images/'
        },

        fonts : {
            location    : './src/fonts/*',
            destination : './dist/fonts/'
        },

        browserSync : {
            baseDir    : './dist/',
            watchPaths : ['./dist/*.html', './dist/css/*.css' ]
        }
    }

/*-------------------------- jade ------------------------------*/

gulp.task('jade', function() {
    gulp.src(paths.jade.compiled)
        .pipe(plumber())
        .pipe(jade({
            pretty: '\t',
        }))
        .pipe(gulp.dest(paths.jade.destination));
});

/*-------------------- browser-sync ----------------------*/

gulp.task('sync', function () {
    browserSync.init({
        server: {
            baseDir: paths.browserSync.baseDir
        }
    });
});

/*---------------------- style -------------------------*/

gulp.task('style', function () {
    var processors = [
            cssimport,
            extend,
            cssnext({ browsers: ['last 2 versions', '> 1%', 'iOS > 7', 'Firefox ESR', 'Opera 12.1', 'ie >= 7'] }),
            cssnano({
                autoprefixer: false
            })
    ];
    gulp.src(paths.css.compiled)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.css.destination));
});
/*---------------------- images ---------------------------*/

gulp.task('img-min', function() {
    gulp.src([paths.img.images, paths.img.logos, paths.img.icons])
        .pipe(imageMin({
            use:[pngquant({quality: '65-80'})]
        }))
        .pipe(gulp.dest(paths.img.destination));
});

/*------------------ fonts -----------------*/

gulp.task('fonts', function() {
    gulp.src(paths.fonts.location)
        .pipe(gulp.dest(paths.fonts.destination))
});

/*------------------ js -----------------*/

gulp.task('js', function() {
    gulp.src(paths.js.location)
        .pipe(gulp.dest(paths.js.destination))
});

/*---------------- clean ------------*/

gulp.task('clean', function () {
    del(paths.img.destination);
});

/*----------------------- watch ---------------------------*/

gulp.task('watch', function() {
    gulp.watch(paths.css.location, ['style']);
    gulp.watch(paths.jade.location, ['jade']);
    gulp.watch(paths.js.location, ['js']);
    gulp.watch(paths.img.location, ['clean', 'img-min']);
    gulp.watch(paths.browserSync.watchPaths).on('change', browserSync.reload);
});

gulp.task('default', ['img-min','jade', 'js', 'style', 'fonts', 'watch', 'sync']);
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleancss = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    uglify = require('gulp-uglifyjs'),
    gutil = require('gulp-util'),
    ftp = require('vinyl-ftp');

var urlscss = 'app/scss/**/*.scss',
    urlcss = 'app/css/**/*.css',
    urljs = 'app/js/**/*.js',
    urlfonts = 'app/fonts/**/*',
    urlimg = 'app/img/**/*',
    urlhtml = 'app/*.html';

// SASS
gulp.task('sass', function (done) {
    gulp.src(urlscss)
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
        }))
        .pipe(cleancss({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('app/css'))
    done();
});

// SCRIPTS
gulp.task('scripts', function (done) {
    gulp.src([
            'app/js/**/*.js'
        ])
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
    done();
});

// CLEAN PRODUCTION FOLDER
gulp.task('clean', function (done) {
    del.sync('public_html');
    done();
});

// WATCH
gulp.task('watch', function (done) {
    gulp.watch(urlscss, gulp.series('sass'));
    gulp.watch(urljs, gulp.series('scripts'));
    done();
});

// BUILD 
gulp.task('build', gulp.series('clean', 'sass', 'scripts', function (done) {
    var buildcss = gulp.src(urlcss)
        .pipe(gulp.dest('public_html/assets/css'));
    console.log('CSS was built');
    var buildjs = gulp.src(urljs)
        .pipe(gulp.dest('public_html/assets/js'));
    console.log('JS was built');
    var buildhtml = gulp.src(urlhtml)
        .pipe(gulp.dest('public_html'));
    console.log('HTML was built');
    var buildfonts = gulp.src(urlfonts)
        .pipe(gulp.dest('public_html/assets/fonts'));
    console.log('Fonts were built');
    var buildfonts = gulp.src(urlimg)
        .pipe(gulp.dest('public_html/assets/img'));
    console.log('Images were built');
    done();
}));

// DEPLOY
gulp.task('deploy', function () {
    var ftpdata = require('./app/config/ftpdata.json');
    var conn = ftp.create({
        host: ftpdata.host,
        user: ftpdata.user,
        password: ftpdata.pass,
        parallel: 10,
        log: gutil.log
    });
    var globs = [
        'public_html/**'
    ];
    return gulp.src(globs, {
            base: '.',
            buffer: false
        })
        .pipe(conn.newer('/'))
        .pipe(conn.dest('/'));

});

// DEFAULT TASK
gulp.task('default', gulp.series('watch'));
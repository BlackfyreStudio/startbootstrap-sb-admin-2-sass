var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require('browser-sync').create();

var paths = {
    source: {
        sass: 'sass/**/*.scss',
        fonts: [
            'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*.{eot,svg,ttf,woff,woff2}',
            'bower_components/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}'
        ],
        images: [
            'bower_components/datatables-plugins/integration/bootstrap/images/*.{jpg,png}'
        ],
        scripts: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
            'bower_components/metisMenu/dist/metisMenu.js',
            'bower_components/raphael/raphael.js',
            'bower_components/morrisjs/morris.js',
            'bower_components/flot/excanvas.js',
            'bower_components/flot/jquery.flot.js',
            'bower_components/flot/jquery.flot.pie.js',
            'bower_components/flot/jquery.flot.resize.js',
            'bower_components/flot/jquery.flot.time.js',
            'bower_components/flot.tooltip/js/jquery.flot.tooltip.js',
            'bower_components/datatables/media/js/jquery.dataTables.js',
            'bower_components/datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.js',
            'js/admin.js'
        ]
    },
    dest: {
        styles: 'dist/css',
        fonts: 'dist/fonts',
        images: 'dist/images',
        scripts: 'dist/js'
    }
};

gulp.task('watch', ['compile'], function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });


    gulp.watch(paths.source.sass, ['sass']);
    gulp.watch('js/*.js',['scripts:watch']);
    gulp.watch("pages/*.html").on('change', browserSync.reload);
});

gulp.task('sass', function () {
    return gulp.src(paths.source.sass)
        .pipe(sass())
        .pipe(gulp.dest(paths.dest.styles))
        .pipe(browserSync.stream());
});

gulp.task('sass:minify', ['sass'], function() {
    return gulp.src(paths.dest + '/sb-admin-2.css')
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest(paths.dest.styles));
});

gulp.task('fonts', function() {
    return gulp.src(paths.source.fonts)
        .pipe(gulp.dest(paths.dest.fonts))
});

gulp.task('images', function() {
    return gulp.src(paths.source.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(paths.dest.images));
});

gulp.task('scripts', function () {
    return gulp.src(paths.source.scripts)
        .pipe(concat('admin.js'))
        .pipe(gulp.dest(paths.dest.scripts))
});

gulp.task('scripts:watch',['scripts'],browserSync.reload);

gulp.task('scripts:uglify',['scripts'], function () {
    return gulp.src(paths.dest.scripts + '/admin.js')
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest.scripts));
});

gulp.task('compile',['sass','fonts','images','scripts'], function() {

});
gulp.task('compile:dist',['sass:minify','fonts','images','scripts:uglify'], function() {

});
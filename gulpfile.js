var gulp = require('gulp'),
    header = require('gulp-header'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    Glue = require('gluejs'),
    fs = require('fs'),
    pkg = require('./package.json');

var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

//
//
// JS building

gulp.task('gluejs', function (cb) {
    var outstream = fs.createWriteStream('./dist/leerstandsmelder-apiclient-web.js');
    outstream.on('finish', cb);
    new Glue()
        .basepath('./src')
        .include([
            './web-leerstandsmelder-apiclient.js',
            './apiclient.js',
            './http/xmlhttp.js',
            './util/data-parser.js',
            './util/auth-header.js'
        ])
        .main('web-leerstandsmelder-apiclient.js')
        .export('LMApi')
        .render(outstream);
});

gulp.task('default', ['gluejs'], function () {
    return gulp.src('./dist/leerstandsmelder-apiclient-web.js')
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(uglify())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest('./dist/'));
});

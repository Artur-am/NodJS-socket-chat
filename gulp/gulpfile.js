"use strict";

let gulp = require( "gulp" ),
    watch = require( "gulp-watch" ),
    rigger = require( "gulp-rigger" ),
    preprocess = require( "gulp-preprocess" ),
    concat = require( "gulp-concat" ),
    sourcemaps = require( "gulp-sourcemaps" ),
    cssmin = require( "gulp-minify-css" ),
    minify = require( "gulp-minify" ),
    stylus = require( "gulp-stylus" ),
    rename = require( "gulp-rename" ),
    prefixer = require( "gulp-autoprefixer" ),
    browserSync = require( "browser-sync" ),
    reload = browserSync.reload,
    rimraf = require( "rimraf" );

let projectPath = "../app/";
let buildPath = "../build";
let lib = projectPath + "assets/";
let buildLib = buildPath + "/assets/";

let projectPaths = {
    "app" : {
        "html" : [
            projectPath + "index.html"
        ],
        "css" : [
            lib + "css/main.styl"
        ],
        "js" : [
            lib + "js/main.js"
        ],
        "audio" : [
            lib + "audio/*.mp3"
        ]
    },
    "watch" : {
        "html" : [
            projectPath + "index.html"
        ],
        "css" : [
            lib + "css/*.styl"
        ],
        "js" : [
            lib + "js/*.js",
            lib + "js/**/*.js"
        ],
        "audio" : [
            lib + "audio/*.mp3"
        ]
    },
    "dist" : {
        html: buildPath,
        css: buildLib + "css/",
        js: buildLib + "js/",
        audio: buildLib + "audio/"
    },
    "clean" : buildPath
};

let config = {
    server: {
        baseDir:  buildPath,
        index: "index.html"
    },
    port: 9000,
    open: true,
    notify: false
};

function getPreprocessContext(value){
    return {
        NODE_ENV: value,
        DEBUG: true
    };
}

function Html(){
    return gulp.src( projectPaths.app.html )
            .pipe( rigger() )
            .pipe( preprocess( {
                    context: getPreprocessContext("watch")
                })
            )
            .pipe( gulp.dest( projectPaths.dist.html ) )
            .pipe( reload( { stream: true } ) );
}

function HtmlBuild(){
    return gulp.src( projectPaths.app.html )
            .pipe( rigger() )
            .pipe( preprocess( {
                    context: getPreprocessContext("build")
                })
            )
            .pipe( gulp.dest(projectPaths.dist.html) )
            .pipe( reload( { stream: true } ) );
}

function JsBuild(){
    return gulp.src( projectPaths.app.js )
            .pipe( concat( "main.js" ) )
            .pipe( rigger() )
            .pipe( sourcemaps.init() )
            .pipe( minify() )
            .pipe( sourcemaps.write() )
            .pipe( reload( { stream: true } ) )
            .pipe( gulp.dest( projectPaths.dist.js ) );
}
function Audio(){
    return gulp.src(projectPaths.app.audio)
            .pipe(gulp.dest(projectPaths.dist.audio));
}

function StylusBuild(){
    return gulp.src( projectPaths.app.css )
            .pipe( sourcemaps.init() )
            .pipe( stylus() )
            .pipe( concat("style.css") )
            .pipe( prefixer( [
                    'last 15 versions',
                    '> 1%',
                    'ie 8',
                    'ie 7'
                ],
                { cascade: true }
                )
            )
            .pipe( sourcemaps.write() )
            .pipe( gulp.dest( projectPaths.dist.css ) )
            .pipe( reload( { stream: true } ) );
}

function CssBuild(){
	return gulp.src( projectPaths.dist.css + "style.css"  )
		.pipe( cssmin() )
		.pipe( rename( { suffix: ".min" } ) )
		.pipe( gulp.dest( projectPaths.dist.css ) );
}

function Clean(cb){
    rimraf( projectPaths.clean, cb );
}

function Webserver(){
    browserSync.init(config);
}

function WatchFiles(){
    watch( projectPaths.watch.html, Html );
    watch( projectPaths.watch.css, css );
    watch( projectPaths.watch.js, JsBuild );
    watch( projectPaths.watch.audio, Audio );
}

let css = gulp.series( StylusBuild, CssBuild );

gulp.task( "html", Html );
gulp.task( "html:build", HtmlBuild );
gulp.task( "js:build", JsBuild );
gulp.task( "audio:build", Audio );
gulp.task( "styles:build", StylusBuild );
gulp.task( "css:build", css );

gulp.task( "build", gulp.series( HtmlBuild, JsBuild, Audio, css ) );
gulp.task( "watch", gulp.parallel( WatchFiles, Webserver ) );
gulp.task( "webserver", Webserver );

gulp.task( "clean", Clean );
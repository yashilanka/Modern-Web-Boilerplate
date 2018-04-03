var fs = require("fs"),
    config = JSON.parse(fs.readFileSync("./settings.json", "utf8")),
    ftp = JSON.parse(fs.readFileSync("./ftp-config.json", "utf8")),
    $ = require("gulp-load-plugins")(),
    argv = require("yargs").argv,
    browser = require("browser-sync").create(
        config.sitename + "Front End Dev Server"
    ),
    htmlInjector = require("bs-html-injector"),
    inject = require('gulp-inject'),
    gulp = require("gulp"),
    del = require("del"),
    panini = require("panini"),
    path = require("path"),
    fs = require("fs"),
    sequence = require("run-sequence"),
    home = require("home"),
    merge = require("merge-stream"),
    os = require("os"),
    inlineimage = require("gulp-inline-image"),
    compass = require("compass-importer"),
    inquirer = require("inquirer"),
    cdnizer = require("gulp-cdnizer"),
    cachebust = require('gulp-cache-bust'),
    deploy = require('vinyl-ftp'),
    encrypt = require('gulp-javascript-obfuscator'),
    cleanCSS = require("gulp-clean-css");


// Variable Caching  
var jsPath = config.jsPath,
    jsName = config.jsName,
    cssName = config.cssName,
    sassPath = config.sassPath,
    sassFiles = config.sassFiles,
    jsFiles = config.jsFiles,
    webPath = config.webpagePath,
    imgPath = config.imgPath,
    otherPath = config.othersPath,
    iconfontName = config.iconfont.name,
    svgPath = config.iconfont.svgPath,
    sketchPath = config.iconfont.sketchPath,
    fontClassName = config.iconfont.fontClassName;


// combine js
var combijs = config.jsComponents;
combijs.push(jsPath + jsFiles);


// Debug in Chrome
module.exports = gulp;

//Get Cross Platform Home Folder
var desktop = "~/Desktop";

// Check for --production flag
var isProduction = !!argv.production;

// Browsers targets when prefixing CSS.
// var COMPATIBILITY = ['> 5%', 'last 5 versions', 'ie >= 9', 'ie 6-8', 'last 2 Android versions', 'Firefox ESR'];
var COMPATIBILITY = [
    "> 5%",
    "last 2 versions",
    "ie >= 10",
    "ie 6-8",
    "last 2 Android versions",
    "Firefox ESR"
];
var isWindows = /^win/.test(os.platform());


// Combine onTime if neccesory and read package.json. also read jquery version
// var combine_js = cdn_js.concat(components_path);
var pkg = require("./package.json");
var jq_version = pkg.dependencies.jquery.replace(/[^\d.-]/g, "");

// Cleans build directory
gulp.task("clean", function() {
    return del(["./build", "./src/scss/others/fonts.scss"]);
});

var currentdate = new Date();
var datetime =
    "backup--" +
    currentdate.getDate() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getFullYear() +
    "__" +
    currentdate.getHours() +
    "." +
    currentdate.getMinutes() +
    "." +
    currentdate.getSeconds();


// Copies user-created files
gulp.task("copy", function() {
    var dirs = [
        "./src/**/*.*",
        "!./src/{scss,svg,sketch,js,fonts,img,tempCss,svg-icon,.hidden,helpers,others}/**/*.*",
        "!./src/_bin/**/*.*",
        "!./src/data/**/*.*",
        "!" + webPath + "layouts/**/*.*",
        "!" + webPath + "pages/**/*.*",
        "!" + webPath + "partials/**/*.*"
    ];

    var assetsFont = [
        "./src/fonts/*.*"
    ];

    gulp
        .src(dirs, {
            base: "./src/"
        })
        .pipe(gulp.dest("./build/"));

    // fonts
    gulp.src(assetsFont).pipe(gulp.dest("./build/css/fonts/"));

    //jquery
    gulp
        .src("./node_modules/jquery/dist/jquery.min.js")
        .pipe(gulp.dest("./build/js/"));

    gulp.src(otherPath + "**/*.*", {
        dot: true
    }).pipe(gulp.dest("./build/"));
});

// Copy page templates into finished HTML files
gulp.task("pages", function() {
    gulp
        .src(webPath + "pages/**/*.{html,hbs,handlebars,md}")
        .pipe(cachebust({
            type: 'timestamp'
        }))
        .pipe(
            panini({
                root: webPath + "pages/",
                layouts: webPath + "layouts/",
                partials: webPath + "partials/**/",
                data: webPath + "data/",
                helpers: webPath + "helpers/"
            })
        )
        .pipe(
            $.preprocess({
                context: {
                    isProduction: !!argv.production,
                    name: config.sitename,
                    css: cssName,
                    js: jsName,
                    isBundle: config.combineJsFile,
                    DEBUG: true
                }
            })
        )
        .pipe(
            cdnizer({
                fallbackScript: "<script>function jqFallback(u) {document.write('<scr'+'ipt src=\"'+encodeURIComponent(u)+'\"></scr'+'ipt>');}</script>",
                fallbackTest: '<script>if(!(${ test })) jqFallback("${ filepath }");</script>',
                files: [{
                    file: "/js/jquery.min.js",
                    cdn: "google:jquery@" + jq_version
                }]
            })
        )

        .pipe(gulp.dest("./build"));
});

gulp.task("pages:reset", function() {
    panini.refresh();
});

// Icon Font Genaration
// First Clean Icon Folder
var runTimestamp = Math.round(Date.now() / 1000);
gulp.task('cleanicons', function(done) {
    if (!isWindows) {
        return del(svgPath);
    }
});

// Then Genarate Icons
gulp.task('Iconfont', !isWindows ? ['cleanicons'] : '', function() {

    // convert sketch to svg
    function icons() {
        return $.if(!isWindows, gulp.src(sketchPath + '*.sketch'), gulp.src(svgPath + '*.svg'))
            .pipe($.if(!isWindows, $.sketch({
                export: 'artboards',
                formats: 'svg',
                compact: true,
                saveForWeb: 'yes',
            })))
            .pipe($.imagemin())
            .pipe($.if(!isWindows, gulp.dest(svgPath)))
            .pipe($.iconfont({
                fontName: iconfontName, // required
                prependUnicode: true, // recommended option
                formats: ['ttf', 'eot', 'woff', 'woff2'], // default, 'woff2' and 'svg' are available
                timestamp: runTimestamp, // recommended to get consistent builds when watching files
                centerHorizontally: true,
                fontHeight: 1000,
                normalize: true,

            }).on('glyphs', function(glyphs) {
                "use strict";

                var options = {
                    glyphs: glyphs,
                    fontName: iconfontName,
                    fontPath: 'fonts/', // set path to font (from your CSS file if relative)
                    className: fontClassName // set class name in your CSS
                };

                gulp.src('./src/.hidden/_font-template.scss')
                    .pipe($.consolidate('underscore', options))
                    .pipe($.rename({
                        basename: '_' + iconfontName
                    }))
                    .pipe(gulp.dest('./src/scss/'));

                gulp.src('./src/.hidden/font-template.html')
                    .pipe($.consolidate('underscore', options))
                    .pipe($.rename({
                        basename: 'iconfonts'
                    }))
                    .pipe($.preprocess({
                        context: {
                            isProduction: !!argv.production,
                            name: config.sitename,
                            css: cssName,
                            DEBUG: true
                        }
                    }))
                    .pipe(gulp.dest('./build/'));
            })).pipe(gulp.dest('./src/fonts/'));
    }

    function addRefs() {
        var target = gulp.src('./src/scss/main.scss');
        var source = gulp.src(['./src/scss/_' + iconfontName + '.scss'], {
            read: false
        });
        gulp
        return target.pipe(inject(source, {
                relative: true,
                name: 'iconfonts',
                ignorePath: './src/scss/'
            }))
            .pipe(gulp.dest('./src/scss/'));
    }

    icons();
    addRefs();

});



// Main App SCSS
gulp.task("css", ["fonts"], function() {
    gulp
        .src(sassPath + sassFiles)
        .pipe($.if(!isProduction, $.changed("./build/css/")))
        .pipe($.sourcemaps.init())
        .pipe(
            $.sass({
                includePaths: ["./node_modules/foundation-sites/scss", "./src/scss/others"],
                relative: true,
                importer: compass,
                // outputStyle: 'compressed'
            }).on(
                "error",
                $.notify.onError(function(error) {
                    return "Error: " + error.message;
                })
            )
        )

        .pipe(inlineimage())
        .pipe(
            $.notify({
                title: "CSS",
                subtitle: "Success",
                message: cssName + ".css successfully compiled!",
                icon: path.join(__dirname, imgPath + "css-noti.png"),
                onLast: true
            })
        )
        .pipe(
            $.if(
                isProduction,
                $.autoprefixer({
                    browsers: COMPATIBILITY,
                    remove: false,
                    grid: true,
                    flexbox: true,
                    supports: true
                })
            )
        )

        .pipe(
            $.if(
                isProduction,
                cleanCSS({
                    level: {
                        1: {
                            specialComments: 0
                        },
                        2: {
                            restructureRules: false
                        }
                    },
                    properties: {
                        ieBangHack: true, // controls keeping IE bang hack
                        ieFilters: true, // controls keeping IE `filter` / `-ms-filter`
                        iePrefixHack: true, // controls keeping IE prefix hack
                        ieSuffixHack: true // controls keeping IE suffix hack
                    },
                    compatibility: "ie8",
                    // inline: ['local', 'remote', googleFontsource],
                    processImport: false
                })
            )
        )
        .pipe(
            $.if(
                isProduction,
                $.rename({
                    basename: cssName,
                    suffix: ".min",
                    extname: ".css"
                }),
                $.rename({
                    basename: cssName,
                    extname: ".css"
                })
            )
        )
        .pipe(
            $.if(
                isProduction,
                $.header(fs.readFileSync("src/.hidden/pack.txt", "utf8"), {
                    pkg: config
                })
            )
        )
        .pipe($.if(!isProduction, $.sourcemaps.write('.')))
        .pipe(gulp.dest("./build/css/"))
        .pipe(browser.stream());
});

gulp.task("fonts", function() {
    gulp
        .src("src/.hidden/fonts.tpl")
        .pipe($.consolidate("underscore", config, {
            useContents: true
        }))
        .pipe($.rename({
            // prefix: "_",
            extname: ".scss"
        }))
        .pipe(gulp.dest(sassPath + "others/"));
});

// User javascript Minify and Concatinate
gulp.task("js", function() {
    var uglifyoption = {
        parse: {},
        compress: {
            drop_console: true,
            hoist_props: true,
            passes: 3,
            toplevel: true
        },
        mangle: {
            toplevel: true
        },
        output: {},
        sourceMap: {},
        nameCache: null, // or specify a name cache object
        toplevel: true,
        ie8: true,
        warnings: false
    };

    // App JavaScript
    function appjs() {
        return gulp
            .src([jsPath + jsFiles])
            .pipe($.sort({
                asc: false
            }))
            .pipe($.sourcemaps.init())
            .pipe($.concat(jsName, {
                newLine: ';'
            }))
            .pipe(
                $.if(
                    isProduction,
                    $.uglify(uglifyoption).on("error", function(e) {
                        console.log(e);
                    })
                )
            )
            .pipe(
                $.notify({
                    title: "JavaScript",
                    subtitle: "Success",
                    message: jsName + ".js successfully compiled!",
                    icon: path.join(__dirname, imgPath + "js-noti.png"),
                    onLast: true
                })
            )
            .pipe($.if(!isProduction, $.sourcemaps.write(".")))
            .pipe($.if(isProduction && config.secureJS, encrypt({
                compact: true,
                mangle: true,
                disableConsoleOutput: true,
                stringArray: true,
                target: 'browser',
                selfDefending: true
            })))
            .pipe(
                $.if(
                    isProduction,
                    $.header(fs.readFileSync("src/.hidden/pack.txt", "utf8"), {
                        pkg: config
                    })
                )
            )
            .pipe(
                $.if(
                    isProduction,
                    $.rename({
                        basename: jsName,
                        suffix: ".min",
                        extname: ".js"
                    }),
                    $.rename({
                        basename: jsName,
                        extname: ".js"
                    })
                )
            )
            .pipe(gulp.dest("./build/js/"));
    }

    function components() {
        return gulp
            .src(config.jsComponents)
            .pipe($.concat("assets.js", {
                newLine: ';'
            }))
            .pipe(
                $.if(
                    isProduction,
                    $.uglify(uglifyoption).on("error", function(e) {
                        console.log(e);
                    })
                )
            )
            .pipe(
                $.notify({
                    title: "JavaScript",
                    subtitle: "Success",
                    message: "Assets.js successfully compiled!",
                    icon: path.join(__dirname, imgPath + "js-noti.png"),
                    onLast: true
                })
            )
            .pipe($.if(isProduction && config.secureJS, encrypt({
                compact: true,
                mangle: true,
                disableConsoleOutput: true,
                stringArray: true,
                target: 'browser'
            })))
            .pipe(
                $.header(fs.readFileSync("src/.hidden/pack.txt", "utf8"), {
                    pkg: config
                })
            )
            .pipe($.if(isProduction, $.rename({
                suffix: ".min"
            })))
            .pipe(gulp.dest("./build/js/"));
    }


    function combine() {

        gulp.src(combijs)
            .pipe($.concat('bundle.js', {
                newLine: ';'
            }))
            .pipe(
                $.if(
                    isProduction,
                    $.uglify(uglifyoption).on("error", function(e) {
                        console.log(e);
                    })
                )
            )
            .pipe(
                $.notify({
                    title: "JavaScript",
                    subtitle: "Success",
                    message: "bundle.js successfully compiled!",
                    icon: path.join(__dirname, imgPath + "js-noti.png"),
                    onLast: true
                })
            )
            .pipe($.if(!isProduction, $.sourcemaps.write(".")))
            .pipe(
                $.if(
                    isProduction,
                    $.header(fs.readFileSync("src/.hidden/pack.txt", "utf8"), {
                        pkg: config
                    })
                )
            )
            .pipe($.if(isProduction, $.rename({
                suffix: ".min"
            })))
            .pipe(gulp.dest("./build/js/"));
    }

    function secure() {

        gulp.src(combijs)
            .pipe($.concat('bundle.js', {
                newLine: ';'
            }))
            .pipe(
                $.if(
                    isProduction,
                    $.uglify(uglifyoption).on("error", function(e) {
                        console.log(e);
                    })
                )
            )
            .pipe(
                $.notify({
                    title: "JavaScript",
                    subtitle: "Success",
                    message: "bundle.js successfully compiled!",
                    icon: path.join(__dirname, imgPath + "js-noti.png"),
                    onLast: true
                })
            )
            .pipe($.if(!isProduction, $.sourcemaps.write(".")))
            .pipe($.if(isProduction, encrypt({
                compact: true,
                mangle: true,
                disableConsoleOutput: true,
                stringArray: true,
                target: 'browser'
            })))
            .pipe(
                $.if(
                    isProduction,
                    $.header(fs.readFileSync("src/.hidden/pack.txt", "utf8"), {
                        pkg: config
                    })
                )
            )
            .pipe($.if(isProduction, $.rename({
                suffix: ".min"
            })))
            .pipe(gulp.dest("./build/js/"));
    }

    if (config.combineJsFile && config.secureJS) {
        secure();
    } else if (config.combineJsFile) {
        combine();
    } else {
        components();
        appjs();
    }

});

// In production, All images are compressed
gulp.task("images", function() {
    var imagemin = $.if(
        isProduction,
        $.imagemin({
            progressive: true,
            // use: [pngquant()],
            svgoPlugins: [{
                removeViewBox: true,
                cleanupAttrs: true,
                removeDoctype: true,
                removeXMLProcInst: true,
                removeComments: true,
                removeMetadata: true,
                removeTitle: true,
                removeDesc: true,
                removeUselessDefs: true,
                removeEditorsNSData: true,
                removeEmptyAttrs: true,
                removeHiddenElems: true,
                removeEmptyText: true,
                removeEmptyContainers: true,
                cleanUpEnableBackground: true,
                minifyStyles: true,
                convertStyleToAttrs: true,
                convertColors: true,
                convertPathData: true,
                convertTransform: true,
                removeUnknownsAndDefaults: true,
                removeNonInheritableGroupAttrs: true,
                removeUselessStrokeAndFill: true,
                removeUnusedNS: true,
                cleanupIDs: true,
                cleanupNumericValues: true,
                moveElemsAttrsToGroup: true,
                moveGroupAttrsToElems: true,
                collapseGroups: true,
                removeRasterImages: true,
                mergePaths: true,
                convertShapeToPath: true,
                sortAttrs: true,
                transformsWithOnePath: true,
                removeDimensions: true,
                removeAttrs: true,
                addClassesToSVGElement: true,
                removeStyleElement: true
            }]
        })
    );

    return gulp
        .src(imgPath + "**/*")
        .pipe(imagemin)
        .pipe(gulp.dest("./build/img"));
});

// Starts a test server, which you can view at http://localhost:3000
gulp.task("server", ["build"], function() {
    browser.use(htmlInjector, {
        files: [webPath + "{layouts,pages,partials}/**/*.html"]
    });

    browser.init({
        open: true,
        notify: true,
        reloadOnRestart: true,
        injectChanges: true,
        files: [
            webPath + "{layouts,pages,partials}/**/*.html",
            sassPath + sassFiles,
            jsPath + jsFiles,
            jsPath + '**/*.js'
        ],
        server: {
            baseDir: "./build"
        },
        logPrefix: config.sitename,
    });
});

// Deploy to server

gulp.task('deploy', function() {

    var conn = deploy.create({
        host: ftp.connect.host,
        user: ftp.connect.user,
        password: ftp.connect.pass,
        parallel: ftp.connect.parallel,
        port: ftp.connect.port,
        timeOffset: ftp.defaults.timeOffset,
        maxConnections: ftp.defaults.maxConnections,
        reload: ftp.connect.reload,
        idleTimeout: ftp.defaults.idleTimeout,
        secure: ftp.defaults.secure,
        log: $.util.log
    });

    return gulp.src(ftp.connect.localPath, {
            base: ftp.connect.base,
            buffer: ftp.defaults.buffer
        })
        // .pipe( conn.mode( ftp.connect.remotePath, ftp.connect.filePermission ) ) // ftp file and foler permission
        .pipe(conn.newer(ftp.connect.remotePath)) // only upload newer files
        .pipe(conn.dest(ftp.connect.remotePath))
        .pipe(
            $.notify({
                title: "Deployment",
                subtitle: "Success",
                message: "Your Files Successfully Deployed to " + ftp.connect.host,
                onLast: true,
            })
        )
        .pipe($.exit());

});

// Backup to Desktop
gulp.task("backup", function() {
    var dirs = [
        "./**/*.*",
        "!**/.git/**/*.*",
        "!**/.git",
        "!**/.git/**",
        "!./node_modules/**/*.*",
        "!./bower_components/**/*.*",
        "!./build/**/*.*"
    ];
    if (isProduction) {
        var src = gulp
            .src(dirs, {
                dot: true
            })
            .pipe($.zip(config.src_zip_name + "-" + datetime + ".zip"))
            .pipe(
                gulp.dest(home.resolve(desktop, config.backup_folder_name + "/src/"))
            );

        var build = gulp
            .src("./build/**/*.*")
            .pipe($.zip(config.build_zip_name + "-" + datetime + ".zip"))
            .pipe(
                $.notify({
                    title: "Backup Completed",
                    subtitle: "Your backup file created",
                    message: "File Browser Now Opening!!",
                    icon: "Terminal Icon",
                    onLast: true
                })
            )
            .pipe(
                gulp.dest(home.resolve(desktop, config.backup_folder_name + "/build/"))
            );

        return merge(src, build).pipe(
            $.open({
                uri: home.resolve(desktop, config.backup_folder_name)
            })
        );
    }
});

gulp.task("backup-src", function() {
    var dirs = [
        "./**/*.*",
        "!**/.git/**/*.*",
        "!**/.git",
        "!**/.git/**",
        "!./node_modules/**/*.*",
        "!./bower_components/**/*.*",
        "!./build/**/*.*"
    ];
    if (isProduction) {
        gulp
            .src(dirs, {
                dot: true
            })
            .pipe($.zip(config.src_zip_name + "-" + datetime + ".zip"))
            .pipe(
                $.notify({
                    title: "Backup Completed",
                    subtitle: "Your backup file created",
                    message: "File Browser Now Opening!!",
                    icon: "Terminal Icon",
                    onLast: true
                })
            )
            .pipe(
                gulp.dest(home.resolve(desktop, config.backup_folder_name + "/src/"))
            )
            .pipe($.open({
                uri: home.resolve(desktop, config.backup_folder_name)
            }));
    }
});

gulp.task("backup-build", function() {
    if (isProduction) {
        gulp
            .src("./build/**/*.*")
            .pipe($.zip(config.build_zip_name + "-" + datetime + ".zip"))
            .pipe(
                $.notify({
                    title: "Backup Completed",
                    subtitle: "Your backup file created",
                    message: "File Browser Now Opening!!",
                    icon: "Terminal Icon",
                    onLast: true
                })
            )
            .pipe(
                gulp.dest(home.resolve(desktop, config.backup_folder_name + "/build/"))
            )
            .pipe($.open({
                uri: home.resolve(desktop, config.backup_folder_name)
            }));
    }
});

var ui = new inquirer.ui.BottomBar();
gulp.task("build", function(done) {
    var answer1 = "Backup source folder",
        answer2 = "Backup build folder",
        answer3 = "i want to backup both folder";

    if (isProduction) {
        ui.log.write(fs.readFileSync("src/.hidden/build.txt", "utf8"));
        inquirer
            .prompt([{
                type: "confirm",
                message: "Do you want to backup Build and Src folders ?",
                default: false,
                name: "start"
            }])
            .then(function(answers) {

                if (answers.start) {
                    inquirer
                        .prompt([{
                            type: "list",
                            message: "Which folder do you want to backup?",
                            name: "build",
                            choices: [answer1, answer2, answer3],
                            validate: function(answer) {
                                if (answer.length < 1) {
                                    return "You must choose at least one option.";
                                }
                                return true;
                            }
                        }])
                        .then(function(check) {
                            if (check.build === answer1) {
                                sequence(
                                    "clean", "Iconfont", ["pages", "css", "js", "images", "copy"],
                                    "backup-src",
                                    done
                                );
                            } else if (check.build === answer2) {
                                sequence(
                                    "clean", "Iconfont", ["pages", "css", "js", "images", "copy"],
                                    "backup-build",
                                    done
                                );
                            } else if (check.build === answer3) {
                                sequence(
                                    "clean", "Iconfont", ["pages", "css", "js", "images", "copy"],
                                    "backup-src",
                                    "backup-build",
                                    done
                                );
                            }
                        });
                } else {
                    inquirer
                        .prompt([{
                            type: "confirm",
                            message: "Do you want to upload your build files & folders to the cloud server ?",
                            default: false,
                            name: "yes"
                        }]).then(function(ans) {
                            if (ans.yes) {
                                sequence("clean", "Iconfont", ["pages", "css", "js", "images", "copy"], 'deploy', function() {
                                    console.log('---------------- Your Project has been successfully build and deployed to the server  ---------------- ');
                                });
                            } else {
                                sequence("clean", "Iconfont", ["pages", "css", "js", "images", "copy"], done);
                            }
                        })
                }

            });
    } else {
        sequence("clean", "Iconfont", ["pages", "css", "js", "images", "copy"], done);
    }
});

// Watch
gulp.task("default", ["build", "server"], function() {
    // Watch HTML Injection
    gulp.watch([webPath + "{layouts,pages,partials}/**/*.html"], ["pages", "pages:reset", htmlInjector]);
    // Watch Sass
    gulp.watch(sassPath + "**/*.scss", ["css"]);
    // Watch JavaScript
    gulp.watch([jsPath + jsFiles, jsPath + '**/*.*'], ["js"]).on('change', browser.reload);
    // Watch Images
    gulp.watch([imgPath + '/**/*.*'], ['images']).on('change', browser.reload);
    // Watch icon file changed
    //gulp.watch(['./src/assets/sketch/**/*.sketch'], ['Iconfont', browser.reload]);
});
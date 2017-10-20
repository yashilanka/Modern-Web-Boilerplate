// Gulp Local Customization
var config = {
    sitename : 'Your New Website',
    css_scssName : 'main',
    sassPath: 'src/scss/',
    jsPath : 'src/js/',
    imgPath : 'src/img/',
    fontsPath : 'src/fonts/',
    binPath : 'src/_bin/',
    webpagePath : 'src/web_pages/',
    othersPath : 'src/others/',
    src_zip_name: 'new-website',
    backup_folder_name: 'new-website',
    build_zip_name: 'new-website',
};



var     $               =   require('gulp-load-plugins')(),
        argv            =   require('yargs').argv,
        browser         =   require('browser-sync').create( config.sitename + 'Front End Dev Server'),
        htmlInjector    =   require('bs-html-injector'),
        gulp            =   require('gulp'),
        del             =   require('del'),
        panini          =   require('panini'),
        path            =   require('path'),
        fs              =   require('fs'),
        sequence        =   require('run-sequence'),
        reload          =   browser.reload,
        home            =   require('home'),
        merge           =   require('merge-stream'),
        os              =   require('os'),
        inlineimage     =   require('gulp-inline-image'),
        compass         =   require('compass-importer'),
        cdn             =   require('cdnjs'),
        inquirer        =   require('inquirer'),
        cdnizer         =   require('gulp-cdnizer'),
        cleanCSS        =   require('gulp-clean-css');



// Check for --production flag
var isProduction = !!(argv.production);


// Browsers to target when prefixing CSS.
// var COMPATIBILITY = ['> 5%', 'last 5 versions', 'ie >= 9', 'ie 6-8', 'last 2 Android versions', 'Firefox ESR'];
var COMPATIBILITY = ['> 5%', 'last 2 versions', 'ie >= 10', 'ie 6-8', 'last 2 Android versions', 'Firefox ESR'];
var isWindows = /^win/.test(os.platform());



// Remove from Production for CDN USE
var cdn_js = [
    // 'node_modules/jquery/dist/jquery.min.js'
];


// Main Assets need to run app !important
var components_path = [
    'node_modules/fastclick/lib/fastclick.js',
    'node_modules/handlebars/dist/handlebars.min.js',
    'node_modules/gsap/src/minified/TweenMax.min.js',
    'node_modules/gsap/src/minified/jquery.gsap.min.js',
    'node_modules/gsap/src/minified/plugins/RoundPropsPlugin.min.js',
    'node_modules/gsap/src/minified/utils/Draggable.min.js',
    'node_modules/gsap/src/minified/plugins/ScrollToPlugin.min.js',
    'node_modules/gsap/src/minified/plugins/TextPlugin.min.js',
    'node_modules/gsap/src/minified/plugins/ColorPropsPlugin.min.js',
    'node_modules/gsap/src/minified/plugins/CSSRulePlugin.min.js',
    'node_modules/gsap/src/minified/plugins/AttrPlugin.min.js',
    'node_modules/gsap/src/minified/plugins/BezierPlugin.min.js',
    'node_modules/gsap/src/minified/plugins/EndArrayPlugin.min.js',
    'node_modules/perfect-scrollbar/dist/perfect-scrollbar.min.js',
    'node_modules/velocity-animate/velocity.min.js',
    'node_modules/velocity-animate/velocity.ui.min.js',
    'node_modules/viewport-units-buggyfill/viewport-units-buggyfill.js',
];


var userJS = [
    config.jsPath + 'app.js'
];


// Combine onTime if neccesory and read package.json. also read jquery version
var combine_js = cdn_js.concat(components_path);
var pkg = require('./package.json');
var jq_version = pkg.dependencies.jquery.replace(/[^\d.-]/g, '');



// Cleans the build directory
gulp.task('clean', function () {
    return del('./build');
});


var currentdate = new Date();
var datetime = "backup--" + currentdate.getDate() + "-"
    + (currentdate.getMonth() + 1) + "-"
    + currentdate.getFullYear() + "__"
    + currentdate.getHours() + "."
    + currentdate.getMinutes() + "."
    + currentdate.getSeconds();

var desktop = '~/Desktop';


// Copies user-created files
gulp.task('copy', function () {
    var dirs = [
        './src/**/*.*',
        '!./src/{scss,svg,sketch,js,fonts,img,tempCss,svg-icon,_bin,others}/**/*.*',
        '!./src/_bin/**/*.*',
        '!./src/data/**/*.*',
        '!' + config.webpagePath + 'layouts/**/*.*',
        '!' + config.webpagePath + 'pages/**/*.*',
        '!' + config.webpagePath + 'partials/**/*.*',
    ];

    var assetsFont = [
        './src/fonts/*.*', !isProduction ? './src/fonts/roboto/*.*' : '!./src/fonts/roboto/*.*',
    ];
  

    gulp.src(dirs, {
        base: './src/'
    }).pipe(gulp.dest('./build/'));

    // fonts
    gulp.src(assetsFont)
        .pipe(gulp.dest('./build/css/fonts/'));
    
    //jquery
    gulp.src('./node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('./build/js/'));

    gulp.src(config.othersPath + '**/*.*')
    .pipe(gulp.dest('./build/'));

});




// Copy page templates into finished HTML files
gulp.task('pages', function () {
    gulp.src(config.webpagePath + 'pages/**/*.{html,hbs,handlebars,md}')
        .pipe(panini({
            root: config.webpagePath + 'pages/',
            layouts: config.webpagePath + 'layouts/',
            partials: config.webpagePath + 'partials/**/',
            data: config.webpagePath + 'data/',
            helpers: config.webpagePath + 'helpers/'
        }))
        .pipe($.preprocess({
            context: {
                isProduction: !!(argv.production),
                name: config.sitename,
                css: config.css_scssName,
                DEBUG: true
            }
        }))
        .pipe(cdnizer({
            fallbackScript: "<script>function jqFallback(u) {document.write('<scr'+'ipt src=\"'+encodeURIComponent(u)+'\"></scr\'+\'ipt>\');}</script>",
            fallbackTest:'<script>if(!(${ test })) jqFallback("${ filepath }");</script>',
            files: [{
                file: '/js/jquery.min.js',
                cdn: 'google:jquery@' + jq_version
             }
         ]}))
        .pipe(gulp.dest('./build'));
});

gulp.task('pages:reset', function (cb) {
    panini.refresh();
});


// Main App SCSS
gulp.task('css', function () {
    gulp.src(config.sassPath + '/' + config.css_scssName +'.scss')
        .pipe($.if(!isProduction, $.changed('./build/css/')))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            includePaths: '',
            relative: true,
            importer: compass,
        }).on("error", $.notify.onError(function (error) {
            return "Error: " + error.message;
        })))
        .pipe(inlineimage())
        .pipe($.notify({
            title: 'CSS',
            subtitle: 'Success',
            message: 'Main.css successfully compiled!',
            icon: path.join(__dirname, config.imgPath + "css-noti.png"),
        }))
        .pipe($.if(isProduction, $.autoprefixer({
            browsers: COMPATIBILITY,
            remove: false,
            grid: true,
            flexbox: true,
            supports: true
        })))
        .pipe($.if(!isProduction, $.sourcemaps.write('./maps')))
        // .pipe($.if(isProduction, gulp.dest('./src/assets/tempCss')))
        // .pipe($.if(!isProduction, gulp.dest('./build/assets/css/')))
        .pipe($.if(isProduction, cleanCSS({
            level: {
                1: {
                    specialComments: 0,
                },
                2: {
                    restructureRules: false
                }
            },
            properties: {

                ieBangHack: true, // controls keeping IE bang hack
                ieFilters: true, // controls keeping IE `filter` / `-ms-filter`
                iePrefixHack: true, // controls keeping IE prefix hack
                ieSuffixHack: true, // controls keeping IE suffix hack
            },
            compatibility: 'ie8',
            // inline: ['local', 'remote', googleFontsource],
            processImport: false
        })))
        .pipe( $.if(isProduction, $.rename({suffix: '.min'})))
        .pipe($.if(isProduction, $.header(fs.readFileSync(config.binPath + 'pack.txt', 'utf8'), {pkg: pkg})))
        .pipe(gulp.dest('./build/css/'))
        .pipe(browser.stream());

});


// User javascript Minify and Concatinate
gulp.task('js', function () {
    
        var uglifyoption = {
            parse: {},
            compress: true,
            mangle: true,
            output: {},
            sourceMap: {},
            nameCache: null, // or specify a name cache object
            toplevel: true,
            ie8: true,
            warnings: true,
        
        };

        // App JavaScript
       function appjs() {
            return gulp.src(userJS)
                .pipe($.sourcemaps.init())
                .pipe($.concat('app.js'))
                .pipe($.if(isProduction, $.uglify().on('error', function (e) {
                    console.log(e);
                })))
                .pipe($.notify({
                    title: 'JavaScript',
                    subtitle: 'Success',
                    message: 'App.js successfully compiled!',
                    icon: path.join(__dirname, config.imgPath + "js-noti.png"),
                }))
                .pipe($.if(!isProduction, $.sourcemaps.write('./maps')))
                .pipe( $.if(isProduction, $.rename({suffix: '.min'})))
                .pipe(gulp.dest('./build/js/'));
        }
    
        function components() {
            return gulp.src(components_path)
                .pipe($.concat('assets.js'))
                .pipe($.if(isProduction, $.uglify().on('error', function (e) {
                    console.log(e);
                })))
                .pipe($.notify({
                    title: 'JavaScript',
                    subtitle: 'Success',
                    message: 'Assets.js successfully compiled!',
                    icon: path.join(__dirname, config.imgPath + "js-noti.png"),
                }))
                .pipe($.header(fs.readFileSync(config.binPath + 'pack.txt', 'utf8'), {pkg: pkg}))
                .pipe( $.if(isProduction, $.rename({suffix: '.min'})))
                .pipe(gulp.dest('./build/js/'));
        }
    
        function combine() {
            return gulp.src(combine_js)
                .pipe($.sourcemaps.init())
                .pipe($.concat('assets.js'))
                .pipe($.sourcemaps.write())
                .pipe( $.if(isProduction, $.rename({suffix: '.min'})))
                .pipe(gulp.dest('./build/js/'));
        }
    
        return isProduction ? merge(components(), appjs()) : merge(appjs(), combine());
    });


    // In production, the images are compressed
gulp.task('images', function () {
    var imagemin = $.if(isProduction, $.imagemin({
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
            removeStyleElement: true,
        }],
    }));

    return gulp.src(config.imgPath + '**/*')
        .pipe(imagemin)
        .pipe(gulp.dest('./build/img'));
});


// Starts a test server, which you can view at http://localhost:3000
gulp.task('server', ['build'], function () {
    browser.use(htmlInjector, {
        files: [config.webpagePath + '{layouts,pages,partials}/**/*.html'],
    });
    browser.init({
        open: true,
        notify: true,
        // browser: ["google chrome", "firefox"],
        reloadDelay: 2000,
        // reloadDebounce: 500,
        // online: true,
        reloadOnRestart: true,
        injectChanges: true,
        files: [config.webpagePath + '{layouts,pages,partials}/**/*.html', "./src/scss/*.scss", './src/js/*.js'],
        // files: ['./build/*.html', "./build/assets/css/*.css", './build/assets/js/*.js'],
        server: {
            baseDir: "./build",
            // middleware: [
            //     modRewrite(['^[^\\.]*$ /index.html [L]'])
            // ],
        },
        logPrefix: config.sitename,
        plugins: [
            {
                module: "bs-html-injector",
                options: {
                    files: config.webpagePath + '{layouts,pages,partials}/**/*.html'
                }
            }
        ],
    });

});


// Backup to Desktop
gulp.task('backup', function () {
    var dirs = [
        './**/*.*',
        '!./node_modules/**/*.*',
        '!./bower_components/**/*.*',
        '!./build/**/*.*',
    ];
    if (isProduction) {

        var src = gulp.src(dirs)
            .pipe($.zip(config.src_zip_name + '-' + datetime + '.zip'))
            .pipe(gulp.dest(home.resolve(desktop, config.backup_folder_name + '/src/')));

        var build = gulp.src('./build/**/*.*')
            .pipe($.zip(config.build_zip_name + '-' + datetime + '.zip'))
            .pipe($.notify({
                title: 'Backup Completed',
                subtitle: 'Your backup file created',
                message: 'File Browser Now Opening!!',
                icon: 'Terminal Icon'
            }))
            .pipe(gulp.dest(home.resolve(desktop, config.backup_folder_name + '/build/')));

        return merge(src, build)
            .pipe($.open({uri: home.resolve(desktop, config.backup_folder_name)}));
    }
});

gulp.task('backup-src', function () {
    var dirs = [
        './**/*.*',
        '!./node_modules/**/*.*',
        '!./bower_components/**/*.*',
        '!./build/**/*.*',
    ];
    if (isProduction) {

        gulp.src(dirs)
            .pipe($.zip(config.src_zip_name + '-' + datetime + '.zip'))
            .pipe($.notify({
                title: 'Backup Completed',
                subtitle: 'Your backup file created',
                message: 'File Browser Now Opening!!',
                icon: 'Terminal Icon'
            }))
            .pipe(gulp.dest(home.resolve(desktop, config.backup_folder_name + '/src/')))
            .pipe($.open({uri: home.resolve(desktop, config.backup_folder_name)}));
    }
});

gulp.task('backup-build', function () {
    if (isProduction) {

        gulp.src('./build/**/*.*')
            .pipe($.zip(config.build_zip_name + '-' + datetime + '.zip'))
            .pipe($.notify({
                title: 'Backup Completed',
                subtitle: 'Your backup file created',
                message: 'File Browser Now Opening!!',
                icon: 'Terminal Icon'
            }))
            .pipe(gulp.dest(home.resolve(desktop, config.backup_folder_name + '/build/')))
            .pipe($.open({uri: home.resolve(desktop, config.backup_folder_name)}));
    }
});




var ui = new inquirer.ui.BottomBar();
gulp.task('build', function (done) {

    var answer1 = "Backup source folder",
        answer2 = "Backup build folder",
        answer3 = "i want to backup both folder";

    if (isProduction) {
        ui.log.write(fs.readFileSync('src/_bin/build.txt', 'utf8'));
        inquirer.prompt([{
            type: 'confirm',
            message: 'Do you want me to create a backup file for Build and Src folders ?',
            default: false,
            name: 'start'
        }]).then(function (answers) {
            if (answers.start) {
                inquirer.prompt([{
                    type: 'list',
                    message: 'Which folder do you want to backup?',
                    name: "build",
                    choices: [answer1, answer2, answer3],
                    validate: function (answer) {
                        if (answer.length < 1) {
                            return "You must choose at least one option.";
                        }
                        return true;
                    }
                }]).then(function (check) {
                    if (check.build === answer1) {
                        sequence('clean', ['pages', 'css',  'js', 'images', 'copy'], 'backup-src', done);
                        // sequence('clean', ['Iconfont'], ['pages', 'css',  'js', 'images', 'copy'], 'backup-src', done);
                    } else if (check.build === answer2) {
                        sequence('clean', ['pages', 'css',  'js', 'images', 'copy'], 'backup-build', done);
                    } else if (check.build === answer3) {
                        sequence('clean', ['pages', 'css',  'js', 'images', 'copy'], 'backup-src', 'backup-build', done);
                    }
                });
            } else {
                sequence('clean', ['pages', 'css', 'js', 'images', 'copy'], done);
            }
        });

    } else {
        sequence('clean', ['pages', 'css', 'js', 'images', 'copy'], done);
    }
});



// Watch
gulp.task('default', ['build', 'server'], function () {
    // Watch HTML Injection
    gulp.watch([config.webpagePath + '{layouts,pages,partials}/**/*.html'], ['pages', 'pages:reset'], htmlInjector);
    // Watch Sass
    gulp.watch(config.sassPath + '**/*.scss', ['css']);
    // Watch JavaScript
    gulp.watch([config.jsPath + '**/*', './js/**/*'], ['js', browser.reload]);
    // Watch Images
    //gulp.watch(['./src/assets/img/**/*'], ['images', browser.reload]);
    // Watch icon file changed
    //gulp.watch(['./src/assets/sketch/**/*.sketch'], ['Iconfont', browser.reload]);
    // Watch static files
    //gulp.watch(['./src/**/*.*', '!./src/assets/{scss,js,font,img}/**/*.*'], ['copy', browser.reload]);

});
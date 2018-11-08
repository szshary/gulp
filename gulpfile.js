/**
 * Created by zhengchong on 2017/01/08.
 */
var gulp = require("gulp"),
    less = require("gulp-less"),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    rev = require('gulp-rev-append'),
    replace = require('gulp-replace');
    fileinclude  = require('gulp-file-include');
    htmlreplace = require('gulp-html-replace');
    clean = require('gulp-clean');
    markdown2bootstrap = require('gulp-markdown2bootstrap');
    config = require("./config.js")


gulp.task('md', function () {
    return gulp.src('../my.md')
        .pipe(markdown2bootstrap({
            theme: 'yeti'
        }))
        .pipe(gulp.dest('../src'));
});

//本地开发开始
gulp.task("serve", ["lint", "less"], function() {

});

// 检查脚本
gulp.task("lint", function() {
    gulp.src(config.JS)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//编译less
gulp.task("less",function() {
    gulp.src(config.LESS)
        .pipe(less())
        .pipe(gulp.dest(config.CSS));
})

gulp.task("default", ["serve"])

//本地开发结束

//打包到dist目录用于部署开发
//打包流程
//1:执行 gulp replace
//2:执行 gulp include
//3:执行 gulp build
//4:执行 gulp rev
//4:执行 gulp clean

//将头部及其他公共部分在打包时替换
gulp.task("replaceHtml",function () {
    gulp.src(config.srcAllHtml)
        .pipe(htmlreplace({
            'gulpfooter': "@@include('../src/template/footer.html')",
            'gulpheader': "@@include('../src/template/header.html')",
            'gulpuserMenu': "@@include('/WebBuild/ibot_os_v3/web/src/template/usermenu.html')",
            'gulpuserTop': "@@include('/WebBuild/ibot_os_v3/web/src/template/usertop.html')",
            'css': '/css/ibotos.css?rev=@@hash',
            'js': '/js/ibotos.js?rev=@@hash'
        }))
        .pipe(gulp.dest("../buildTemp/"));
})
//替换开发中的js文件
gulp.task("replaceJS",function () {
    gulp.src(config.JS)
        .pipe(htmlreplace({
            'loadheader': "",
            'loadfooter': ""
        }))
        .pipe(gulp.dest(config.distJSFolder));
})

gulp.task("replace", ["replaceHtml","replaceJS"],function () {

})
//替换include文件
gulp.task("include", function() {
    gulp.src("../buildTemp/**/*.html")
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(config.distFolder));
})


gulp.task("concatcss",function () {
    gulp.src(config.concatcssList)
        .pipe(concat('ibotos.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(config.distCSSFolder));
})


//拷贝css库文件
gulp.task("libsCSS",function() {
    gulp.src(config.srclibsCSS)
        .pipe(gulp.dest(config.distlibsCSS));
})

//拷贝font库文件
gulp.task("fonts",function() {
    gulp.src("../src/css/fonts/*")
        .pipe(gulp.dest("../dist/css/fonts/"));
})

//拷贝flash文件
gulp.task("fonts",function() {
    gulp.src("../src/flash/*")
        .pipe(gulp.dest("../dist/flash/"));
})

//拷贝图片
gulp.task("img",function() {
    gulp.src(config.srcIMG)
        .pipe(gulp.dest(config.distIMGFolder));
})

//拷贝favicon.ico
gulp.task("favicon",function() {
    gulp.src(config.favicon)
        .pipe(gulp.dest(config.distFolder));
})

//压缩合并js
gulp.task("js",function () {
    gulp.src(config.concatJSlist)
        .pipe(concat('ibotos.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.distJSFolder))
})
//压缩html
gulp.task("html", function() {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src(config.distHTML)
        .pipe(htmlmin(options))
        .pipe(gulp.dest(config.distFolder));
})

//添加版本号
gulp.task('rev', function () {
    gulp.src(config.distHTML)
        .pipe(rev())
        .pipe(gulp.dest(config.distFolder));
});

//删除无用文件
gulp.task('clean', function () {
    return gulp.src('../buildTemp', {read: false})
        .pipe(clean({force: true}));
});

gulp.task("build", ["concatcss","favicon","libsCSS","img","fonts","js","html"],function () {

})


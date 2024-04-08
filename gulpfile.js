let project_folder="dist";
let source_folder="src";

let path={
    build:{
        html: project_folder + "/",
        css: project_folder + "/css",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts",
    },
    src: {
        html: source_folder + "/*.html",
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.ttf",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        },
        clean: "./" + project_folder + "/"
}

let {src,dest} = require('gulp'),
  gulp = require('gulp'),
  browsersync = require("browser-sync").create(),
  fileinclude = require("gulp-file-include"),
  del = require("del"),
  scss = require('gulp-sass')(require('sass')),
  autoprefixer = require("gulp-autoprefixer"),
  clean_css = require('gulp-clean-css'),
  group_media = require("gulp-group-css-media-queries"),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify-es').default,
  svgSprite = require('gulp-svg-sprite'),
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2'),
  fonter = require('gulp-fonter'),
  inlineCss = require('gulp-inline-css');


  
  function browserSync(params){
      browsersync.init({
           server:{
               baseDir: "./" + project_folder + "/"
           },
           port:3000,
           notify:false
      })
  }
  function html(){
      return src(path.src.html)
      .pipe(fileinclude())
       .pipe(dest(path.build.html))
       .pipe(browsersync.stream())
  }
  function js(){
    return src(path.src.js)
    .pipe(fileinclude())
     .pipe(dest(path.build.js))
     .pipe(
         uglify()
     )
     .pipe(
        rename({
            extname: ".min.js"
        })
    )
     .pipe(browsersync.stream())
}
  function img(){
        return src(path.src.img)
         .pipe(dest(path.build.img))
         .pipe(browsersync.stream())
  }

  function css(){
      return src(path.src.css)
        .pipe(
            scss({ outputStyle: 'expanded' }).on('error', scss.logError)
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
              overrideBrowserslist: ["last 5 versions"],
              cascade: true
        }))
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
  }

  function fonts(params){
      src(path.src.fonts)
       .pipe(ttf2woff())
       .pipe(dest(path.build.fonts))
       return src(path.src.fonts)
       .pipe(ttf2woff2())
       .pipe(dest(path.build.fonts))
  }

  gulp.task('otf2ttf',function(){
    return src([source_folder + '/fonts/*.otf'])
      .pipe(fonter({
          formats: ['ttf']
      }))
      .pipe(dest(source_folder + '/fonts/'));
  })

  gulp.task('svgSprite',function(){
      return gulp.src([source_folder + '/iconsprite/*.svg'])
       .pipe(svgSprite({
           mode: {
               stack: {
                   sprite: "../icons/icons.svg",
               }
           }
       }))
       .pipe(dest(path.build.img))
  })

  gulp.task('default', function() {
    return gulp.src('./*.html')
        .pipe(inlineCss())
        .pipe(gulp.dest('build/'));
});
  
  function watchFiles(params){
      gulp.watch([path.watch.html],html);
      gulp.watch([path.watch.css],css);
      gulp.watch([path.watch.js],js);
      gulp.watch([path.watch.img],img)
  }

  function clean(params){
      return del(path.clean);
  }

  let build = gulp.series(clean,gulp.parallel(js,css,html,img,fonts));
  let watch=gulp.parallel(build,watchFiles,browserSync);
  
  exports.fonts = fonts;
  exports.img = img;
  exports.js = js;
  exports.css = css;
  exports.html = html;
  exports.build = build;
  exports.watch = watch;
  exports.default = watch;
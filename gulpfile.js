var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglifyjs');

function style() {
  // Where should gulp look for the sass files?
  // My .sass files are stored in the styles folder
  // (If you want to use scss files, simply look for *.scss files instead)
  return (
    gulp
      .src("./www/sass/*.scss")

      // Use sass with the files found, and log any errors
      .pipe(sass())
      .on("error", sass.logError)

      // What is the destination for the compiled file?
      .pipe(gulp.dest("./www/css"))
  );
}

function uglifyjs() {
  return (
    gulp.src(
      [
        "www/lib/app/framework7.js",
        "www/lib/app/jquery.js",
        "www/lib/app/dao.js",
        "www/lib/app/app.js",
        "www/lib/app/md5.js",
        "www/lib/app/jquery-mask.js",
        "www/lib/app/moment.js",
        "www/lib/app/moment.pt-br.js",
        "www/lib/app/valida-cpf-cnpj.js",
        "www/lib/app/shepherd.js",
        "www/lib/app/firebase.js",
        "www/lib/app/guide.js",
        "www/lib/app/chart.js",
        "www/lib/page/servidor.js",
        "www/lib/page/funcoes.js",
        "www/lib/page/telas.js"])

      .pipe(uglify())
      .pipe(gulp.dest('./www/js'))
  );
}

function watch() {
  // gulp.watch takes in the location of the files to watch for changes
  // and the name of the function we want to run on change
  gulp.watch('./www/sass/*.scss', style)
  gulp.watch('./www/lib/*/*.js', uglifyjs)
}


// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp style
exports.style = style;
exports.watch = watch;
exports.uglifyjs = uglifyjs;
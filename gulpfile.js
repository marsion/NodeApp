const config = require('config');
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const nodemon = require('gulp-nodemon');

process.on('uncaughtException', err => {
  console.error(err.message, err.stack, err.errors);
  process.exit(255);
});

gulp.task('nodemon', callback => {
  nodemon({
    nodeArgs: ['--debug'],
    script:   'index.js',
    watch: ['*'],
    ext: 'js css html jade json pug'
  });
});

gulp.on('err', gulpErr => {
  if (gulpErr.err) {
    // cause
    console.error(
      'Gulp error details',
      [gulpErr.err.message, gulpErr.err.stack, gulpErr.err.errors]
        .filter(Boolean)
    );
  }
});
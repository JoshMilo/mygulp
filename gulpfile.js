var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    myth = require('gulp-myth'),
    sass = require('gulp-ruby-sass'),
    gutil = require('gulp-util'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();

	//individual gulp tasks

gulp.task('reload', function() {
    return gulp.src('.')
    .pipe(livereload(server));
});

// concatenates and uglifies scripts

gulp.task('scripts', function() {
 	return gulp.src('js/*.js')
    .pipe(jshint('js/.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// handles pre-processing of Sass and Myth 

gulp.task('sass', function() {
    return gulp.src('css/*.css')
    .pipe(sass({style: 'expanded'}))
    .pipe(gulp.dest('build/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('build/css'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Sass compiled successfully'}))
});

gulp.task('myth', function() {
	return gulp.src('css/*.css')
	.pipe(myth())
	.pipe(gulp.dest('build/css'))
	.pipe(livereload(server))
	.pipe(notify({ message: 'Myth compiled successfully' }));
});	

// compresses and optimizes images

gulp.task('images', function() {
 	return gulp.src('img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('build/img'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Images task complete' }));
});

//cleans up files

gulp.task('clean', function() {
 	return gulp.src(['build/css', 'build/js', 'build/img'], {read: false})
    .pipe(clean());	
});

//this default task will load the other tasks

gulp.task('default', ['clean'], function() {
	gulp.start('sass','myth', 'scripts', 'images');
});

gulp.task('watch', function(next) {

	server.listen(35729, function(err) {
	   if (err) {
			return console.log(err)
		};
        gulp.watch('*.html', ['reload']); //watches html files
        gulp.watch('css/*.css', ['sass']); //watches Sass files
        gulp.watch('css/*.css', ['myth']); //watches myth files
        gulp.watch('js/*.js', ['scripts']); //watches js files
        gulp.watch('img/**/*', ['images']); //watches img files
        console.log('listening to yo shit');
        next();
	});
});

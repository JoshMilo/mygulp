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
    include = require('gulp-include'),
    coffee = require('gulp-coffee'),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();

gulp.task('connect', connect.server({
    root: ['dist'],
    port: 1337,
}));


// reloads the page after saving

gulp.task('reload', function() {
    return gulp.src('.')
    .pipe(livereload(server));
});

// combines partials into one file.

gulp.task('include', function() {
    return gulp.src('src/index.html')
    .pipe(include())
    .pipe(gulp.dest('dist/'))
    .pipe(notify({ message: "Files included" }));
});

// processes coffeescript files

gulp.task('coffee', function() {
    return gulp.src('src/js/*.coffee')
    .pipe(coffee({ bare: true }).on('error', gutil.log))
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: "Coffee's Ready!" }));
});


// concatenates and uglifies scripts

gulp.task('scripts', function() {
 	return gulp.src('src/js/*.js')
    .pipe(jshint('src/js/.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Scripts task complete' }));
});


// handles pre-processing of Sass and Myth 

gulp.task('sass', function() {
    return gulp.src('src/styles/*.scss')
    .pipe(sass({style: 'expanded'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Sass compiled successfully'}))
});

gulp.task('myth', function() {
	return gulp.src('src/styles/*.css')
	.pipe(myth())
	.pipe(gulp.dest('dist/css'))
	.pipe(livereload(server))
	.pipe(notify({ message: 'Myth compiled successfully' }));
});	

// compresses and optimizes images

gulp.task('images', function() {
 	return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Images task complete' }));
});

//cleans up files

gulp.task('clean', function() {
 	return gulp.src(['dist/css', 'dist/js', 'dist/img'], {read: false})
    .pipe(clean());	
});

//this default task will load the other tasks

gulp.task('default', ['clean'], function() {
	gulp.start('sass','myth', 'scripts', 'images', 'include', 'coffee');
});

gulp.task('watch', function(next) {

	server.listen(35729, function(err) {
	   if (err) {
			return console.log(err)
		};
        gulp.watch('src/*.html', ['reload']); //watches html files
        gulp.watch('src/styles/*.scss', ['sass']); //watches Sass files
        gulp.watch('src/styles/*.css', ['myth']); //watches myth files
        gulp.watch('src/js/*.coffee', ['coffee']); //watches coffeescript files
        gulp.watch('src/js/*.js', ['scripts']); //watches js files
        gulp.watch('src/img/**/*', ['images']); //watches img files
        console.log('listening to yo shit');
        next();
	});
});

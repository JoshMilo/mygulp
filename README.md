mygulp
======

Here is my setup for Gulp. I'll add everything it does here but the gulpfile.js has them all listed at the top.


1. run '''npm install''' in the main directory

Your main working files should be inside of the *src* folder. Your final production files will be in the *dist* folder (when you run '''gulp''' a dist folder and all subfolders will be created for you).


To use the livereload type in '''gulp-watch'''. this will watch and refresh/compile:

* Coffeescript
* Sass
* Myth
* CSS (auto-prefixes, compiles Sass/Myth)
* Less (coming soon, like tomorrow)
* JS/(jshint)

##Production 

type '''gulp''' and it will:

* clean out duplicate files
* uglify JS
* concatentate files
* inject partials/views
* minify CSS/JS
* compress & Optimize Images
* clear cache

This gulp setup includes a static file server. To use the built in server just type in '''gulp connect''' in the terminal

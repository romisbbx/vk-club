module.exports = function(grunt) {
	var gruntConfig = {
		app: {
			stylesheets: {
				src: 'sass',
				specify: 'sass/main.sass',
				compiled: '_build/css'
			},
			images: {
				src: 'img',
				compiled: '_build/img'
			},
			svg: {
				src: 'svg',
				compiled: '_build/css/icons'
			},
			scripts: {
				src: 'js',
				compiled: '_build/js/'
			},
			templates: {
				src: 'tpl',
				compiled: '_build/tpl'
			}
		},

		// Задачи
		uglify: {
			options: {
				banner: '/*<%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: '<%= app.scripts.compiled %>app.js',
				dest: '<%= app.scripts.compiled %>app.min.js'
			}
		},

		clean: {
			options: {
				force: true
			},
			build: [ '_build' ]
		},

		compass: {
			watch: {
				options: {
					sassDir: '<%= app.stylesheets.src %>',
					cssDir: '<%= app.stylesheets.compiled %>',
//					outputStyle: 'expanded',
					outputStyle: 'compressed',
					noLineComments: false,
					generatedImagesDir: '<%= app.images.compiled %>',
					relativeAssets: true,
					require: 'compass-normalize',
					debugInfo: true
				}
			},
			dev: {
				options: {
					sassDir: '<%= app.stylesheets.src %>',
					cssDir: '<%= app.stylesheets.compiled %>',
					specify: '<%= app.stylesheets.specify %>',
//					outputStyle: 'expanded',
					outputStyle: 'compressed',
					noLineComments: false,
					generatedImagesDir: '<%= app.images.compiled %>',
					relativeAssets: true,
					require: 'compass-normalize',
					debugInfo: true
				}
			},
			deploy: {
				options: {
					sassDir: '<%= app.stylesheets.src %>',
					cssDir: '<%= app.stylesheets.compiled %>',
					specify: '<%= app.stylesheets.specify %>',
					outputStyle: 'compressed',
					noLineComments: true,
					generatedImagesDir: '<%= app.images.compiled %>',
					relativeAssets: true,
					require: 'compass-normalize',
					debugInfo: false
				}
			}
		},

		grunticon: {
			svg: {
				options: {
					src: "<%= app.svg.src %>",
					dest: "<%= app.svg.compiled %>",
					pngfolder: "../../img/icons/"
				}
			}
		},

		watch: {
			scss: {
				files: '<%= app.stylesheets.src %>/**/*.sass',
				tasks: 'compass:watch'
			}
		}
	};

	// Загружаем js config

	var path = 'js/',
		fs = require('fs'),
		configString = fs.readFileSync(path + 'files.js', 'utf-8'),
		jsConfig = JSON.parse(configString.substr(configString.indexOf('{'))),
		libsFileList = [],
		appFileList = [];

	if (jsConfig.libs) {
		jsConfig.libs.forEach(function(file) {
			if (file.indexOf('._') !== 0) {
				libsFileList.push(path + file);
			}
		});
	}

	if (jsConfig.app) {
		jsConfig.app.forEach(function(file) {
			if (file.indexOf('._') !== 0) {
				appFileList.push(path + file);
			}
		});
	}

	gruntConfig.concat = {
		libs: {
			src: libsFileList,
			dest: '_build/js/libs.min.js'
		},
		app: {
			src: appFileList,
			dest: '_build/js/app.min.js'
		}
	};

	grunt.initConfig(gruntConfig);

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-grunticon');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Кастомные задачи
	grunt.registerTask('build', ['clean', 'concat:libs','concat:app', 'compass:dev', 'grunticon:svg']);
	grunt.registerTask('deploy', ['clean', 'concat:libs','concat:app', 'compass:deploy', 'grunticon:svg']);
	grunt.registerTask('default', ['build', 'watch']);
};
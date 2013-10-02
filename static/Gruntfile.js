module.exports = function(grunt) {
	grunt.initConfig({
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
				compiled: '_build/js'
			},
			templates: {
				src: 'tpl',
				compiled: '_build/tpl'
			}
		},

		// Задачи
		copy: {
			images: {
				files: [
					{
						expand: true,
						cwd: "<%= app.images.src %>/",
						src: ["**"],
						dest: "<%= app.images.compiled %>/"
					}
				]
			}
		},

		uglify: {
			options: {
				banner: '/*<%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: '<%= app.scripts.src %>/*.js',
				dest: '<%= app.scripts.compiled %>/scripts.min.js'
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
//			copy_images: {
//				files: '<%= app.images.src %>/*',
//				tasks: 'copy:images'
//			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-grunticon');

	// Кастомные задачи
	grunt.registerTask('build', ['clean', /*'copy', */'grunticon:svg', 'compass:dev' ]);
	grunt.registerTask('deploy', ['clean', /*'copy', */'grunticon:svg', 'compass:deploy', 'uglify' ]);
	grunt.registerTask('default', ['build', 'watch']);
};
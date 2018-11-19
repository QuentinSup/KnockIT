module.exports = function(grunt) {
	
	var path = require('path');

	grunt.file.defaultEncoding = 'utf8';
	grunt.file.preserveBOM = false;

	// Project configuration.
	grunt
			.initConfig({
				path : path,
				pkg : grunt.file.readJSON('grunt.json'),
				typescript : {
					snapshotfwk : {
						src : [
								"<%= pkg.basedir %>/webkit/definitions/**/*.d.ts",
								"<%= pkg.basedir %>/webkit/index.ts" ],
						dest : "<%= pkg.targetDir %>agilite-digitale-webkit.js",
						options : {
							sourceMap : true,
							declaration : true,
							comments : true
						}
					},
					releasefwk : {
						src : [
								"<%= pkg.basedir %>/webkit/definitions/**/*.d.ts",
								"<%= pkg.basedir %>/webkit/index.ts" ],
						dest : "<%= pkg.targetDir %>agilite-digitale-webkit.js",
						options : {
							sourceMap : false,
							declaration : true,
							comments : false
						}
					},
					util : {
						src : [
								"<%= pkg.basedir %>/webkit/definitions/**/*.d.ts",
								"<%= pkg.basedir %>/webkit/utils.ts" ],
						dest : "<%= pkg.targetDir %>webkit-utils.js",
						options : {
							sourceMap : false,
							declaration : true,
							comments : false
						}
					}
				},
				uglify : {
					release : {
						files : [ {
							expand : true,
							cwd : "<%= pkg.targetDir %>",
							src : "**/*.js",
							dest : "<%= pkg.targetDir %>"
						} ]
					}
				},
				htmlmin : {
					release : {
						options : {
							minifyJS : true,
							minifyCSS : true,
							collapseWhitespace : true,
							conservativeCollapse : true,
							ignoreCustomComments : [ /^\s+ko/, /\/ko\s+$/ ]
						},
						files : [ {
							expand : true,
							cwd : "<%= pkg.targetDir %>",
							src : [ "**/*.{html,css}" ],
							dest : "<%= pkg.targetDir %>"
						} ]
					}
				},
				less : {
					snapshot : {
						options : {
							cleancss : false,
							ieCompat : true,
							compress : false
						},
						files : [ {
							expand : true,
							cwd : "<%= pkg.basedir %>resources",
							src : [ "**/*.less", "!**/_*.less",
									'!**/vendors{,/**/*}' ],
							dest : "<%= pkg.targetDir %>",
							ext : ".css"
						} ]
					},
					release : {
						options : {
							cleancss : true,
							ieCompat : true,
							compress : true
						},
						files : [ {
							expand : true,
							cwd : "<%= pkg.basedir %>resources",
							src : [ "**/*.less", "!**/_*.less",
									'!**/vendors{,/**/*}' ],
							dest : "<%= pkg.targetDir %>",
							ext : ".css"
						} ]
					}
				},
				concat : {
					options : {
						separator : '',
					},
					webkit_dependencies : {
						src : [
								"<%= pkg.basedir %>/webkit/definitions/**/*.d.ts",
								"<%= pkg.targetDir %>agilite-digitale-webkit.d.ts" ],
						dest : "<%= pkg.targetDir %>/../../../typescript/webkit.d.ts"
					},
					webkit : {
						src : [
								"<%= pkg.targetDir %>agilite-digitale-vendors.js",
								"<%= pkg.basedir %>/resources/assets/js/presets/LocaleInfos.js",
								"<%= pkg.targetDir %>agilite-digitale-webkit.js" ],
						dest : "<%= pkg.targetDir %>agilite-digitale-webkit-<%= pkg.version %>.js"
					}
				},
				copyto : {
					snapshot : {
						options : {
							encoding : "<%= pkg.encoding %>",
							ignore : [ '**/resources/webkit{,/**/*}', // Répertoire
							// TYPESCRIPT
							'**/vendors{,/**/*}', // Répertoire includes
							'**/*.scc', // Fichiers VSS
							'**/*.ts', // Fichiers Typescript
							'**/*.less', // Fichiers Less
							'**/*.inc.*', // Fichiers includes
							'**/LocaleInfos.js' ]
						},
						files : [ {
							expand : true,
							cwd : "<%= path.resolve(pkg.basedir) %>/resources",
							src : [ '**/*' ],
							dest : "<%= pkg.targetDir %>"
						} ]
					},
					release : {
						options : {
							encoding : "<%= pkg.encoding %>",
							ignore : [ '**/webkit{,/**/*}', // Répertoire
							// TYPESCRIPT
							'**/vendors{,/**/*}', // Répertoire includes
							'**/*.ts', // Fichiers Typescript
							'**/*.less', // Fichiers Less
							'**/*.scc', // Fichiers VSS
							'**/*.inc.*', // Fichiers includes
							'**/LocaleInfos.js' ]
						},
						files : [ {
							expand : true,
							cwd : "<%= path.resolve(pkg.basedir) %>/resources",
							src : [ '**/*' ],
							dest : "<%= pkg.targetDir %>"
						} ]
					}
				},
				includereplace : {
					vendorcss : {
						src : [ "<%= pkg.basedir %>/resources/vendors/vendors.inc.css" ],
						dest : "<%= pkg.targetDir %>agilite-digitale-webkit-<%= pkg.version %>.css",
					},
					vendorjs : {
						src : [ "<%= pkg.basedir %>/resources/vendors/vendors.inc.js" ],
						dest : "<%= pkg.targetDir %>agilite-digitale-vendors.js",
					}
				},
				clean : {
					options : {
						force : true
					},
					dependencies : [
							"<%= pkg.targetDir %>/resources/**/*.d.ts",
							"<%= pkg.targetDir %>agilite-digitale-webkit.js",
							"<%= pkg.targetDir %>agilite-digitale-vendors.js" ],
					target : [ "<%= pkg.targetDir %>/",
							"<%= pkg.targetDir %>../../../typescript/" ]
				},
				showtime : {
					start : {
						msg : "Started at: "
					},
					end : {
						msg : "Ended at: "
					}
				},
				shell : {
					optipng : {
						command : function(file) {
							return '"../optimg/optipng" '
									+ file + ' -strip all';
						}
					},
					optijpg : {
						command : function(file) {
							return '"../optimg/jpegoptim" '
									+ file + ' --strip-all';
						}
					}
				},
				optimg : {
					release : {
						files : [ {
							expand : true,
							cwd : "<%= pkg.targetDir %>",
							src : [ "**/*.{png,jpg,jpeg}" ],
							dest : "<%= pkg.targetDir %>"
						} ]
					}
				},
				compress : {
					webapp : {
						options : {
							archive : '<%= pkg.webappDir %>/<%= pkg.webappArchiveName %>',
							mode : 'zip'
						},
						files : [ {
							expand : true,
							cwd : '<%= pkg.targetBaseDir %>/',
							src : [ '**/*' ],
							dest : '/'
						} ]
					}
				}
			});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-typescript');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-copy-to');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-include-replace');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('optimgp', function() {
		var taskConfig = grunt.config(this.args.join('.'));
		var expanded = grunt.task.normalizeMultiTaskFiles(taskConfig);
		expanded.forEach(function(files) {
			files.src.forEach(function(file) {
				if (file.toLowerCase().endsWith(".png")) {
					grunt.task.run('shell:optipng:' + file);
				} else if (file.toLowerCase().endsWith(".jpg")
						|| file.toLowerCase().endsWith(".jpeg")) {
					grunt.task.run('shell:optijpg:' + file);
				}
			});
		});
	});

	// Default task(s).
	// grunt.registerTask('default', ['tsc']);
	grunt
			.registerTask(
					'conf',
					'Configuration',
					function() {
						grunt.log
								.writeln("Configuration: edit 'grunt.json' file to change values");
						grunt.log.writeln("Base dir: "
								+ grunt.config.get('pkg.basedir'));
						grunt.log.writeln("Target dir: "
								+ grunt.config.get('pkg.targetDir'));
					});

	grunt.registerMultiTask('showtime', 'Display time', function() {
		grunt.log.writeln(this.data.msg + (new Date().toLocaleString()));
	});

	grunt.registerTask('snapshot', 'Resources generation [SNAPSHOT]', [ 'conf',
			'showtime:start', 'clean:target', 'copyto:snapshot',
			'includereplace:vendorcss', 'includereplace:vendorjs',
			'typescript:snapshotfwk', 'concat:webkit',
			'concat:webkit_dependencies', 'clean:dependencies',
			'less:snapshot', 'showtime:end' ]);

	grunt.registerTask('release', 'Resources generation [RELEASE]', [ 'conf',
			'showtime:start', 'clean:target', 'copyto:release',
			'includereplace:vendorcss', 'includereplace:vendorjs',
			'typescript:releasefwk', 'concat:webkit',
			'concat:webkit_dependencies', 'uglify:release', 'less:release',
			'htmlmin:release', 'optimgp:optimg:release', 'clean:dependencies',
			'showtime:end' ]);

	grunt.registerTask('optimg', 'Images generation [RELEASE]', [ 'conf',
			'showtime:start', 'optimgp:optimg:release', 'showtime:end' ]);

	grunt.registerTask('webapp', 'Resources generation [WEBAPP]', [
			'clean:target', 'release', 'compress:webapp' ]);
	
	grunt.registerTask('util', 'Images generation [RELEASE]', [ 'conf',
	        'showtime:start', 'typescript:util', 'showtime:end' ]);

};
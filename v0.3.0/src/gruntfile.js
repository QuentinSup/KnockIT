module.exports = function(grunt) {
	
	let path = require('path');

	grunt.file.defaultEncoding = 'utf8';
	grunt.file.preserveBOM = false;

	let cwd = process.cwd();

	grunt.log.writeln("Launch");
	grunt.log.writeln(`Current directory: ${cwd}`);

	let defaultConf = grunt.file.readJSON(__dirname + '/package.json');
	let localConf = {};
	try {
		localConf = grunt.file.readJSON('package.json')
	} catch(e) {}

	let finalConf = Object.assign({ 'baseDir': cwd, 'outDir': cwd + "/dist/" }, defaultConf.build || {});
	finalConf = Object.assign(finalConf, localConf.build || {});

	if(!finalConf.outDir) {
		grunt.log.writeln("Error");
		return;
	}

	let tsconfigConf = {};
	try {
		tsconfigConf = grunt.file.readJSON("tsconfig.json");
	} catch(e) {}


	grunt.file.setBase(__dirname);

	let __srcDir = path.resolve(__dirname + '/../src/');
	let __srcVendorsJsDir = path.resolve(__srcDir + "/vendors/js/") + path.sep;
	let __srcVendorsCssDir = path.resolve(__srcDir + "/vendors/css/") + path.sep;

	let jsVendorsFiles = [
		__srcVendorsJsDir + "sprintf-1.0.0.min.js",
		__srcVendorsJsDir + "httpstatus-commons-rest-1.0.0.min.js",
		__srcVendorsJsDir + "jquery-1.12.4.min.js",
		__srcVendorsJsDir + "jquery-ui-1.12.1.min.js",
		__srcVendorsJsDir + "jquery.address-1.6.js",
		__srcVendorsJsDir + "jquery.appear-fix.js",
		__srcVendorsJsDir + "jquery.cookie-1.4.1.js",
		__srcVendorsJsDir + "jquery.cookiebar.js",
		__srcVendorsJsDir + "jquery.mutate.events-1.0.0.min.js",
		__srcVendorsJsDir + "jquery.mutate-1.0.0.min.js",
		__srcVendorsJsDir + "jquery.nanoscroller-0.8.7.min.js",
		__srcVendorsJsDir + "jquery.tooltipster-3.3.0-fix.min.js",
		__srcVendorsJsDir + "knockout-3.4.2.min.js",
		__srcVendorsJsDir + "knockout.address.min.js",
		__srcVendorsJsDir + "knockout.templateengine-2.0.5.min.js",
		__srcVendorsJsDir + "require.js",
		"<%= conf.outDir %>index.js"
	];

	let cssVendorsFiles = [
		__srcVendorsCssDir + "bootstrap-3.3.7.min.css",
		__srcVendorsCssDir + "h5bp.min.css",
		__srcVendorsCssDir + "jquery-ui-1.12.1.structure.min.css",
		__srcVendorsCssDir + "jquery.nanoscroller-0.8.7.css",
		__srcVendorsCssDir + "jquery.tooltipster-3.3.0.min.css",
		"<%= conf.outDir %>index.css"
	];




	grunt.log.writeln(__srcDir + path.sep);
	grunt.log.writeln(finalConf.outDir);
	grunt.log.writeln(path.resolve(finalConf.outDir));

	// Project configuration.
	grunt.initConfig({
		path : path,
		__srcDir: __srcDir,
		conf : finalConf,
		typescript : {
			dev: {
				src : ["<%= __srcDir %>/ts/index.ts", "<%= conf.baseDir %>/index.ts"],
				dest : "<%= conf.outDir %>/index.js",
				options : {
					sourceMap : true,
					declaration : true,
					comments : true,
					module: 'amd'
				}
			},
			prod : {
				src : ["<%= __srcDir %>/index.ts", "<%= conf.baseDir %>/index.ts" ],
				dest : "<%= conf.outDir %>index.js",
				options : {
					sourceMap : false,
					declaration : true,
					comments : false,
					module: 'amd'
				}
			}
		},
		uglify : {
			prod : {
				files : [ {
					expand : true,
					cwd : "<%= conf.outDir %>",
					src : "**/*.js",
					dest : "<%= conf.outDir %>"
				} ]
			}
		},
		htmlmin : {
			prod : {
				options : {
					minifyJS : true,
					minifyCSS : true,
					collapseWhitespace : true,
					conservativeCollapse : true,
					ignoreCustomComments : [ /^\s+ko/, /\/ko\s+$/ ]
				},
				files : [ {
					expand : true,
					cwd : "<%= conf.outDir %>",
					src : [ "**/*.{html,css}" ],
					dest : "<%= conf.outDir %>"
				} ]
			}
		},
		less : {
			dev : {
				options : {
					cleancss : false,
					ieCompat : true,
					compress : false
				},
				files : [ {
					expand : true,
					cwd : "<%= conf.baseDir %>",
					src : [ "**/*.less", "!**/_*.less",
							'!**/node_modules{,/**/*}' ],
					dest : "<%= conf.outDir %>",
					ext : ".css"
				} ]
			},
			prod : {
				options : {
					cleancss : true,
					ieCompat : true,
					compress : true
				},
				files : [ {
					expand : true,
					cwd : "<%= conf.baseDir %>",
					src : [ "**/*.less", "!**/_*.less",
							'!**/node_modules{,/**/*}' ],
					dest : "<%= conf.outDir %>",
					ext : ".css"
				} ]
			}
		},
		concat : {
			options : {
				separator : '\n;',
			},
			js: {
				src : jsVendorsFiles,
				dest : "<%= conf.outDir %>index-<%= conf.version %>.js"
			},
			css: {
				src : cssVendorsFiles,
				dest : "<%= conf.outDir %>index-<%= conf.version %>.css"	
			}
		},
		copyto : {
			snapshot : {
				options : {
					encoding : "<%= conf.encoding %>",
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
					cwd : "<%= path.resolve(conf.baseDir) %>/resources",
					src : [ '**/*' ],
					dest : "<%= conf.outDir %>"
				} ]
			},
			release : {
				options : {
					encoding : "<%= conf.encoding %>",
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
					cwd : "<%= path.resolve(conf.baseDir) %>/resources",
					src : [ '**/*' ],
					dest : "<%= conf.outDir %>"
				} ]
			}
		},
		/*
		includereplace : {
			vendorcss : {
				src : [ "<%= conf.baseDir %>/resources/vendors/vendors.inc.css" ],
				dest : "<%= conf.outDir %>agilite-digitale-webkit-<%= conf.version %>.css",
			},
			vendorjs : {
				src : [ "<%= conf.baseDir %>/resources/vendors/vendors.inc.js" ],
				dest : "<%= conf.outDir %>agilite-digitale-vendors.js",
			}
		},*/
		clean : {
			options : {
				force : false
			},
			out : [ "<%= conf.outDir %>/" ]
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
			tsc: {
				command : function() {
					return 'tsc';
				}	
			},
			optipng : {
				command : function(file) {
					return '"' + __dirname  + '/optimg/optipng" ' + file + ' -strip all';
				}
			},
			optijpg : {
				command : function(file) {
					return '"' + __dirname  + '/optimg/optipng" ' + file + ' -strip all';
				}
			}
		},
		optimg : {
			prod : {
				files : [ {
					expand : true,
					cwd : "<%= conf.outDir %>",
					src : [ "**/*.{png,jpg,jpeg}" ],
					dest : "<%= conf.outDir %>"
				} ]
			}
		},
		compress : {
			app : {
				options : {
					archive : '<%= conf.webappDir %>/<%= conf.webappArchiveName %>',
					mode : 'zip'
				},
				files : [ {
					expand : true,
					cwd : '<%= conf.targetBaseDir %>/',
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
	//grunt.loadNpmTasks('grunt-include-replace');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.file.setBase(cwd);

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

	grunt.registerTask('conf', 'Configuration',
		function() {
			grunt.log
					.writeln("Configuration: edit property 'build' of 'package.json' to set values");
			grunt.log.writeln("Base dir: "
					+ grunt.config.get('conf.baseDir'));
			grunt.log.writeln("Out dir: "
					+ grunt.config.get('conf.outDir'));
		});

	grunt.registerMultiTask('showtime', 'Display time', function() {
		grunt.log.writeln(this.data.msg + (new Date().toLocaleString()));
	});

	grunt.registerTask('build-dev', 'Build generation [DEV]', [ 
			'conf',
			'showtime:start', 
			'clean:out', 
			/*
			'copyto:snapshot',
			'includereplace:vendorcss', 
			'includereplace:vendorjs',*/
			'shell:tsc', 
			'less:dev',
			'concat:js',
			'concat:css', 
			//'clean:dependencies',
			'showtime:end' ]);

	grunt.registerTask('build-prod', 'Build generation [PROD]', [ 
			'conf',
			'showtime:start', 
			'clean:out', 
			/*
			'copyto:release',
			'includereplace:vendorcss', 
			'includereplace:vendorjs',*/
			'typescript:prod', 
			'less:prod',
			'concat:js',
			'concat:css', 
			'uglify:prod',
			'htmlmin:prod', 
			'optimgp:optimg:prod', 
			//'clean:dependencies',
			'showtime:end' ]);

	grunt.registerTask('optimg', 'Images optimization', [ 
			'conf',
			'showtime:start', 
			'optimgp:optimg:prod', 
			'showtime:end' ]);

	grunt.registerTask('webapp', 'Resources generation [APP]', [
			'clean:target', 
			'release', 
			'compress:app' ]);




};
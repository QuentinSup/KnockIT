module.exports = function(grunt) {
	
	let path = require('path');

	grunt.file.defaultEncoding = 'utf8';
	grunt.file.preserveBOM = false;

	let cwd = process.cwd();

	grunt.log.writeln("Launch");
	grunt.log.writeln(`Current directory: ${cwd}`);
	
	let moduleConf = grunt.file.readJSON(__dirname + '/package.json');
	let localConf = {};
	let applicationName = "webapp";
	let applicationVersion = "0.0.1";
	try {
		localConf = grunt.file.readJSON('package.json')
		applicationName = localConf.name
		applicationVersion = localConf.version
	} catch(e) {}

	
	let defaultConf = { 
		'baseDir': cwd, 
		'outDir': cwd + "/build",
		'distDir': cwd + "/dist",
		'publishDir': cwd + '/publish',
		'jsFileName': 'index',
		'cssFileName': 'index',
		'name': applicationName,
		'version': applicationVersion
	};
	
	let finalConf = Object.assign(defaultConf, moduleConf.build || {});
	finalConf = Object.assign(finalConf, localConf.build || {});

	if(!finalConf.outDir || !finalConf.distDir) {
		grunt.log.writeln("Error");
		return;
	}

	finalConf.baseDir = path.relative(cwd, finalConf.baseDir);
	finalConf.baseDir = finalConf.baseDir?finalConf.baseDir + path.sep:"";
	finalConf.outDir = path.relative(cwd, finalConf.outDir);
	finalConf.outDir = finalConf.outDir?finalConf.outDir + path.sep:"";
	finalConf.distDir = path.relative(cwd, finalConf.distDir);
	finalConf.distDir = finalConf.distDir?finalConf.distDir + path.sep:"";
	finalConf.publishDir = path.relative(cwd, finalConf.publishDir);
	finalConf.publishDir = finalConf.publishDir?finalConf.publishDir + path.sep:"";

	let tsconfigConf = {};
	try {
		tsconfigConf = grunt.file.readJSON("tsconfig.json");
	} catch(e) {}

	let __finalJsFileName = finalConf.jsFileName + "-" + finalConf.version + ".js";
	let __finalCssFileName = finalConf.cssFileName + "-" + finalConf.version + ".css";
	let __srcDir = path.relative(cwd, path.resolve(__dirname + '/../src/'));
	let __srcVendorsJsDir = path.relative(cwd, path.resolve(__srcDir + "/vendors/js/")) + path.sep;
	let __srcVendorsCssDir = path.relative(cwd, path.resolve(__srcDir + "/vendors/css/")) + path.sep;

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
		finalConf.outDir + "**/*.js"
	];

	console.log(jsVendorsFiles);

	let cssVendorsFiles = [
		__srcVendorsCssDir + "bootstrap-3.3.7.min.css",
		__srcVendorsCssDir + "h5bp.min.css",
		__srcVendorsCssDir + "jquery-ui-1.12.1.structure.min.css",
		__srcVendorsCssDir + "jquery.nanoscroller-0.8.7.css",
		__srcVendorsCssDir + "jquery.tooltipster-3.3.0.min.css",
		finalConf.outDir + "**/*.css"
	];

	let __filesExclusion = finalConf.excludes || [];
	__filesExclusion.push('tsconfig.json');
	__filesExclusion.push('package.json');
	__filesExclusion.push(__srcDir + "/**");
	__filesExclusion.push(finalConf.outDir + "/**");
	__filesExclusion.push(finalConf.distDir + "/**");
	__filesExclusion.push(finalConf.publishDir + "/**");
	__filesExclusion.push("node_modules/**");
	__filesExclusion.push("**/node_modules/**");
	for(let i = 0; i < __filesExclusion.length; i++) {
		__filesExclusion[i] = '!' + __filesExclusion[i];
	}

	// Project configuration.
	grunt.initConfig({
		path : path,
		__srcDir: __srcDir,
		conf : finalConf,
		typescript : {
			dev: {
				src : ["<%= __srcDir %>ts/index.ts", "<%= conf.baseDir %>index.ts"],
				dest : "<%= conf.outDir %>/index.js",
				options : {
					sourceMap : true,
					declaration : true,
					comments : true,
					module: 'amd'
				}
			},
			prod : {
				src : ["<%= __srcDir %>index.ts", "<%= conf.baseDir %>index.ts" ],
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
					cwd : "<%= conf.distDir %>",
					src : "**/*.js",
					dest : "<%= conf.distDir %>"
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
					cwd : "<%= conf.distDir %>",
					src : [ "**/*.{html,css}" ],
					dest : "<%= conf.distDir %>"
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
					expand : false,
					cwd: cwd,
					src : [ "<%= conf.baseDir %>**/*.less", __srcDir + "/less/index.less", "!<%= conf.baseDir %>**/_*.less"].concat(__filesExclusion),
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
					cwd: cwd,
					src : [ "<%= conf.baseDir %>**/*.less", __srcDir + "/less/index.less", "!<%= conf.baseDir %>**/_*.less"].concat(__filesExclusion),
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
				files: [ {
					expand: true,
					cwd: cwd,
					src: jsVendorsFiles,
					dest : "<%= conf.distDir %>/" + __finalJsFileName
				}]
			},
			css: {
				files: [ {
					expand: true,
					cwd: cwd,
					src: cssVendorsFiles,
					dest : "<%= conf.distDir %>/" + __finalCssFileName
				}]
			}
		},
		copyto : {
			out : {
				options : {
					encoding : "<%= conf.encoding %>",
					ignore : []
				},
				files : [ {
					expand : true,
					cwd: cwd,
					src : [ 
						'<%= conf.baseDir %>**/*.js', '<%= conf.baseDir %>**/*.css'
					].concat(__filesExclusion),
					dest : "<%= conf.outDir %>"
				} ]
			},
			dist : {
				options : {
					encoding : "<%= conf.encoding %>",
					ignore : [
						'**/*.ts', // Fichiers Typescript
						'**/*.js',
						'**/*.less', // Fichiers Less
						'**/*.css'
					]
				},
				files : [ {
					expand : true,
					cwd: cwd,
					src : [ 
						'<%= conf.baseDir %>**/*'
					].concat(__filesExclusion),
					dest : "<%= conf.distDir %>"
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
			out : [ "<%= conf.outDir %>" ],
			dist : [ "<%= conf.distDir %>" ],
			empty: {
		        src: ["<%= conf.distDir %>**/*"],
		        filter: function (path) {
		            return grunt.file.isDir(path) && fs.readdirSync(path).length === 0;
		        }
		    }
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
					cwd : "<%= conf.distDir %>",
					src : [ "**/*.{png,jpg,jpeg}" ],
					dest : "<%= conf.distDir %>"
				} ]
			}
		},
		compress : {
			app : {
				options : {
					archive : '<%= conf.distDir %>/<%= conf.name %>-<%= conf.version %>',
					mode : 'zip'
				},
				files : [ {
					expand : true,
					cwd : '<%= conf.distDir %>',
					src : [ '**/*' ],
					dest : '<%= conf.publishDir %>'
				} ]
			}
		}
	});

	grunt.file.setBase(__dirname);

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
			grunt.log.writeln("Dist dir: "
					+ grunt.config.get('conf.distDir'));
		});

	grunt.registerMultiTask('showtime', 'Display time', function() {
		grunt.log.writeln(this.data.msg + (new Date().toLocaleString()));
	});

	grunt.registerTask('build-dev', 'Build generation [DEV]', [ 
			'conf',
			'showtime:start', 
			'clean:out',
			'clean:dist',
			'shell:tsc', 
			'less:dev',
			'copyto:out',
			'concat:js',
			'concat:css',
			'copyto:dist',
			'clean:empty',
			'showtime:end' ]);

	grunt.registerTask('build-prod', 'Build generation [PROD]', [ 
			'conf',
			'showtime:start', 
			'clean:out', 
			'typescript:prod', 
			'less:prod',
			'copyto:out',
			'concat:js',
			'concat:css', 
			'copyto:dist',
			'clean:empty',
			'uglify:prod',
			'htmlmin:prod', 
			'optimgp:optimg:prod', 
			'clean:out',
			'clean:empty',
			'showtime:end' ]);

	grunt.registerTask('optimg', 'Images optimization', [ 
			'conf',
			'showtime:start', 
			'optimgp:optimg:prod', 
			'showtime:end' ]);

	grunt.registerTask('publish', 'Resources generation [Publish]', [
			'build-prod', 
			'compress:app' ]);




};
module.exports = function(grunt) {

	grunt.file.defaultEncoding = 'utf8';
	grunt.file.preserveBOM = false;
	
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('grunt.json'),
    typescript: {
    	snapshotfwk: {
    		src: ["<%= pkg.basedir %>/webkit/definitions/**/*.d.ts", "<%= pkg.basedir %>/webkit/index.ts"],
    		dest: "<%= pkg.targetDir %>knockitjs-<%= pkg.version %>.js",
    		options: { 
    			sourceMap: true,
    			declaration: true,
    			comments: true
    		}
    	},
    	releasefwk: {
    		src: ["<%= pkg.basedir %>/webkit/definitions/**/*.d.ts", "<%= pkg.basedir %>/webkit/index.ts"],
    		dest: "<%= pkg.targetDir %>knockitjs-<%= pkg.version %>.js",
    		options: { 
    			sourceMap: false,
    			declaration: true,
    			comments: false
    		}
    	}
    },
    uglify: {
    	release: {
			files: [{
		          expand: true,
		          cwd: "<%= pkg.targetDir %>",
		          src: "**/*.js",
		          dest:"<%= pkg.targetDir %>"
		      }]
    	}
    },
    htmlmin: {                                     
        release: {    
			options: {
				minifyJS: true,
				minifyCSS: true,
				collapseWhitespace: true,
				conservativeCollapse: true,
				ignoreCustomComments: [/^\s+ko/, /\/ko\s+$/]
			},
			files: [{
		      expand: true,
		      cwd: "<%= pkg.targetDir %>",
		      src: ["**/*.{html,css}"],
		      dest:"<%= pkg.targetDir %>"
			}]
        }
      },
      less: {
			snapshot: {
			    options: {
		    		cleancss: false,
		    		ieCompat: true,
		    		compress: false
			    },
			    files: [{
			      expand: true,
			      cwd: "<%= pkg.basedir %>resources",
			      src: ["**/*.less", "!**/_*.less", '!**/vendors{,/**/*}'],
			      dest:"<%= pkg.targetDir %>",
			      ext: ".css"
				}]
			},
			release: {
			    options: {
		    		cleancss: true,
		    		ieCompat: true,
		    		compress: true
			    },
			    files: [{
			      expand: true,
			      cwd: "<%= pkg.basedir %>resources",
			      src: ["**/*.less", "!**/_*.less", '!**/vendors{,/**/*}'],
			      dest:"<%= pkg.targetDir %>",
			      ext: ".css"
				}]
			}
	    },
    concat: {
        options: {
          separator: '\n',
        },
        webkit_dependencies: {
			src: ["<%= pkg.basedir %>/webkit/definitions/**/*.d.ts", "<%= pkg.targetDir %>knockitjs-<%= pkg.version %>.d.ts"],
    		dest: "<%= pkg.targetDir %>/typescript/knockitjs-<%= pkg.version %>.d.ts"
		},
        webkit_less: {
			src: ["<%= pkg.basedir %>/less/**/*.less", "!<%= pkg.basedir %>/**/_index.less"],
    		dest: "<%= pkg.targetDir %>/less/knockitjs-<%= pkg.version %>.less"
		},
        webkit: {
			src: ["<%= pkg.targetDir %>knockitjs-<%= pkg.version %>-vendors.js", "<%= pkg.basedir %>/resources/assets/js/presets/LocaleInfos.js", "<%= pkg.targetDir %>knockitjs-<%= pkg.version %>.js"],
    		dest: "<%= pkg.targetDir %>knockitjs-<%= pkg.version %>.js"
		}
      },
	    copyto: {
	    	snapshot: {
	    		options: {
	    			encoding: "<%= pkg.encoding %>",
	    			ignore: [
				         '**/webkit{,/**/*}', 	// Répertoire TYPESCRIPT
				         '**/vendors{,/**/*}', 	// Répertoire includes
				         '**/*.scc', 	// Fichiers VSS
				         '**/*.ts', 	// Fichiers Typescript
				         '**/*.less', 	// Fichiers Less
				         '**/*.inc.*',  // Fichiers includes
				         '**/LocaleInfos.js'
	    			]
	    		},
	    		files: [
	    		    {
	    		       expand: true,
	    		       cwd: "<%= pkg.basedir %>/resources",
	    		       src: ['**/*'],
	    		       dest: "<%= pkg.targetDir %>"
    		        }
	    		]
	    	},
	    	release: {
	    		options: {
	    			encoding: "<%= pkg.encoding %>",
	    			ignore: [
				         '**/webkit{,/**/*}', 	// Répertoire TYPESCRIPT
				         '**/vendors{,/**/*}',  // Répertoire includes
				         '**/*.ts', 			// Fichiers Typescript
				         '**/*.less', 			// Fichiers Less
				         '**/*.scc', 			// Fichiers VSS
				         '**/*.inc.*',  		// Fichiers includes
				         '**/LocaleInfos.js'
	    			]
	    		},
	    		files: [
	    		    {
	    		       expand: true,
	    		       cwd: "<%= pkg.basedir %>/resources",
	    		       src: ['**/*'],
	    		       dest: "<%= pkg.targetDir %>"
    		        }
	    		]
	    	}
	    },
		includereplace: {
			vendorcss: {
				src: ["<%= pkg.basedir %>/resources/vendors/vendors.inc.css"],
	    		dest: "<%= pkg.targetDir %>knockitjs-<%= pkg.version %>.css",
			},
		    vendorjs: {
				src: ["<%= pkg.basedir %>/resources/vendors/vendors.inc.js"],
	    		dest: "<%= pkg.targetDir %>knockitjs-<%= pkg.version %>-vendors.js",
			}
		},
		clean: {
			options: {
				force: true
			},
			dependencies: [ "<%= pkg.targetDir %>/resources/**/*.d.ts", "<%= pkg.targetDir %>knockitjs-<%= pkg.version %>-vendors.js"],
			target: [ "<%= pkg.targetDir %>/", "<%= pkg.targetDir %>/typescript/" ]
		},
		showtime: {
			start: {
				msg: "Started at: "
			},
			end: {
				msg: "Ended at: "
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
  grunt.loadNpmTasks('grunt-include-replace');
  grunt.loadNpmTasks('grunt-contrib-clean');
  
  // Default task(s).
  //grunt.registerTask('default', ['tsc']);
  grunt.registerTask('conf', 'Configuration', function() {
	  grunt.log.writeln("Configuration: edit 'grunt.json' file to change values");
	  grunt.log.writeln("Base dir: " + grunt.config.get('pkg.basedir'));
	  grunt.log.writeln("Target dir: " + grunt.config.get('pkg.targetDir'));
  });
  
  grunt.registerMultiTask('showtime', 'Display time', function() {
	  grunt.log.writeln(this.data.msg + (new Date().toLocaleString()));
  });

  grunt.registerTask('snapshot', 'Resources generation [SNAPSHOT]', ['conf', 'showtime:start', 'clean:target', 'copyto:snapshot', 'includereplace:vendorcss', 'includereplace:vendorjs', 'typescript:snapshotfwk', 'concat:webkit', 'concat:webkit_dependencies', 'concat:webkit_less', 'clean:dependencies', 'less:snapshot', 'showtime:end']);
  grunt.registerTask('release', 'Resources generation [RELEASE]', ['conf', 'showtime:start', 'clean:target', 'copyto:release', 'includereplace:vendorcss', 'includereplace:vendorjs', 'typescript:releasefwk', 'concat:webkit', 'concat:webkit_dependencies', 'concat:webkit_less', 'uglify:release', 'htmlmin:release', 'clean:dependencies', 'less:release', 'showtime:end']);

};
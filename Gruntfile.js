module.exports = function(grunt) {

    var exec = require('exec');

    // define work directories
    var pUSV = process.cwd();
    var pROOT = pUSV+"/..";
    var pPROJECT = pROOT + "/project";
    var pBUILD = pPROJECT + "/build";
    var pWORK = pPROJECT + "/work";
    var pPUG = pPROJECT;
    var pPUG_CACHE = pWORK + "/.cache";

    // ./../project/build

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        pug:
            {
                compile:
                    {
                        options:
                            {
                                skip: 'node_modules',
                                pretty: true,
                                basedir: pPUG,
                                data:
                                    {
                                        debug: false,
                                        USV: require(pUSV+'/common/common'),
                                        store: require(pPROJECT+'/store')
                                    }
                            },
                        files: [{
                            expand: true,
                            cwd: pPUG,
                            dest: pPUG_CACHE,
                            src: '*.pug',
                            ext: '.html',
                            extDot: 'first'
                        }]
                    }
            },

        copy:
            {
                pug:
                    {
                        files:
                            [
                                // includes files within path
                                {
                                    expand: true,
                                    cwd: pPUG_CACHE,
                                    src: ['*.html'],
                                    dest: pBUILD,
                                    filter: 'isFile'
                                }
                            ]
                    }
            },

        less:
            {
                dev:
                    {
                        expand: true,
                        cwd: pBUILD+'/assets/less',
                        dest: pBUILD+'/assets/less',
                        src: '**/*.less',
                        ext: '.css',
                        extDot: 'first'
                    }
            },

        coffee:
            {
                dev:
                    {
                        expand: true,
                        cwd: pBUILD+'/assets/js',
                        dest: pBUILD+'/assets/js',
                        src: '**/*.coffee',
                        ext: '.js',
                        extDot: 'first'
                    },
                common:
                    {
                        expand: true,
                        cwd: pUSV+'/common',
                        dest: pUSV+'/common',
                        src: '**/*.coffee',
                        ext: '.js',
                        extDot: 'first'
                    }
            },

        coffeelint:
            {
                dev: {
                    files: {
                        src: [pBUILD+'/assets/js/**/*.coffee']
                    },
                    options: {
                        force: true
                    }
                },
                common: {
                    files: {
                        src: [pUSV+'/common/**/*.coffee']
                    },
                    options: {
                        force: true
                    }
                }
            },

        watch:
            {
                templates:
                    {
                        files: ['**/*.pug'],
                        tasks: ['pug', 'copy'],
                        options: {
                            spawn: false,
                            cwd: pPUG
                        }
                    },
                styles:
                    {
                        files: ['**/*.less'],
                        tasks: ['less'],
                        options: {
                            spawn: false,
                            cwd: pBUILD
                        }
                    },
                scripts:
                    {
                        files: ['**/*.coffee'],
                        tasks: ['coffeelint:dev', 'coffee:dev'],
                        options: {
                            spawn: false,
                            cwd: pBUILD
                        }
                    },

                // usv scripts
                scripts_common:
                    {
                        files: ['common/**/*.coffee'],
                        tasks: ['coffeelint:common', 'coffee:common'],
                        options: {
                            spawn: false,
                            cwd: pUSV
                        }
                    },

                configFiles: {
                    files: [ 'Gruntfile.js' ],
                    options: {
                        reload: true
                    }
                }
            },

        exec:
            {
                lint_error: {
                    cmd: function() {
                        return "spd-say \"BEEEEP. Coffee lint error.!\""
                    }
                }
            }

    });

    var PugInheritance = require('pug-inheritance');
    var changedFiles = [];

    // watch optimize
    var onChange = grunt.util._.debounce(function() {
        var options = grunt.config('pug.compile.options');
        var dependantFiles = [];

        changedFiles.forEach(function(filename) {
            var directory = options.basedir;
            var inheritance = new PugInheritance(filename, directory, options);
            dependantFiles = dependantFiles.concat(inheritance.files);
        });

        var config;
        // update pug
        config = grunt.config('pug.compile.files')[0];
        config.src = dependantFiles;
        grunt.config('pug.compile.files', [config]);

        changedFiles = [];
    }, 100);

    grunt.event.on('watch', function(action, filepath) {
        changedFiles.push(filepath);
        onChange();
    });


    // lint voice warning
    var OnLintErrorCheck = grunt.util._.throttle(function() {
        grunt.task.run('exec:lint_error');
    }, 100);

    grunt.event.on('coffeelint:error', function () {
        OnLintErrorCheck();
    });

    console.log("USV v2.1, Happy codding!");
    console.log("------------------------");

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-coffeelint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['less', 'coffee', 'pug', 'copy', 'watch']);
};
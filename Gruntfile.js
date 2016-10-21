module.exports = function(grunt) {

    var faker = require('faker');
    faker.locale = "ru";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        pug:
        {
            compile:
            {
                options:
                {
                    pretty: true,
                    data:
                    {
                        debug: false,
                        usv: require('./common/common'),
                        store: require('../project/work/store'),
                        faker: faker
                    }
                },
                expand: true,
                cwd: '../project/work/pug',
                dest: '../project/build',
                src: '*.pug',
                ext: '.html',
                extDot: 'first'
            }
        },

        less:
        {
            dev:
            {
                expand: true,
                cwd: '../project/build/assets/less',
                dest: '../project/build/assets/less',
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
                cwd: '../project/build/assets/coffee',
                dest: '../project/build/assets/coffee',
                src: '**/*.coffee',
                ext: '.js',
                extDot: 'first'
            },
            common:
            {
                expand: true,
                cwd: './common',
                dest: './common',
                src: '**/*.coffee',
                ext: '.js',
                extDot: 'first'
            }
        },

        watch:
        {
            templates:
            {
                files: ['../project/work/pug/**/*.pug'],
                tasks: ['pug']
            },
            styles:
            {
                files: ['../project/build/**/*.less'],
                tasks: ['less']
            },
            scripts:
            {
                files: ['../project/build/**/*.coffee'],
                tasks: ['coffee:dev']
            },

            // usv scripts
            scripts_common:
            {
                files: ['./common/**/*.coffee'],
                tasks: ['coffee:common']
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['pug', 'less', 'coffee', 'watch']);

};
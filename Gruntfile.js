module.exports = function(grunt) {

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
                        debug: false
                    }
                },
                expand: true,
                cwd: 'pug/',
                src: '*.pug',
                dest: '../build',
                ext: '.html',
                extDot: 'first'
            }
        },

        less:
        {
            dev:
            {
                options: {
                    paths: ['assets/css']
                },
                expand: true,
                cwd: '../build',
                dest: '../build',
                src: '**/*.less',
                ext: '.css',
                extDot: 'first'
            }
        },

        watch:
        {
            scripts:
            {
                files: ['**/*.pug'],
                tasks: ['pug']
            },
            styles:
            {
                files: ['**/*.less'],
                tasks: ['less']
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['pug', 'less', 'watch']);

};
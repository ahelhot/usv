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

        watch: {
            scripts:
            {
                files: ['**/*.pug'],
                tasks: ['pug']
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['pug', 'watch']);

};
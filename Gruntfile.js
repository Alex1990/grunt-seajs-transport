/*
 * grunt-seajs-transport
 * https://github.com/alexchao/grunt-seajs-transport
 *
 * Copyright (c) 2014 Alex Chao
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    uglify: {
      target_name: {
        files: [{
          expand: true,
          cwd: 'test/cases/minified',
          src: '**/*.js',
          dest: 'test/dest/minified'
        }]
      }
    },

    // Configuration to be run (and then tested).
    seajs_transport: {
      basic: {
        options: {
          quoteChar: "'"
        },
        files: [{
          expand: true,
          cwd: 'test/cases/basic',
          src: '**/*.js',
          dest: 'test/dest/basic'
        }]
      },
      noid: {
        options: {
          id: false
        },
        files: [{
          expand: true,
          cwd: 'test/cases/noid',
          src: '**/*.js',
          dest: 'test/dest/noid'
        }]
      },
      nodeps: {
        options: {
          deps: false
        },
        files: [{
          expand: true,
          cwd: 'test/cases/nodeps',
          src: '**/*.js',
          dest: 'test/dest/nodeps'
        }]
      },
      prefix: {
        options: {
          idPrefix: 'jcn-'
        },
        files: [{
          expand: true,
          cwd: 'test/cases/prefix',
          src: '**/*.js',
          dest: 'test/dest/prefix'
        }]
      },
      minified: {
        options: {
          space: false
        },
        files: [{
          expand: true,
          cwd: 'test/dest/minified',
          src: '**/*.js'
        }]
      }
    },

    // Clean the dest directory
    clean: {
      dest: ['test/dest']
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "dest" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'uglify', 'seajs_transport', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};

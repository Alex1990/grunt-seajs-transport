/*
 * grunt-seajs-transport
 * https://github.com/alexchao/grunt-seajs-transport
 *
 * Copyright (c) 2014 Alex Chao
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var path = require('path');
  var parseDependencies = require('searequire');

  grunt.registerMultiTask('seajs_transport', 'Extract the ids and dependencies of the cmd module.', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      id: true, // Whether to extract the module id (use filename, eg: foo.js => foo)
      deps: true, // Whether to extract the module dependencies
      idPrefix: '', // The prefix of module id
      asyncMod: false, // Whether to extract the async module which is loaded with `require.async('moduleId', function(`
      quoteChar: '"' // The wrapper quotes
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      // Concat specified files.
      f.src.filter(function(filepath) {

        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      })
      .forEach(function(filepath) {
        var file = grunt.file.read(filepath);

        // Parse the dependencies of the module file
        var depMetas = parseDependencies(file, options.asyncMod);

        // Extract the dependencies to a array
        var deps = depMetas.map(function(v) {
          var lIndex = v.string.indexOf("'");
          var rIndex = v.string.lastIndexOf("'");

          return v.string.slice(lIndex + 1, rIndex);
        });

        deps = unique(deps);

        var ch = options.quoteChar;
        deps = options.deps ? '[' + ch + deps.join(ch + ', ' + ch) + ch + '], ' : '';

        // `$'` represents the portion of the followed by the matched substring
        deps.replace(/\$/g, '$$');

        var id = options.id ? ch + options.idPrefix + filename(filepath) + ch + ', ' : '';

        var dest = f.dest || f.src;
        var destFile = file.replace('define(function(', 'define(' + id + deps + 'function(');

        grunt.file.write(dest, destFile);

        grunt.log.writeln('File "' + filepath + '" transported.');
      });
    });

    // Get the filename (excluding extname)
    function filename(filepath) {
      return path.basename(filepath, path.extname(filepath));
    }

    // Remove the duplicate element (only for string type)
    function unique(arr) {
      var o = {};

      arr.forEach(function(item) {
        o[item] = 1;
      });

      return Object.keys(o);
    }

    // Not used
    function parseModule(source) {
      var index = source.indexOf(')');
      var transportRe = /define\((["'](.*?)["'],)?(\[(.*?)\],)?function\(([\w-]+),[\w-]+,[\w-]+\)/;

      var res = {};
      var output = transportRe.exec(source);

      if (output) {
        res.id = output[2];
        res.deps = output[4].split(',');
        res.requireWord = output[5];
      } else {
        res = null;
      }

      return res;
    }
  });

};

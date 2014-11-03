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
  // var parseDependencies = require('searequire');

  grunt.registerMultiTask('seajs_transport', 'Extract the ids and dependencies of the cmd module.', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      id: true, // Whether to extract the module id (use filename, eg: foo.js => foo)
      deps: true, // Whether to extract the module dependencies
      idPrefix: '', // The prefix of module id
      quoteChar: '"', // The wrapper quotes
      space: true // The space after ',' in the arguments of the `define` function
    });

    var SLASH_RE = /\\\\/g;
    var CMD_RE = /define\(\s*?function\s*?\(\s*?([\w-$]+?)[, \)]/;

    // Calculate the number of all transported files
    var total = 0;

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      // Handle specified files.
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

        // If the file isn't a CMD module, then skip
        if (!CMD_RE.test(file)) {
          return;
        }

        var key = CMD_RE.exec(file);

        // https://github.com/seajs/seajs/blob/2.3.0/src/util-deps.js#L6
        var requireRe = new RegExp('"(?:\\\\"|[^"])*"|\'(?:\\\\\'|[^\'])*\'|\\\/\\*[\\S\\s]*?\\*\\/|\\/(?:\\\\\\/|[^\\/\\r\\n])+\\/(?=[^\\/])|\\/\\/.*|\\.\\s*' + key[1] + '|(?:^|[^$])\\b' + key[1] + '\\s*\\(\\s*(["\'])(.+?)\\1\\s*\\)', 'g');
        var deps = unique(parseDependencies(file, requireRe));

        // Parse the dependencies of the module file
        // var depMetas = parseDependencies(file, options.asyncMod);

        // Extract the dependencies to a array
        // var deps = unique(depMetas.map(function(v) {
        //   v = v.string;
        //   return v.split(/['"]/)[1];
        // }));

        // Shorthand
        var ch = options.quoteChar;
        var s = options.space ? ' ' : '';

        // Convert the deps array to string form
        deps = options.deps ? '[' + ch + deps.join(ch + ',' + s + ch) + ch + '],' + s : '';

        // `$'` represents the portion of the followed by the matched substring
        deps = deps.replace(/\$/g, '$$$$');

        var id = options.id ? ch + options.idPrefix + filename(filepath) + ch + ',' + s : '';

        // If you didn't specify the `dest` property, the file will override the source file.
        var dest = f.orig.dest ? f.dest : path.join(f.orig.cwd, f.dest);
        var destFile = file.replace(/define\(.*?function(\s*)\(/, 'define(' + id + deps + 'function$1(');

        grunt.file.write(dest, destFile);

        grunt.log.writeln('File "' + filepath + '" is transported.');
        total++;
      });
    });

    grunt.log.writeln(total + ' files are transported.');

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

    // https://github.com/seajs/seajs/blob/2.3.0/src/util-deps.js
    function parseDependencies(code, requireRe) {
      var res = [];

      code.replace(SLASH_RE, '')
          .replace(requireRe, function(m, s1, s2) {
            if (s2) {
              res.push(s2);
            }
          });

      return res;
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

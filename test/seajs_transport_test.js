'use strict';

var fs = require('fs');
var path = require('path');
var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

function readDirs(dir) {
  var result = [];

  fs.readdirSync(dir)
    .forEach(function(file) {
      var sub = path.join(dir, file);
      if (fs.statSync(sub).isDirectory()) {
        result = result.concat(readDirs(sub).map(function(subFile) {
          return path.join(file, subFile);
        }));
      } else {
        result.push(file);
      }
    });

  return result;
}

exports.seajs_transport = {
  test_options: function(test) {
    test.expect(1);

    var base = path.resolve('test/cases');
    var dest = path.resolve('test/dest');
    var dirs = fs.readdirSync(base);
    dirs.forEach(function(dir) {
      var files = readDirs(path.join(base, dir));

      if (files.length) {
        files.filter(function(file) {
          return !/\.expected$/.test(file);
        }).forEach(function(file) {
          var expected = grunt.file.read(path.join(base, dir, file + '.expected'));
          var actual = grunt.file.read(path.join(dest, dir, file));

          test.equal(actual, expected, 'Test ' + dir);
        });
      }
    });

    test.done();
  }
};

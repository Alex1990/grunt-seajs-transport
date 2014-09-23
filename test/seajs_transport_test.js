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

exports.seajs_transport = {
  test_options: function(test) {

    var base = path.resolve('test/cases');
    var dest = path.resolve('test/dest');

    grunt.file.recurse(base, function(filepath, rootdir, subdir, filename) {
      if (!/\.expected$/.test(filepath)) {
        var expected = grunt.file.read(filepath + '.expected');
        var actual = grunt.file.read(path.join(dest, subdir, filename));

        test.equal(actual, expected, 'Test ' + subdir + filename);
      }
    });

    test.done();
  }
};

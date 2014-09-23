# grunt-seajs-transport

> Extract the id and dependencies of a CMD module and convert it to a Transport module.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-seajs-transport --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-seajs-transport');
```

## The "seajs_transport" task

### Overview
In your project's Gruntfile, add a section named `seajs_transport` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  seajs_transport: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.id
Type: `Boolean`
Default value: `true`

Whether to extract the id of the module (use filename, eg: foo.js => foo).

#### options.deps
Type: `Boolean`
Default value: `true`

Whether to extract the depedencies of the module.

#### options.idPrefix
Type: `String`
Default value: `''`

Append a prefix to the id of the module.

#### options.quoteChar
Type: `String`
Default value: `"`

The quotation wrapping the id and dependency.

#### options.space
Type: `Boolean`
Default value: `true`

The space after the `,` in the arguments of the `define` function.

### Usage Examples

#### Basic

```js
grunt.initConfig({
  seajs_transport: {
    some_name: {
      options: {},
      files: [{
        expand: true,
        cwd: 'action',
        src: '**/*.js',
        dest: 'min/action'
      }]
    }
  }
});
```

#### Transport the minified file

This grunt plugin can transport the minified file. 
Besides, if you omit the `dest` property of the `files` object, 
the transported file will override the source file.

```js
grunt.initConfig({
  seajs_transport: {
    some_name: {
      options: {
        space: false
      },
      files: [{
        expand: true,
        cwd: 'min/action',
        src: '**/*.js'
      }]
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

**2014-09-23** `0.1.1`

Publish a npm package.

**2014-09-23** `0.1.0`

The first version.

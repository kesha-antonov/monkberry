'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Compiler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parser = require('./parser');

var _compiler = require('./compiler');

var _entity = require('./transform/entity');

var _whitespace = require('./optimize/whitespace');

var _utils = require('./utils');

var _graph = require('./graph');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compiler = exports.Compiler = function () {
  function Compiler() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Compiler);

    this.options = Object.assign({
      asModule: true
    }, options);
    this.transforms = [_whitespace.whitespace, _entity.entity];
    this.globals = ['window', 'Array', 'Object', 'Math', 'JSON'];
  }

  _createClass(Compiler, [{
    key: 'compile',
    value: function compile(filename, code) {
      var ast = _parser.parser.parse(filename, code);

      // Transform.
      this.transforms.forEach(function (transform) {
        return transform(ast);
      });

      return (0, _compiler.compile)((0, _utils.getTemplateName)(getBaseName(filename)), ast, this.options, this.globals);
    }
  }, {
    key: 'drawAstTree',
    value: function drawAstTree(filename, code) {
      var ast = _parser.parser.parse(filename, code);

      // Transform.
      this.transforms.forEach(function (transform) {
        return transform(ast);
      });

      return (0, _graph.drawGraph)(ast);
    }
  }]);

  return Compiler;
}();

function getBaseName(name) {
  return name.split('/').pop().replace(/\.\w+$/, '');
}
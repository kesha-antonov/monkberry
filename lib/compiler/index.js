'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compile = compile;

var _figure = require('../figure');

var _document = require('./document');

var _document2 = _interopRequireDefault(_document);

var _element = require('./element');

var _element2 = _interopRequireDefault(_element);

var _attribute = require('./attribute');

var _attribute2 = _interopRequireDefault(_attribute);

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

var _expression = require('./expression');

var _expression2 = _interopRequireDefault(_expression);

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

var _comment = require('./comment');

var _comment2 = _interopRequireDefault(_comment);

var _import = require('./import');

var _import2 = _interopRequireDefault(_import);

var _if = require('./if');

var _if2 = _interopRequireDefault(_if);

var _for = require('./for');

var _for2 = _interopRequireDefault(_for);

var _unsafe = require('./unsafe');

var _unsafe2 = _interopRequireDefault(_unsafe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compilers = Object.assign({}, _document2.default, _element2.default, _attribute2.default, _directive2.default, _expression2.default, _text2.default, _comment2.default, _import2.default, _if2.default, _for2.default, _unsafe2.default);

function next(parent, node, figure, options) {
  var path = {
    parent: parent,
    node: node,
    figure: figure,
    options: options,
    compile: function compile(child) {
      var subfigure = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : figure;
      return next(node, child, subfigure, options);
    }
  };

  if (node.type in compilers) {
    return compilers[node.type](path);
  } else {
    throw new Error('Unknown node type "' + node.type + '".');
  }
}

function compile(name, ast, options, globals) {
  var figure = new _figure.Figure(name);
  figure.scope = globals;
  return next(null, ast, figure, options);
}
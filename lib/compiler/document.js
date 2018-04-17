'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sourceNode = require('./sourceNode');

var _utils = require('../utils');

exports.default = {
  Document: function Document(_ref) {
    var node = _ref.node,
        figure = _ref.figure,
        compile = _ref.compile,
        options = _ref.options;

    figure.children = node.body.map(function (child) {
      return compile(child);
    }).filter(_utils.notNull);

    if (options.asModule) {
      return (0, _sourceNode.sourceNode)(node.loc, ['var Monkberry = require(\'monkberry\');\n', figure.generate(), '\n', 'module.exports = ' + figure.name + ';\n']);
    } else {
      return (0, _sourceNode.sourceNode)(node.loc, [figure.generate(), '\n', 'window.' + figure.name + ' = ' + figure.name + ';\n']);
    }
  }
};
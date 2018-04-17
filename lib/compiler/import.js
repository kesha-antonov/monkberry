'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sourceNode = require('./sourceNode');

exports.default = {
  /**
   * @return {null}
   */
  ImportStatement: function ImportStatement(_ref) {
    var node = _ref.node,
        figure = _ref.figure;

    // TODO: Add support for ES2015 imports.
    figure.root().addImport((0, _sourceNode.sourceNode)(node.loc, 'var ' + node.identifier.name + ' = __requireDefault(require(' + node.path.value + '));'));

    figure.addToScope(node.identifier.name);

    return null;
  }
};
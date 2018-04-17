'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sourceNode = require('./sourceNode');

var _utils = require('../utils');

exports.default = {
  Text: function Text(_ref) {
    var node = _ref.node;

    // Trim new lines and white spaces to a single whitespace.
    return (0, _sourceNode.sourceNode)(node.loc, ['document.createTextNode(' + (0, _utils.esc)(node.text.replace(/^\s+|\s+$/g, ' ')) + ')']);
  }
};
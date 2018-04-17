'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sourceNode = require('./sourceNode');

var _utils = require('../utils');

exports.default = {
  Element: function Element(_ref) {
    var node = _ref.node,
        figure = _ref.figure,
        compile = _ref.compile;

    node.reference = node.name + figure.uniqid();

    figure.declare((0, _sourceNode.sourceNode)(node.loc, 'var ' + node.reference + ' = document.createElement(\'' + node.name + '\');'));

    var children = node.body.map(function (child) {
      return compile(child);
    }).filter(_utils.notNull);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var child = _step.value;

        figure.construct((0, _sourceNode.sourceNode)(node.reference + '.appendChild(' + child + ');'));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    node.attributes.map(function (child) {
      return compile(child);
    });

    return node.reference;
  }
};
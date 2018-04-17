'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _sourceNode = require('./sourceNode');

var _variable = require('./variable');

var _attribute = require('./attribute');

var _utils = require('../utils');

exports.default = {
  /**
   * Compile directive of regular nodes.
   *
   * @param {ElementNode} parent
   * @param {DirectiveNode} node
   * @param {Figure} figure
   * @param {Function} compile
   */
  Directive: function Directive(_ref) {
    var parent = _ref.parent,
        node = _ref.node,
        figure = _ref.figure,
        compile = _ref.compile;

    var directive = (0, _utils.hyphensToCamelCase)(node.name) + 'Directive' + figure.uniqid('directive_name');

    figure.thisRef = true;
    figure.addDirective((0, _sourceNode.sourceNode)(node.loc, 'var ' + directive + ';'));
    figure.addRenderActions((0, _sourceNode.sourceNode)(node.loc, ['    if (' + directive + ' === undefined) {\n', '      ' + directive + ' = new _this.directives.' + node.name + '();\n', '    }\n', '    ' + directive + '.bind(' + parent.reference + ');']));
    figure.addOnRemove((0, _sourceNode.sourceNode)(node.loc, ['    ' + directive + '.unbind(' + parent.reference + ');']));

    var _compileToExpression = (0, _attribute.compileToExpression)(figure, node, compile),
        _compileToExpression2 = _slicedToArray(_compileToExpression, 1),
        expr = _compileToExpression2[0];

    var variables = (0, _variable.collectVariables)(figure.getScope(), expr);

    if (variables.length == 0) {
      figure.addRenderActions((0, _sourceNode.sourceNode)(node.loc, ['    ' + directive + '.update(', expr ? compile(expr) : 'undefined', ');']));
    } else {
      figure.spot(variables).add((0, _sourceNode.sourceNode)(node.loc, ['      ' + directive + '.update(', compile(expr), ')']));
    }
  }
};
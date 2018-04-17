'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _sourceNode = require('./sourceNode');

var _variable = require('./variable');

var _utils = require('../utils');

var _attribute = require('./attribute');

var _figure = require('../figure');

exports.default = {
  Element: function Element(_ref) {
    var parent = _ref.parent,
        node = _ref.node,
        figure = _ref.figure,
        compile = _ref.compile;

    node.reference = null;

    var templateName = (0, _utils.getTemplateName)(node.name);
    var childName = 'child' + figure.uniqid('child_name');
    var placeholder = void 0;

    if ((0, _utils.isSingleChild)(parent, node)) {
      placeholder = parent.reference;
    } else {
      node.reference = placeholder = 'custom' + figure.uniqid('placeholder');
      figure.declare((0, _sourceNode.sourceNode)('var ' + placeholder + ' = document.createComment(\'' + node.name + '\');'));
    }

    figure.declare((0, _sourceNode.sourceNode)('var ' + childName + ' = {};'));

    var data = [];
    var variables = [];

    // Collect info about variables and attributes.
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = node.attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var attr = _step.value;

        if (attr.type == 'SpreadAttribute') {

          figure.spot(attr.identifier.name).add((0, _sourceNode.sourceNode)(node.loc, '      Monkberry.insert(_this, ' + placeholder + ', ' + childName + ', ' + templateName + ', ' + attr.identifier.name + ')'));
        } else {
          var _compileToExpression = (0, _attribute.compileToExpression)(figure, attr, compile),
              _compileToExpression2 = _slicedToArray(_compileToExpression, 1),
              expr = _compileToExpression2[0]; // TODO: Add support for default value in custom tag attributes attr={{ value || 'default' }}.


          variables = variables.concat((0, _variable.collectVariables)(figure.getScope(), expr));

          var property = (0, _sourceNode.sourceNode)(node.loc, ['\'' + attr.name + '\': ' + compile(expr)]);
          data.push(property);
        }
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

    variables = (0, _utils.unique)(variables);
    data = '{' + data.join(', ') + '}';

    figure.thisRef = true;

    // Add spot for custom attribute or insert on render if no variables in attributes.
    if (variables.length > 0) {

      figure.spot(variables).add((0, _sourceNode.sourceNode)(node.loc, '      Monkberry.insert(_this, ' + placeholder + ', ' + childName + ', ' + templateName + ', ' + data + ')'));
    } else {

      figure.addRenderActions((0, _sourceNode.sourceNode)(node.loc, '    Monkberry.insert(_this, ' + placeholder + ', ' + childName + ', ' + templateName + ', ' + data + ');'));
    }

    if (node.body.length > 0) {
      var subfigure = new _figure.Figure(templateName, figure);
      subfigure.children = node.body.map(function (node) {
        return compile(node, subfigure);
      }).filter(_utils.notNull);

      figure.addFigure(subfigure);
    }

    return node.reference;
  }
};
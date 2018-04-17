'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.compileToExpression = compileToExpression;

var _parser = require('../parser');

var _sourceNode = require('./sourceNode');

var _variable = require('./variable');

var _utils = require('../utils');

/**
 * For this attributes doesn't work this:
 *
 *     node.setAttribute('value', ...);
 *
 * To change them, Monkberry generate code like this:
 *
 *     node.value = ...;
 *
 */
var plainAttributes = ['id', 'value', 'checked', 'selected'];

/**
 * This attributes take boolean values, not string values.
 */
var booleanAttributes = ['checked', 'selected'];

exports.default = {
  /**
   * Compile attributes of regular nodes.
   *
   * @param {ElementNode} parent
   * @param {AttributeNode} node
   * @param {Figure} figure
   * @param {Function} compile
   */
  Attribute: function Attribute(_ref) {
    var parent = _ref.parent,
        node = _ref.node,
        figure = _ref.figure,
        compile = _ref.compile;

    var _compileToExpression = compileToExpression(figure, node, compile),
        _compileToExpression2 = _slicedToArray(_compileToExpression, 2),
        expr = _compileToExpression2[0],
        defaults = _compileToExpression2[1];

    var variables = (0, _variable.collectVariables)(figure.getScope(), expr);

    if (variables.length == 0) {
      figure.construct((0, _sourceNode.sourceNode)(node.loc, [attr(node.loc, parent.reference, node.name, expr ? compile(expr) : defaultAttrValue(node.name))]));
    } else {
      // When rendering attributes with more then one variable,
      // Monkberry will wait for all data, before setting attribute.
      //
      //    <div class="{{ foo }} {{ bar }}">
      //
      // Then you pass only one variable, no update will happen:
      //
      //    view.update({foo});
      //
      // Now attribute will be set:
      //
      //    view.update({foo, bar});
      //

      // TODO: Implement updater, if one of expression contains default value.
      // Example (now this does not work):
      //
      //    <div class="{{ foo }} {{ bar || 'default' }}">
      //
      // This will update attribute:
      //
      //    view.update({foo});
      //

      figure.spot(variables).add((0, _sourceNode.sourceNode)(node.loc, ['      ', attr(node.loc, parent.reference, node.name, compile(expr))]));

      if (defaults.length > 0) {
        figure.construct((0, _sourceNode.sourceNode)(node.loc, [attr(node.loc, parent.reference, node.name, (0, _sourceNode.sourceNode)(defaults).join(' + '))]));
      }
    }
  },

  /**
   * Generate code for spread operator.
   *
   *    <div {{...attributes}}>
   *
   * @param {ElementNode} parent
   * @param {AttributeNode} node
   * @param {Figure} figure
   */
  SpreadAttribute: function SpreadAttribute(_ref2) {
    var parent = _ref2.parent,
        node = _ref2.node,
        figure = _ref2.figure;

    figure.root().addFunction('__spread', (0, _sourceNode.sourceNode)(['function (node, attr) {\n', '  for (var property in attr) if (attr.hasOwnProperty(property)) {\n', '    if (property in ' + (0, _utils.esc)((0, _utils.arrayToObject)(plainAttributes)) + ') {\n', '      node[property] = attr[property];\n', '    } else {\n', '      node.setAttribute(property, attr[property]);\n', '    }\n', '  }\n', '}']));

    var attr = node.identifier.name;
    figure.spot(attr).add((0, _sourceNode.sourceNode)(node.loc, '      __spread(' + parent.reference + ', ' + attr + ')'));
  }
};

/**
 * Transform attribute with text and expression into single expression.
 *
 *    <div class="cat {{ dog }} {{ cow || 'moo' }}">
 *
 * Will transformed into:
 *
 *    <div class={{ 'cat ' + dog + ' ' + (cow || 'moo') }}>
 *
 * Also collects default values for attribute: `cat ` and variables name with default: ['moo'].
 *
 * @param {Figure} figure
 * @param {Object} node
 * @param {Function} compile
 * @returns {*[]}
 */

function compileToExpression(figure, node, compile) {
  var expr = void 0,
      defaults = [];

  var pushDefaults = function pushDefaults(node) {
    if (node.type == 'Literal') {
      defaults.push(compile(node));
    } else if (node.type == 'ExpressionStatement' && node.expression.type == 'LogicalExpression' && node.expression.operator == '||') {
      // Add as default right side of "||" expression if there are no variables.
      // In this example, when Monkberry will render div,
      //
      //    <div class="{{ foo || 'default' }}">
      //
      // it set class attribute fo 'default'.

      if ((0, _variable.collectVariables)(figure.getScope(), node.expression.right) == 0) {
        defaults.push(compile(node.expression.right));
      }
    }
  };

  if (!node.body) {
    expr = null;
  } else if (node.body.length == 1) {

    expr = extract(node.body[0]);
    pushDefaults(node.body[0]);
  } else if (node.body.length >= 2) {

    expr = new _parser.ast.BinaryExpressionNode('+', extract(node.body[0]), extract(node.body[1]), node.loc);
    pushDefaults(node.body[0]);
    pushDefaults(node.body[1]);

    var at = expr;
    for (var i = 2; i < node.body.length; i++) {
      at = at.right = new _parser.ast.BinaryExpressionNode('+', at.right, extract(node.body[i]), null);
      pushDefaults(node.body[i]);
    }
  }

  return [expr, defaults];
}

/**
 * Generate source nodes for attribute.
 * @param {Object} loc
 * @param {string} reference
 * @param {string} attrName
 * @param {string} value
 * @returns {SourceNode}
 */
function attr(loc, reference, attrName, value) {
  if (plainAttributes.indexOf(attrName) != -1) {
    return (0, _sourceNode.sourceNode)(loc, [reference, '.', attrName, ' = ', value, ';']);
  } else {
    return (0, _sourceNode.sourceNode)(loc, [reference, '.setAttribute(', (0, _utils.esc)(attrName), ', ', value, ');']);
  }
}

/**
 * Returns default value for attribute name.
 * @param {string} attrName
 * @returns {string}
 */
function defaultAttrValue(attrName) {
  if (booleanAttributes.indexOf(attrName) != -1) {
    return 'true';
  } else {
    return '""';
  }
}

/**
 * @param {Object} node
 * @returns {Object}
 */
function extract(node) {
  if (node.type == 'ExpressionStatement') {
    return node.expression;
  } else {
    return node;
  }
}
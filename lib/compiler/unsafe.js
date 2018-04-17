'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sourceNode = require('./sourceNode');

var _variable = require('./variable');

var _utils = require('../utils');

exports.default = {
  UnsafeStatement: function UnsafeStatement(_ref) {
    var parent = _ref.parent,
        node = _ref.node,
        figure = _ref.figure,
        compile = _ref.compile;

    node.reference = null;

    var unsafeNumber = figure.uniqid('unsafe');
    var unsafeNodes = 'unsafeNodes' + unsafeNumber;
    var placeholder = void 0;

    if ((0, _utils.isSingleChild)(parent, node)) {
      placeholder = parent.reference;
    } else {
      node.reference = placeholder = 'unsafe' + unsafeNumber;
      figure.declare((0, _sourceNode.sourceNode)('var ' + placeholder + ' = document.createComment(\'unsafe\');'));
    }

    figure.declare((0, _sourceNode.sourceNode)('var ' + unsafeNodes + ' = [];'));

    // Add unsafe function.
    var code = unsafe.toString().replace(/(\s{2,}|\n)/g, '');
    figure.root().addFunction('__unsafe', (0, _sourceNode.sourceNode)(null, code));

    var variables = (0, _variable.collectVariables)(figure.getScope(), node.html);

    if (variables.length == 0) {
      figure.addRenderActions((0, _sourceNode.sourceNode)(node.loc, ['      __unsafe(' + placeholder + ', ' + unsafeNodes + ', ', compile(node.html), ');']));
    } else {
      figure.spot(variables).add((0, _sourceNode.sourceNode)(node.loc, ['      __unsafe(' + placeholder + ', ' + unsafeNodes + ', ', compile(node.html), ')']));
    }

    return node.reference;
  }
};

/**
 * This function is being used for unsafe `innerHTML` insertion of HTML into DOM.
 * Code looks strange. I know. But it is possible minimalistic implementation of.
 *
 * @param root {Element} Node there to insert unsafe html.
 * @param nodes {Array} List of already inserted html nodes for remove.
 * @param html {string} Unsafe html to insert.
 */

function unsafe(root, nodes, html) {
  var node,
      j,
      i = nodes.length,
      element = document.createElement('div');
  element.innerHTML = html;

  while (i-- > 0) {
    nodes[i].parentNode.removeChild(nodes.pop());
  }for (i = j = element.childNodes.length - 1; j >= 0; j--) {
    nodes.push(element.childNodes[j]);
  }++i;
  if (root.nodeType == 8) {
    if (root.parentNode) while (i-- > 0) {
      root.parentNode.insertBefore(nodes[i], root);
    } else throw "Can not insert child view into parent node. You need append your view first and then update.";
  } else while (i-- > 0) {
    root.appendChild(nodes[i]);
  }
}
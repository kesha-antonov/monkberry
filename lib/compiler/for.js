'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sourceNode = require('./sourceNode');

var _variable = require('./variable');

var _utils = require('../utils');

var _figure = require('../figure');

exports.default = {
  ForStatement: function ForStatement(_ref) {
    var parent = _ref.parent,
        node = _ref.node,
        figure = _ref.figure,
        compile = _ref.compile;

    node.reference = null;

    var templateName = figure.name + '_for' + figure.uniqid('template_name');
    var childrenName = 'children' + figure.uniqid('child_name');
    var placeholder = void 0;

    if ((0, _utils.isSingleChild)(parent, node)) {
      placeholder = parent.reference;
    } else {
      node.reference = placeholder = 'for' + figure.uniqid('placeholder');
      figure.declare((0, _sourceNode.sourceNode)('var ' + placeholder + ' = document.createComment(\'for\');'));
    }

    figure.declare((0, _sourceNode.sourceNode)('var ' + childrenName + ' = new Monkberry.Map();'));

    // for (

    var variablesOfExpression = (0, _variable.collectVariables)(figure.getScope(), node.expr);

    figure.thisRef = true;
    figure.spot(variablesOfExpression).add((0, _sourceNode.sourceNode)(node.loc, ['      Monkberry.loop(_this, ' + placeholder + ', ' + childrenName + ', ' + templateName + ', ', compile(node.expr), node.options === null ? '' : [', ', (0, _utils.esc)(node.options)], ')']));

    // ) {

    var subfigure = new _figure.Figure(templateName, figure);

    if (node.body.length > 0) {
      subfigure.children = node.body.map(function (node) {
        return compile(node, subfigure);
      }).filter(_utils.notNull);
      figure.addFigure(subfigure);
      subfigure.stateNeed = true;
    }

    figure.addOnUpdate(node.options === null ? (0, _sourceNode.sourceNode)(node.loc, ['    ' + childrenName + '.forEach(function (view) {\n', '      view.update(view.__state__);\n', '    });']) :
    // TODO: Remove double update on foreach.
    // Simple solution is to use Object.assign({}, __data__, view.__state__),
    // But this isn't supported in a lot of browsers for now.
    // Also i have solution for this what may come in next v5 version...
    (0, _sourceNode.sourceNode)(node.loc, ['    ' + childrenName + '.forEach(function (view) {\n', '      view.update(view.__state__);\n', '      view.update(__data__);\n', '      view.update(view.__state__);\n', '    });']));

    if (node.options && node.options.value) {
      subfigure.spot(node.options.value).onlyFromLoop = true;
    }

    if (node.options && node.options.key) {
      subfigure.spot(node.options.key).onlyFromLoop = true;
    }

    // }

    return node.reference;
  }
};
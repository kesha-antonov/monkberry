'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sourceNode = require('./sourceNode');

var _figure = require('../figure');

var _variable = require('./variable');

var _utils = require('../utils');

exports.default = {
  IfStatement: function IfStatement(_ref) {
    var parent = _ref.parent,
        node = _ref.node,
        figure = _ref.figure,
        compile = _ref.compile;

    node.reference = null;

    var templateNameForThen = figure.name + '_if' + figure.uniqid('template_name');
    var templateNameForOtherwise = figure.name + '_else' + figure.uniqid('template_name');
    var childNameForThen = 'child' + figure.uniqid('child_name');
    var childNameForOtherwise = 'child' + figure.uniqid('child_name');
    var placeholder = void 0;

    if ((0, _utils.isSingleChild)(parent, node)) {
      placeholder = parent.reference;
    } else {
      node.reference = placeholder = 'for' + figure.uniqid('placeholder');
      figure.declare((0, _sourceNode.sourceNode)('var ' + placeholder + ' = document.createComment(\'if\');'));
    }

    figure.declare('var ' + childNameForThen + ' = {};');

    if (node.otherwise) {
      figure.declare('var ' + childNameForOtherwise + ' = {};');
    }

    // if (

    var variablesOfExpression = (0, _variable.collectVariables)(figure.getScope(), node.cond);

    figure.thisRef = true;
    figure.hasNested = true;

    figure.spot(variablesOfExpression).add((0, _sourceNode.sourceNode)(node.loc, ['      ', node.otherwise ? 'result = ' : '', 'Monkberry.cond(_this, ' + placeholder + ', ' + childNameForThen + ', ' + templateNameForThen + ', ', compile(node.cond), ')']));

    if (node.otherwise) {
      figure.spot(variablesOfExpression).add((0, _sourceNode.sourceNode)(node.loc, ['      ', 'Monkberry.cond(_this, ' + placeholder + ', ' + childNameForOtherwise + ', ' + templateNameForOtherwise + ', !result)'])).declareVariable('result');
    }

    // ) then {

    var compileBody = function compileBody(loc, body, templateName, childName) {
      var subfigure = new _figure.Figure(templateName, figure);
      subfigure.children = body.map(function (node) {
        return compile(node, subfigure);
      }).filter(_utils.notNull);
      figure.addFigure(subfigure);

      figure.addOnUpdate((0, _sourceNode.sourceNode)(loc, ['    if (' + childName + '.ref) {\n', '      ' + childName + '.ref.update(__data__);\n', '    }']));
    };

    compileBody(node.loc, node.then, templateNameForThen, childNameForThen);

    // } else {

    if (node.otherwise) {
      compileBody(node.loc, node.otherwise, templateNameForOtherwise, childNameForOtherwise);
    }

    // }

    return node.reference;
  }
};
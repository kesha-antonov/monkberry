'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sourceNode = require('./sourceNode');

var _variable = require('./variable');

exports.default = {
  ExpressionStatement: function ExpressionStatement(_ref) {
    var node = _ref.node,
        compile = _ref.compile,
        figure = _ref.figure;

    node.reference = 'text' + figure.uniqid();

    var defaultValue = '\'\'';

    if (node.expression.type == 'LogicalExpression' && node.expression.operator == '||') {
      // Add as default right side of "||" expression if there are no variables.
      if ((0, _variable.collectVariables)(figure.getScope(), node.expression.right) == 0) {
        defaultValue = compile(node.expression.right);
      }
    }

    figure.declare((0, _sourceNode.sourceNode)('var ' + node.reference + ' = document.createTextNode(' + defaultValue + ');'));

    var variables = (0, _variable.collectVariables)(figure.getScope(), node.expression);

    if (variables.length == 0) {
      figure.construct((0, _sourceNode.sourceNode)(node.loc, [node.reference, '.textContent = ', compile(node.expression)]));
    } else {
      figure.spot(variables).add((0, _sourceNode.sourceNode)(node.loc, ['      ', node.reference, '.textContent = ', compile(node.expression)]));
    }

    return node.reference;
  },

  FilterExpression: function FilterExpression(_ref2) {
    var node = _ref2.node,
        figure = _ref2.figure,
        compile = _ref2.compile;

    var prefix = '';

    if (!figure.isInScope(node.callee.name)) {
      figure.thisRef = true;
      prefix = '_this.filters.';
    }

    var sn = (0, _sourceNode.sourceNode)(node.loc, [prefix, compile(node.callee), '(']);

    for (var i = 0; i < node.arguments.length; i++) {
      if (i !== 0) {
        sn.add(', ');
      }

      sn.add(compile(node.arguments[i]));
    }

    return sn.add(')');
  },

  ArrayExpression: function ArrayExpression(_ref3) {
    var node = _ref3.node,
        compile = _ref3.compile;

    var sn = (0, _sourceNode.sourceNode)(node.loc, '[');
    var elements = node.elements;

    for (var i = 0; i < node.elements.length; i++) {
      if (i !== 0) {
        sn.add(', ');
      }

      sn.add(compile(elements[i]));
    }

    return sn.add(']');
  },

  ObjectExpression: function ObjectExpression(_ref4) {
    var node = _ref4.node,
        compile = _ref4.compile;

    var sn = (0, _sourceNode.sourceNode)(node.loc, '({');

    for (var i = 0; i < node.properties.length; i++) {
      var prop = node.properties[i];
      var kind = prop.kind;
      var key = prop.key;
      var value = prop.value;

      if (i !== 0) {
        sn.add(', ');
      }

      if (kind === 'init') {
        sn.add([compile(key), ': ', compile(value)]);
      } else {
        var params = value.params;
        var body = value.body;

        sn.add([kind, ' ', compile(key), '(']);

        for (var j = 0; j < params.length; j++) {
          if (j !== 0) {
            sn.add(', ');
          }

          sn.add(compile(params[j]));
        }

        sn.add(') { ');

        for (var _j = 0; _j < body.length; _j++) {
          sn.add([compile(body[_j]), ' ']);
        }

        sn.add('}');
      }
    }

    return sn.add('})');
  },

  SequenceExpression: function SequenceExpression(_ref5) {
    var node = _ref5.node,
        compile = _ref5.compile;

    var sn = (0, _sourceNode.sourceNode)(node.loc, '');

    for (var i = 0; i < node.expressions.length; i++) {
      if (i !== 0) {
        sn.add(', ');
      }

      sn.add(compile(node.expressions[i]));
    }

    return sn;
  },

  UnaryExpression: function UnaryExpression(_ref6) {
    var node = _ref6.node,
        compile = _ref6.compile;

    if (node.operator == 'delete' || node.operator == 'void' || node.operator == 'typeof') {
      return (0, _sourceNode.sourceNode)(node.loc, [node.operator, ' (', compile(node.argument), ')']);
    } else {
      return (0, _sourceNode.sourceNode)(node.loc, [node.operator, '(', compile(node.argument), ')']);
    }
  },

  BinaryExpression: function BinaryExpression(_ref7) {
    var node = _ref7.node,
        compile = _ref7.compile;

    return (0, _sourceNode.sourceNode)(node.loc, ['(', compile(node.left), ') ', node.operator, ' (', compile(node.right), ')']);
  },

  AssignmentExpression: function AssignmentExpression(_ref8) {
    var node = _ref8.node,
        compile = _ref8.compile;

    return (0, _sourceNode.sourceNode)(node.loc, ['(', compile(node.left), ') ', node.operator, ' (', compile(node.right), ')']);
  },

  UpdateExpression: function UpdateExpression(_ref9) {
    var node = _ref9.node,
        compile = _ref9.compile;

    if (node.prefix) {
      return (0, _sourceNode.sourceNode)(node.loc, ['(', node.operator, compile(node.argument), ')']);
    } else {
      return (0, _sourceNode.sourceNode)(node.loc, ['(', compile(node.argument), node.operator, ')']);
    }
  },

  LogicalExpression: function LogicalExpression(_ref10) {
    var node = _ref10.node,
        compile = _ref10.compile;

    return (0, _sourceNode.sourceNode)(node.loc, ['(', compile(node.left), ') ', node.operator, ' (' + compile(node.right), ')']);
  },

  ConditionalExpression: function ConditionalExpression(_ref11) {
    var node = _ref11.node,
        compile = _ref11.compile;

    return (0, _sourceNode.sourceNode)(node.loc, ['(', compile(node.test), ') ? ', compile(node.consequent), ' : ', compile(node.alternate)]);
  },

  NewExpression: function NewExpression(_ref12) {
    var node = _ref12.node,
        compile = _ref12.compile;

    var sn = (0, _sourceNode.sourceNode)(node.loc, ['new ', compile(node.callee)]);

    if (node.arguments !== null) {
      sn.add('(');

      for (var i = 0; i < node.arguments.length; i++) {
        if (i !== 0) {
          sn.add(', ');
        }

        sn.add(compile(node.arguments[i]));
      }

      sn.add(')');
    }

    return sn;
  },

  CallExpression: function CallExpression(_ref13) {
    var node = _ref13.node,
        compile = _ref13.compile;

    var sn = (0, _sourceNode.sourceNode)(node.loc, [compile(node.callee), '(']);

    for (var i = 0; i < node.arguments.length; i++) {
      if (i !== 0) {
        sn.add(', ');
      }

      sn.add(compile(node.arguments[i]));
    }

    return sn.add(')');
  },

  MemberExpression: function MemberExpression(_ref14) {
    var node = _ref14.node,
        compile = _ref14.compile;

    if (node.computed) {
      return (0, _sourceNode.sourceNode)(node.loc, [compile(node.object), '[', compile(node.property), ']']);
    } else {
      return (0, _sourceNode.sourceNode)(node.loc, [compile(node.object), '.', compile(node.property)]);
    }
  },

  ThisExpression: function ThisExpression(_ref15) {
    var node = _ref15.node,
        figure = _ref15.figure;

    var ref = function ref(fig) {
      return fig.parent == null ? '' : '.parent' + ref(fig.parent);
    };

    figure.thisRef = true;

    return (0, _sourceNode.sourceNode)(node.loc, '_this' + ref(figure));
  },

  Identifier: function Identifier(_ref16) {
    var node = _ref16.node;

    return (0, _sourceNode.sourceNode)(node.loc, node.name);
  },

  Accessor: function Accessor(_ref17) {
    var node = _ref17.node;

    return (0, _sourceNode.sourceNode)(node.loc, node.name);
  },

  Literal: function Literal(_ref18) {
    var node = _ref18.node;

    return (0, _sourceNode.sourceNode)(node.loc, node.value.toString());
  }
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visit = visit;
function visit(node, visitor) {
  if (node.type in visitors) {
    visitors[node.type](node, visitor);
  } else {
    throw new Error("Unknown node type \"" + node.type + "\".");
  }
}

function handle(node, visitor) {
  if (node.type in visitor) {
    visitor[node.type](node);
  }
}

var visitors = {
  Document: function Document(node, visitor) {
    handle(node, visitor);

    for (var i = 0; i < node.body.length; i++) {
      visit(node.body[i], visitor);
    }
  },
  Text: function Text(node, visitor) {
    handle(node, visitor);
  },
  Comment: function Comment(node, visitor) {
    handle(node, visitor);
  },
  Element: function Element(node, visitor) {
    handle(node, visitor);

    for (var i = 0; i < node.attributes.length; i++) {
      visit(node.attributes[i], visitor);
    }

    for (var _i = 0; _i < node.body.length; _i++) {
      visit(node.body[_i], visitor);
    }
  },
  Attribute: function Attribute(node, visitor) {
    handle(node, visitor);

    if (node.body) {
      for (var i = 0; i < node.body.length; i++) {
        visit(node.body[i], visitor);
      }
    }
  },
  SpreadAttribute: function SpreadAttribute(node, visitor) {
    handle(node, visitor);
    visit(node.identifier, visitor);
  },
  Directive: function Directive(node, visitor) {
    handle(node, visitor);

    if (node.body) {
      for (var i = 0; i < node.body.length; i++) {
        visit(node.body[i], visitor);
      }
    }
  },
  ExpressionStatement: function ExpressionStatement(node, visitor) {
    handle(node, visitor);
    visit(node.expression, visitor);
  },
  ImportStatement: function ImportStatement(node, visitor) {
    handle(node, visitor);
  },
  IfStatement: function IfStatement(node, visitor) {
    handle(node, visitor);

    visit(node.cond, visitor);

    for (var i = 0; i < node.then.length; i++) {
      visit(node.then[i], visitor);
    }

    if (node.otherwise) {
      for (var _i2 = 0; _i2 < node.otherwise.length; _i2++) {
        visit(node.otherwise[_i2], visitor);
      }
    }
  },
  ForStatement: function ForStatement(node, visitor) {
    handle(node, visitor);

    visit(node.expr, visitor);

    for (var i = 0; i < node.body.length; i++) {
      visit(node.body[i], visitor);
    }
  },
  BlockStatement: function BlockStatement(node, visitor) {
    handle(node, visitor);

    for (var i = 0; i < node.body.length; i++) {
      visit(node.body[i], visitor);
    }
  },
  UnsafeStatement: function UnsafeStatement(node, visitor) {
    handle(node, visitor);
  },
  FilterExpression: function FilterExpression(node, visitor) {
    handle(node, visitor);

    visit(node.callee, visitor);
    var args = node.arguments;

    for (var i = 0, len = args.length; i < len; i++) {
      visit(args[i], visitor);
    }
  },
  ArrayExpression: function ArrayExpression(node, visitor) {
    handle(node, visitor);

    var elements = node.elements;

    for (var i = 0, len = elements.length; i < len; i++) {
      visit(elements[i], visitor);
    }
  },
  ObjectExpression: function ObjectExpression(node, visitor) {
    handle(node, visitor);

    var i,
        j,
        properties = node.properties;

    for (i = 0, len = properties.length; i < len; i++) {
      var prop = properties[i];
      var kind = prop.kind;
      var key = prop.key;
      var value = prop.value;

      if (kind === "init") {
        visit(key, visitor);
        visit(value, visitor);
      } else {
        var params = value.params;
        var body = value.body;

        visit(key, visitor);

        for (j = 0, plen = params.length; j < plen; j++) {
          visit(params[j], visitor);
        }

        for (j = 0, blen = body.length; j < blen; j++) {
          visit(body[j], visitor);
        }
      }
    }
  },
  SequenceExpression: function SequenceExpression(node, visitor) {
    handle(node, visitor);

    var expressions = node.expressions;

    for (var i = 0, len = expressions.length; i < len; i++) {
      visit(expressions[i], visitor);
    }
  },
  UnaryExpression: function UnaryExpression(node, visitor) {
    handle(node, visitor);

    visit(node.argument, visitor);
  },
  BinaryExpression: function BinaryExpression(node, visitor) {
    handle(node, visitor);

    visit(node.left, visitor);
    visit(node.right, visitor);
  },
  AssignmentExpression: function AssignmentExpression(node, visitor) {
    handle(node, visitor);

    visit(node.left, visitor);
    visit(node.right, visitor);
  },
  UpdateExpression: function UpdateExpression(node, visitor) {
    handle(node, visitor);

    visit(node.argument, visitor);
    visit(node.argument, visitor);
  },
  LogicalExpression: function LogicalExpression(node, visitor) {
    handle(node, visitor);

    visit(node.left, visitor);
    visit(node.right, visitor);
  },
  ConditionalExpression: function ConditionalExpression(node, visitor) {
    handle(node, visitor);

    visit(node.test, visitor);
    visit(node.consequent, visitor);
    visit(node.alternate, visitor);
  },
  NewExpression: function NewExpression(node, visitor) {
    handle(node, visitor);

    visit(node.callee, visitor);
    var args = node.arguments;

    if (args !== null) {
      for (var i = 0, len = args.length; i < len; i++) {
        visit(args[i], visitor);
      }
    }
  },
  CallExpression: function CallExpression(node, visitor) {
    handle(node, visitor);

    visit(node.callee, visitor);
    var args = node.arguments;

    for (var i = 0, len = args.length; i < len; i++) {
      visit(args[i], visitor);
    }
  },
  MemberExpression: function MemberExpression(node, visitor) {
    handle(node, visitor);
    visit(node.object, visitor);
    visit(node.property, visitor);
  },
  ThisExpression: function ThisExpression(node, visitor) {
    handle(node, visitor);
  },
  Identifier: function Identifier(node, visitor) {
    handle(node, visitor);
  },
  Accessor: function Accessor(node, visitor) {
    handle(node, visitor);
  },
  Literal: function Literal(node, visitor) {
    handle(node, visitor);
  }
};
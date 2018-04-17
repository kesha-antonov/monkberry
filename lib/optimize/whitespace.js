'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.whitespace = whitespace;

var _visitor = require('../visitor');

function whitespace(ast) {
  (0, _visitor.visit)(ast, {
    Document: function Document(node) {
      trim(node, 'body');
    },
    Element: function Element(node) {
      trim(node, 'body');
    },
    IfStatement: function IfStatement(node) {
      trim(node, 'then');
      trim(node, 'otherwise');
    },
    ForStatement: function ForStatement(node) {
      trim(node, 'body');
    },
    BlockStatement: function BlockStatement(node) {
      trim(node, 'body');
    }
  });
}

function trim(node, key) {
  var skipped = false,
      nodes = [];

  if (!node[key]) {
    return;
  }

  // Skip empty text nodes.
  for (var i = 0; i < node[key].length; i++) {
    if (node[key][i].type == 'Text') {
      if (node[key][i].text.replace(/^\s+|\s+$/g, '') === '') {
        skipped = true;
        continue; // Skip this node.
      }
    }

    nodes.push(node[key][i]);
  }

  if (skipped) {
    node[key] = nodes;
  }
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectVariables = collectVariables;

var _visitor = require('../visitor');

function collectVariables(scope, node) {
  var variables = [];
  if (node) {
    var nodes = [].concat(node);
    nodes.forEach(function (node) {
      (0, _visitor.visit)(node, {
        Identifier: function Identifier(node) {
          if (variables.indexOf(node.name) == -1 && scope.indexOf(node.name) == -1) {
            variables.push(node.name);
          }
        }
      });
    });
  }
  return variables;
}
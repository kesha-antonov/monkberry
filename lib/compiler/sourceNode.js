'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sourceNode = sourceNode;

var _sourceMap = require('source-map');

function sourceNode(loc, chunk) {
  // Check call arity.
  if (chunk == undefined) {
    chunk = loc;
    loc = null;
  }

  if (!loc) {
    return new _sourceMap.SourceNode(null, null, null, chunk);
  } else {
    return new _sourceMap.SourceNode(loc.start.line, loc.start.column, loc.source, chunk);
  }
}
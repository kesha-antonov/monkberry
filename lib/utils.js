'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esc = esc;
exports.size = size;
exports.notNull = notNull;
exports.unique = unique;
exports.isSingleChild = isSingleChild;
exports.getTemplateName = getTemplateName;
exports.getStringLiteralValue = getStringLiteralValue;
exports.arrayToObject = arrayToObject;
exports.hyphensToCamelCase = hyphensToCamelCase;
function esc(str) {
  return JSON.stringify(str);
}

function size(obj) {
  var size = 0,
      key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      size++;
    }
  }
  return size;
}

function notNull(item) {
  return item !== null;
}

function unique(a) {
  return a.reduce(function (p, c) {
    if (p.indexOf(c) < 0) {
      p.push(c);
    }
    return p;
  }, []);
}

function isSingleChild(parent, node) {
  if (parent) {
    if (parent.type == 'Element') {
      if (parent.body.length == 1 && parent.body[0] == node) {
        return true;
      }
    }
  }
  return false;
}

function getTemplateName(name) {
  return name.replace(/\W+/g, '_');
}

function getStringLiteralValue(literal) {
  return literal.value.replace(/^["']/, '').replace(/["']$/, '');
}

function arrayToObject(array) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  var obj = {};
  for (var i = 0; i < array.length; i++) {
    obj[array[i]] = value;
  }
  return obj;
}

function hyphensToCamelCase(str) {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}
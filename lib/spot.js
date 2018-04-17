'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Spot = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _sourceNode = require('./compiler/sourceNode');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Spot = exports.Spot = function () {
  function Spot(variables) {
    _classCallCheck(this, Spot);

    this.variables = (0, _utils.unique)(variables).sort();
    this.reference = this.variables.join('_');
    this.declaredVariables = {};
    this.operators = [];
    this.length = this.variables.length;
    this.cache = false;
    this.onlyFromLoop = false;
  }

  _createClass(Spot, [{
    key: 'generate',
    value: function generate() {
      var sn = (0, _sourceNode.sourceNode)('function (' + this.variables.join(', ') + ') {\n');

      Object.keys(this.declaredVariables).forEach(function (name) {
        sn.add('      var ' + name + ';\n');
      });

      if (this.operators.length > 0) {
        sn.add((0, _sourceNode.sourceNode)(this.operators).join(';\n')).add(';\n');
      }

      sn.add('    }');

      return sn;
    }
  }, {
    key: 'add',
    value: function add(code) {
      this.operators.push(code);
      return this;
    }
  }, {
    key: 'declareVariable',
    value: function declareVariable(name) {
      this.declaredVariables[name] = true;
      return this;
    }
  }]);

  return Spot;
}();
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Figure = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sourceNode = require('./compiler/sourceNode');

var _utils = require('./utils');

var _spot = require('./spot');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Figure = exports.Figure = function () {
  function Figure(name) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, Figure);

    this.name = name;
    this.parent = parent;
    this.uniqCounters = {};
    this.children = [];
    this.functions = {};
    this.imports = [];
    this.declarations = [];
    this.constructions = [];
    this.directives = [];
    this.renderActions = [];
    this.subFigures = [];
    this.spots = {};
    this.scope = [];
    this.onUpdate = [];
    this.onRemove = [];
    this.thisRef = false;
    this.stateNeed = false;
  }

  _createClass(Figure, [{
    key: 'generate',
    value: function generate() {
      var sn = (0, _sourceNode.sourceNode)('');

      if (this.imports.length > 0) {
        sn.add((0, _sourceNode.sourceNode)(this.imports).join('\n'));
        sn.add('\n');
        sn.add('function __requireDefault(obj) { return obj && obj.__esModule ? obj.default : obj; }\n');
      }

      if ((0, _utils.size)(this.functions) > 0) {
        sn.add('\n');
        sn.add(this.generateFunctions());
      }

      sn.add(['\n', '/**\n', ' * @class\n', ' */\n', 'function ' + this.name + '() {\n', '  Monkberry.call(this);\n']);

      if (this.isCacheNeeded()) {
        sn.add('  this.__cache__ = {};\n');
      }

      if (this.stateNeed) {
        sn.add('  this.__state__ = {};\n');
      }

      if (this.thisRef) {
        sn.add('  var _this = this;\n');
      }

      sn.add('\n');

      if (this.declarations.length > 0) {
        sn.add(['  // Create elements\n', '  ', (0, _sourceNode.sourceNode)(this.declarations).join('\n  '), '\n\n']);
      }

      if (this.constructions.length > 0) {
        sn.add(['  // Construct dom\n', '  ', (0, _sourceNode.sourceNode)(null, this.constructions).join('\n  '), '\n\n']);
      }

      if (this.directives.length > 0) {
        sn.add(['  // Directives\n', '  ', (0, _sourceNode.sourceNode)(null, this.directives).join('\n  '), '\n\n']);
      }

      if ((0, _utils.size)(this.spots) > 0) {
        sn.add(['  // Update functions\n', '  this.__update__ = {\n', this.generateSpots(), '\n', '  };\n', '\n']);
      }

      if (this.renderActions.length > 0) {
        sn.add(['  // Extra render actions\n', '  this.onRender = function () {\n', (0, _sourceNode.sourceNode)(this.renderActions).join('\n'), '\n', '  };\n', '\n']);
      }

      if (this.onUpdate.length > 0) {
        sn.add(['  // On update actions\n', '  this.onUpdate = function (__data__) {\n', (0, _sourceNode.sourceNode)(this.onUpdate).join('\n'), '\n', '  };\n', '\n']);
      }

      if (this.onRemove.length > 0) {
        sn.add(['  // On remove actions\n', '  this.onRemove = function (__data__) {\n', (0, _sourceNode.sourceNode)(this.onRemove).join('\n'), '\n', '  };\n', '\n']);
      }

      sn.add(['  // Set root nodes\n', '  this.nodes = [', (0, _sourceNode.sourceNode)(this.children).join(', '), '];\n']);

      sn.add('}\n');

      sn.add([this.name + '.prototype = Object.create(Monkberry.prototype);\n', this.name + '.prototype.constructor = ' + this.name + ';\n', this.name + '.pool = [];\n']);

      sn.add(this.generateUpdateFunction());

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.subFigures[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var subfigure = _step.value;

          sn.add(subfigure.generate());
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return sn;
    }
  }, {
    key: 'generateFunctions',
    value: function generateFunctions() {
      var _this = this;

      var defn = [];
      Object.keys(this.functions).forEach(function (key) {
        defn.push((0, _sourceNode.sourceNode)(key + ' = ' + _this.functions[key]));
      });
      return (0, _sourceNode.sourceNode)('var ').add((0, _sourceNode.sourceNode)(defn).join(',\n')).add(';\n');
    }
  }, {
    key: 'generateSpots',
    value: function generateSpots() {
      var _this2 = this;

      var parts = [];

      Object.keys(this.spots).map(function (x) {
        return _this2.spots[x];
      }).filter(function (spot) {
        return spot.operators.length > 0;
      }).map(function (spot) {
        parts.push((0, _sourceNode.sourceNode)(['    ', spot.reference, ': ', spot.generate()]));
      });

      return (0, _sourceNode.sourceNode)(null, parts).join(',\n');
    }
  }, {
    key: 'generateUpdateFunction',
    value: function generateUpdateFunction() {
      var _this3 = this;

      var sn = (0, _sourceNode.sourceNode)(this.name + '.prototype.update = function (__data__) {\n');

      var spots = Object.keys(this.spots).map(function (key) {
        return _this3.spots[key];
      }).sort(function (a, b) {
        return a.length - b.length;
      });

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = spots[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var spot = _step2.value;

          if (spot.length == 1) {
            var name = spot.variables[0];

            sn.add('  if (__data__.' + name + ' !== undefined');
            if (spot.onlyFromLoop) {
              sn.add(' && __data__.__index__ !== undefined');
            }
            sn.add(') {\n');

            if (spot.cache) {
              sn.add('    this.__cache__.' + name + ' = __data__.' + name + ';\n');
            }

            if (spot.operators.length > 0) {
              sn.add('    this.__update__.' + spot.reference + '(__data__.' + name + ');\n');
            }

            sn.add('  }\n');
          } else {

            var cond = (0, _sourceNode.sourceNode)(spot.variables.map(function (name) {
              return 'this.__cache__.' + name + ' !== undefined';
            })).join(' && ');
            var params = (0, _sourceNode.sourceNode)(spot.variables.map(function (name) {
              return 'this.__cache__.' + name;
            })).join(', ');

            sn.add(['  if (', cond, ') {\n', '    this.__update__.' + spot.reference + '(', params, ');\n', '  }\n']);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (this.onUpdate.length > 0) {
        sn.add('  this.onUpdate(__data__);\n');
      }

      sn.add('};\n');
      return sn;
    }
  }, {
    key: 'uniqid',
    value: function uniqid() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';

      if (!this.uniqCounters[name]) {
        this.uniqCounters[name] = 0;
      }
      return this.uniqCounters[name]++;
    }
  }, {
    key: 'hasSpot',
    value: function hasSpot(variables) {
      return this.spots.hasOwnProperty(new _spot.Spot([].concat(variables)).reference);
    }
  }, {
    key: 'spot',
    value: function spot(variables) {
      var s = new _spot.Spot([].concat(variables));

      if (!this.spots.hasOwnProperty(s.reference)) {
        this.spots[s.reference] = s;

        if (s.variables.length > 1) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = s.variables[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var variable = _step3.value;

              this.spot(variable).cache = true;
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      }

      return this.spots[s.reference];
    }
  }, {
    key: 'isCacheNeeded',
    value: function isCacheNeeded() {
      var _this4 = this;

      var needed = false;

      Object.keys(this.spots).map(function (x) {
        return _this4.spots[x];
      }).forEach(function (spot) {
        if (spot.variables.length > 1) {
          needed = true;
        }
        if (spot.cache) {
          needed = true;
        }
      });

      return needed;
    }
  }, {
    key: 'root',
    value: function root() {
      if (this.parent) {
        return this.parent.root();
      } else {
        return this;
      }
    }
  }, {
    key: 'getScope',
    value: function getScope() {
      if (this.parent) {
        return [].concat(this.scope).concat(this.parent.getScope());
      } else {
        return this.scope;
      }
    }
  }, {
    key: 'addToScope',
    value: function addToScope(variable) {
      this.scope.push(variable);
    }
  }, {
    key: 'isInScope',
    value: function isInScope(variable) {
      return this.getScope().indexOf(variable) != -1;
    }
  }, {
    key: 'declare',
    value: function declare(node) {
      this.declarations.push(node);
    }
  }, {
    key: 'construct',
    value: function construct(node) {
      this.constructions.push(node);
    }
  }, {
    key: 'addFunction',
    value: function addFunction(name, source) {
      if (!this.functions.hasOwnProperty(name)) {
        this.functions[name] = source;
      }
    }
  }, {
    key: 'addFigure',
    value: function addFigure(figure) {
      this.subFigures.push(figure);
    }
  }, {
    key: 'addRenderActions',
    value: function addRenderActions(action) {
      this.renderActions.push(action);
    }
  }, {
    key: 'addImport',
    value: function addImport(source) {
      this.imports.push(source);
    }
  }, {
    key: 'addOnUpdate',
    value: function addOnUpdate(node) {
      this.onUpdate.push(node);
    }
  }, {
    key: 'prependOnUpdate',
    value: function prependOnUpdate(node) {
      this.onUpdate.unshift(node);
    }
  }, {
    key: 'addOnRemove',
    value: function addOnRemove(node) {
      this.onRemove.push(node);
    }
  }, {
    key: 'addDirective',
    value: function addDirective(node) {
      this.directives.push(node);
    }
  }]);

  return Figure;
}();
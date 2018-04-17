'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVGElements = exports.HTMLElements = undefined;

var _html = require('./html');

var _html2 = _interopRequireDefault(_html);

var _svg = require('./svg');

var _svg2 = _interopRequireDefault(_svg);

var _custom = require('./custom');

var _custom2 = _interopRequireDefault(_custom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HTMLElements = exports.HTMLElements = ('a abbr address area article aside audio b base bdi bdo big blockquote body br ' + 'button canvas caption cite code col colgroup data datalist dd del details dfn ' + 'dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 ' + 'h6 head header hr html i iframe img input ins kbd keygen label legend li link ' + 'main map mark menu menuitem meta meter nav noscript object ol optgroup option ' + 'output p param picture pre progress q rp rt ruby s samp script section select ' + 'small source span strong style sub summary sup table tbody td textarea tfoot th ' + 'thead time title tr track u ul var video wbr').split(' ');

var SVGElements = exports.SVGElements = ('circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite ' + 'feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feFlood feFuncA ' + 'feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset ' + 'fePointLight feSpecularLighting feSpotLight feTile feTurbulence g line linearGradient mask ' + 'path pattern polygon polyline radialGradient rect stop svg text tspan animate').split(' ');

exports.default = {
  Element: function Element(path) {
    if (HTMLElements.indexOf(path.node.name) != -1) {
      return _html2.default.Element(path);
    } else if (SVGElements.indexOf(path.node.name) != -1) {
      return _svg2.default.Element(path);
    } else {
      return _custom2.default.Element(path);
    }
  }
};
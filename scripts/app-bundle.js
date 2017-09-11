define('app',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var App = exports.App = function App() {
        _classCallCheck(this, App);
    };
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./base.css\"></require>\n  <section class=\"under-construction\">\n    <h1 class=\"display-text\">Under construction.</h1>\n  </section>\n</template>\n"; });
define('text!base.css', ['module'], function(module) { module.exports = "@import url(\"https://fonts.googleapis.com/css?family=Libre+Barcode+39+Text|Open+Sans\");\nbody {\n  font-family: 'Open Sans', sans-serif;\n  padding: 0;\n  margin: 0; }\n\n.display-text {\n  font-family: 'Libre Barcode 39 Text', cursive; }\n\n.under-construction {\n  position: absolute;\n  width: 100vw;\n  height: 100vh;\n  text-align: center;\n  font-weight: 100;\n  background: linear-gradient(139deg, #77a3bb, #9ea1d5, #95c8b7, #77bbb9);\n  background-size: 800% 800%;\n  -webkit-animation: CSSGradiantAnimation 43s ease infinite;\n  -moz-animation: CSSGradiantAnimation 43s ease infinite;\n  animation: CSSGradiantAnimation 43s ease infinite; }\n  .under-construction h1 {\n    font-size: 4rem; }\n  .under-construction h1, .under-construction h2, .under-construction h3, .under-construction h4, .under-construction h5, .under-construction h6 {\n    font-weight: inherit; }\n\n@-webkit-keyframes CSSGradiantAnimation {\n  0% {\n    background-position: 50% 0%; }\n  50% {\n    background-position: 50% 100%; }\n  100% {\n    background-position: 50% 0%; } }\n\n@-moz-keyframes CSSGradiantAnimation {\n  0% {\n    background-position: 50% 0%; }\n  50% {\n    background-position: 50% 100%; }\n  100% {\n    background-position: 50% 0%; } }\n\n@keyframes CSSGradiantAnimation {\n  0% {\n    background-position: 50% 0%; }\n  50% {\n    background-position: 50% 100%; }\n  100% {\n    background-position: 50% 0%; } }\n"; });
//# sourceMappingURL=app-bundle.js.map
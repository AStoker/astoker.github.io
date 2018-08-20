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

    logWelcomeMessage();

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

  function logWelcomeMessage() {
    console.log('Curious one, aren\'t you?');
    console.log('"Under Construction" is a very loose term right now.');
    console.log('Hit me up over on GitHub (https://github.com/AStoker) if you need anything.');
    console.log('Party on dudes!');
    console.log('https://youtu.be/rph_1DODXDU');
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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./base.css\"></require>\n\n  <h1 class=\"construction-text\">Under construction.</h1>\n  <section class=\"backdrop\"></section>\n\n</template>\n"; });
define('text!base.css', ['module'], function(module) { module.exports = "@import url(\"https://fonts.googleapis.com/css?family=Libre+Barcode+39+Text|Open+Sans\");\nbody {\n  font-family: 'Open Sans', sans-serif;\n  padding: 0;\n  margin: 0; }\n\n.construction-text {\n  font-family: 'Libre Barcode 39 Text', cursive;\n  font-size: 4rem;\n  position: absolute;\n  width: 100vw;\n  text-align: center;\n  z-index: 99; }\n\n.backdrop {\n  position: absolute;\n  width: 100vw;\n  height: 100vh;\n  text-align: center;\n  font-weight: 100;\n  background-image: url(\"images/Background.jpg\");\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n  filter: opacity(0.5); }\n"; });
//# sourceMappingURL=app-bundle.js.map
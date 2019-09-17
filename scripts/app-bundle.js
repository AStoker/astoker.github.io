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
    console.log('\n%cCurious one, aren\'t you?\n' + '"Under Construction" is a very loose term right now.\n' + 'Hit me up over on GitHub (https://github.com/AStoker) if you need anything.\n' + 'Party on dudes!\n' + 'https://youtu.be/rph_1DODXDU\n', 'background: rgb(220, 162, 110); color:rgb(57, 64, 88)');
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
define('text!base.css', ['module'], function(module) { module.exports = "@import url(\"https://fonts.googleapis.com/css?family=Expletus+Sans|Poiret+One\");\nbody {\n  font-family: 'Poiret One', sans-serif;\n  padding: 0;\n  margin: 0; }\n\n.construction-text {\n  font-size: 6rem;\n  position: absolute;\n  width: 100vw;\n  text-align: center;\n  z-index: 99; }\n\n.diagonal-slice {\n  position: absolute;\n  width: 100vw;\n  height: 60vh;\n  background: linear-gradient(193deg, rgba(255, 255, 255, 0.5) 50%, transparent 50%); }\n\n.backdrop {\n  position: absolute;\n  top: 0px;\n  bottom: 0px;\n  left: 0px;\n  right: 0px;\n  overflow: hidden; }\n  .backdrop .backdrop-image {\n    width: calc(100% + 15px);\n    height: calc(100% + 15px);\n    position: relative;\n    left: -8px;\n    top: -8px;\n    background-image: url(\"images/Background.jpg\");\n    background-position: center;\n    background-repeat: no-repeat;\n    background-size: cover;\n    filter: opacity(0.9) blur(2px); }\n"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./base.css\"></require>\n\n    <h1 class=\"construction-text\">Under construction</h1>\n\n    <section class=\"backdrop\">\n        <div class=\"backdrop-image\"></div>\n    </section>\n    <section class=\"diagonal-slice\"></section>\n\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map
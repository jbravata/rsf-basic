import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.iterator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

/**
 * Provides access to values set in the blob in Moov Console.
 */
var Config =
/*#__PURE__*/
function () {
  function Config() {
    _classCallCheck(this, Config);

    _defineProperty(this, "values", {});
  }

  _createClass(Config, [{
    key: "get",

    /**
     * Gets a config value
     * @param {String} key
     * @return {Object}
     */
    value: function get(key) {
      return this.values[key];
    }
    /**
     * Loads values from a JSON blob
     * @param {String/Object} blob A json blob
     */

  }, {
    key: "load",
    value: function load(blob) {
      if (!blob) return;

      if (typeof blob === 'string') {
        blob = JSON.parse(blob);
      }

      this.values = blob;
    }
  }]);

  return Config;
}();

var config = new Config();
export default config;
//# sourceMappingURL=Config.js.map
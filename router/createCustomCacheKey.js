import "core-js/modules/es6.function.name";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es6.object.keys";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import flatten from 'lodash/flatten';
/**
 * @private
 */

var QS_MODE_BLACKLIST = 'blacklist';
var QS_MODE_WHITELIST = 'whitelist';

var CustomCacheKey =
/*#__PURE__*/
function () {
  function CustomCacheKey() {
    _classCallCheck(this, CustomCacheKey);

    _defineProperty(this, "queryParametersMode", QS_MODE_BLACKLIST);

    _defineProperty(this, "queryParameterslist", []);

    _defineProperty(this, "queryParametersChanged", false);

    _defineProperty(this, "headers", []);

    _defineProperty(this, "cookies", {});
  }

  _createClass(CustomCacheKey, [{
    key: "excludeAllQueryParameters",
    value: function excludeAllQueryParameters() {
      this._preventQueryParametersConflict();

      this.queryParametersMode = QS_MODE_WHITELIST;
      this.queryParameterslist = [];
      return this;
    }
  }, {
    key: "excludeQueryParameters",
    value: function excludeQueryParameters() {
      this._preventQueryParametersConflict();

      this.queryParametersMode = QS_MODE_BLACKLIST;

      for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      this.queryParameterslist = this._convertArgsToArray(params);
      return this;
    }
  }, {
    key: "excludeAllQueryParametersExcept",
    value: function excludeAllQueryParametersExcept() {
      this._preventQueryParametersConflict();

      this.queryParametersMode = QS_MODE_WHITELIST;

      for (var _len2 = arguments.length, params = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        params[_key2] = arguments[_key2];
      }

      this.queryParameterslist = this._convertArgsToArray(params);
      return this;
    }
  }, {
    key: "addHeader",
    value: function addHeader(name, createPartitions) {
      if (typeof createPartitions === 'function') {
        var partitions = new Partitions();
        createPartitions(partitions);
        this.headers.push({
          name: name,
          partitions: partitions.toJSON()
        });
      } else {
        this.headers.push(name);
      }

      return this;
    }
  }, {
    key: "addCookie",
    value: function addCookie(name, createPartitions) {
      var partitions = new Partitions();

      if (typeof createPartitions === 'function') {
        createPartitions(partitions);
      }

      this.cookies[name] = partitions.toJSON();
      return this;
    }
    /**
     * Returns the name of all cookies in the custom key
     * @return {String[]}
     */

  }, {
    key: "getCookieNames",
    value: function getCookieNames() {
      return Object.keys(this.cookies);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        add_headers: this.headers,
        add_cookies: this.cookies,
        query_parameters_mode: this.queryParametersMode,
        query_parameters_list: this.queryParameterslist
      };
    }
    /**
     * @private
     */

  }, {
    key: "_preventQueryParametersConflict",
    value: function _preventQueryParametersConflict() {
      if (this.queryParametersChanged) {
        throw new Error('You cannot combine multiple query params exclusion in a single custom cache key definition');
      }

      this.queryParametersChanged = true;
    }
    /**
     * Some function can be called with both an array or spread arguments.
     * ex: excludeAllQueryParameters('uid', 'utm_source') or excludeAllQueryParameters([uid', 'utm_source'])
     * @param {@} args
     */

  }, {
    key: "_convertArgsToArray",
    value: function _convertArgsToArray(args) {
      return flatten(args);
    }
  }]);

  return CustomCacheKey;
}();
/**
 * @private
 */


var Partitions =
/*#__PURE__*/
function () {
  function Partitions() {
    _classCallCheck(this, Partitions);

    _defineProperty(this, "partitions", []);

    _defineProperty(this, "name", null);
  }

  _createClass(Partitions, [{
    key: "partition",
    value: function partition(name) {
      var partition = new PartitionConfig(name);
      this.partitions.push(partition);
      return partition;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      if (this.partitions.length === 0) {
        return null;
      } else {
        return this.partitions.map(function (p) {
          return p.toJSON();
        });
      }
    }
  }]);

  return Partitions;
}();
/**
 * @private
 */


var PartitionConfig =
/*#__PURE__*/
function () {
  function PartitionConfig(name) {
    _classCallCheck(this, PartitionConfig);

    _defineProperty(this, "pattern", null);

    _defineProperty(this, "name", null);

    this.name = name;
  }

  _createClass(PartitionConfig, [{
    key: "byPattern",
    value: function byPattern(pattern) {
      this.pattern = pattern;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        partition: this.name,
        partitioning_regex: this.pattern
      };
    }
  }]);

  return PartitionConfig;
}();
/**
 * Returns a DSL for creating custom server cache keys based on cookies, query parameters, and
 * request headers.
 *
 * example:
 *
 * ```js
 *  new Router()
 *    .get('/s/:id',
 *      cache({
 *        edge: {
 *          key: createCustomCacheKey()
 *            .addHeader('user-agent')
 *            .excludeQueryParameters(['uid'])
 *            .addCookie('location', cookie => {
 *              cookie.partition('na').byPattern('us|ca')
 *              cookie.partition('eur').byPattern('de|fr|ee')
 *            })
 *        }
 *      })
 *    )
 * ```
 */


export default function createCustomCacheKey() {
  return new CustomCacheKey();
}
//# sourceMappingURL=createCustomCacheKey.js.map
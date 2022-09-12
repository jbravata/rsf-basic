import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _wrapNativeSuper from "@babel/runtime/helpers/wrapNativeSuper";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import "core-js/modules/es6.function.name";
import _objectSpread from "@babel/runtime/helpers/objectSpread";

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

/**
 * Creates a fetch function with an internal incrementing request counter that ensures that out of order
 * responses result in a `StaleResponseError`.
 *
 * Example usage:
 *
 * ```js
 * import { fetchLatest, StaleResponseError } from 'react-storefront/fetchLatest'
 * import originalFetch from 'fetch'
 *
 * const fetch = fetchLatest(originalFetch)
 *
 * try {
 *   const response = await fetch('/some/url')
 * } catch (e) {
 *   if (!StaleResponseError.is(e)) {
 *     throw e // just ignore stale responses, rethrow all other errors
 *   }
 * }
 * ```
 * @param {Function} fetch An implementation of the standard browser fetch.
 * @return {Function}
 */
export function fetchLatest(fetch) {
  var nextId = 0;
  var controller;

  var abort = function abort() {
    controller && controller.abort();

    if (typeof AbortController !== 'undefined') {
      return controller = new AbortController();
    } else {
      return {
        signal: null
      };
    }
  };

  return function (url, options) {
    var id = ++nextId;
    var signal = abort().signal;
    return fetch(url, _objectSpread({}, options, {
      signal: signal
    })).then(function (response) {
      if (id !== nextId) {
        throw new StaleResponseError();
      }

      return response;
    }).catch(function (error) {
      // For browsers that support AbortController, ensure that the behavior is the same as browsers that don't -
      // StaleResponseError should be thrown in either case
      if (error.name === 'AbortError') {
        throw new StaleResponseError();
      } else {
        throw error;
      }
    });
  };
}
/**
 * Thrown when an out of order response is received from `fetchLatest`.
 */

export var StaleResponseError =
/*#__PURE__*/
function (_Error) {
  _inherits(StaleResponseError, _Error);

  function StaleResponseError() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, StaleResponseError);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(StaleResponseError)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "name", 'StaleResponseError');

    return _this;
  }

  return StaleResponseError;
}(_wrapNativeSuper(Error));

_defineProperty(StaleResponseError, "is", function (e) {
  return e.name === 'StaleResponseError';
});
//# sourceMappingURL=fetchLatest.js.map
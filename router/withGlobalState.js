import _regeneratorRuntime from "@babel/runtime/regenerator";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import "core-js/modules/es6.string.ends-with";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

/**
 * When doing SSR, returns `globalState` and `localState` merged.  When responding to an AJAX
 * request, only returns `localState`.
 *
 * Example:
 *
 * ```js
 * async function productHandler({ id }, state, request) {
 *   const product = await fetchProductFromUpstreamAPI() // get product info from upstream API
 *   const globalState = () => fetchMenuData() // async function that makes an api call to get menu data.  Will only be called during ssr
 *   return withGlobalState(request, globalState, product)
 * }
 * ```
 *
 * @param {Request} request The request object passed into the handler
 * @param {Object/Function} globalState An object containing data that is needed for all landing pages, such as menu items, navigation, etc..., or a function that returns this data.
 * @param {Object} localState The state being returned for the specific URL being handled.
 * @return {Object} Data to be applied to the state tree.
 */
export default function withGlobalState(_x, _x2, _x3) {
  return _withGlobalState.apply(this, arguments);
}

function _withGlobalState() {
  _withGlobalState = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(request, globalState, localState) {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!request.path.endsWith('.json')) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", localState);

          case 4:
            if (!(typeof globalState === 'function')) {
              _context.next = 8;
              break;
            }

            _context.next = 7;
            return globalState(request);

          case 7:
            globalState = _context.sent;

          case 8:
            return _context.abrupt("return", _objectSpread({}, globalState, localState));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _withGlobalState.apply(this, arguments);
}
//# sourceMappingURL=withGlobalState.js.map
import _regeneratorRuntime from "@babel/runtime/regenerator";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { RESPONSE_TYPE, HANDLER } from './headers'; // The default callback used when none is provided.  Simply returns the upstream HTML unaltered.

var perfectProxy = function perfectProxy(_params, _request, response) {
  return response.send();
};
/**
 * A handler that fetches HTML from the same path as the current request on the upstream site. Use
 * this handler to transform HTML from the upstream site or return it unaltered.
 * To relay the response from the upstream site unaltered, call `response.send()` with no arguments.
 *
 * Example - Using a handler to transform the HTML from the proxied site:
 *
 * ```js
 * // src/routes.js
 * import { Router, proxyUpstream } from 'react-storefront/router'
 *
 * export default new Router()
 *   .get('/some-page',
 *     proxyUpstream('./proxy/proxy-handler')
 *   )
 * ```
 *
 * ```js
 * // src/proxy/proxy-handler.js
 * import getStats from 'react-storefront-stats'
 *
 * export default async function proxyHandler(params, request, response) {
 *   const contentType = global.env.content_type || ''
 *
 *   if (contentType.indexOf('html') > -1) {
 *     const stats = await getStats()
 *     fns.init$(body)
 *
 *     // ... alter the response HTML received from the upstream site here by calling functions on $. ...
 *
 *     response.send($.html())
 *   } else {
 *     response.send()
 *   }
 * }
 * ```
 *
 * Example - returning the HTML from the upstream site unaltered:
 *
 * ```js
 * // src/routes.js
 * import { Router, proxyUpstream } from 'react-storefront/router'
 *
 * export default new Router()
 *   .get('/some-page',
 *     proxyUpstream()
 *   )
 * ```
 *
 * @param {Function} cb A function to call after the response has been received from the upstream site.
 * @param {Object} cb.params Request parameters parsed from the route and query string
 * @param {Request} cb.request An object representing the request
 * @param {Response} cb.response An object representing the response.  Call `response.send(html)` to send the resulting html back to the browser.
 */


export default function proxyUpstream() {
  var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : perfectProxy;
  return {
    type: 'proxyUpstream',
    runOn: {
      server: true,
      client: true
    },
    fn: function () {
      var _fn = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(params, request, response) {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(process.env.MOOV_RUNTIME === 'client')) {
                  _context.next = 4;
                  break;
                }

                // reload the page if this handler is called during client-side navigation
                window.location.reload();
                _context.next = 14;
                break;

              case 4:
                if (!(cb == null)) {
                  _context.next = 6;
                  break;
                }

                throw new Error('You must provide a path to a handler in proxyUpstream().  Please check your routes.');

              case 6:
                // indicate handler path and asset class in a response header so we can track it in logs
                response.set(HANDLER, cb.path);
                response.set(RESPONSE_TYPE, 'proxy');
                _context.next = 10;
                return cb(params, request, response);

              case 10:
                _context.t0 = _context.sent;

                if (_context.t0) {
                  _context.next = 13;
                  break;
                }

                _context.t0 = {
                  proxyUpstream: true
                };

              case 13:
                return _context.abrupt("return", _context.t0);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fn(_x, _x2, _x3) {
        return _fn.apply(this, arguments);
      }

      return fn;
    }()
  };
}
//# sourceMappingURL=proxyUpstream.js.map
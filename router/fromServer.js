/* tslint:disable */
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import "core-js/modules/es6.string.ends-with";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import "regenerator-runtime/runtime";
import "core-js/modules/es6.regexp.search";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { fetchLatest, StaleResponseError } from '../fetchLatest';
import { abortPrefetches, resumePrefetches, isServiceWorkerReady } from './serviceWorker';
import { HANDLER, RESPONSE_TYPE, SURROGATE_KEY, REACT_STOREFRONT, API_VERSION, CLIENT_IF } from './headers';
import getAPIVersion from './getAPIVersion';
var doFetch;
/**
 * Fetch's state as json from the specified url
 * @private
 * @param {String} url The url to fetch
 * @param {Object} options
 * @param {String} options.cache Set to "force-cache" to cache the response in the service worker.  Omit to skip the service worker cache.
 * @param {Object} originalResponse Response object/context which can be modified on the client
 * @return {Object} A state patch
 */

export function fetch(_x) {
  return _fetch.apply(this, arguments);
}
/**
 * Handles a redirect response.  Will do a client side navigation if the URL has the same hostname as the app, otherwise will
 * reload the page.
 * @private
 * @param {String} url
 */

function _fetch() {
  _fetch = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee3(url) {
    var _headers;

    var _ref,
        _ref$cache,
        cache,
        _ref$onlyHit,
        onlyHit,
        originalResponse,
        _location,
        href,
        headers,
        result,
        _args3 = arguments;

    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _ref = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {}, _ref$cache = _ref.cache, cache = _ref$cache === void 0 ? 'default' : _ref$cache, _ref$onlyHit = _ref.onlyHit, onlyHit = _ref$onlyHit === void 0 ? false : _ref$onlyHit;
            originalResponse = _args3.length > 2 ? _args3[2] : undefined;
            abortPrefetches();
            doFetch = doFetch || fetchLatest(require('isomorphic-unfetch'));
            _location = location, href = _location.href;
            headers = (_headers = {}, _defineProperty(_headers, REACT_STOREFRONT, 'true'), _defineProperty(_headers, API_VERSION, getAPIVersion()), _headers);

            if (onlyHit) {
              headers[CLIENT_IF] = 'cache-hit';
            }

            _context3.prev = 7;
            _context3.next = 10;
            return doFetch(url, {
              cache: cache || 'default',
              credentials: 'include',
              headers: headers
            }).then(function (response) {
              var redirected = response.redirected,
                  url = response.url;

              if (redirected) {
                redirectTo(url); // This allows downstream event handlers to know if a response was redirected

                if (originalResponse) {
                  originalResponse.redirected = true;
                }
              } else {
                resumePrefetches();

                if (response.status === 204) {
                  return null;
                } else {
                  return response.json();
                }
              }
            });

          case 10:
            result = _context3.sent;

            if (!(result != null && location.href === href)) {
              _context3.next = 13;
              break;
            }

            return _context3.abrupt("return", _objectSpread({
              loading: false
            }, result));

          case 13:
            _context3.next = 22;
            break;

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3["catch"](7);

            if (!StaleResponseError.is(_context3.t0)) {
              _context3.next = 21;
              break;
            }

            return _context3.abrupt("return", null);

          case 21:
            throw _context3.t0;

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[7, 15]]);
  }));
  return _fetch.apply(this, arguments);
}

function redirectTo(url) {
  if (url) {
    var parsed = new URL(url);
    var history = window.moov.history;

    if (parsed.hostname === window.location.hostname) {
      history.push(parsed.pathname + parsed.search);
    } else {
      window.location.assign(url);
    }
  } else {
    throw new Error('Received a redirect without a location header.');
  }
}
/**
 * Creates a handler that fetches data from the server.
 *
 * The `handlerPath` should point to a module that exports a function that takes params, request, and response,
 * and returns an object that should be applied to the app state.  For example:
 *
 * ```js
 * // routes.js
 * router.get('/p/:id'
 *   fromServer('./product/product-handler')
 * )
 *
 * // product/product-handler.js
 * export default function productHandler(params, request, response) {
 *   return fetchFromUpstreamApi(`/products/${params.id}`)
 *     .then(res => res.json())
 *     .then(productData => ({ // the shape of this object should match your AppModel
 *       page: 'Product',
 *       product: productData
 *     }))
 * }
 * ```
 *
 * When the request path ends in ".json", the json response will be returned verbatim.  In all other cases, server-side rendered HTML
 * will be returned.
 *
 * You can also send a verbatim string response using `response.send(body)`.  For example:
 *
 * ```js
 * // routes.js
 * router.get('/my-api'
 *   fromServer('./my-api-handler')
 * )
 *
 * // my-api-handler.js
 * export default function myApiHandler(params, request, response) {
 *   response
 *     .set('content-type', response.JSON)
 *     .send(JSON.stringify({ foo: 'bar' }))
 * }
 * ```
 *
 * When `response.send()` is called in a handler, react-storefront will never perform server-side rendering.
 *
 * @param {String} handlerPath The path to the module that exports a handler function that returns
 *  state to apply to the app state tree.  The shape of the returned object should match your `AppModel`.
 * @param {Function} getURL An optional function that returns the back end url to call when fetching.  You only need
 *  to specify this if you want to override the default URL.
 * @return {Function}
 */


export default function fromServer(handlerPath, getURL) {
  if (handlerPath == null) {
    throw new Error('You must provide a path to a handler in fromServer().  Please check your routes.');
  }
  /**
   * Creates the URL for fetching json from the server, using `getURL` if provided,
   * allowing the user to override the URL convention.
   * @private
   */


  function createURL() {
    var url = "".concat(location.pathname, ".json").concat(location.search);
    return getURL ? getURL(url) : url;
  }

  return {
    type: 'fromServer',
    runOn: {
      server: true,
      client: true // fromServer handlers run on the client too - we make an ajax request to get the state from the server

    },
    getCachedResponse: function getCachedResponse(response) {
      return _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee() {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (isServiceWorkerReady()) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", null);

              case 2:
                _context.next = 4;
                return fetch(createURL(), {
                  cache: response.clientCache,
                  onlyHit: true
                });

              case 4:
                return _context.abrupt("return", _context.sent);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }))();
    },
    fn: function fn(params, request, response) {
      return _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2() {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(typeof handlerPath === 'string')) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return", fetch(createURL(), {
                  cache: response.clientCache
                }, response));

              case 4:
                // indicate handler path and asset class in a response header so we can track it in logs
                response.set(HANDLER, handlerPath.path);
                response.set(RESPONSE_TYPE, request.path.endsWith('.json') ? 'json' : 'ssr'); // use the handler path as the surrogate cache key if one has not already been set by cache#surrogateKey

                if (!response.get(SURROGATE_KEY)) {
                  response.set(SURROGATE_KEY, handlerPath.path);
                } // handler path has been transpiled to a function


                return _context2.abrupt("return", handlerPath(params, request, response));

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }))();
    }
  };
}
//# sourceMappingURL=fromServer.js.map
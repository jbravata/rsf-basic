/* eslint:disable */
import "core-js/modules/es6.promise";
import "core-js/modules/es6.string.ends-with";
import "core-js/modules/es6.regexp.replace";
import "core-js/modules/es6.array.find";
import "core-js/modules/es6.regexp.match";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import "core-js/modules/es7.symbol.async-iterator";
import "core-js/modules/es6.symbol";
import "core-js/modules/web.dom.iterable";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import "core-js/modules/es6.regexp.search";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncIterator from "@babel/runtime/helpers/asyncIterator";
import _awaitAsyncGenerator from "@babel/runtime/helpers/awaitAsyncGenerator";
import _wrapAsyncGenerator from "@babel/runtime/helpers/wrapAsyncGenerator";

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import Route from 'route-parser';
import isFunction from 'lodash/isFunction';
import qs from 'qs';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import { configureCache } from './serviceWorker';
import ClientContext from './ClientContext';
import EventEmitter from 'eventemitter3';
import powerLinkHandler from './powerLinkHandler';
import fromServer from './fromServer';
import defaultClientCacheConfig from './defaultClientCacheConfig';
/**
 * Provides routing for MUR-based applications and PWAs.  This class is inspired by express and uses https://github.com/rcs/route-parser,
 * which supports sophisticated pattern matching including optional paths, params, and splatting.
 *
 * Example:
 * ```js
 *  const router = new Router()
 *
 *  router.get('/products/:id', ({ id }) => {
 *    // fetch product from upstream API (you'll need to write this function)
 *    return fetchProduct(id).then(result => {
 *      return result.product // this will be the result of router.run()
 *    })
 *  })
 *
 *  // assuming env.path = /products/1 and env.method = 'GET'
 *  router.run() // => the details for product 1
 * ```
 *
 * Routes can be divided into multiple files to increase maintainability using the "use()" method.  For example:
 *
 * ```js
 *  // /scripts/api/router.js
 *
 *  const appShell = require('/build/index.html.js)
 *
 *  module.exports = new Router()
 *    .fallback(() => appShell) // render the PWA's app shell for all unmatched routes
 *    .use('/products', require('/api/products.js'))
 * ```
 *
 * ```js
 *  // /scripts/api/products.js
 *
 *  module.exports = new Router()
 *    .get('/:id', ({ id }) => new Promise((resolve, reject) => {
 *      // fetch product from upstream API...
 *     }))
 * ```
 *
 * ```js
 *  // /scripts/index.js
 *
 *  const router = require('/api/router')
 *
 *  module.exports = function() {
 *    // ...
 *    router.run().then((result) => {
 *      const body = typeof result === 'string' ? result : JSON.stringify(result)
 *      sendResponse({ body, htmlparsed: true })
 *    })
 *  }
 * ```
 *
 * Router is an EventEmitting that fires the following events:
 *
 * - `before`: Fires before a route is run, passing an object containing `request` and `response`.
 * - `after`: Fires after a route is run and all handlers have finised, passing an object containing `request` and `response`.
 * - `fetch`: Fires when a `fromServer` handler runs on the client, resulting in a fetch from the server. No arguments are passed to the event handler.
 */

var Router =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(Router, _EventEmitter);

  function Router() {
    var _this2;

    _classCallCheck(this, Router);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Router).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "routes", []);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "appShellConfigured", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "isBrowser", process.env.MOOV_RUNTIME === 'client');

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "clientCacheConfig", defaultClientCacheConfig);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "fallbackHandlers", [{
      runOn: {
        client: true,
        server: true
      },
      fn: function fn() {
        return {
          page: '404'
        };
      }
    }]);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "errorHandler", function (e, params, request, response) {
      if (response && response.status) {
        response.status(500, 'error');
      }

      return {
        page: 'Error',
        error: e.message,
        stack: e.stack,
        loading: false
      };
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "fetchFreshState", function (location) {
      var pathname = location.pathname,
          search = location.search;
      var request = {
        path: pathname,
        search: search,
        query: qs.parse(search),
        method: 'GET'
      };
      var response = new ClientContext();
      var options = {
        initialLoad: false
      };
      return _this2.runAll(request, response, options, location.state);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "onLocationChange",
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(callback, location, action) {
        var pathname, search, request, context, state, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, _state;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(_this2.prevLocation && location.pathname === _this2.prevLocation.pathname && location.search === _this2.prevLocation.search)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                _this2.prevLocation = location; // this needs to come before handlers are called or going back while async handlers are running will lead to a broken state

                if (!(action === 'REPLACE')) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return");

              case 5:
                pathname = location.pathname, search = location.search;
                request = {
                  path: pathname,
                  search: search,
                  query: qs.parse(search),
                  method: 'GET'
                };
                context = new ClientContext();
                state = location.state;

                _this2.emit('before', {
                  request: request,
                  response: context,
                  action: action
                });

                if (!(action === 'PUSH' || !state)) {
                  _context.next = 46;
                  break;
                }

                /*
                 * Why limit action to PUSH here? POP indicates that the user is going back or forward
                 * In those cases, if we have location.state, we can assume it's the full state.  We don't need to
                 * do anything for replace.
                 */
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _context.prev = 13;
                _iterator2 = _asyncIterator(_this2.run(request, context, {
                  historyState: state
                }));

              case 15:
                _context.next = 17;
                return _iterator2.next();

              case 17:
                _step2 = _context.sent;
                _iteratorNormalCompletion2 = _step2.done;
                _context.next = 21;
                return _step2.value;

              case 21:
                _value2 = _context.sent;

                if (_iteratorNormalCompletion2) {
                  _context.next = 28;
                  break;
                }

                _state = _value2;
                callback(_state, action);

              case 25:
                _iteratorNormalCompletion2 = true;
                _context.next = 15;
                break;

              case 28:
                _context.next = 34;
                break;

              case 30:
                _context.prev = 30;
                _context.t0 = _context["catch"](13);
                _didIteratorError2 = true;
                _iteratorError2 = _context.t0;

              case 34:
                _context.prev = 34;
                _context.prev = 35;

                if (!(!_iteratorNormalCompletion2 && _iterator2.return != null)) {
                  _context.next = 39;
                  break;
                }

                _context.next = 39;
                return _iterator2.return();

              case 39:
                _context.prev = 39;

                if (!_didIteratorError2) {
                  _context.next = 42;
                  break;
                }

                throw _iteratorError2;

              case 42:
                return _context.finish(39);

              case 43:
                return _context.finish(34);

              case 44:
                _context.next = 47;
                break;

              case 46:
                if (state) {
                  callback(state, action); // called when restoring history state and applying state from Link components
                }

              case 47:
                _this2.emit('after', {
                  request: request,
                  response: context
                });

              case 48:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[13, 30, 34, 44], [35,, 39, 43]]);
      }));

      return function (_x, _x2, _x3) {
        console.log(this, arguments)
        return _ref.apply(this, arguments);
      };
    }());

    _this2.get('/.powerlinks.js', fromServer(powerLinkHandler));

    return _this2;
  }

  _createClass(Router, [{
    key: "pushRoute",
    value: function pushRoute(method, path, handlers) {
      // We are explicitly setting JSON and AMP routes in order to handle
      // model data routes
      this.routes.push({
        path: new Route(path + '.json'),
        method: method,
        handlers: handlers
      });
      this.routes.push({
        path: new Route(path + '.amp'),
        method: method,
        handlers: handlers
      });
      this.routes.push({
        path: new Route(path),
        method: method,
        handlers: handlers
      });
      return this;
    }
    /**
     * Registers a GET route
     * @param {String} path A path pattern
     * @param {...any} handlers Handlers that return patches to be merged into the app state
     * @return {Router} this
     */

  }, {
    key: "get",
    value: function get(path) {
      for (var _len = arguments.length, handlers = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        handlers[_key - 1] = arguments[_key];
      }

      return this.pushRoute('GET', path, handlers);
    }
    /**
     * Registers a POST route
     * @param {String} path A path pattern
     * @param {...any} handlers Handlers that return patches to be merged into the app state
     * @return {Router} this
     */

  }, {
    key: "post",
    value: function post(path) {
      for (var _len2 = arguments.length, handlers = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        handlers[_key2 - 1] = arguments[_key2];
      }

      return this.pushRoute('POST', path, handlers);
    }
    /**
     * Registers a PATCH route
     * @param {String} path A path pattern
     * @param {...any} handlers Handlers that return patches to be merged into the app state
     * @return {Router} this
     */

  }, {
    key: "patch",
    value: function patch(path) {
      for (var _len3 = arguments.length, handlers = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        handlers[_key3 - 1] = arguments[_key3];
      }

      return this.pushRoute('PATCH', path, handlers);
    }
    /**
     * Registers a PUT route
     * @param {String} path A path pattern
     * @param {...any} handlers Handlers that return patches to be merged into the app state
     * @return {Router} this
     */

  }, {
    key: "put",
    value: function put(path) {
      for (var _len4 = arguments.length, handlers = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        handlers[_key4 - 1] = arguments[_key4];
      }

      return this.pushRoute('PUT', path, handlers);
    }
    /**
     * Registers a DELETE route
     * @param {String} path A path pattern
     * @param {...any} handlers Handlers that return patches to be merged into the app state
     * @return {Router} this
     */

  }, {
    key: "delete",
    value: function _delete(path) {
      for (var _len5 = arguments.length, handlers = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        handlers[_key5 - 1] = arguments[_key5];
      }

      return this.pushRoute('DELETE', path, handlers);
    }
    /**
     * Registers an OPTIONS route
     * @param {String} path A path pattern
     * @param {...any} handlers Handlers that return patches to be merged into the app state
     * @return {Router} this
     */

  }, {
    key: "options",
    value: function options(path) {
      for (var _len6 = arguments.length, handlers = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        handlers[_key6 - 1] = arguments[_key6];
      }

      return this.pushRoute('OPTIONS', path, handlers);
    }
    /**
     * Designates the handlers for unmatched routes
     * @param {Function} callback A function that returns a promise that resolves to the content to return
     * @return {Router} this
     */

  }, {
    key: "fallback",
    value: function fallback() {
      for (var _len7 = arguments.length, handlers = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        handlers[_key7] = arguments[_key7];
      }

      this.fallbackHandlers = handlers;
      return this;
    }
    /**
     * Defines the handler for the app-shell.  Generally this should be a single fromServer handler that return
     * the global data for menus and navigation and sets loading: true.  The app-shell is used in offline mode
     * during initial landing on an uncached SSR result.
     * @param {...any} handlers Handlers that return patches to be merged into the app state
     * @return {Router} this
     */

  }, {
    key: "appShell",
    value: function appShell() {
      this.appShellConfigured = true;

      for (var _len8 = arguments.length, handlers = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        handlers[_key8] = arguments[_key8];
      }

      return this.get.apply(this, ['/.app-shell'].concat(handlers));
    }
    /**
     * Returns `true` if `appShell` has been called to configure an appShell route, otherwise `false`.
     * @return {Boolean}
     */

  }, {
    key: "isAppShellConfigured",
    value: function isAppShellConfigured() {
      return this.appShellConfigured;
    }
    /**
     * Sets the handler for errors thrown during route handling
     * @param {Function} handler A function that returns a promise that resolves to the content to return
     * @return {Router} this
     */

  }, {
    key: "error",
    value: function error(handler) {
      this.errorHandler = handler;
      return this;
    }
    /**
     * Registers a set of nested routes.
     *
     * Example:
     *
     *  Router root = new Router()
     *
     *  Router products = new Router()
     *  products.get('/:id', ({ id }) => {
     *    return Promise.resolve(id)
     *  })
     *
     *  root.use('/products', products)
     *
     *  // url: /products/1
     *  root.run().then(result => console.log(result)) // => 1
     *
     * @param {String} path The parent path
     * @param {Router} router A router to handle the nested routes
     * @return {Router} this
     */

  }, {
    key: "use",
    value: function use(path, router) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = router.routes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var route = _step3.value;

          var routePath = route.path,
              rest = _objectWithoutProperties(route, ["path"]);

          this.routes.push(_objectSpread({
            path: new Route(path + routePath.spec)
          }, rest));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return this;
    }
    /**
     * Returns `true` if the request will be cached on the client, otherwise `false`.
     * @param {Object} request
     * @return {Boolean}
     */

  }, {
    key: "willCacheOnClient",
    value: function willCacheOnClient(request) {
      var _this$findMatchingRou = this.findMatchingRoute(request),
          match = _this$findMatchingRou.match;

      return this.isClientCachingEnabled(match);
    }
    /**
     * Returns `true` if the route has a cache handler with `client: true`, otherwise `false`.
     * @private
     * @param {Route} route
     * @return {Boolean}
     */

  }, {
    key: "isClientCachingEnabled",
    value: function isClientCachingEnabled(route) {
      var handler = this.getCacheHandler(route);

      if (handler && handler.client) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * Configures service worker runtime caching options
     * @param {Object} options
     * @param {Object} options.cacheName The name of the runtime cache
     * @param {Object} options.maxEntries The max number of entries to store in the cache
     * @param {Object} options.maxAgeSeconds The TTL in seconds for entries
     * @return {Router} this
     */

  }, {
    key: "configureClientCache",
    value: function configureClientCache(options) {
      if (typeof window !== 'undefined') {
        this.clientCacheConfig = _objectSpread({}, defaultClientCacheConfig, options);
        configureCache(this.clientCacheConfig);
      }

      return this;
    }
    /**
     * Finds the cache handler for the specified request
     * @param {Object} route
     * @return {Object} The handler
     */

  }, {
    key: "getCacheHandler",
    value: function getCacheHandler(route) {
      var handlers = route ? route.handlers : this.fallbackHandlers;
      return handlers && handlers.find(function (handler) {
        return handler.type === 'cache';
      });
    }
    /**
     * Creates an object describing the browser location
     * @return {Object}
     */

  }, {
    key: "createLocation",
    value: function createLocation() {
      return {
        protocol: location.protocol.replace(/:/, ''),
        pathname: location.pathname,
        search: location.search,
        hostname: location.hostname,
        port: location.port
      };
    }
    /**
     * Returns a merged cached response for all specified fromServer handler.  Will return null
     * if we're missing a cached response for any of the handlers
     * @param {Object[]} fromServerHandlers
     * @param {ClientContext} res
     * @return {Object}
     */

  }, {
    key: "getCachedPatch",
    value: function () {
      var _getCachedPatch = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(fromServerHandlers, res) {
        var result, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, handler, response;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                result = {};
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context2.prev = 4;
                _iterator4 = fromServerHandlers[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                  _context2.next = 19;
                  break;
                }

                handler = _step4.value;
                _context2.next = 10;
                return handler.getCachedResponse(res);

              case 10:
                response = _context2.sent;

                if (!response) {
                  _context2.next = 15;
                  break;
                }

                merge(result, response);
                _context2.next = 16;
                break;

              case 15:
                return _context2.abrupt("return", null);

              case 16:
                _iteratorNormalCompletion4 = true;
                _context2.next = 6;
                break;

              case 19:
                _context2.next = 25;
                break;

              case 21:
                _context2.prev = 21;
                _context2.t0 = _context2["catch"](4);
                _didIteratorError4 = true;
                _iteratorError4 = _context2.t0;

              case 25:
                _context2.prev = 25;
                _context2.prev = 26;

                if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                  _iterator4.return();
                }

              case 28:
                _context2.prev = 28;

                if (!_didIteratorError4) {
                  _context2.next = 31;
                  break;
                }

                throw _iteratorError4;

              case 31:
                return _context2.finish(28);

              case 32:
                return _context2.finish(25);

              case 33:
                return _context2.abrupt("return", result);

              case 34:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[4, 21, 25, 33], [26,, 28, 32]]);
      }));

      function getCachedPatch(_x4, _x5) {
        return _getCachedPatch.apply(this, arguments);
      }

      return getCachedPatch;
    }()
    /**
     * Runs the current url (from env) and generates a result from each the matching route's handlers.
     * @param {Object} request The request being served
     * @param {String} request.path The url path
     * @param {String} request.method The http method
     * @param {Response} response The response object
     * @param {Object} options
     * @param {Boolean} [options.initialLoad=false] Set to true if this is the initial load of the application.  This will cause the HTML to be cached for the current path
     * @return {Object} Generates state objects
     */

  }, {
    key: "run",
    value: function run(request, response) {
      var _this = this;

      var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref2$initialLoad = _ref2.initialLoad,
          initialLoad = _ref2$initialLoad === void 0 ? false : _ref2$initialLoad,
          _ref2$historyState = _ref2.historyState,
          historyState = _ref2$historyState === void 0 ? {} : _ref2$historyState;

      return _wrapAsyncGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3() {
        var _this$findMatchingRou2, match, params, handlers, cachedFromServerResult, serverHandlers, fromClientHandler, cacheHandler, historyStatePatch, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, handler, result;

        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _this$findMatchingRou2 = _this.findMatchingRoute(request), match = _this$findMatchingRou2.match, params = _this$findMatchingRou2.params;
                _context3.prev = 1;
                request.params = params;

                if (!request.params.hasOwnProperty('format')) {
                  if (request.path.endsWith('.json')) {
                    request.params.format = 'json';
                  } else if (request.path.endsWith('.amp')) {
                    request.params.format = 'amp';
                  }
                }

                handlers = match ? match.handlers : _this.fallbackHandlers;
                cachedFromServerResult = null;

                if (!(_this.isBrowser && !initialLoad)) {
                  _context3.next = 22;
                  break;
                }

                serverHandlers = handlers.filter(function (h) {
                  return h.type === 'fromServer';
                });
                fromClientHandler = handlers.find(function (h) {
                  return h.type === 'fromClient';
                });
                cacheHandler = handlers.find(function (h) {
                  return h.type === 'cache';
                }); // run the cache handler so the caching headers are set on the request for the service worker

                if (!(cacheHandler && cacheHandler.client)) {
                  _context3.next = 15;
                  break;
                }

                cacheHandler.fn(params, request, response);
                _context3.next = 14;
                return _awaitAsyncGenerator(_this.getCachedPatch(serverHandlers, response));

              case 14:
                cachedFromServerResult = _context3.sent;

              case 15:
                historyStatePatch = _objectSpread({
                  location: _this.createLocation()
                }, historyState, {
                  loading: serverHandlers.length > 0 && cachedFromServerResult == null
                });

                if (!(cachedFromServerResult && fromClientHandler)) {
                  _context3.next = 20;
                  break;
                }

                // If we have a cached result from the server, merge the historyStatePatch into it so we only have to yield once
                // in the fromClient handler
                cachedFromServerResult = merge({}, historyStatePatch, cachedFromServerResult);
                _context3.next = 22;
                break;

              case 20:
                _context3.next = 22;
                return merge({}, historyStatePatch, cachedFromServerResult);

              case 22:
                _iteratorNormalCompletion5 = true;
                _didIteratorError5 = false;
                _iteratorError5 = undefined;
                _context3.prev = 25;
                _iterator5 = handlers[Symbol.iterator]();

              case 27:
                if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                  _context3.next = 58;
                  break;
                }

                handler = _step5.value;

                if (typeof handler === 'function') {
                  handler = {
                    runOn: {
                      server: true,
                      client: true
                    },
                    fn: handler
                  };
                } // we've already run the cache handler on the client above


                if (!(handler.type === 'cache' && _this.isBrowser)) {
                  _context3.next = 32;
                  break;
                }

                return _context3.abrupt("continue", 55);

              case 32:
                if (!(!handler.runOn.client && _this.isBrowser)) {
                  _context3.next = 34;
                  break;
                }

                return _context3.abrupt("continue", 55);

              case 34:
                if (!(!handler.runOn.server && !_this.isBrowser)) {
                  _context3.next = 36;
                  break;
                }

                return _context3.abrupt("continue", 55);

              case 36:
                if (!(request.path.endsWith('.json') && (handler.runOn.server !== true || _this.isBrowser))) {
                  _context3.next = 38;
                  break;
                }

                return _context3.abrupt("continue", 55);

              case 38:
                if (!(handler.type === 'fromServer')) {
                  _context3.next = 44;
                  break;
                }

                if (!(cachedFromServerResult != null)) {
                  _context3.next = 43;
                  break;
                }

                return _context3.abrupt("continue", 55);

              case 43:
                _this.emit('fetch');

              case 44:
                _context3.next = 46;
                return _awaitAsyncGenerator(_this.toPromise(handler.fn, params, request, response));

              case 46:
                result = _context3.sent;

                if (!(handler.type === 'fromClient' && _this.isBrowser)) {
                  _context3.next = 52;
                  break;
                }

                _context3.next = 50;
                return merge({}, result || {}, cachedFromServerResult);

              case 50:
                _context3.next = 55;
                break;

              case 52:
                if (!result) {
                  _context3.next = 55;
                  break;
                }

                _context3.next = 55;
                return result;

              case 55:
                _iteratorNormalCompletion5 = true;
                _context3.next = 27;
                break;

              case 58:
                _context3.next = 64;
                break;

              case 60:
                _context3.prev = 60;
                _context3.t0 = _context3["catch"](25);
                _didIteratorError5 = true;
                _iteratorError5 = _context3.t0;

              case 64:
                _context3.prev = 64;
                _context3.prev = 65;

                if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                  _iterator5.return();
                }

              case 67:
                _context3.prev = 67;

                if (!_didIteratorError5) {
                  _context3.next = 70;
                  break;
                }

                throw _iteratorError5;

              case 70:
                return _context3.finish(67);

              case 71:
                return _context3.finish(64);

              case 72:
                _context3.next = 79;
                break;

              case 74:
                _context3.prev = 74;
                _context3.t1 = _context3["catch"](1);

                // We emit an error event here so that we can pass the error to the error reporter
                // while still allowing the user to provide their own error handler function.
                _this.emit('error', _context3.t1); // call the .error() function registered by the user


                _context3.next = 79;
                return _this.errorHandler(_context3.t1, params, request, response);

              case 79:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 74], [25, 60, 64, 72], [65,, 67, 71]]);
      }))();
    }
    /**
     * Runs all client and server handlers for the specified path and method
     * @param {Object} request The request being served
     * @param {String} request.path The url path
     * @param {String} request.method The http method
     * @param {Response} response The response object
     * @param {Object} options
     * @param {Object} [state={}] The accumulated state from other handlers
     * @return {Object} The merged result of all handlers
     */

  }, {
    key: "runAll",
    value: function () {
      var _runAll = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee4(request, response, options) {
        var state,
            _iteratorNormalCompletion,
            _didIteratorError,
            _iteratorError,
            _iterator,
            _step,
            _value,
            result,
            _args4 = arguments;

        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                state = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : {};
                state = cloneDeep(state); // prevent initial state from being mutated

                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _context4.prev = 4;
                _iterator = _asyncIterator(this.run(request, response, options));

              case 6:
                _context4.next = 8;
                return _iterator.next();

              case 8:
                _step = _context4.sent;
                _iteratorNormalCompletion = _step.done;
                _context4.next = 12;
                return _step.value;

              case 12:
                _value = _context4.sent;

                if (_iteratorNormalCompletion) {
                  _context4.next = 19;
                  break;
                }

                result = _value;

                if (typeof result === 'string') {
                  state = result;
                } else {
                  merge(state, result);
                }

              case 16:
                _iteratorNormalCompletion = true;
                _context4.next = 6;
                break;

              case 19:
                _context4.next = 25;
                break;

              case 21:
                _context4.prev = 21;
                _context4.t0 = _context4["catch"](4);
                _didIteratorError = true;
                _iteratorError = _context4.t0;

              case 25:
                _context4.prev = 25;
                _context4.prev = 26;

                if (!(!_iteratorNormalCompletion && _iterator.return != null)) {
                  _context4.next = 30;
                  break;
                }

                _context4.next = 30;
                return _iterator.return();

              case 30:
                _context4.prev = 30;

                if (!_didIteratorError) {
                  _context4.next = 33;
                  break;
                }

                throw _iteratorError;

              case 33:
                return _context4.finish(30);

              case 34:
                return _context4.finish(25);

              case 35:
                return _context4.abrupt("return", state);

              case 36:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[4, 21, 25, 35], [26,, 30, 34]]);
      }));

      function runAll(_x6, _x7, _x8) {
        return _runAll.apply(this, arguments);
      }

      return runAll;
    }()
    /**
     * Converts specified callback to a promise
     * @param {Function/Object} callback A function that returns a Promise that
     *  resolves to the new state, a function that returns the new state, or the new state itself.
     * @param {Object} params The request parameters
     * @param {Object} request The request object with body and headers
     * @param {Response} response The response object
     */

  }, {
    key: "toPromise",
    value: function toPromise(callback, params, request, response) {
      if (isFunction(callback)) {
        var result = callback(params, request, response);

        if (result && result.then) {
          // callback returned a promise
          return result;
        } else {
          // callback returned the new state
          return Promise.resolve(result);
        }
      } else {
        // callback is the new state
        return Promise.resolve(callback);
      }
    }
    /**
     * Returns the matching route and parsed params for the specified path and method
     * @param {Object} request The http request
     * @return {Object} an object with match and params
     */

  }, {
    key: "findMatchingRoute",
    value: function findMatchingRoute(request) {
      var params;
      var path = request.path,
          query = request.query,
          _request$method = request.method,
          method = _request$method === void 0 ? 'GET' : _request$method;
      var routeIndexHeader = request.headers && request.headers.get('x-xdn-route');

      if (routeIndexHeader != null) {
        // route passed in from the edge
        var routeIndex = parseInt(routeIndexHeader);

        if (!isNaN(routeIndex)) {
          var route = this.routes[routeIndex];

          var _params = route ? route.path.match(path) : {};

          return {
            match: route,
            params: _objectSpread({}, _params, query)
          };
        }
      } // fall back to matching the route


      method = method.toUpperCase();
      var match = this.routes.filter(function (route) {
        return method === route.method;
      }).find(function (route) {
        return params = route.path.match(path);
      });
      return {
        match: match,
        params: _objectSpread({}, params, query)
      };
    }
    /**
     * Returns true if the URL points to a route that has a proxyUpstream handler.
     * @param {String} url The url to check
     * @param {String} [method='get']
     * @return {Boolean}
     */

  }, {
    key: "willNavigateToUpstream",
    value: function willNavigateToUpstream(url) {
      var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'get';

      var _ref3 = new URL(url, typeof window !== 'undefined' ? window.location : undefined),
          path = _ref3.pathname,
          search = _ref3.search;

      return this.willFetchFromUpstream({
        path: path,
        search: search,
        method: method
      });
    }
    /**
     * Returns true if the route will result in the server connecting to the
     * upstream site due to the presence of a `proxyUpstream` handler or `fromOrigin` handler, otherwise
     * false.
     * @private
     * @param {Object} request
     * @return {Boolean}
     */

  }, {
    key: "willFetchFromUpstream",
    value: function willFetchFromUpstream(request) {
      var _this$findMatchingRou3 = this.findMatchingRoute(request),
          match = _this$findMatchingRou3.match;

      var handlers = match ? match.handlers : this.fallbackHandlers;
      return handlers.some(function (handler) {
        return handler.type === 'proxyUpstream' || handler.type === 'fromOrigin';
      });
    }
    /**
     * Runs all client and server handlers for the specified location and returns state
     */

  }, {
    key: "watch",

    /**
     * Calls the specified callback whenever the current URL changes
     * @param {History} history
     * @param {Function} callback
     * @return {Router} this
     */
    value: function watch(history, callback) {
      this.history = history;
      this.prevLocation = history.location;
      history.listen(this.onLocationChange.bind(this, callback));
      var _history$location = history.location,
          pathname = _history$location.pathname,
          search = _history$location.search;
      var request = {
        path: pathname,
        search: search,
        query: qs.parse(search),
        method: 'GET'
      };
      var context = new ClientContext(request);
      this.emit('after', {
        request: request,
        response: context,
        initialLoad: true
      });
      return this;
    }
    /**
     * Provides an easy way to navigate by changing some but not all of the query params.  Any keys
     * included in the params object are applied as new query param values.  All other query params are preserved.
     * @param {Object} params Key/value pairs to apply to the query string.  Specifying a value of undefined or null will remove that parameter from the query string
     * @param {Object} [stringifyOptions={}] Options of stringifying all query params.  Applied for `qs.stringify`: https://github.com/ljharb/qs#stringifying
     */

  }, {
    key: "applySearch",
    value: function applySearch(params) {
      var stringifyOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var history = this.history;
      var nextParams = qs.stringify(_objectSpread({}, qs.parse(history.location.search, {
        ignoreQueryPrefix: true
      }), params), stringifyOptions);
      history.replace("".concat(history.location.pathname, "?").concat(nextParams));
    }
  }]);

  return Router;
}(EventEmitter);

export { Router as default };
//# sourceMappingURL=Router.js.map
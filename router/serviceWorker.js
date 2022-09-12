import "core-js/modules/es6.promise";
import "core-js/modules/es7.symbol.async-iterator";
import "core-js/modules/es6.symbol";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es6.regexp.search";
import "core-js/modules/es6.string.starts-with";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
var installed = false;
/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */

function messageSW(params) {
  try {
    navigator.serviceWorker.controller.postMessage(params);
  } catch (e) {
    console.warn('Could not message Service Worker', e);
  }
}
/**
 * Cache content using the service worker.  If content is not supplied, the service worker will fetch
 * the content from the server
 * @param {String} path The URI path of the request
 * @param {String} cacheData The data to cache
 */


export function cache(_x, _x2) {
  return _cache.apply(this, arguments);
}
/**
 * Prefetches and caches JSON for the specified path
 * @param {String} path A URL path for a page (without .json)
 */

function _cache() {
  _cache = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(path, cacheData) {
    var _ref, apiVersion;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return waitForServiceWorkerController();

          case 2:
            if (!_context.sent) {
              _context.next = 7;
              break;
            }

            _ref = window.moov || {}, apiVersion = _ref.apiVersion;

            if (!(window.moov.router && !window.moov.router.willCacheOnClient({
              path: path
            }))) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return");

          case 6:
            if (cacheData) {
              messageSW({
                action: 'cache-state',
                path: path,
                apiVersion: apiVersion,
                cacheData: cacheData
              });
            } else {
              messageSW({
                action: 'cache-path',
                path: path,
                apiVersion: apiVersion
              });
            }

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _cache.apply(this, arguments);
}

export function prefetchJsonFor(_x3, _x4) {
  return _prefetchJsonFor.apply(this, arguments);
}
/**
 * Prefetches and caches SSR and JSON for the specified path
 * @param {String} path A URL path for a page (without .json)
 */

function _prefetchJsonFor() {
  _prefetchJsonFor = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2(path, includeSSR) {
    var url, _url;

    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (path) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return");

          case 2:
            if (path.startsWith('http')) {
              url = new URL(path);
              cache("".concat(url.origin).concat(url.pathname, ".json").concat(url.search));
            } else {
              _url = new URL("http://z.z".concat(path));
              cache("".concat(_url.pathname, ".json").concat(_url.search));
            }

            if (includeSSR) {
              cache(path);
            }

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _prefetchJsonFor.apply(this, arguments);
}

export function prefetch(path) {
  cache(path);
  prefetchJsonFor(path);
}
/**
 * Aborts all in progress prefetches.  Call this function to prevent prefetching from blocking
 * more important requests, like page navigation.
 */

export function abortPrefetches() {
  return _abortPrefetches.apply(this, arguments);
}
/**
 * Resume queued prefetch requests which were cancelled to allow for more important requests
 */

function _abortPrefetches() {
  _abortPrefetches = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee3() {
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return waitForServiceWorkerController();

          case 2:
            if (!_context3.sent) {
              _context3.next = 4;
              break;
            }

            messageSW({
              action: 'abort-prefetches'
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _abortPrefetches.apply(this, arguments);
}

export function resumePrefetches() {
  return _resumePrefetches.apply(this, arguments);
}
/**
 * Configures runtime caching options
 * @private
 * @param {Object} options
 * @param {Object} options.cacheName The name of the runtime cache
 * @param {Object} options.maxEntries The max number of entries to store in the cache
 * @param {Object} options.maxAgeSeconds The TTL in seconds for entries
 */

function _resumePrefetches() {
  _resumePrefetches = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee4() {
    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return waitForServiceWorkerController();

          case 2:
            if (!_context4.sent) {
              _context4.next = 4;
              break;
            }

            messageSW({
              action: 'resume-prefetches'
            });

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _resumePrefetches.apply(this, arguments);
}

export function configureCache(_x5) {
  return _configureCache.apply(this, arguments);
}
/**
 * Clears all API and SSR responses from the client cache
 * @return {Promise} Resolved once all caches have b
 */

function _configureCache() {
  _configureCache = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee5(options) {
    return _regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return waitForServiceWorkerController();

          case 2:
            if (!_context5.sent) {
              _context5.next = 4;
              break;
            }

            messageSW({
              action: 'configure-runtime-caching',
              options: options
            });

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _configureCache.apply(this, arguments);
}

export function clearCache() {
  return _clearCache.apply(this, arguments);
}
/**
 * Resolves when the service worker has been installed
 * @private
 */

function _clearCache() {
  _clearCache = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee6() {
    var keys, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key;

    return _regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (!('caches' in window)) {
              _context6.next = 31;
              break;
            }

            _context6.next = 3;
            return caches.keys();

          case 3:
            keys = _context6.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context6.prev = 7;
            _iterator = keys[Symbol.iterator]();

          case 9:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context6.next = 17;
              break;
            }

            key = _step.value;

            if (key.startsWith('workbox-precache')) {
              _context6.next = 14;
              break;
            }

            _context6.next = 14;
            return caches.delete(key);

          case 14:
            _iteratorNormalCompletion = true;
            _context6.next = 9;
            break;

          case 17:
            _context6.next = 23;
            break;

          case 19:
            _context6.prev = 19;
            _context6.t0 = _context6["catch"](7);
            _didIteratorError = true;
            _iteratorError = _context6.t0;

          case 23:
            _context6.prev = 23;
            _context6.prev = 24;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 26:
            _context6.prev = 26;

            if (!_didIteratorError) {
              _context6.next = 29;
              break;
            }

            throw _iteratorError;

          case 29:
            return _context6.finish(26);

          case 30:
            return _context6.finish(23);

          case 31:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this, [[7, 19, 23, 31], [24,, 26, 30]]);
  }));
  return _clearCache.apply(this, arguments);
}

export function waitForServiceWorkerController() {
  return _waitForServiceWorkerController.apply(this, arguments);
}
/**
 * Removes runtime caches for old versions of the api.  This ensures that all responses
 * are appropriate for the current version of the UI.
 * @private
 */

function _waitForServiceWorkerController() {
  _waitForServiceWorkerController = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee7() {
    return _regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (navigator.serviceWorker) {
              _context7.next = 2;
              break;
            }

            return _context7.abrupt("return", false);

          case 2:
            return _context7.abrupt("return", new Promise(function (resolve) {
              navigator.serviceWorker.ready.then(function () {
                if (navigator.serviceWorker.controller) {
                  return resolve(true);
                }

                navigator.serviceWorker.addEventListener('controllerchange', function () {
                  resolve(true);
                });
              }) // According to specs this should never reject. However, FF does reject when the setting
              // to clear cache after window close is enabled
              .catch(function () {
                return resolve(false);
              });
            }));

          case 3:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));
  return _waitForServiceWorkerController.apply(this, arguments);
}

export function removeOldCaches() {
  return _removeOldCaches.apply(this, arguments);
}

function _removeOldCaches() {
  _removeOldCaches = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee8() {
    return _regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return waitForServiceWorkerController();

          case 2:
            if (!_context8.sent) {
              _context8.next = 4;
              break;
            }

            if (window.moov && window.moov.apiVersion) {
              messageSW({
                action: 'remove-old-caches',
                apiVersion: window.moov.apiVersion
              });
            }

          case 4:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));
  return _removeOldCaches.apply(this, arguments);
}

export function isServiceWorkerReady() {
  return installed;
}
export default {
  removeOldCaches: removeOldCaches,
  waitForServiceWorkerController: waitForServiceWorkerController,
  configureCache: configureCache,
  resumePrefetches: resumePrefetches,
  abortPrefetches: abortPrefetches,
  prefetch: prefetch,
  prefetchJsonFor: prefetchJsonFor,
  isServiceWorkerReady: isServiceWorkerReady,
  cache: cache
};

if (typeof window !== 'undefined') {
  waitForServiceWorkerController().then(function (isInstalled) {
    installed = isInstalled;
  });
}
//# sourceMappingURL=serviceWorker.js.map
import "core-js/modules/es6.regexp.replace";
import "core-js/modules/es6.string.link";
import "core-js/modules/es6.regexp.to-string";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import "core-js/modules/es6.string.ends-with";
import "core-js/modules/es6.object.assign";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import "core-js/modules/es6.regexp.search";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react';
import { SheetsRegistry } from 'react-jss/lib/jss';
import { flushChunkNames } from 'react-universal-component/server';
import PWA from './PWA';
import { createMemoryHistory } from 'history';
import { Helmet } from 'react-helmet';
import { renderHtml, renderInitialStateScript, renderScript, renderStyle, renderPreloadHeader, getScripts } from './renderers';
import getStats from 'react-storefront-stats';
import { renderAmpAnalyticsTags } from './Track';
import { ROUTES } from './router/headers';
import flattenDeep from 'lodash/flattenDeep';
import requestContext from './requestContext';
import './utils/profile';
/**
 * A request handler for the server.
 * @param {Object} config
 * @param {Object} config.theme A material-UI theme
 * @param {Class} config.model The model class for the root of the state tree
 * @param {React.Component} config.App The root app component
 * @param {Router} config.router An instance of moov_router's Router class
 * @param {Boolean} config.deferScripts Adds the defer attribute to all script tags to speed up initial page render. Defaults to true.
 * @param {Function} config.transform A function to transform the rendered HTML before it is sent to the browser
 * @param {Function} config.errorReporter A function to call when an error occurs so that it can be logged
 */

var Server =
/*#__PURE__*/
function () {
  function Server(_ref) {
    var _this = this;

    var theme = _ref.theme,
        model = _ref.model,
        App = _ref.App,
        router = _ref.router,
        _ref$deferScripts = _ref.deferScripts,
        deferScripts = _ref$deferScripts === void 0 ? true : _ref$deferScripts,
        transform = _ref.transform,
        _ref$errorReporter = _ref.errorReporter,
        errorReporter = _ref$errorReporter === void 0 ? Function.prototype : _ref$errorReporter,
        _ref$sendPreloadHeade = _ref.sendPreloadHeaders,
        sendPreloadHeaders = _ref$sendPreloadHeade === void 0 ? true : _ref$sendPreloadHeade;

    _classCallCheck(this, Server);

    _defineProperty(this, "serve",
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(request, response) {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", profile('x-rsf-t-serve',
                /*#__PURE__*/
                _asyncToGenerator(
                /*#__PURE__*/
                _regeneratorRuntime.mark(function _callee() {
                  var history, state, reportError;
                  return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          console.error = console.error || console.log;
                          console.warn = console.warn || console.log;
                          history = createMemoryHistory({
                            initialEntries: [request.path + request.search]
                          });

                          if (!request.headers.get(ROUTES)) {
                            _context.next = 5;
                            break;
                          }

                          return _context.abrupt("return", response.json(_this.router.routes.map(function (route) {
                            return route.path.spec;
                          })));

                        case 5:
                          reportError = function reportError(error) {
                            _this.errorReporter({
                              error: error,
                              history: history,
                              app: state
                            });
                          };

                          _context.prev = 6;

                          _this.router.on('error', reportError);

                          _context.next = 10;
                          return _this.router.runAll(request, response);

                        case 10:
                          state = _context.sent;

                          if (!(!state.proxyUpstream && !response.headersSent)) {
                            _context.next = 14;
                            break;
                          }

                          _context.next = 14;
                          return _this.renderPWA({
                            request: request,
                            response: response,
                            state: state,
                            history: history
                          });

                        case 14:
                          _context.next = 21;
                          break;

                        case 16:
                          _context.prev = 16;
                          _context.t0 = _context["catch"](6);
                          reportError(_context.t0);
                          _context.next = 21;
                          return _this.renderError(_context.t0, request, response, history);

                        case 21:
                          _context.prev = 21;

                          _this.router.off('error', _this.errorReporter);

                          return _context.finish(21);

                        case 24:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, this, [[6, 16, 21, 24]]);
                }))));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }());

    console.error = console.warn = console.log;
    Object.assign(this, {
      theme: theme,
      model: model,
      App: App,
      router: router,
      deferScripts: deferScripts,
      transform: transform,
      errorReporter: errorReporter,
      sendPreloadHeaders: sendPreloadHeaders
    });
  }
  /**
   * Handles an isomorphic request by serving json, html, or amp content based on the URL.
   */


  _createClass(Server, [{
    key: "setContentType",

    /**
     * Sets the content type to application/json for json URLs, text/html for all others
     * @private
     * @param {Object} request
     * @param {Response} response
     */
    value: function setContentType(request, response) {
      if (response.get('content-type') == null) {
        if (request.path.endsWith('.json')) {
          response.set('content-type', 'application/json');
        } else {
          response.set('content-type', 'text/html');
        }
      }
    }
    /**
     * Renders either a JSON or HTML response for the given state based on the path suffix.
     * @private
     * @param {Object} options
     * @param {Object} options.request The current request object
     * @param {Response} options.response The current response object
     * @param {Object} options.state The app state
     * @param {Object} options.history The js history object
     * @return The html for app
     */

  }, {
    key: "renderPWA",
    value: function () {
      var _renderPWA = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3(_ref4) {
        var _this2 = this;

        var request, response, state, history, App, theme, protocol, hostname, port, path, search, amp, sheetsRegistry, model, stats, html, helmet, chunks, scripts;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                request = _ref4.request, response = _ref4.response, state = _ref4.state, history = _ref4.history;
                console.error = console.error || console.log;
                console.warn = console.warn || console.log;
                App = this.App, theme = this.theme;
                protocol = request.protocol, hostname = request.hostname, port = request.port, path = request.path, search = request.search;
                this.setContentType(request, response);

                if (!path.endsWith('.json')) {
                  _context3.next = 8;
                  break;
                }

                return _context3.abrupt("return", response.send(JSON.stringify(state)));

              case 8:
                amp = path.endsWith('.amp');
                sheetsRegistry = new SheetsRegistry();
                model = this.model.create(_objectSpread({}, state, {
                  amp: amp,
                  initialWidth: amp ? 'xs' : state.initialWidth,
                  location: _objectSpread({}, history.location, {
                    port: port,
                    protocol: protocol,
                    hostname: hostname
                  })
                }));
                this.chunkNames = [];
                _context3.prev = 12;
                _context3.next = 15;
                return getStats();

              case 15:
                stats = _context3.sent;
                _context3.next = 18;
                return profile('x-rsf-t-render-html', function () {
                  return renderHtml({
                    component: React.createElement(PWA, null, React.createElement(App, null)),
                    providers: {
                      app: model,
                      history: history,
                      analytics: {},
                      router: _this2.router
                    },
                    registry: sheetsRegistry,
                    theme: theme
                  });
                });

              case 18:
                html = _context3.sent;
                helmet = Helmet.renderStatic();
                chunks = flushChunkNames(stats);
                scripts = flattenDeep([chunks.map(function (chunk) {
                  return getScripts({
                    stats: stats,
                    chunk: chunk
                  });
                }), getScripts({
                  stats: stats,
                  chunk: 'main'
                })]); // Set prefetch headers so that our scripts will be fetched
                // and loaded as fast as possible

                if (this.sendPreloadHeaders) {
                  response.set('link', scripts.map(renderPreloadHeader).join(', '));
                }

                _context3.t0 = "\n        <!DOCTYPE html>\n        <html ".concat(helmet.htmlAttributes.toString(), ">\n          <head>\n            ").concat(helmet.title.toString(), "\n            <noscript id=\"jss-insertion-point\"></noscript>\n            ").concat(helmet.meta.toString(), "\n            ").concat(helmet.link.toString(), "\n            ").concat(helmet.script.toString(), "\n          </head>\n          <body ").concat(helmet.bodyAttributes.toString(), ">\n            ");
                _context3.next = 26;
                return renderStyle({
                  registry: sheetsRegistry,
                  minify: Boolean(amp)
                });

              case 26:
                _context3.t1 = _context3.sent;
                _context3.t2 = html;
                _context3.t3 = amp ? '' : "\n              ".concat(renderInitialStateScript({
                  state: model,
                  routeData: state,
                  defer: this.deferScripts
                }), "\n              ").concat(scripts.map(function (src) {
                  return renderScript(src, _this2.deferScripts);
                }).join(''), "\n            ");
                html = _context3.t0.concat.call(_context3.t0, _context3.t1, "\n            <noscript>\n              You need to enable JavaScript to run this app.\n            </noscript>\n            <div id=\"root\">").concat(_context3.t2, "</div>\n            ").concat(_context3.t3, "\n          </body>\n        </html>\n      ");

                if (!(typeof this.transform === 'function')) {
                  _context3.next = 34;
                  break;
                }

                _context3.next = 33;
                return this.transform(html, {
                  model: model,
                  sheetsRegistry: sheetsRegistry,
                  helmet: helmet
                });

              case 33:
                html = _context3.sent;

              case 34:
                if (!(amp && (!requestContext.get('amp-enabled') || !requestContext.get('amp-transformed')))) {
                  _context3.next = 41;
                  break;
                }

                console.warn('\nAMP not enabled');

                if (!requestContext.get('amp-enabled')) {
                  console.warn('\twithAMP was not used');
                }

                if (!requestContext.get('amp-transformed')) {
                  console.warn('\ttransformAmpHtml was not used');
                }

                console.warn('Redirecting to the PWA.');
                response.redirect(path.replace(/\.amp/, '') + search, 302);
                return _context3.abrupt("return");

              case 41:
                response.send(html);
                _context3.next = 49;
                break;

              case 44:
                _context3.prev = 44;
                _context3.t4 = _context3["catch"](12);
                // flush head content to prevent memory leak, see https://github.com/nfl/react-helmet#server-usage
                Helmet.renderStatic(); // flush amp analytics tags to prevent memory leak

                renderAmpAnalyticsTags(model);
                throw _context3.t4;

              case 49:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[12, 44]]);
      }));

      function renderPWA(_x3) {
        return _renderPWA.apply(this, arguments);
      }

      return renderPWA;
    }()
    /**
     * Renders an error response, either as JSON or SSR HTML, depending on the suffix
     * on the request path.
     * @private
     * @param {Error} e
     * @param {Request} request
     * @param {Response} response
     */

  }, {
    key: "renderError",
    value: function () {
      var _renderError = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee4(e, request, response, history) {
        var state;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                response.status(500, 'error');
                state = {
                  page: 'Error',
                  error: e.message,
                  stack: process.env.MOOV_ENV === 'production' ? null : e.stack
                };

                if (request.path.endsWith('.json')) {
                  response.send(state);
                }

                _context4.prev = 3;
                _context4.next = 6;
                return this.renderPWA({
                  request: request,
                  response: response,
                  state: state,
                  history: history
                });

              case 6:
                _context4.next = 11;
                break;

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](3);
                response.send(process.env.MOOV_ENV === 'production' ? 'An unknown error occurred while attempting to process your request.' : _context4.t0.stack);

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[3, 8]]);
      }));

      function renderError(_x4, _x5, _x6, _x7) {
        return _renderError.apply(this, arguments);
      }

      return renderError;
    }()
  }]);

  return Server;
}();

export { Server as default };
//# sourceMappingURL=Server.js.map
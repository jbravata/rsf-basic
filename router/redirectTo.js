import _regeneratorRuntime from "@babel/runtime/regenerator";
import "core-js/modules/es6.regexp.constructor";
import "core-js/modules/es6.regexp.replace";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _objectSpread from "@babel/runtime/helpers/objectSpread";

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import transformParams from './transformParams';
export default function redirectTo(path) {
  var type = 'redirectTo';
  var runOn = {
    server: true,
    client: false
  };

  var _config = function config(routePath, status) {
    return {
      redirect: _objectSpread({
        rewrite_path_regex: transformParams(routePath, path)
      }, status ? {
        status: status
      } : {})
    };
  };

  var responseStatus = 302;

  function fn(_x, _x2, _x3) {
    return _fn.apply(this, arguments);
  }

  function _fn() {
    _fn = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee(params, request, response) {
      var redirectPath, key;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              redirectPath = path;

              for (key in params) {
                redirectPath = redirectPath.replace(new RegExp("{".concat(key, "}"), 'g'), params[key]);
              }

              response.redirect(redirectPath, responseStatus);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));
    return _fn.apply(this, arguments);
  }

  return {
    type: type,
    config: _config,
    withStatus: function withStatus(status) {
      responseStatus = status;
      return {
        type: type,
        config: function config(routePath) {
          return _config(routePath, status);
        },
        runOn: runOn,
        fn: fn
      };
    },
    runOn: runOn,
    fn: fn
  };
}
//# sourceMappingURL=redirectTo.js.map
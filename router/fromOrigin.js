import _objectSpread from "@babel/runtime/helpers/objectSpread";

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import transformParams from './transformParams';
import proxyUpstream from './proxyUpstream';
export default function fromOrigin() {
  var backend = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'origin';
  var type = 'fromOrigin';
  var _config = {
    proxy: {
      backend: backend
    }
  };
  var runOn = {
    server: true,
    client: false
  };
  return _objectSpread({}, proxyUpstream(), {
    type: type,
    config: function config() {
      return _config;
    },
    // note as of react-storefront-edge@4.0.0, this is no longer used but is kept here for backwards compatibility
    transformPath: function transformPath(path) {
      return {
        type: type,
        runOn: runOn,
        config: function config(routePath) {
          _config.proxy.rewrite_path_regex = transformParams(routePath, path);
          return _config;
        }
      };
    }
  });
}
//# sourceMappingURL=fromOrigin.js.map
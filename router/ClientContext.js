import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

/**
 * @private
 */
var ClientContext =
/*#__PURE__*/
function () {
  function ClientContext() {
    _classCallCheck(this, ClientContext);

    _defineProperty(this, "clientCache", 'default');
  }

  _createClass(ClientContext, [{
    key: "cacheOnClient",

    /**
     * Controls caching in the service worker
     * @param {Boolean} shouldCache Set to true to cache the response on the client
     * @return {Response} this
     */
    value: function cacheOnClient(shouldCache) {
      if (shouldCache == null) throw new Error('shouldCache cannot be null in call to response.cacheOnClient');
      this.clientCache = shouldCache ? 'force-cache' : 'default';
      return this;
    } // Since this object is used in place of the Response on the client, we stub out Responses's methods
    // to prevent errors on the client in isomorphic handlers

  }, {
    key: "status",
    value: function status() {}
  }, {
    key: "set",
    value: function set() {}
  }, {
    key: "redirect",
    value: function redirect() {}
  }, {
    key: "get",
    value: function get() {}
  }, {
    key: "cookie",
    value: function cookie() {}
  }]);

  return ClientContext;
}();

export { ClientContext as default };
//# sourceMappingURL=ClientContext.js.map
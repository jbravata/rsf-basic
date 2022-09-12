import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.regexp.search";

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import registerServiceWorker from '../registerServiceWorker';
import { prefetch, waitForServiceWorkerController } from '../router/serviceWorker';
import qs from 'qs';
waitForServiceWorkerController().then(function () {
  if (window.location.search.length) {
    var _qs$parse = qs.parse(window.location.search, {
      ignoreQueryPrefix: true
    }),
        preload = _qs$parse.preload;

    if (preload) {
      try {
        JSON.parse(preload).forEach(function (url) {
          return prefetch(url);
        });
      } catch (e) {
        console.error("could not parse preload list from query string: ".concat(preload), e);
      }
    }
  }
});
registerServiceWorker();
//# sourceMappingURL=installServiceWorker.js.map
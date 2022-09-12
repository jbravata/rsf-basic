/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react';
import { createBrowserHistory } from 'history';
import hydrate from './utils/hydrate';
import scheduleHydration from './utils/scheduleHydration';
import registerServiceWorker, { unregister } from './registerServiceWorker';
import PWA from './PWA';
/**
 * Bootstraps the PWA react application.
 * @param {options} options
 * @param {React.Element} options.App The root app element
 * @param {Object} options.theme A material-ui theme
 * @param {Class} options.model A mobx-state-tree model class, typically extending `react-storefront/model/AppModelBase`
 * @param {HTMLElement} options.target The DOM element to mount onto
 * @param {Function} options.errorReporter A function to call when an error occurs so that it can be logged, typically located in `src/errorReporter.js`.
 * @param {Boolean} options.serviceWorker A flag for controlling if a service worker is registered
 * @param {Boolean} options.delayHydrationUntilPageLoad If `true` hydration will not occur until the window load event.  This helps improve initial page load time, especially largest image render.
 */

export default function launchClient(_ref) {
  var App = _ref.App,
      theme = _ref.theme,
      model = _ref.model,
      router = _ref.router,
      _ref$target = _ref.target,
      target = _ref$target === void 0 ? document.getElementById('root') : _ref$target,
      _ref$errorReporter = _ref.errorReporter,
      errorReporter = _ref$errorReporter === void 0 ? Function.prototype : _ref$errorReporter,
      _ref$serviceWorker = _ref.serviceWorker,
      serviceWorker = _ref$serviceWorker === void 0 ? true : _ref$serviceWorker,
      _ref$delayHydrationUn = _ref.delayHydrationUntilPageLoad,
      delayHydrationUntilPageLoad = _ref$delayHydrationUn === void 0 ? false : _ref$delayHydrationUn,
      additionalDelay = _ref.additionalDelay;
  scheduleHydration(delayHydrationUntilPageLoad, additionalDelay, function () {
    var history = createBrowserHistory();
    hydrate({
      component: React.createElement(PWA, {
        errorReporter: errorReporter
      }, React.createElement(App, null)),
      model: model,
      theme: theme,
      target: target,
      providerProps: {
        history: history,
        router: router
      }
    });
  });

  if (serviceWorker) {
    registerServiceWorker();
  } else {
    unregister();
  }
}
//# sourceMappingURL=launchClient.js.map
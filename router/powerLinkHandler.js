/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
export default function powerLinkHandler(_params, request, response) {
  response.set('content-type', 'application/javascript');
  var src = "".concat(request.protocol, "//").concat(request.hostname).concat([80, 443].indexOf(request.port) === -1 ? ':' + request.port : '');
  response.set('x-moov-cache', 'true');
  response.set('cache-control', "max-age: ".concat(60 * 60 * 24, ", s-maxage: ").concat(60 * 60 * 24 * 365));
  response.send("\n    var links = Array.from(document.querySelectorAll('a[data-rsf-power-link]')).map(function(link) {\n      var powerlink = link.getAttribute('href');\n      powerlink += (powerlink.indexOf('?') === -1 ? '?' : '&') + 'powerlink'\n      link.setAttribute('href', powerlink);\n      return link.getAttribute('href')\n    });\n\n    var el = document.createElement('iframe');\n\n    el.setAttribute('src', '".concat(src, "/pwa/install-service-worker.html?preload=' + encodeURIComponent(JSON.stringify(links)));\n    el.setAttribute('style', 'height:1px;width:1px;');\n    el.setAttribute('frameborder', '0');\n    \n    document.body.appendChild(el);\n  "));
}
//# sourceMappingURL=powerLinkHandler.js.map
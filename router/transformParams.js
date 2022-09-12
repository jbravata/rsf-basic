import "core-js/modules/es6.regexp.constructor";
import "core-js/modules/es6.regexp.replace";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.function.name";

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
function findParams(node) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (node.displayName === 'Param' || node.displayName === 'Splat') {
    params.push(node.props.name);
  }

  node.children.forEach(function (child) {
    return findParams(child, params);
  });
  return params;
}

export default function transformParams(route, path) {
  var params = findParams(route.ast);
  params.forEach(function (param, paramIndex) {
    path = path.replace( // Replacing all references of param which are
    // - Not at the begining of the path
    // - Not escaped
    new RegExp("(^|[^\\\\]){".concat(param, "}"), 'g'), function (match, capture) {
      return "".concat(capture, "\\").concat(paramIndex + 1);
    });
  });
  return path;
}
//# sourceMappingURL=transformParams.js.map
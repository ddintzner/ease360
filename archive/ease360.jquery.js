/*!
 * ease360° jQuery Legacy Shim v1.0.5
 * Maps the jQuery plugin API ($('#el').ease360(options)) to ease360 v1.0.5.
 *
 * Usage:
 *   Include AFTER both ease360-1.0.5.js AND jQuery.
 *
 *   <!-- new core (no jQuery needed) -->
 *   <script src="ease360-1.0.5.js"></script>
 *
 *   <!-- optional shim only if you have legacy code using the jQuery pattern -->
 *   <script src="jquery.js"></script>
 *   <script src="ease360.jquery.js"></script>
 *
 * Then your old code just works:
 *   var viewer = $('#myEl').ease360({ frames: [...], sourceWidth: 540, sourceHeight: 540 });
 *   viewer.angle(90);
 *   viewer.angleTo(180, 0.5);
 *
 * Changelog:
 *   1.0.5 - Aligned with ease360 v1.0.5.
 *           Fixed method forwarding: 'changeFrame' → 'changeFrames' (the name the
 *           core actually exposes), and added 'angleSet' and 'stopAllIntervals'.
 *           Fixed chaining: core methods return undefined, so the proxy now returns
 *           itself for any call that doesn't return a value (angle() with no
 *           argument still returns the current angle).
 *           CommonJS require() now points to ../ease360-1.0.5 (this shim lives in archive/).
 *   1.0.0 - Initial release.
 *
 * Copyright (c) 2016–2026 Derek Dintzner
 * Licensed under the MIT license.
 */

(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'ease360'], factory);
  } else if (typeof module === 'object' && module.exports) {
    factory(require('jquery'), require('../ease360-1.0.5'));
  } else {
    factory(window.jQuery || window.$, window.ease360);
  }
}(function ($, ease360) {
  'use strict';

  if (!$) {
    console.warn('ease360 jQuery shim: jQuery not found. Shim not registered.');
    return;
  }
  if (!ease360) {
    throw new Error('ease360 jQuery shim: ease360 core not found. Include ease360-1.0.5.js before this shim.');
  }

  // Store instances keyed to DOM elements via jQuery .data()
  var DATA_KEY = 'ease360-instance';

  // Public instance methods forwarded by the proxy. These must match the
  // method names on the ease360 core exactly.
  var INSTANCE_METHODS = [
    'angle', 'angleTo', 'angleStep', 'angleSet',
    'spinOver', 'spinOut',
    'changeFrames', 'changeFramesResponsive',
    'stopAllIntervals',
    'destroy'
  ];

  /**
   * A lightweight proxy that wraps an Ease360 instance and exposes
   * the full API. When methods are called via the jQuery plugin pattern
   * (e.g. viewer.angleTo(90)), they delegate to the real instance.
   *
   * Methods that return nothing hand back the proxy so calls can be chained:
   *   $('#el').ease360(opts).angleTo(90).spinOver(1);
   */
  function ShimProxy(instance, jqEl) {
    this._instance = instance;
    this._jq = jqEl;
  }

  // Forward all public methods from the real instance
  INSTANCE_METHODS.forEach(function (method) {
    ShimProxy.prototype[method] = function () {
      var result = this._instance[method].apply(this._instance, arguments);
      // Core methods return undefined (setters/actions) — return the proxy so
      // chaining works. Getters (e.g. angle() with no args) return their value.
      return (result === undefined || result === this._instance) ? this : result;
    };
  });

  // Expose progress getter
  Object.defineProperty(ShimProxy.prototype, 'progress', {
    get: function () { return this._instance.progress; }
  });

  // -------------------------------------------------------------------------
  // jQuery plugin registration
  // -------------------------------------------------------------------------

  $.fn.ease360 = function (options) {
    var $el = this.first(); // ease360 operates on a single element
    var el  = $el[0];

    if (!el) return this;

    // If an instance already exists, return the proxy so callers can chain
    var existing = $.data(el, DATA_KEY);
    if (existing) return existing;

    // Create new ease360 instance and wrap in proxy
    var instance = ease360(el, options || {});
    var proxy = new ShimProxy(instance, $el);

    $.data(el, DATA_KEY, proxy);

    // Deprecation notice in development (stripped in minified build via terser)
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(
        '[ease360] jQuery plugin pattern detected. ' +
        'Consider migrating to the jQuery-free API: ' +
        'ease360(\'#' + (el.id || 'el') + '\', options). ' +
        'The jQuery shim is provided for backwards compatibility only.'
      );
    }

    return proxy;
  };

  // -------------------------------------------------------------------------
  // Convenience: $.ease360 namespace for users who store instances globally
  // -------------------------------------------------------------------------
  $.ease360 = {
    version: ease360.VERSION,
    getInstance: function (selector) {
      var el = $(selector)[0];
      return el ? $.data(el, DATA_KEY) : null;
    }
  };

}));

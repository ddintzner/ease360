/*!
 * ease360° CDN Helper v1.0.1
 * Cloudinary image sequencer utility for ease360°.
 * https://github.com/ddintzner/ease360
 *
 * Generates Cloudinary-transformed frame URLs for use with ease360°
 * responsive breakpoint sets. Supports width-only, width+height, and
 * crop modes per breakpoint for full aspect ratio control.
 *
 * Copyright (c) 2016–2026 Derek Dintzner
 * Licensed under the MIT license.
 */

(function(root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ease360cdn = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';

  // ---------------------------------------------------------------------------
  // Cloudinary URL builder
  // ---------------------------------------------------------------------------

  /**
   * Build a single Cloudinary transformation URL.
   *
   * @param  {string} cloudName   Your Cloudinary cloud name
   * @param  {string} publicId    Public ID of the image (with or without extension)
   * @param  {object} transforms  Transformation options
   *   @param  {number}  transforms.width    Target width in px
   *   @param  {number}  transforms.height   Target height in px (optional — omit to scale proportionally)
   *   @param  {string}  transforms.crop     Crop mode: 'scale' | 'fill' | 'fit' | 'pad' | 'limit' (default: 'scale')
   *                                         Only applied when height is also set.
   *   @param  {string}  transforms.gravity  Crop anchor: 'center' | 'north' | 'south' | 'auto' (default: 'center')
   *   @param  {string}  transforms.format   'auto' | 'webp' | 'jpg' | 'png' (default: 'auto')
   *   @param  {number}  transforms.quality  1–100 or 'auto' (default: 'auto')
   *   @param  {string}  transforms.version  Optional version string e.g. 'v1778226364'
   * @return {string}  Full Cloudinary URL
   */
  function buildUrl(cloudName, publicId, transforms) {
    var t = transforms || {};
    var parts = [];

    if (t.width)            parts.push('w_' + t.width);
    if (t.height)           parts.push('h_' + t.height);

    // crop only makes sense when constraining both dimensions
    if (t.width && t.height) {
      parts.push('c_' + (t.crop || 'fill'));
      if (t.gravity)        parts.push('g_' + t.gravity);
    }

    parts.push('q_' + (t.quality || 'auto'));
    parts.push('f_' + (t.format  || 'auto'));

    var transformation = parts.join(',');
    var version = t.version ? t.version + '/' : '';

    return [
      'https://res.cloudinary.com',
      cloudName,
      'image/upload',
      transformation,
      version + publicId
    ].join('/');
  }

  // ---------------------------------------------------------------------------
  // Frame sequence generator
  // ---------------------------------------------------------------------------

  /**
   * Generate an array of Cloudinary URLs for a numbered frame sequence.
   *
   * Frame filenames follow the pattern:
   *   {prefix}-{frame}.{ext}
   * e.g. G090-LondonGray-lg-001.jpg through G090-LondonGray-lg-036.jpg
   *
   * @param  {object} options
   *   @param  {string}  options.cloudName   Cloudinary cloud name — required
   *   @param  {string}  options.prefix      Filename prefix e.g. 'G090-LondonGray-lg'
   *   @param  {number}  options.frames      Total number of frames (default: 36)
   *   @param  {number}  options.pad         Zero-pad frame number to N digits (default: 3)
   *   @param  {string}  options.ext         File extension (default: 'jpg')
   *   @param  {number}  options.startFrame  First frame number (default: 1)
   *   @param  {number}  options.width       Resize width in px
   *   @param  {number}  options.height      Resize height in px (optional — omit to scale proportionally)
   *   @param  {string}  options.crop        Crop mode when both width+height set: 'fill' | 'fit' | 'pad' | 'scale' (default: 'fill')
   *   @param  {string}  options.gravity     Crop anchor: 'center' | 'north' | 'south' | 'auto' (default: 'center')
   *   @param  {string}  options.format      Image format (default: 'auto' → WebP where supported)
   *   @param  {string}  options.quality     Compression quality (default: 'auto')
   *   @param  {string}  options.version     Cloudinary version string e.g. 'v1778226364'
   *   @param  {string}  options.folder      Optional Cloudinary folder prefix e.g. 'vehicles/g90'
   * @return {string[]}  Array of frame URLs
   */
  function frames(options) {
    var o = options || {};

    if (!o.cloudName) throw new Error('ease360cdn.frames: cloudName is required');
    if (!o.prefix)    throw new Error('ease360cdn.frames: prefix is required');

    var total      = o.frames     || 36;
    var pad        = o.pad        || 3;
    var ext        = o.ext        || 'jpg';
    var startFrame = o.startFrame || 1;
    var folder     = o.folder     ? o.folder.replace(/\/$/, '') + '/' : '';

    var urls = [];

    for (var i = 0; i < total; i++) {
      var frameNum = startFrame + i;
      var padded   = String(frameNum).padStart(pad, '0');
      var publicId = folder + o.prefix + '-' + padded + '.' + ext;

      urls.push(buildUrl(o.cloudName, publicId, {
        width:   o.width,
        height:  o.height,
        crop:    o.crop,
        gravity: o.gravity,
        format:  o.format  || 'auto',
        quality: o.quality || 'auto',
        version: o.version
      }));
    }

    return urls;
  }

  // ---------------------------------------------------------------------------
  // Responsive set builder
  // ---------------------------------------------------------------------------

  /**
   * Generate a full ease360° responsive array from a single config.
   * Each breakpoint entry is ready to drop directly into ease360()'s
   * responsive option.
   *
   * @param  {object}   baseOptions             Shared options (cloudName, prefix, version, etc.)
   * @param  {object[]} breakpoints             Array of breakpoint definitions
   *   @param  {number}  breakpoint.breakpoint  Viewport width in px
   *   @param  {number}  breakpoint.width       Frame render width (also the Cloudinary resize width)
   *   @param  {number}  breakpoint.height      Frame render height
   *   @param  {string}  breakpoint.crop        Override crop for this breakpoint (optional)
   *   @param  {string}  breakpoint.gravity     Override gravity for this breakpoint (optional)
   *   @param  {boolean} breakpoint.flex        Enable flex width (default: { w: true })
   * @return {object[]}  ease360 responsive array
   *
   * @example — width only, height scales proportionally
   * ease360cdn.responsive(base, [
   *   { breakpoint: 1440, width: 1440, height: 722 },
   *   { breakpoint: 1024, width: 1024, height: 534 },
   *   { breakpoint: 640,  width: 640,  height: 360 }
   * ]);
   *
   * @example — fixed aspect ratio with crop (e.g. 1:1 square at mobile)
   * ease360cdn.responsive(base, [
   *   { breakpoint: 1440, width: 1440, height: 722  },
   *   { breakpoint: 1024, width: 1024, height: 534  },
   *   { breakpoint: 640,  width: 640,  height: 640, crop: 'fill', gravity: 'auto' }
   * ]);
   *
   * @example — different aspect ratio per breakpoint
   * ease360cdn.responsive(base, [
   *   { breakpoint: 1440, width: 1440, height: 810  },   // 16:9
   *   { breakpoint: 1024, width: 1024, height: 1024 },   // 1:1
   *   { breakpoint: 640,  width: 640,  height: 853  }    // 3:4
   * ]);
   */
  function responsive(baseOptions, breakpoints) {
    if (!baseOptions) throw new Error('ease360cdn.responsive: baseOptions is required');
    if (!breakpoints || !breakpoints.length) throw new Error('ease360cdn.responsive: breakpoints array is required');

    return breakpoints.map(function(bp) {

      // Per-breakpoint crop/gravity overrides baseOptions values
      var cropMode = bp.crop    || baseOptions.crop    || undefined;
      var gravity  = bp.gravity || baseOptions.gravity || undefined;

      // Only pass height to buildUrl if explicitly set on breakpoint
      // Omitting height = width-only resize, height scales proportionally
      var bpHeight = bp.cdnHeight !== undefined ? bp.cdnHeight : bp.height;

      return {
        breakpoint: bp.breakpoint,
        width:      bp.width,
        height:     bp.height,
        flex:       bp.flex !== undefined ? bp.flex : { w: true },
        frames:     frames(Object.assign({}, baseOptions, {
          width:   bp.width,
          height:  bpHeight,
          crop:    cropMode,
          gravity: gravity
        }))
      };
    });
  }

  // ---------------------------------------------------------------------------
  // HiDPI / Retina variant
  // ---------------------------------------------------------------------------

  /**
   * Convenience wrapper to generate a 2× HiDPI frame set.
   * Doubles the width of every breakpoint for use with framesHighDPI.
   *
   * @param  {object}   baseOptions   Same as responsive()
   * @param  {object[]} breakpoints   Same as responsive()
   * @return {object[]} responsive array with 2× widths
   */
  function responsiveHiDPI(baseOptions, breakpoints) {
    var doubled = breakpoints.map(function(bp) {
      return Object.assign({}, bp, { width: bp.width * 2 });
    });
    return responsive(baseOptions, doubled);
  }

  // ---------------------------------------------------------------------------
  // Export
  // ---------------------------------------------------------------------------

  return {
    frames:          frames,
    responsive:      responsive,
    responsiveHiDPI: responsiveHiDPI,
    buildUrl:        buildUrl,
    VERSION:         '1.0.1'
  };

}));

# Changelog

All notable changes to ease360° are documented here.

---

## [1.0.0] — 2026-07-09

- **Breaking:** jQuery dependency removed. Core is now zero-dependency vanilla JS.
- New UMD build — works with AMD, CommonJS, ESM, and global script tags.
- New `ease360.jquery.js` shim — drop-in backwards compatibility for the `$('#el').ease360()` pattern.
- `ease360(selector, options)` factory function replaces the jQuery plugin pattern.
- CSS selector string or DOM element both accepted as first argument.
- New `destroy()` method removes canvas and unbinds all events.
- Modernized event handling — Pointer Events API (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`). Unifies mouse, touch, and stylus input. `setPointerCapture()` added for reliable drag tracking outside the element boundary.
- `width` and `height` settings renamed to `sourceWidth` and `sourceHeight`. Legacy `width`/`height` still accepted with a deprecation warning.
- `touchdirection` renamed to `dragDirection`. Legacy `touchdirection` and `dragAxis` still accepted with deprecation warnings.
- `sourceWidth` and `sourceHeight` are now optional. When omitted, ease360° probes `frames[0]` for dimensions automatically. Provide both to skip the probe: synchronous init, no CORS dependency.
- Fixed `backgroundOffsetY` / `backgroundOffsetX` being ignored when `backgroundSize` is `'cover-center'`.
- `ease360.css` — added `touch-action: none` and `user-select: none` to `.ease360` for reliable pointer event handling on mobile and tablet.

---

## [0.2.75] — 03/28/2025

- Responsive image set declaration updated. Do not declare an image set, width, or height outside the responsive setting — all image sets should be within the responsive array.
- New `changeFramesResponsive()` for frame updates on responsive sets.
- The physics control `damping` is now a configurable setting.

## [0.2.7] — 03/22/2025

- New `backgroundSize` settings: `'cover-center'` and `'cover-top'`.

## [0.2.65] — 11/08/2024

- Updated `changeFrames` event to wait until the engine has stopped before updating the image set.

## [0.2.6] — 11/08/2024

- Enhancement for `changeFrames` with `preloadSmart: true`. When `changeFrames` is triggered, the current angle loads first. The `preloadSmart` feature also carries over to the new set of images.

## [0.2.5] — 11/08/2024

- Fixed `changeFrames` event — second set not loading with `preloadSmart: true`.

## [0.2.4] — 02/23/2024

- Fixed issue with `preloadSmart` not rendering additional canvas frames.

## [0.2.3] — 03/05/2020

- If you add a retina set to a breakpoint, you are no longer required to include a retina set for all breakpoints. You can now mix and match which breakpoints include `framesHighDPI`.

## [0.2.2] — 03/03/2020

- Fixed `startAngle` issue. Initial interaction now starts at the defined angle and no longer resets to angle 0.

## [0.2.1] — 11/11/2019

- Setting `transparencySupport` added. Default is `true` — clears the canvas before drawing each new image.

## [0.2.0] — 11/01/2019

- Transparent PNG support.

## [0.1.0] — 04/16/2019

- Updated `ease360.js` and `ease360.min.js` — replaced `.selector` (deprecated/removed from jQuery).
  Reference commit: [ae2df3a](https://github.com/ddintzner/ease360/commit/ae2df3a4bf4a923b2a7d0296438cda61848c3d27)

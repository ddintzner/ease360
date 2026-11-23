# Changelog

All notable changes to ease360° are documented here.

---

## [1.0.7] — 2026-11-22

- **`angleTo()` takes the shortest arc by default.** 350° → 10° turns forward 20° instead of back 340°. Pass `{ shortest: false }` for the old linear behaviour or a multi-turn spin.
- **`angleTo(angle, options)`:** `duration`, `speed` (degrees per second, so the time scales with the distance), `minDuration`, `shortest` and `loadFrames`. The `angleTo(angle, seconds)` form still works.
- `angleTo()` and `angleStep()` load the remaining frames first (the second half when `preloadSmart` is on). `loadFrames: false` opts out. New method `loadRemaining()`.
- Fixed `startMove()` checking `states.activeTween` instead of `timeline.activeTween`. A drag now stops a running `angleTo()` tween instead of fighting it (flicker). `angleStep()` also cancels a running tween.
- `dragDirection: 'all'` follows the dominant axis of each move. Both branches used the signed x delta before.
- New `dragThreshold` option (default 4px) before the drag axis is locked.
- The viewer sets `touch-action` from `dragDirection` (`pan-y` for `'left-right'`, `pan-x` for `'up-down'`, otherwise `none`), so vertical swipes scroll the page. `ease360.css` defaults to `pan-y`.
- The window resize listener is registered once and `destroy()` now removes it (it used a new anonymous function, so it was never removed).
- `changeFramesResponsive(sets, sizes)` accepts optional per-breakpoint `{ sourceWidth, sourceHeight }` for sets delivered at a different size.
- **Frame swaps can fade.** `changeFrames(frames, options)` and `changeFramesResponsive(sets, sizes, options)` take `{ fade, minLoadTime, loadStart, loaded, timeout }`. With `fade` the current picture is held as a snapshot canvas (class `ease360-swap`) over the viewer, the new set loads behind it, and the snapshot fades out only once the first set of the new frames is loaded and drawn. A second swap mid-fade keeps what is on screen; reduced-motion visitors get a hard swap. The snapshot is a `<canvas class="ease360-swap">` at `z-index: 2`, inside the viewer: use `instance.canvas.c` for the live canvas rather than `querySelector('canvas')`, and scope your own canvas CSS with `:not(.ease360-swap)`.
- **`changeFrames(frames, framesHighDPI)` is deprecated.** The second argument is now the options object. The old form still works, with a console deprecation warning; `framesHighDPI` will be removed in a future major version.
- **While a swap loads the viewer is locked** (`lock`, default `true`): drag, `angleTo()`, `angleStep()` and `spinOver()` are ignored, and a coasting spin or running tween is stopped. `isLocked()` reports it.
- **Failed loads are handled.** A frame that fails to load, or a set not loaded within `timeout` (default 15000ms), fails the swap: `error(info, instance)` is called (`info.reason` is `"load"` or `"timeout"`) and, unless `revert: false`, the previous frames are put back behind the old picture, then `reverted(instance)` is called. The status callback reports `"error"`.
- New loading flag: `isLoading()` (`states.loading`) is true from the start of a swap until the new set is loaded, and the state callback reports `"loading"` then `"loaded"`.
- `ease360.VERSION` reports `1.0.7`.
- Files: `ease360-1.0.7.js` and `ease360-1.0.7.min.js` replace the 1.0.6 builds.
- `archive/ease360.jquery.js` shim: now targets 1.0.7 (CommonJS `require('./ease360-1.0.7')`) and forwards `isLoading()` and `isLocked()`.
- `ease360.cdn.js` 1.0.2: new `separator` option (default `'-'`) for public IDs like `2027_EGV70_ADV_AWD_CeresBlue_72f_000`, and `startFrame: 0` now works (it used to fall back to 1). Defaults are unchanged.

---

## [1.0.6] — 2026-11-21

- Fixed a frame-lookup rounding bug: `(angle / 360) * totalframes` is now rounded. Floating-point error gave a non-integer index for some frame counts (45, 60, 90, 120, 180, 360), so a frame URL came out as `undefined` (404) and the viewer sat on the loading spinner.
- `ease360.VERSION` reports `1.0.6`.
- Files: `ease360-1.0.6.js` and `ease360-1.0.6.min.js` replace the 1.0.5 builds.

---

## [1.0.5] — 2026-11-06

- **The 1.0.0 build did not contain several features documented under 1.0.0.** `ease360-1.0.0.js` (GitHub, and npm 1.0.0 and 1.0.2) still used the legacy mouse and touch handlers and read only `width` / `height`. 1.0.5 is the build that implements them:
  - `sourceWidth` / `sourceHeight` (legacy `width` / `height` still accepted with a warning), optional with a probe of `frames[0]`, including a clear console error for CORS and load failures.
  - `dragDirection` (legacy `dragAxis` and `touchdirection` still accepted with warnings).
  - Pointer Events (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) with `setPointerCapture()`.
  - `backgroundOffsetX` / `backgroundOffsetY` now apply with `'cover-center'`.
  - `stateUpdate` receives the status string (`'init'` | `'start'` | `'active'` | `'stop'`).
- Fixed an uncaught `TypeError` in the draw loop when a drag began with the physics position at exactly 0 (frame index -1). `engine()` now wraps negative angles and `canvasDraw()` ignores frames that are missing or not loaded yet.
- Responsive sets may now have different frame counts (for example 72 on desktop, 36 on mobile). On a breakpoint swap the angle snaps onto the new set's frame grid, instead of requesting a missing frame (`undefined`) and leaving the canvas blank until the next drag.
- The canvas context uses `imageSmoothingQuality = 'high'`, re-applied on every draw because resizing a canvas resets it.
- `ease360.VERSION` reports `1.0.5`.
- Files: `ease360-1.0.5.js` and `ease360-1.0.5.min.js` replace the 1.0.0 builds, which move to `archive/`.
- `archive/ease360.jquery.js` shim: forwards `changeFrames` (it previously forwarded the non-existent `changeFrame`), adds `angleSet` and `stopAllIntervals`, supports chaining, and requires `../ease360-1.0.5`.
- Docs: new README section on responsive set sizing (right-sized sets per breakpoint fix mobile edge aliasing).

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

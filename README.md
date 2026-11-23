<img src="https://raw.githubusercontent.com/ddintzner/ease360/main/ease360-logo.png" alt="ease360°" height="80">

> A modern JS framework for silky smooth 360°s.

**v1.0.7** — jQuery-free. Zero dependencies. ~41 KB minified (~10 KB gzipped).

**Docs & live examples: [ease360.dintzner.com](https://ease360.dintzner.com)**

**License:** MIT &nbsp;|&nbsp; **Version:** 1.0.7 &nbsp;|&nbsp; [Docs & Demos](https://ease360.dintzner.com) &nbsp;|&nbsp; [Changelog](CHANGELOG.md)

---

## Description

ease360° is a 360 degree image spin sequencer, designed for a better feel. Utilizing HTML5 canvas and JavaScript, ease360° offers greater performance and control than previous methods. Responsive layouts, Cloudinary CDN integration, event handling, and smart preloading are all supported. Drop in a script tag, pass a frame array, and spin.

### Features

- Physics-based inertia engine — drag, release, and coast to a natural stop
- Zero dependencies — vanilla JS, no jQuery, no build step required
- Smart preloading — interactive at 50% bandwidth, remaining frames load on first drag
- Responsive breakpoints — swap frame sets automatically per viewport width
- Cloudinary CDN integration — resize from a single master via URL transforms
- Runtime frame swapping — change color variants or assets without reinitializing
- Canvas renderer — no DOM manipulation, no CSS background tricks
- Four lifecycle callbacks — `progressUpdate`, `angleUpdate`, `stateUpdate`, `responsiveUpdate`
- UMD build — works with AMD, CommonJS, ESM, or a plain `<script>` tag
- `destroy()` method — clean removal of canvas and all event listeners

See [CHANGELOG.md](CHANGELOG.md) for full release history.

---

## What's new in v1.0

- ✅ **jQuery removed** — zero runtime dependencies
- ✅ **Same API** — all settings, methods, and callbacks unchanged
- ✅ **jQuery shim** — `ease360.jquery.js` kept in `/archive/` for gradual migration from v0.x
- ✅ **UMD build** — works with AMD, CommonJS, ESM, or a plain `<script>` tag
- ✅ **New `destroy()` method** — cleans up canvas and events

---

## Updated: the ease360° docs site

⚡ **[ease360.dintzner.com](https://ease360.dintzner.com)** is the new home for documentation and live, interactive examples. Every example is a working viewer you can drag, with the code shown beside it.

- 📘 **[Full reference](https://ease360.dintzner.com/index.php#settings)** — every setting, method, property, and callback
- 🚀 **[Ex 1 — Basic setup](https://ease360.dintzner.com/examples/ex1.php)** — install, frame arrays, `sourceWidth` / `sourceHeight`, and your first viewer
- 🎛️ **[Ex 2 — Callbacks & control](https://ease360.dintzner.com/examples/ex2.php)** — `progressUpdate`, `angleUpdate`, `stateUpdate`, `preloadSmart` loaders, goto buttons, keyboard, and hover-to-spin
- 📱 **[Ex 3 — Responsive breakpoints](https://ease360.dintzner.com/examples/ex3.php)** — swap frame sets per viewport width, including right-sized sets for mobile
- 🎨 **[Ex 4 — Change color](https://ease360.dintzner.com/examples/ex4.php)** — runtime `changeFrames()` for color and finish pickers, with loader orchestration
- ☁️ **[Ex 5 — CDN helper & Cloudinary](https://ease360.dintzner.com/examples/ex5.php)** — build frame URLs from a single master image
- 🛠️ **[Common errors & debugging](https://ease360.dintzner.com/examples/common-errors.php)** — blank canvas, CORS, wrong frame index, 50% progress jumps, jagged edges on mobile, and more

---

## Quick start

```html
<!-- 1. Include the script -->
<script src="ease360-1.0.7.js"></script>

<!-- 2. Add a container -->
<div id="viewer"></div>

<!-- 3. Init -->
<script>
  const viewer = ease360('#viewer', {
    frames: ['frame_001.jpg', 'frame_002.jpg', /* … */ 'frame_036.jpg'],
    sourceWidth:  540,
    sourceHeight: 540
  });
</script>
```

---

## Installation

### Script tag (CDN / download)

```html
<script src="ease360-1.0.7.min.js"></script>
```

### npm

```bash
npm install ease360
```

```js
import ease360 from 'ease360';
// or
const ease360 = require('ease360');
```

### Legacy jQuery projects (gradual migration)

If your project already uses the jQuery plugin pattern and you want to upgrade incrementally:

```html
<!-- New core — no jQuery required -->
<script src="ease360-1.0.7.js"></script>

<!-- Your existing jQuery -->
<script src="jquery.min.js"></script>

<!-- Compatibility shim — old code works untouched -->
<script src="archive/ease360.jquery.js"></script>
```

Your existing code continues to work:

```js
$(function() {
  var viewer = $('#viewer').ease360({ frames: myFrames, sourceWidth: 540, sourceHeight: 540 });
  viewer.angleTo(180);
});
```

> The shim logs a deprecation notice in the console to help you track down call sites. Once migrated, remove jQuery and the shim entirely.

---

## Migration from v0.x

| | v0.x (jQuery) | v1.0 (vanilla) |
|---|---|---|
| **Dependency** | jQuery 1.7+ | None |
| **Init** | `$('#el').ease360(opts)` | `ease360('#el', opts)` |
| **DOM ready** | `$(function(){…})` | Not needed — or use `DOMContentLoaded` |
| **Module** | Global only | UMD (AMD / CJS / ESM / global) |
| **All settings** | Unchanged | ✅ Identical |
| **All methods** | Unchanged | ✅ Identical |
| **All callbacks** | Unchanged | ✅ Identical |

**Before:**
```js
$(function() {
  var viewer = $('#myEl').ease360({
    frames: teapotFrames,
    sourceWidth:  540,
    sourceHeight: 540,
    damping: 0.93
  });
  viewer.angleTo(90, 0.5);
});
```

**After:**
```js
const viewer = ease360('#myEl', {
  frames: teapotFrames,
  sourceWidth:  540,
  sourceHeight: 540,
  damping: 0.93
});
viewer.angleTo(90, 0.5);
```

---

## Settings

> **Note:** ease360° requires an even number of frames. Any frame count that divides evenly into 360 works — 12, 24, 36, 72, up to 360.

| Option | Type | Default | Description |
|---|---|---|---|
| `frames` | array | `null` | Ordered array of image paths — **required** |
| `sourceWidth` | int | `null` | Delivered frame pixel width. Optional — probes `frames[0]` if omitted. Previously `width` (v0.x). |
| `sourceHeight` | int | `null` | Delivered frame pixel height. Optional — probes `frames[0]` if omitted. Previously `height` (v0.x). |
| `frameDirection` | int | `1` | Set `-1` to reverse sequence direction |
| `backgroundSize` | enum | `'stretch'` | `'stretch'` \| `'cover'` \| `'cover-center'` \| `'cover-top'` |
| `backgroundOffsetX` | float | `0` | X offset in px when `backgroundSize` is cover |
| `backgroundOffsetY` | float | `0` | Y offset in px when `backgroundSize` is cover |
| `preloadSmart` | boolean | `false` | Loads every other frame first (50%), remaining frames load on first drag. |
| `flex` | object | `{}` | Flexible container support. `{ w: true }` — percentage-width container. `{ h: true }` — percentage-height container. Can combine: `{ w: true, h: true }`. |
| `dragDirection` | enum | `'left-right'` | `'left-right'` \| `'up-down'` \| `'all'` \| `'none'`. Previously `touchdirection`, `dragAxis` (v0.x). The viewer sets `touch-action` to match (`pan-y`, `pan-x` or `none`) so the other axis still scrolls the page. |
| `dragThreshold` | int | `4` | Pixels the pointer must move before the drag axis is locked. |
| `responsive` | array | — | Breakpoint array — see Responsive section |
| `startAngle` | int | `0` | Initial angle on load (0–359) |
| `damping` | float | `0.95` | Physics friction: `0.85` (firm) → `0.98` (fluid). `1.0` = perpetual spin |
| `transparencySupport` | boolean | `true` | Clears canvas before each frame. Set `false` for legacy behavior |

---

## Methods

| Method | Parameters | Description |
|---|---|---|
| `angle()` | — | Returns current angle (0–359). Getter. |
| `angle(value)` | int | Sets angle instantly. Setter. |
| `angleTo(angle, duration?)` | int, float | Animates to angle by the shortest arc (350° → 10° turns forward 20°). Duration in seconds. |
| `angleTo(angle, options)` | int, object | `options`: `duration` (s), `speed` (degrees per second; time scales with distance, overrides `duration`), `minDuration` (s, default `0.35`, floor for `speed`), `shortest` (default `true`; `false` = plain `angle - current`, for multi-turn spins), `loadFrames` (default `true`; loads the remaining frames first). Ignored while another `angleTo` is running. |
| `angleStep(degrees)` | int | Turns by a number of degrees (negative = backwards) without animation, cancelling any running `angleTo`. |
| `spinOver(speed?)` | float | Continuous spin. Positive or negative speed. Default `1.0`. |
| `spinOut()` | — | Cancels `spinOver()`. |
| `changeFrames(frames, options?)` | array, object | Swaps the frame set of a viewer set up with `frames`. Waits for the engine to stop, then loads the new frames behind the current picture. `options`: `fade` (`true` = 500ms, or milliseconds: holds the old picture as a snapshot and fades it out once the new set is loaded and drawn), `minLoadTime` (ms the old picture and loading state stay up at least), `loadStart(instance)`, `loaded(instance)` (called when the first set of the new frames is in) and `timeout` (ms, default `15000`; a set not loaded by then counts as failed), `error(info, instance)` (a frame failed to load or the timeout hit: `info.reason` is `"load"` or `"timeout"`), `revert` (default `true`: on failure the previous frames are put back behind the old picture), `reverted(instance)` and `lock` (default `true`: drag, `angleTo`, `angleStep` and `spinOver` are ignored while the new set loads). |
| `changeFramesResponsive(sets, sizes?, options?)` | array of arrays, array, object | Swaps the frame sets of a viewer set up with `responsive`, one set per breakpoint, in the same order. Waits for the engine to stop, then loads the new frames behind the current picture. `sizes`: optional `[{ sourceWidth, sourceHeight }, …]` for sets of a different delivered size. Same `options` as `changeFrames`. |
| `isLoading()` | — | `true` from the start of a frame swap until the first set of the new frames is loaded. The state callback reports `"loading"` then `"loaded"` (`"error"` on failure). |
| `isLocked()` | — | `true` while a swap is loading and the viewer is locked (see `lock`). |
| `destroy()` | — | Removes canvas, unbinds all events, cancels animation. |

---

## Changing frames

`changeFrames()` and `changeFramesResponsive()` take the same `options` object as their last argument and behave the same way. Without options the frames swap straight away. With options, ease360° holds the current picture as a snapshot over the viewer, loads the new set behind it, and fades the snapshot out only once the new frames are loaded and drawn. See [Ex 4](https://ease360.dintzner.com/examples/ex4.php) for a working color picker.

| Option | Type | Default | Description |
|---|---|---|---|
| `fade` | boolean \| number | `false` | `true` fades the old picture out over 500ms; a number sets the milliseconds. Skipped for visitors who ask for reduced motion. |
| `minLoadTime` | number (ms) | `0` | Keeps the old picture and the loading state up for at least this long, so a fast connection doesn't flash a spinner. |
| `loadStart` | function | — | Called with the instance when the swap begins. |
| `loaded` | function | — | Called with the instance when the first set of the new frames is loaded and drawn, as the fade starts. |
| `timeout` | number (ms) | `15000` | A set that has not loaded by then counts as failed. |
| `error` | function | — | Called with `(info, instance)` when the swap fails. `info.reason` is `"load"` (a frame failed; `info.file` says which) or `"timeout"`. `info.reverting` is `true` when the previous frames are being put back; `info.revertFailed` is `true` if they would not load either. |
| `revert` | boolean | `true` | On failure, put the previous frames back behind the old picture. `false` leaves it to `error`, for instance to retry. |
| `reverted` | function | — | Called with the instance once the previous frames are back. |
| `lock` | boolean | `true` | Ignore drag, `angleTo()`, `angleStep()` and `spinOver()` while the new set loads. `false` leaves the viewer live. |

`changeFramesResponsive()` also takes `sizes`, an optional array of `{ sourceWidth, sourceHeight }`, one per breakpoint, for sets delivered at a different size than the original. The status callback reports `"loading"`, then `"loaded"` (or `"error"`).

### The loading flag and the lock

From the moment a swap starts until the new set is loaded, `viewer.isLoading()` returns `true` (it reads `states.loading`). The status callback reports `"loading"` and then `"loaded"`, so a UI can disable controls or show a spinner without any options at all. This works with or without `fade`.

While the flag is up the viewer is **locked**: a swap stops any spin that is coasting or any `angleTo()` tween, and drag, `angleTo()`, `angleStep()` and `spinOver()` are ignored until the new set is in. Otherwise a visitor could spin through frames that are half old and half new. `viewer.isLocked()` reports it, and `lock: false` leaves the viewer live during the swap.

A swap raises `progress` from 0 to 1 like the first load did, so if your `progressUpdate` hides the first-load spinner, return early while `isLoading()` is true and use the `loaded` option for the swap instead.

### Failed loads

A frame that 404s, or a set that is still not in after `timeout` milliseconds (default 15000), fails the swap. By default ease360° then puts the **previous frames back** behind the old picture, which stays up the whole time, so the visitor never sees a half-loaded set. Your `error` callback is called first, to update the UI, and `reverted` is called once the old frames are back.

```js
viewer.changeFrames(frames, {
  fade: 500,
  timeout: 8000,                  // give up after 8s
  error: (info) => {
    // info.reason: 'load' (info.file is the frame that failed) or 'timeout'
    // info.reverting: true when the previous frames are being put back
    // info.revertFailed: true if even the previous frames would not load
    showMessage('Could not load that color.');
  },
  reverted: () => hideSpinner()
});
```

With `revert: false` the old frames are not put back: the old picture fades out and `error` decides what happens next, for instance calling `changeFrames()` again to retry. With `preloadSmart`, only the first half of the new set is checked for failures; frames in the second half that fail later are not reported.

### Example: color swatches

Keep a map of which sets have been loaded at least once. The first visit shows the spinner and holds for a minimum time; a set loaded before comes from the browser cache, so it just fades. If a swap fails, switch the swatch back.

```js
const changeVariant = (key) => {
  const previous = activeColor;
  selectColor(key);                       // marks the swatch active

  const firstVisit = !colorLoaded[key];
  colorLoaded[key] = true;

  viewer.changeFrames(variantFrames[key], {
    fade: 500,
    minLoadTime: firstVisit ? 1150 : 0,
    loadStart: firstVisit ? showSpinner : undefined,
    loaded: hideSpinner,
    error: () => {                        // the previous frames are put back for you
      colorLoaded[key] = false;
      selectColor(previous);
      hideSpinner();
    }
  });
};
```

For a viewer set up with `responsive`, call `changeFramesResponsive([...setsInBreakpointOrder], sizes?, options)` the same way. See [Ex 4](https://ease360.dintzner.com/examples/ex4.php) for the full working page.

## Properties

| Property | Type | Description |
|---|---|---|
| `.progress` | float | 0–1 loading progress. Use with `progressUpdate` callback. Getter. |
| `.totalLoaded` | int | Number of frames loaded so far. Use alongside `.frames.length` to calculate raw load progress. Getter. |
| `.frames` | array | The active frame array. Use `.frames.length` to get total frame count. Getter. |
| `.canvas.c` | HTMLCanvasElement | Reference to the underlying canvas DOM element. Use to apply CSS classes (e.g. opacity transitions) after load. |

---

## Callbacks

| Callback | Argument | Description |
|---|---|---|
| `progressUpdate` | float (0–1) | Fired on every frame load tick |
| `angleUpdate` | int (0–359) | Fired on every angle change during render |
| `responsiveUpdate` | breakpoint object | Fired when the active responsive breakpoint changes |
| `stateUpdate` | string | `'init'` \| `'start'` \| `'active'` \| `'stop'` |

---

## Responsive example

```js
const viewer = ease360('#viewer', {
  backgroundSize: 'cover-center',
  preloadSmart:   false,
  startAngle:     60,
  damping:        0.925,
  responsive: [
    { breakpoint: 1440, frames: frames1440, flex: { w: true }, sourceWidth: 1440, sourceHeight: 722 },
    { breakpoint: 1024, frames: frames1024, flex: { w: true }, sourceWidth: 1024, sourceHeight: 534 },
    { breakpoint: 640,  frames: frames640,  flex: { w: true }, sourceWidth: 640,  sourceHeight: 360 },
    { breakpoint: 534,  frames: frames534,  flex: { w: true }, sourceWidth: 534,  sourceHeight: 301 }
  ],
  progressUpdate:   onProgress,
  responsiveUpdate: onBreakpoint,
  stateUpdate:      (s) => console.log('State:', s)
});

// Swap color variant across all breakpoints
function changeColor(colorFrameSets) {
  viewer.changeFramesResponsive(colorFrameSets); // [frames1440, frames1024, frames640, frames534]
}
```

---

## Responsive sets: sizing and frame counts

Serve a right-sized frame set for each breakpoint. A 1920px frame drawn into a ~390px phone canvas is a ~5:1 downscale in one step, and thin edges stair-step. A 640px-wide set for phones keeps the browser to roughly 1.5:1 and the edges stay clean. Suggested widths: 1920 · 1440 · 1024 · 768 · 640 · 375.

```js
responsive: [
  // Tablet / desktop — 1920px and wider also gets this set (no oversized catch-all needed)
  { breakpoint: 1920,   frames: framesFull,   sourceWidth: 1920, sourceHeight: 1080, flex: { w: true } },
  // Mobile — 640px viewport and below
  { breakpoint: 641,    frames: frames640w,   sourceWidth: 640,  sourceHeight: 360,  flex: { w: true } }
]
```

- **Order:** list sets large to small. ease360° activates the last entry whose `breakpoint` is above the viewport width, so `641` means "640px and below". The initial load compares with `<` and a later resize with `<=`; the two differ only at a viewport of exactly the breakpoint value. **No catch-all breakpoint:** if no entry matches (a viewport wider than the first breakpoint), the first entry is used, so make it your largest set at its true width (for example `1920`), not `100000`.
- **Sizes:** `sourceWidth` / `sourceHeight` must match the delivered size of that set, not the master.
- **Frame counts may differ per set** (for example 72 on desktop, 36 on mobile). Each count must divide evenly into 360. On a breakpoint swap the angle snaps to the nearest frame the new set has.
- **Retina:** `framesHighDPI` is no longer used. Ship the right-sized set instead.
- **DOM:** when a set swaps, ease360° replaces the viewer element with a clone to drop old listeners. Look up child elements (loaders, overlays) when you need them instead of keeping references.

---

## Browser support

ease360° works in all modern browsers.

---

## Files

| File | Description |
|---|---|
| `ease360-1.0.7.js` | Full annotated source |
| `ease360-1.0.7.min.js` | Minified production build |
| `ease360.css` | Required styles for the viewer (`touch-action`, `user-select`) |
| `ease360.cdn.js` | Optional CDN helper (Cloudinary URL builder), v1.0.2 |
| `archive/` | Previous builds (0.x and 1.0.0) |
| `ease360.jquery.js` *(archive)* | Legacy jQuery plugin shim — see `/archive/` |
| `ease360.jquery.min.js` *(archive)* | Legacy jQuery plugin shim — minified — see `/archive/` |

---

## License

Copyright © 2016–2026 Derek Dintzner — MIT License

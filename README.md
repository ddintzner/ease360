# ease360°

> A modern JS framework for silky smooth 360°s.

**v1.0.0** — jQuery-free. Zero dependencies. ~28 KB minified.

**License:** MIT &nbsp;|&nbsp; **Version:** 1.0.0 &nbsp;|&nbsp; [Changelog](CHANGELOG.md)

---

## Description

ease360° is a 360 degree image spin sequencer, designed for a better feel. Utilizing HTML5 canvas and JavaScript, ease360° offers greater performance and control than previous methods. Responsive layouts, retina images, event handling and smart preloading are all supported. Basic setup only requires 3 parameters, but you can do much more.

### Features

- Physics-based solution for 360 spin

See [CHANGELOG.md](CHANGELOG.md) for full release history.

---

## What's new in v1.0

- ✅ **jQuery removed** — zero runtime dependencies
- ✅ **Same API** — all settings, methods, and callbacks unchanged
- ✅ **jQuery shim** — `ease360.jquery.js` keeps old `$('#el').ease360()` code working
- ✅ **UMD build** — works with AMD, CommonJS, ESM, or a plain `<script>` tag
- ✅ **New `destroy()` method** — cleans up canvas and events

---

## Quick start

```html
<!-- 1. Include the script -->
<script src="ease360-1.0.0.js"></script>

<!-- 2. Add a container -->
<div id="viewer"></div>

<!-- 3. Init -->
<script>
  const viewer = ease360('#viewer', {
    frames: ['frame_001.jpg', 'frame_002.jpg', /* … */ 'frame_036.jpg'],
    width:  540,
    height: 540
  });
</script>
```

---

## Installation

### Script tag (CDN / download)

```html
<script src="ease360-1.0.0.min.js"></script>
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
<script src="ease360-1.0.0.js"></script>

<!-- Your existing jQuery -->
<script src="jquery.min.js"></script>

<!-- Compatibility shim — old code works untouched -->
<script src="ease360.jquery.js"></script>
```

Your existing code continues to work:

```js
$(function() {
  var viewer = $('#viewer').ease360({ frames: myFrames, width: 540, height: 540 });
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
    width:  540,
    height: 540,
    damping: 0.93
  });
  viewer.angleTo(90, 0.5);
});
```

**After:**
```js
const viewer = ease360('#myEl', {
  frames: teapotFrames,
  width:  540,
  height: 540,
  damping: 0.93
});
viewer.angleTo(90, 0.5);
```

---

## Settings

| Option | Type | Default | Description |
|---|---|---|---|
| `frames` | array | `null` | Ordered array of image paths — **required** |
| `width` | int | `null` | Source frame pixel width — **required** (unless responsive) |
| `height` | int | `null` | Source frame pixel height — **required** (unless responsive) |
| `framesHighDPI` | array | — | Retina/HiDPI frame paths (2× resolution) |
| `frameDirection` | int | `1` | Set `-1` to reverse sequence direction |
| `backgroundSize` | enum | `'stretch'` | `'stretch'` \| `'cover'` \| `'cover-center'` \| `'cover-top'` |
| `backgroundOffsetX` | float | `0` | X offset in px when `backgroundSize` is cover |
| `backgroundOffsetY` | float | `0` | Y offset in px when `backgroundSize` is cover |
| `preloadSmart` | boolean | `false` | Loads every other frame first (50%), rest on interaction. Requires even-length frames array. |
| `flex` | object | `{ w: false }` | Set `{ w: true }` for percentage-width containers |
| `touchdirection` | enum | `'left-right'` | `'left-right'` or `'up-down'` |
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
| `angleTo(angle, duration?)` | int, float | Animates to angle. Duration in seconds (default `1.0`). |
| `angleStep(angle)` | int | Jumps to angle without animation. |
| `spinOver(speed?)` | float | Continuous spin. Positive or negative speed. Default `1.0`. |
| `spinOut()` | — | Cancels `spinOver()`. |
| `changeFrame(frames, hdpiFrames?)` | array, array | Swaps frame set. Waits for engine stop. |
| `changeFramesResponsive(setsArray)` | array of arrays | Swaps responsive frame sets. Order must match init `responsive` array. |
| `destroy()` | — | Removes canvas, unbinds all events, cancels animation. |

---

## Properties

| Property | Type | Description |
|---|---|---|
| `.progress` | float | 0–1 loading progress. Getter. |

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
    { breakpoint: 1440, frames: frames1440, flex: { w: true }, width: 1440, height: 722 },
    { breakpoint: 1024, frames: frames1024, flex: { w: true }, width: 1024, height: 534 },
    { breakpoint: 640,  frames: frames640,  flex: { w: true }, width: 640,  height: 360 },
    { breakpoint: 534,  frames: frames534,  flex: { w: true }, width: 534,  height: 301 }
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

## Browser support

ease360° works in all modern browsers.

---

## Files

| File | Description |
|---|---|
| `ease360-1.0.0.js` | Full annotated source |
| `ease360-1.0.0.min.js` | Minified production build |
| `ease360.jquery.js` | Legacy jQuery plugin shim — annotated source |
| `ease360.jquery.min.js` | Legacy jQuery plugin shim — minified |

---

## License

Copyright © 2016–2026 Derek Dintzner — MIT License

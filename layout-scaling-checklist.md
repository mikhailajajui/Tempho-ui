# Layout Scaling Checklist (With Examples)

## Container Basics
1. Use `width: 100%` + `max-width` + `margin: 0 auto`.
   - Good:
     - `width: min(100%, 1200px);`
     - `margin: 0 auto;`
   - Avoid:
     - `width: 1200px;`

## Sizes: Prefer Fluid Over Fixed
1. Use `clamp()`, `%`, `min()`, `max()` for widths/heights.
   - Good:
     - `width: clamp(320px, 38vw, 724px);`
     - `height: auto;`
   - Avoid:
     - `width: 724px; height: 724px;`

## Aspect Ratio for Media
1. Use `aspect-ratio` instead of fixed height.
   - Good:
     - `width: min(100%, 1100px);`
     - `aspect-ratio: 1100 / 509;`
   - Avoid:
     - `width: 1100px; height: 509px;`

## Positioning
1. Use layout (grid/flex) for primary structure.
   - Good:
     - `display: grid; grid-template-columns: 2fr 1fr;`
   - Avoid:
     - `position: absolute; margin-left: 45vw;`
2. Use absolute positioning only for decorative elements.

## Spacing
1. Use width-based spacing for horizontal padding.
   - Good:
     - `padding-left: clamp(0px, 6vw, 96px);`
   - Avoid:
     - `padding-left: 20vh;`

## Height
1. Prefer `min-height` + padding.
   - Good:
     - `min-height: 900px; padding: clamp(80px, 10vh, 140px);`
   - Avoid:
     - `height: 1400px;`

## Carousels & Cards
1. Use responsive `min-width` and `height`.
   - Good:
     - `min-width: clamp(220px, 28vw, 320px);`
     - `height: clamp(120px, 14vw, 180px);`
   - Avoid:
     - `min-width: 320px; height: 180px;`

## Typography
1. Use `clamp()` for headings.
   - Good:
     - `font-size: clamp(48px, 6.2vw, 88px);`
   - Avoid:
     - `font-size: 108px;`

## Quick Debug Questions
1. Are any **large blocks** fixed pixel width/height?
2. Are **primary layout elements** absolutely positioned?
3. Are you using **vh for horizontal spacing**?
4. Do children **ignore** the container’s max width?
5. Is the design dependent on **one “perfect” viewport size**?

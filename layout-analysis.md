# Layout Scaling Review

## Summary
The main scaling issues on desktop are driven by fixed pixel dimensions, absolute positioning tied to `vw/vh` offsets, and containers that exceed practical max widths. These choices make the layout look OK at a narrow set of resolutions but break on wider or shorter screens. This is not just a `max-width` problem; it is primarily about using fluid sizing and layout primitives that can adapt to different desktop sizes.

## Primary Issues
1. Fixed pixel sizes on large visual blocks.
2. Absolute positioning with `vw/vh` offsets and hard-coded widths.
3. Inconsistent container widths and overly large max widths.
4. Heights locked to large pixel values instead of `min-height` + responsive padding.

## Evidence By File
1. `src/components/HeroImages.module.css`
   - `.heroImageWrapper` uses fixed `width: 724px`, `height: 724px` and is positioned with `margin-left: 45.5vw`, `margin-top: 12vh`.
   - Child panels (`.pl1`, `.pl2`, `.pl3`) are fixed pixel sizes and absolute positions, so they do not scale with the layout.
2. `src/components/WhyTempoSection.module.css`
   - `.photoPlaceholder` is fixed at `width: 1100px; height: 509px;`.
   - `.content` uses `padding-left: 20vh;`, which scales with viewport height, not width, and causes misalignment.
3. `src/components/FooterImageSection.module.css`
   - The section height is fixed at `1400px` and the card at `995px x 598px`, which overflows or feels oversized on mid-sized desktops.
4. `src/components/HeroSection.module.css`
   - Uses some `max-width` and `clamp()` correctly, but the overall hero stack competes with absolute-positioned image blocks.
5. `src/components/PartnersSection.module.css`
   - The carousel containers and logo cards use fixed minimum widths and heights that do not adapt to medium-sized desktops.

## Why This Breaks On Desktop
1. Fixed sizes do not scale across 1280, 1440, 1920, and 2560 widths.
2. Absolute positioning ignores the normal flow, so it does not respond to container widths or column reflow.
3. A single `max-width` is not enough when the children are pinned to fixed widths or viewport offsets.

## Recommended Fix Strategy
1. Convert fixed widths/heights to fluid rules using `clamp()`, `%`, `min()`, and `max()`.
2. Replace `margin-left: 45.5vw` and similar offsets with container-based alignment (grid or flex).
3. Set a consistent container pattern like:
   - `width: min(100%, 1200px);`
   - `margin: 0 auto;`
   - `padding: clamp(24px, 3vw, 48px);`
4. Use `aspect-ratio` for large image blocks instead of hard-coded heights.
5. Limit absolute positioning to decorative elements only, not primary layout.

## Concrete Targets For Improvement
1. Hero images block: rewrite to a grid or flex container that sits inside the hero column, then scale panels with `clamp()` and `aspect-ratio`.
2. Why Tempo image: replace `width: 1100px` with `width: min(100%, 1100px)` and use `aspect-ratio: 1100 / 509`.
3. Footer: replace `height: 1400px` with `min-height` plus responsive padding and center the card with fluid width.
4. Partners carousel: reduce fixed `min-width` and apply `clamp()` to card sizing.

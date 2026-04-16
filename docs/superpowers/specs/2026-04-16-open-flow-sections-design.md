# Open Flow Section Redesign

**Date:** 2026-04-16
**Status:** Approved

## Problem

The four main sections (Professional Focus, Clients & Brands, Personal Life, CV) use frosted glass containers with gradient backgrounds that clash with the header's open, flowing design. The header feels airy and organic; the sections feel boxed-in and template-like.

## Design Decision

Remove all container styling from sections. Sections become content on the page with generous whitespace — matching the header's visual language. The existing decorative SVG lines provide all the visual texture needed.

## CSS Changes

### Remove

1. **Section margin inset** — `.section { margin-inline }` that creates the card-like gap from viewport edges
2. **Gradient backgrounds** — all `.section__bg` rules including per-section gradient definitions and their dark mode variants
3. **Frosted glass** — `.section:not(.footer) .container` backdrop-filter/background rules and dark mode variant
4. **Logo card containers** — `.client-logos__item` background, border, border-radius, padding, and hover/dark mode styling for these properties
5. **Logo focus-within outline on item** — `.client-logos__item:focus-within` outline (focus moves to the link)

### Keep

- Section spacing (`margin-block`)
- Section label typography and alignment
- Section text styles
- Logo track layout, animation, mask, and image sizing
- Logo link styles and accessibility
- CV tab styles
- Social link pill styles
- All fade-in animation classes
- All SVG decorative lines
- Footer (already excluded from frosted glass via `:not(.footer)`)

### Adjust

- `.client-logos__item` — keep flex layout for centering but remove visual container (background, border, border-radius, box shadow)
- `.client-logos__item:hover` — remove background/border hover effects; the image filter transition is sufficient
- Dark mode `.client-logos__item` — remove opacity dimming (was tied to the white card contrast)

## HTML Changes

Remove `<div class="section__bg"></div>` from all four sections in `index.html` since the element is no longer styled.

## Files Modified

- `assets/css/main.css` — remove/simplify section and logo item styles
- `index.html` — remove `.section__bg` divs

## Dark Mode

Works naturally. Body background switches to `#111`, text to light colors. Without container backgrounds, sections inherit directly. No special treatment needed.

## No Regressions

- Footer is unaffected (already excluded from frosted glass)
- Imprint page sections: check if they use `.section__bg` — if so, same treatment applies
- Logo images remain lazy-loaded with proper alt text
- All accessibility features preserved (skip-to-content, aria labels, focus states, reduced motion)

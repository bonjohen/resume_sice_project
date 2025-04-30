# Phase II Implementation Plan

## 1. Design System

  [x] Create `css/design-system.css` with spacing scale (`--space-1` … `--space-5`) and fluid type scale using `clamp()`.
  [x] Define core color tokens (`--brand`, `--brand-light`, `--surface`, `--surface-alt`, `--text`, `--text-muted`) and verify WCAG AA contrast.
  [x] Import Google Fonts **Poppins** (headings) and **Inter** (body) via `font-display: swap`.

## 2. Layout Refactor

  [x] Replace hero and facet list flex layouts with CSS Grid (`grid-template-columns: repeat(auto-fit,minmax(10rem,1fr));`).
  [x] Convert each `.facet-section` to a named‑areas grid for balanced text / media alignment.
  [x] Update media query breakpoints to rely on fluid grid where possible.

## 3. Navigation & Header

  [x] Implement sticky header that shrinks on scroll (`window.scrollY > 60` adds `.shrink`).
  [x] Add smooth‑scroll anchor links and highlight active facet via Intersection Observer.
  [x] Set `scroll-margin-top` on section headings to avoid header overlap.

## 4. Footer Enhancements

  [x] Move JSON download and print buttons into a responsive flex row.
  [x] Add inline SVG icons for GitHub, LinkedIn, and email in `/assets/icons/`.
  [x] Apply alternate surface background color and consistent padding.

## 5. Dark Mode & Theming

  [x] Add `@media (prefers-color-scheme: dark)` token overrides for colors.
  [x] Provide manual dark‑mode toggle that sets `data-theme` attribute on `<html>`.
  [x] Persist theme preference in `localStorage`.

## 6. Iconography & Imagery

  [x] Replace PNG icons with MIT‑licensed **Heroicons** inline SVGs.
  [x] Add decorative background SVG wave or gradient mask to hero section.
  [x] Introduce optional <30 KB **Lottie** animation beside name tag.

## 7. Typography & Performance

  [x] Set base line‑height to 1.6 and establish heading scale (`--step--1` … `--step‑4`).
  [x] Run `npm run build` size report; target < 150 KB total CSS/JS (gzip).
  [x] Lazy‑load non‑critical assets with `loading="lazy"` / `fetchpriority="low"`.

## 8. Accessibility & QA

  [ ] Re‑audit color contrast for WCAG 2.2 AA compliance.
  [ ] Keyboard‑test all interactive elements (header links, pills, theme toggle).
  [ ] Update automated tests to cover header shrink, dark‑mode state, and new grid layout.

## 9. Deployment

  [ ] Commit Phase II changes to `phase-ii` branch; open PR to `main` after review.
  [ ] Deploy preview to GitHub Pages and validate on custom domain.
  [ ] Run Lighthouse performance & accessibility audits and fix critical issues.

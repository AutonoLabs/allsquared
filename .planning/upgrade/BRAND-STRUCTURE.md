# AllSquared Brand and UI Structure

## Design Source of Truth

For this upgrade, the direct implementation base is `AllSquared.html` from `AutonoLabs/allsquared-website`, not the previous app theme.

Production ownership is different from brand-source ownership: `AutonoLabs/allsquared-app` is the canonical production repo for both marketing and app, while `AutonoLabs/allsquared-website` is now reference/archive only.

Priority order:

1. `https://raw.githubusercontent.com/AutonoLabs/allsquared-website/main/AllSquared.html`
2. live `https://allsquared.io/` as a verification target
3. current app docs that still agree with `AllSquared.html`
4. current app implementation

This matters because the current app still uses a Material 3 visual layer, while `AllSquared.html` already defines the section rhythm, copy tone, palette, and type system we want.

## Brand Direction To Implement

Use the `AllSquared.html` direction as the main external brand:

- paper and white surfaces with restrained depth
- navy ink body color
- green as primary action color
- muted navy and slate support tones
- rounded cards with fine rules and editorial spacing
- `Source Serif 4` display, `Inter Tight` body, `JetBrains Mono` meta
- square `AS²` motif and restrained italic emphasis

The product should use the same tokens, but apply them with less density than the marketing pages.

## Visual Rules

### Marketing surfaces

- Bold, high-contrast section composition
- Strong hero typography
- Framed cards with visible outlines and offsets
- Dense storytelling rhythm
- Decorative motif usage is welcome

### Product surfaces

- Same palette and typography family
- More restrained accent use
- Fewer decorative blocks
- Clear data hierarchy first
- Focus on status, trust, and task completion

### Admin surfaces

- Most restrained of the three
- Token-compatible, but optimized for scanning and control
- Avoid turning admin into a marketing page

## Recommended Token Layer

Replace the current M3-first theme in `client/src/index.css` with a brand token layer built around:

- colors
  - ink
  - paper
  - warm paper
  - line
  - navy support tones
  - green action
  - gold and red support states
  - muted slate
- typography
  - display
  - body
  - mono
- structure
  - border widths
  - shadow offsets
  - radii policy
  - spacing scale

Implementation direction:

- create `client/src/styles/brand-tokens.css`
- create `client/src/styles/brand-utilities.css` if needed
- import them from `client/src/index.css`
- demote or remove `client/src/styles/md3-theme.css`

## Recommended Component Structure

### Shared brand primitives

Create:

- `client/src/components/brand/BrandMark.tsx`
- `client/src/components/brand/BrandButton.tsx`
- `client/src/components/brand/BrandBadge.tsx`
- `client/src/components/brand/BrandCard.tsx`
- `client/src/components/brand/SectionHeading.tsx`
- `client/src/components/brand/StatCard.tsx`
- `client/src/components/brand/Wordmark.tsx`

These should hold the visual rules that are currently spread across page-local markup.

### Marketing section library

Create:

- `client/src/components/marketing/Hero.tsx`
- `client/src/components/marketing/ProofBar.tsx`
- `client/src/components/marketing/ProblemSection.tsx`
- `client/src/components/marketing/HowItWorksSection.tsx`
- `client/src/components/marketing/ComparisonMatrix.tsx`
- `client/src/components/marketing/PricingSection.tsx`
- `client/src/components/marketing/FaqSection.tsx`
- `client/src/components/marketing/FinalCta.tsx`

### Product components

Create or migrate toward:

- `client/src/components/product/StatusBadge.tsx`
- `client/src/components/product/PageHeader.tsx`
- `client/src/components/product/EmptyState.tsx`
- `client/src/components/product/MetricTile.tsx`

These should share brand tokens but stay operational in tone.

## Layout Structure

### Public shell

Keep one public shell for:

- header
- footer
- shared CTA logic
- page-section spacing

Primary files:

- `client/src/components/Header.tsx`
- `client/src/components/Footer.tsx`
- public route pages in `client/src/pages/*`

### Product shell

Keep the dashboard layout separate:

- side navigation
- app bar
- content chrome
- mobile nav

Primary files:

- `client/src/components/DashboardLayout.tsx`
- `client/src/components/AdminLayout.tsx`

The dashboard should inherit the new tokens without inheriting the full long-scroll landing-page treatment.

## Migration Plan

### Step 1

Build tokens and new brand primitives without deleting the existing M3 components.

### Step 2

Rewrite the public pages to the new section library.

### Step 3

Reskin shared shell components:

- header
- footer
- dashboard layout
- admin layout

### Step 4

Replace page-local hardcoded styling and remove dead M3 usage.

## Do Not Do

- Do not paste static HTML files into React pages.
- Do not keep both M3 and brand-token systems active long-term.
- Do not make the dashboard as visually loud as the homepage.
- Do not let public pages and product pages drift into separate brand identities.

## Practical First Targets

When implementation starts, the most leverage comes from:

1. `client/src/index.css`
2. `client/src/components/Header.tsx`
3. `client/src/components/Footer.tsx`
4. `client/src/pages/Home.tsx`
5. `client/src/components/DashboardLayout.tsx`
6. `client/src/pages/NewContractBuilder.tsx`

These files control the current theme mismatch most directly.

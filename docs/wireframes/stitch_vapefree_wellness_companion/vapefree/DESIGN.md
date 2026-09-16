---
name: VapeFree
colors:
  surface: '#fbf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#fbf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f0'
  surface-container: '#efeeeb'
  surface-container-high: '#eae8e5'
  surface-container-highest: '#e4e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#3e4947'
  inverse-surface: '#30312f'
  inverse-on-surface: '#f2f0ed'
  outline: '#6e7977'
  outline-variant: '#bec9c6'
  surface-tint: '#006a63'
  primary: '#006a63'
  on-primary: '#ffffff'
  primary-container: '#5baea5'
  on-primary-container: '#003f3a'
  inverse-primary: '#82d5cb'
  secondary: '#8d4d36'
  on-secondary: '#ffffff'
  secondary-container: '#fdaa8d'
  on-secondary-container: '#783c27'
  tertiary: '#3b6847'
  on-tertiary: '#ffffff'
  tertiary-container: '#7cab86'
  on-tertiary-container: '#113f23'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9ef2e7'
  primary-fixed-dim: '#82d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#ffb59c'
  on-secondary-fixed: '#390c00'
  on-secondary-fixed-variant: '#703621'
  tertiary-fixed: '#bcefc5'
  tertiary-fixed-dim: '#a1d2aa'
  on-tertiary-fixed: '#00210d'
  on-tertiary-fixed-variant: '#234f31'
  background: '#fbf9f6'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2df'
typography:
  headline-xl:
    fontFamily: Quicksand
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Quicksand
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-lg-mobile:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Quicksand
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Quicksand
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 24px
  gutter: 16px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system is centered on a supportive, non-clinical aesthetic that prioritizes psychological safety and positive reinforcement. The brand personality is that of a "calm companion"—avoiding the sterile, high-pressure environments typical of medical apps. 

The style is a blend of **Soft Minimalism** and **Organic Tactility**. It utilizes generous whitespace to reduce cognitive load and large border radii to evoke a sense of friendliness and approachability. Visual metaphors focus on growth and breath, moving away from "quit" or "stop" imagery toward "freedom" and "wellness."

## Colors
The palette is designed to lower cortisol levels. The primary colors are muted teals and soft greens, representing calm and natural growth. Instead of harsh reds for lapses or "failure" states, the system uses soft ochres or muted oranges to maintain a non-judgmental tone.

- **Primary (Teal):** Used for progress indicators and main navigational elements.
- **Secondary (Peach/Coral):** Used for celebratory moments and positive reinforcement.
- **Tertiary (Sage Green):** Used for secondary supportive actions and "safe space" content.
- **Background (Off-White):** A warm, cream-tinted neutral to reduce eye strain compared to pure white.
- **Success/State:** Transitions between teal and coral; no aggressive red-to-green binary.

## Typography
The typography uses **Quicksand** for its rounded terminals and open apertures, which communicate a friendly and approachable tone. For smaller UI labels and functional elements where legibility is paramount, **Plus Jakarta Sans** provides a clean, modern balance without losing the softness of the brand.

Headlines should use tighter letter-spacing to feel cohesive and "hugged." Body text requires generous line heights to ensure a relaxed reading experience, particularly for supportive articles or journaling prompts.

## Layout & Spacing
This design system employs a **Fluid Layout** with an emphasis on "Safe Margins." The UI should never feel cramped; the spacing rhythm follows an 8px base grid but prioritizes vertical "breathing room."

- **Mobile:** Single column with 24px horizontal margins to keep content centered and focused.
- **Tablet/Desktop:** Content is constrained to a maximum width of 600px for reading comfort, floating centrally in the viewport.
- **Negative Space:** Use high-value vertical padding (stack-lg) between distinct sections to prevent users from feeling overwhelmed by information.

## Elevation & Depth
Depth is created through **Ambient Shadows** and **Tonal Layers** rather than sharp lines.
- **Surfaces:** Cards use a pure white background against the off-white application background to create a subtle lift.
- **Shadows:** Use extremely diffused shadows with a slight teal or peach tint (`#5BAEA5` at 8% opacity) to make elements feel like they are floating softly on the page.
- **Gradients:** Subtle, linear gradients (e.g., Muted Teal to Sage) are used on primary surfaces to simulate a soft light source from the top-left, adding a sense of tactile dimension.

## Shapes
The shape language is defined by **Pill-shaped (3)** geometry. Sharp corners are avoided entirely to maintain the "non-clinical" and "soft" brand promise. 

- **Primary Buttons:** Fully rounded (pill) ends.
- **Cards/Modules:** Use the `rounded-xl` (1.5rem / 24px) setting to create a friendly, container-like feel.
- **Input Fields:** Large 1rem rounded corners to make interaction feel inviting rather than formal.

## Components
- **Buttons:** Primary buttons use a subtle gradient and a soft shadow. Interaction states should involve a gentle "press-in" scale effect (e.g., 0.98 scale) rather than a harsh color change.
- **Progress Trackers:** Circular or wave-based progress indicators are preferred over horizontal bars. Use the primary teal to show growth.
- **Cards:** Cards should have no borders; depth is conveyed entirely through the contrast between the surface color and the ambient shadow.
- **Input Fields:** Backgrounds should be a slightly darker shade of the neutral background (`#F0EDE9`) rather than a white box with a border. This makes the form feel "carved" into the page.
- **Chips/Badges:** Used for mood tracking or craving triggers. These should be large and easy to tap, using the tertiary sage green or secondary peach to indicate selection.
- **Positive Reinforcement Modals:** Use full-screen overlays with a soft backdrop blur and celebratory peach accents. Icons should be hand-drawn or soft-weighted line art.
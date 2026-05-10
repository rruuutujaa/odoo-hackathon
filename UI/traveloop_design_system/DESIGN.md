---
name: Traveloop Design System
colors:
  surface: '#f8f9fd'
  surface-dim: '#d9dade'
  surface-bright: '#f8f9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3f7'
  surface-container: '#edeef2'
  surface-container-high: '#e7e8ec'
  surface-container-highest: '#e1e2e6'
  on-surface: '#191c1f'
  on-surface-variant: '#594139'
  inverse-surface: '#2e3134'
  inverse-on-surface: '#eff1f5'
  outline: '#8d7168'
  outline-variant: '#e1bfb5'
  surface-tint: '#ab3500'
  primary: '#ab3500'
  on-primary: '#ffffff'
  primary-container: '#ff6b35'
  on-primary-container: '#5f1900'
  inverse-primary: '#ffb59d'
  secondary: '#585c7d'
  on-secondary: '#ffffff'
  secondary-container: '#d4d8fe'
  on-secondary-container: '#585d7e'
  tertiary: '#895032'
  on-tertiary: '#ffffff'
  tertiary-container: '#ce8968'
  on-tertiary-container: '#53240a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#832600'
  secondary-fixed: '#dee0ff'
  secondary-fixed-dim: '#c0c4ea'
  on-secondary-fixed: '#141936'
  on-secondary-fixed-variant: '#404564'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb693'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#6d391d'
  background: '#f8f9fd'
  on-background: '#191c1f'
  surface-variant: '#e1e2e6'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  sidebar-width: 280px
  card-padding: 24px
  section-gap: 48px
---

## Brand & Style
This design system targets high-end travelers who value both the emotional inspiration of a journey and the surgical precision of a well-organized itinerary. It balances the warmth of lifestyle photography with the rigorous efficiency of a productivity tool.

The visual direction is a **Hybrid Glassmorphism** style. It utilizes the "Airy" structural clarity of Notion, the high-performance "Command-K" efficiency of Linear, and the inviting, image-centric warmth of Airbnb. The interface feels light and breathable, utilizing layered depth to separate planning logic from inspirational content. Key characteristics include high-radius rounded corners, semi-transparent utility layers, and precision-engineered interactive elements.

## Colors
The palette is designed to create a "Premium Utility" feel. 

*   **Primary Orange (#FF6B35):** Used for primary actions, progress indicators, and active states to evoke energy and exploration.
*   **Deep Navy (#1A1F3C):** Provides the "Linear-style" grounding. Used for sidebars, high-contrast text, and precision accents to convey authority and stability.
*   **Soft Background (#F7F8FC):** A cool-tinted off-white that reduces eye strain and allows white cards to "pop" via subtle elevation.
*   **Gradients:** Use a linear transition from Primary Orange to a soft Peach (#FFB38F) for hero sections and premium feature highlights.

## Typography
The typography strategy prioritizes readability and structural hierarchy. 

**Plus Jakarta Sans** is used for headings to provide a friendly, open, and premium feel. Its geometric yet soft nature aligns with the 20px+ corner radii of the UI. **Inter** is used for all body text and UI controls to maintain a "SaaS-like" efficiency and neutrality. For technical data, flight numbers, or timestamps, **JetBrains Mono** is used sparingly as a label font to inject a sense of "Linear-style" precision.

Maintain generous vertical rhythm; headings should have significant top-margin to separate itinerary sections clearly.

## Layout & Spacing
This design system uses a **Fixed-Fluid Hybrid Grid**. Content is housed in a centered 1440px container for desktop viewing, while the sidebar remains fixed to the viewport.

*   **Rhythm:** Based on a 4px baseline grid. Most components use 12px, 16px, or 24px internal padding.
*   **Margins:** Desktop layouts use 48px side margins; mobile scales down to 16px.
*   **Sidebars:** The left-hand navigation is treated as a high-precision utility zone (Deep Navy or Glassmorphic White), providing a constant anchor for the more fluid, image-heavy content area.

## Elevation & Depth
Depth is the core differentiator of this design system. It avoids heavy, muddy shadows in favor of light and transparency.

1.  **Level 0 (Base):** Soft Background (#F7F8FC).
2.  **Level 1 (Cards):** Pure White (#FFFFFF) with a 2px "Ambient" shadow (4% opacity Navy) and a subtle 1px border (#E2E4ED).
3.  **Level 2 (Glass):** Used for Navbars and Floating Search. White at 70% opacity with a `backdrop-filter: blur(20px)`.
4.  **Level 3 (Popovers/Modals):** Stronger blur (40px) with a 10% opacity Deep Navy shadow to signify high priority.

Use layered depth to show "Travel Stacks"—where itinerary items appear to be physically layered on top of a map or destination image.

## Shapes
The shape language is extremely soft but mathematically precise. 

*   **Primary Containers:** Use a minimum of 20px (`rounded-2xl`) for cards and main content areas to mimic the friendly aesthetic of modern premium hardware.
*   **Buttons & Inputs:** Use 12px (`rounded-xl`) to maintain a distinct clickable feel while remaining softer than standard corporate UI.
*   **Search Bars:** Fully pill-shaped (`rounded-full`) to emphasize the "Floating" and dynamic nature of the search experience.

## Components
Consistent implementation of these components ensures the premium-efficiency balance:

*   **Floating Search Bar:** A pill-shaped, glassmorphic element that sits at the top of the viewport. It should use Lucide icons for "Search," "Location," and "Date" with subtle dividers between sections.
*   **Glassmorphism Navbar:** Top-aligned or sidebar-integrated. Use high blur and a thin white inner-stroke to define edges against varied travel imagery backgrounds.
*   **Modern Analytics Cards:** Used for budget tracking or travel stats. These should feature clean, thin-stroke line charts using the Primary Orange, with JetBrains Mono for data points.
*   **Elegant Sidebar:** A Deep Navy (#1A1F3C) or ultra-minimal White sidebar with 16px Lucide-style icons. Active states should use a subtle vertical orange pill indicator on the left.
*   **Buttons:** Primary buttons use the Orange-to-Peach gradient with white text. Secondary buttons are Deep Navy with white text. Ghost buttons use a 1px Navy or Light Gray border.
*   **Input Fields:** Minimalist with floating labels. Focus states should trigger a 2px Primary Orange glow and a slight lift in elevation.
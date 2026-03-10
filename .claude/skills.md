---
name: frontend-design
description: Create immersive, premium Pokémon-inspired frontend interfaces. Builds atmospheric UI with type-reactive color systems, holographic card effects, cinematic Pokédex aesthetics, and dynamic energy fields. No generic SaaS vibes.
---

This skill creates **Pokémon-inspired** premium frontend interfaces. Every component should feel like holding a holographic Charizard card under light for the first time — rare, luminous, alive. Think Pokédex terminals, championship arenas, legendary encounters, and collector-grade presentation.

KF Company builds Pokémon display and discovery apps. The UI must reflect that identity: **electric, vivid, holographic, epic**.

## Design DNA

Every interface must embody these principles:

### Dark-First — Digital Arena
- Deep dark bases (`#050810`, `#08101A`, `#0D1520`) — NEVER flat black
- NEVER white backgrounds. NEVER light mode defaults.
- Depth through layered dark surfaces with type-reactive glows, holographic borders, and electric glassmorphism

### Color Language — Type-Reactive System
- **Electric accent**: Vivid yellow-gold (`#FFD700` base, `#FFE840` bright, `#FFF176` light) — active states, accents, Pikachu-energy CTAs
- **Fire glow**: `#FF6B35` / `#FF4500` — fire-type Pokémon, danger states, legendary highlights
- **Water shimmer**: `#00B4D8` / `#0077B6` — water-type, calm info states
- **Psychic haze**: `#C77DFF` / `#9B59B6` — psychic/ghost-type, mystery, rare encounters
- **Shadow dark**: `#1A1A2E` — containers, elevated surfaces
- **Cream text**: `#F0ECE3` — headings, primary text
- **Muted text**: `#8899AA` — body, secondary
- Colors must GLOW. Use multi-layer `box-shadow` (4+ layers), `text-shadow` for energy text, `filter: drop-shadow()` on Pokémon sprites. Glows must be VISIBLE and match Pokémon type.

### Dynamic Type-Coloring
- Each Pokémon card/display must inherit its TYPE's color as its dominant glow
- Fire types → orange/red halos. Water → cyan shimmer. Electric → yellow pulses. Psychic → purple mist. Dragon → indigo fire. Ghost → eerie green.
- Type badges: pill-shaped, semi-transparent, glowing background matching type color

### Typography — Technical & Epic
- Display/headers: **Rajdhani** or **Orbitron** (600-700 weight) — the primary display font for titles, Pokédex numbers, stat labels
- Body: **DM Sans** or **Nunito** — clean, friendly, readable
- Mono: **JetBrains Mono** — for stats, IDs, base power numbers
- NEVER: Inter, Roboto, Arial, system fonts, or anything generic
- Uppercase + letter-spacing on type labels. Orbitron for Pokédex numbers (#0001 format).

## UI Patterns — Pokédex Terminal, Not Web UI

### Containers & Cards
- `holo-card` class: holographic glassmorphism with rainbow shimmer on hover, inner type-glow, and luminous border
- Rounded corners (`rounded-2xl`) — modern, not sharp
- Thin luminous borders matching Pokémon type color at 15% opacity, intensifying on hover
- Subtle scanline texture at 3% opacity for digital-terminal depth
- Card flip animations revealing stats on reverse

### Holographic Card Effect (CRITICAL)
- On hover: rainbow gradient sweep across card (`linear-gradient` with hue-rotate animation)
- Tilt effect with `perspective(800px) rotateX() rotateY()` following cursor
- Prismatic border: `border-image` with conic-gradient cycling through spectrum
- Foil shimmer: animated `background-position` on metallic gradient overlay
- This is the SIGNATURE interaction — make it extraordinary

### Pokémon Display
- Sprites/artwork with type-colored `drop-shadow` glow (3-4 layers)
- Entrance animation: Pokémon materializes from energy ball (scale 0 + blur → scale 1 + sharp)
- Idle animation: gentle floating (`translateY` -6px loop), subtle breathing glow pulse
- Shiny variants: gold sparkle particles orbiting the sprite
- 3D model support: `canvas` with Three.js for featured/legendary Pokémon

### Stat Bars
- Animated progress bars filling on reveal with spring easing
- Color-coded: low stats (red) → mid (yellow) → high (green/blue) → maxed (gold shimmer)
- Numbers count up with spring animation on entry
- Comparison mode: dual bars overlaid for side-by-side Pokémon comparison

### Buttons & Interactive Elements
- Primary CTA: electric yellow gradient, pulsing glow ring, `CATCH` energy on hover
- Type filter buttons: each glows its own type color on active
- Hover states: glow intensifies, card lifts (-6px), shimmer sweep, border brightens
- Pokéball loader: animated SVG Pokéball spinning and opening

### Decorative Elements — Pokémon World
- **Energy fields**: radial gradients pulsing outward from legendary Pokémon
- **Particle systems**: type-colored energy sparks (fire crackling, water droplets, electric arcs)
- **Pokédex scanner lines**: horizontal scan effect sweeping across cards on load
- **Star/space backgrounds**: for legendary/mythical sections — cosmic depth
- **Terrain elements**: subtle grass texture, ocean waves, or cave crystals matching Pokémon habitat
- **Evolution chains**: connected node diagrams with glowing arrows

### Animations & Motion
- **Card reveal**: Pokéball throw → open → Pokémon materializes (3-step sequence)
- **Hover**: Holographic tilt + rainbow shimmer + glow intensification
- **Type change**: Smooth background color transition when switching Pokémon
- **Battle enter**: Dramatic slide-in from sides with energy burst
- **Shiny encounter**: Screen flash → gold particle explosion → sparkle idle
- **Transitions**: Smooth 400-800ms. Spring physics. Cinematic, not snappy.
- Use Framer Motion for React animations. CSS for ambient loops.

### Backgrounds & Atmosphere
- Never flat solid colors. Build depth:
  - Radial glow pools matching featured Pokémon's type
  - Subtle hexagonal grid pattern at 4% opacity (Pokédex aesthetic)
  - Floating type-energy particles (30-50, randomized)
  - Noise grain texture at 3% opacity for depth
- Background should feel like a **glowing Pokédex terminal in a dark room** or **standing in an arena before a legendary battle**

### Pokédex Grid & Layout
- Masonry or CSS Grid with variable card sizes — legendary Pokémon get featured large cards
- Filter bar: animated type-pill filters with glow on active
- Search: real-time filtering with Pokémon sprite previews
- Generation sections: styled as "discovered regions" with habitat-themed separators

## What to AVOID — The "Generic" Blacklist

NEVER produce interfaces that look like:
- Any existing Pokémon website (Bulbapedia, Serebii, official site) — be MORE premium
- SaaS dashboards with white backgrounds and gray cards
- "Gaming site" aesthetics with aggressive gradients and no refinement
- Flat black backgrounds without atmosphere
- Invisible glows (make them VIVID — this is Pokémon, not a bank app)
- Generic card grids that ignore type-theming
- Missing holographic effects on cards (this is NON-NEGOTIABLE)

If it doesn't feel like **a luxury collector's Pokédex from 2087**, START OVER.

## Implementation Standards

- Production-grade, working code — not mockups
- Responsive by default (mobile-first — Pokémon fans browse on phone)
- Accessible: proper contrast, focus states (type-colored glow rings), semantic HTML, alt text on sprites
- Performance: CSS animations for ambient, Framer Motion for interactions, `will-change` on animated elements, lazy-load sprites
- Use CSS custom properties for type color system
- Google Fonts via `next/font/google` for typography

## The Vibe Check

Before submitting any interface, ask: **"Does this feel like unboxing a holographic Charizard EX from a sealed pack?"**

If the answer isn't an immediate yes — add more type-reactive glow, more holographic shimmer, more Pokémon energy. The users are collectors and fans. The UI should make every Pokémon feel legendary.
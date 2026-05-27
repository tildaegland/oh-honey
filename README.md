# Oh Honey

A fictional local honey webshop concept built as a front-end showcase project.

Oh Honey started as an exploration of AI-assisted visual creation and SVG animation, then evolved into a complete single-page brand experience with multiple content sections, responsive navigation, and a custom loading intro.

[Live preview](https://tildaegland.github.io/oh-honey/)


## Project story

This project began with two creative experiments:

1. A generated hero visual for a honey brand concept.
2. An animated SVG logo reveal.

Instead of treating those as isolated assets, I expanded the idea into a full fictional webshop/brand website. The final result focuses on atmosphere, storytelling, and presentation quality, with the animation used as a branded loading screen and the visual system applied across the full page.

## What the site includes

- Branded loading screen with SVG logo animation.
- Hero section with responsive image sources and strong visual identity.
- Fully styled content sections for Shop, About, Recipes, and Visit.
- Mobile-friendly navigation with a menu toggle and click-outside behavior.
- Smooth transition from intro overlay to visible site content.
- Footer with contact details, quick links, and social links.

## Tech stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-663399?style=for-the-badge&logo=css&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

- Vite
- TypeScript
- SCSS (modular partial structure)
- GSAP (animation timeline and motion control)

## Key implementation details

- Intro animation is controlled in TypeScript using GSAP timelines.
- Motion behavior respects reduced-motion user preferences.
- Navigation adapts at mobile breakpoint and updates aria attributes for accessibility.
- Styling is organized into SCSS partials for sections and layout components.

## Why this project is in my portfolio

Oh Honey represents how I work from concept to polished UI:

- Translating an initial visual idea into a complete product direction.
- Turning a standalone SVG animation into purposeful interaction design.
- Building a cohesive front-end with reusable structure and consistent brand tone.
- Practicing realistic content architecture for future webshop projects.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```

## Future improvements

- Add product cards and filtering for a more realistic shop flow.
- Connect to a small CMS or JSON data source for editable content.
- Expand animation states with scroll-triggered section reveals.
- Add automated tests for menu behavior and core interactions.

## Credits

- Brand concept, layout direction, and front-end implementation: Tilda Egland
- Visual concept based on AI-assisted image generation and custom SVG animation work

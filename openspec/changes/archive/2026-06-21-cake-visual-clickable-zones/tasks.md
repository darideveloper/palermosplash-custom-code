## 1. Gitignore

- [x] 1.1 Add `backups` entry to `.gitignore`

## 2. Create palermo-cake directory and files

- [x] 2.1 Create `palermo-cake/palermo-cake.css` file
- [x] 2.2 Create `palermo-cake/palermo-cake.js` file

## 3. CSS: Cake image positioning

- [x] 3.1 Set `#cake-parts img` with fixed positioning at bottom center, centered via `left: 50%; transform: translateX(-50%)`
- [x] 3.2 Add `.horizontal #cake-parts img` rule with `height: 100vh; width: auto`
- [x] 3.3 Add `.vertical #cake-parts img` rule with `height: 90%; width: auto`

## 4. CSS: Glow effects

- [x] 4.1 Add `#cake-parts .glow img` with `opacity: 0; z-index: 1; transition: all 1s ease-in-out`
- [x] 4.2 Add `#cake-parts .glow.visible img` with `opacity: 1; animation: zoomer 2s linear infinite`

## 5. CSS: Button positioning — horizontal

- [x] 5.1 Style `.cake-button` as fixed, centered, 53vw wide, 11vh tall, z-index 3
- [x] 5.2 Add `.horizontal .cake-button#button-1` at `bottom: 24vh`
- [x] 5.3 Add `.horizontal .cake-button#button-2` at `bottom: 35vh`
- [x] 5.4 Add `.horizontal .cake-button#button-3` at `bottom: 46vh`
- [x] 5.5 Add `.horizontal .cake-button#button-4` at `bottom: 58vh`
- [x] 5.6 Add `.horizontal .cake-button#button-5` at `bottom: 70vh`

## 6. CSS: Button positioning — vertical

- [x] 6.1 Override `.vertical .cake-button` with full-width (100vw) and adjusted transform
- [x] 6.2 Add `.vertical .cake-button#button-1` at `bottom: 9vh`
- [x] 6.3 Add `.vertical .cake-button#button-2` at `bottom: 19vh`
- [x] 6.4 Add `.vertical .cake-button#button-3` at `bottom: 30vh`
- [x] 6.5 Add `.vertical .cake-button#button-4` at `bottom: 41vh`
- [x] 6.6 Add `.vertical .cake-button#button-5` at `bottom: 52vh`

## 7. CSS: Text overlay layer

- [x] 7.1 Add `.texts` style with `mix-blend-mode: darken; z-index: 2`

## 8. JS: Orientation detection

- [x] 8.1 Wait for `DOMContentLoaded`
- [x] 8.2 Implement `updateOrientation()`: compare `window.innerWidth >= window.innerHeight`, toggle `.horizontal`/`.vertical` on `<body>`
- [x] 8.3 Call `updateOrientation()` on load
- [x] 8.4 Bind `updateOrientation()` to `window.resize` event

## 9. JS: Dynamic button generation

- [x] 9.1 Loop 1–5, create `div.cake-button` with ID `button-{i}`
- [x] 9.2 For each button, query `#glow-{i}` for corresponding glow element
- [x] 9.3 Add `mouseenter` handler: add class `visible` to glow element
- [x] 9.4 Add `mouseleave` handler: remove class `visible` from glow element
- [x] 9.5 Append each button to `<body>`

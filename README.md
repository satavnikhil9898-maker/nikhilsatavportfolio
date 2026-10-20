# Nikhil Satav — Portfolio

Personal portfolio of **Nikhil Satav**, Senior Product Designer (B2B SaaS · Enterprise).

The site is a single, dependency-free static page: plain HTML, CSS and JavaScript, with no build step.

## Sections

- **Hero.** "I turn chaos into clarity". Move the cursor to reveal the clean solution under each messy problem. You can also choose *Reveal everything*.
- **Selected work.** Five case-study cards (ADDA ERP, Vendor Portal, TTD CCC dashboard, TTD helpdesk, ARM dashboard).
- **My design process.** An interactive, chaptered "video" walkthrough of how I design with Claude, Figma MCP and a design system.
- **Contact.** WhatsApp and email cards with a copy-to-clipboard email address.
- **Light / dark theme toggle**, plus `prefers-reduced-motion` support.

## Project structure

```
.
├── index.html              # Page markup (rendered from a <template>)
├── case0N-*.html           # Five case study pages
├── css/
│   └── styles.css          # Theme tokens, hover states, animations
├── js/
│   ├── runtime.js          # Tiny template engine ({{ }}, <sc-if>, <sc-for>)
│   ├── app.js              # Page component: state, handlers, bindings
│   └── case0N-*.js         # One component per case study page
├── assets/
│   └── images/             # Case-study thumbnails (.webp)
├── firebase.json           # Firebase Hosting config
└── .firebaserc             # Firebase project alias
```

### How rendering works

`index.html` holds the page markup inside `<template id="dc-template">`.
`js/runtime.js` reads that template, resolves `{{ expression }}` bindings, the `<sc-if>` and `<sc-for>` blocks and the `onClick="{{handler}}"` style events against the values returned by `Portfolio.renderVals()` in `js/app.js`, and renders the result into `<div id="app">`. Calling `setState()` re-renders the page on the next animation frame.

To edit **content or layout**, change the markup in `index.html`. To edit **behaviour or data** (hero words, process chapters, contact logic), change `js/app.js`.

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
# Python
python3 -m http.server 8080

# or Firebase emulator
firebase serve
```

Then visit http://localhost:8080.

## Deploy (Firebase Hosting)

```bash
npm install -g firebase-tools   # once
firebase login                  # once
firebase deploy --only hosting
```

The hosting root is the repository root (`"public": "."` in `firebase.json`).

## Case study pages

Each work card on the home page opens its case study page, and each page's *Back to portfolio* button returns to the work section (`index.html#work`). Every page renders with `js/runtime.js` plus its own component script in `js/`, and its images live in `assets/images/`:

- `case01-custom-fields.html`
- `case02-vendor-portal.html`
- `case03-ttd-ccc.html`
- `case04-ttd-helpdesk.html`
- `case05-arm-dashboard.html`

## Contact

- Email: [satavnikhil9898@gmail.com](mailto:satavnikhil9898@gmail.com)
- WhatsApp: [+91 72186 77696](https://wa.me/917218677696)

---

© Nikhil Satav. All rights reserved.

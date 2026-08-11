# JO / ZGRF — Interactive Portfolio

Static portfolio built with plain HTML, CSS and JavaScript.

## Structure

- `index.html` — page structure and content
- `style.css` — visual system, responsive layout and motion styling
- `script.js` — cursor physics, magnetic buttons, image tilt, scroll reveal and canvas field
- `assets/portrait.webp` — supplied portrait image
- `assets/visual-study.webp` — supplied visual artwork
- `vercel.json` — minimal static deployment configuration

## Run locally

Open `index.html` directly, or serve the folder with any static server.

Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy to Vercel

Import the folder/repository as a static project. No build command or framework preset is required.

## Design direction

The visual language intentionally combines:
- editorial / brutalist typography
- black, off-white and signal-red palette
- asymmetric/broken grid
- tactile image treatment
- kinetic type and marquee motion
- pointer-reactive interactions
- reduced-motion fallback

The supplied images are used as actual portfolio assets. Project labels are intentionally framed as visual studies rather than invented client work.

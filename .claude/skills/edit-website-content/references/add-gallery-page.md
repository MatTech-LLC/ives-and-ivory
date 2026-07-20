# Adding a new gallery event (with its own detail page)

This is the multi-step case: a new event that gets a **card on the Gallery
page** and its **own detail page** with a set of photos (like "Night Before
Cliffside Soirée"). It touches three places that must agree, so go carefully and
rebuild at the end.

Use the existing cliffside event as your working template throughout:
`src/pages/gallery-cliffside.html`, its card in `src/pages/gallery.html`, and
its entry in `scripts/build.mjs`.

## Step 1 — add the photos

Put the event's images in `assets/`. Use clear, lowercase, hyphenated names,
e.g. `gallery-tuscan-vineyard-1.jpg`. Flag any very large files (> ~1.5 MB) to
the owner and offer to resize.

## Step 2 — create the detail page

Create `src/pages/gallery-<slug>.html` (e.g. `gallery-tuscan-vineyard.html`).
Copy `src/pages/gallery-cliffside.html` as the starting point and change:

- the `<h1>` title and the location line beneath it;
- the `<img>` tags inside the `column-count` container — one per photo, each
  with a meaningful `alt`. Keep the same inline styles as the example so the
  masonry layout works.

The "← Back to Gallery" link stays as is.

## Step 3 — register the page in the build script

Open `scripts/build.mjs` and add an entry to the `pages` array (copy the
cliffside entry and edit it):

```js
{
  file: 'gallery-tuscan-vineyard.html',            // matches Step 2 filename
  out: 'gallery/tuscan-vineyard/index.html',       // the folder path on the site
  path: '/gallery/tuscan-vineyard',                // the public URL
  active: 'gallery',                                // keeps "Gallery" highlighted in the nav
  title: 'Tuscan Vineyard Wedding | Gallery | Ives & Ivory Events',
  description: 'Short one-line description for Google/social previews.',
},
```

`file`, `out`, and `path` must be consistent with each other and with the
filename from Step 2. A mismatch here is the most common way this breaks — a
page silently won't build, or won't be reachable. Double-check them.

## Step 4 — add the card on the Gallery page

In `src/pages/gallery.html`, add a linking card in the `gallery-grid`. Copy the
cliffside card (the `<a class="gallery-card" href="...">` block) and update the
`href` to the new `path`, the teaser `<img>` (`src` + `alt`), the `<h3>` title,
and the location line.

## Step 5 — verify

```bash
npm run build
```

Confirm the output includes a line like `wrote gallery/tuscan-vineyard/index.html`.
Then:

```bash
npm run preview
```

Check three things at `http://localhost:4173`: the new card shows on `/gallery`,
clicking it opens the detail page, and all photos load. Fix and rebuild if
anything is off, then hand back to the owner and offer to publish.

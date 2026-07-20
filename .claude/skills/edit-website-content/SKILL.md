---
name: edit-website-content
description: >-
  Use this skill for any edit to the Ives & Ivory Events website's visible
  content — changing wording/copy on a page, swapping or adding a photo,
  updating the footer (phone, email, social links), editing testimonials, or
  adding a new gallery event. Trigger whenever the user asks to "change the
  text", "update the About/Services/Home page", "fix a typo", "replace/add a
  photo or image", "add a gallery event", "update the phone number", or
  similar edits to what visitors see. This is the default skill for everyday
  website edits. Do NOT use it for the inquiry/contact form fields (use
  edit-inquiry-form) or for putting changes live (use publish-website).
---

# Editing Ives & Ivory website content

This site is assembled by a build script — you **edit source files in `src/`,
then rebuild**. Never edit `dist/` (it's regenerated and git-ignored). Read
`CLAUDE.md` in the repo root if you haven't this session; it has the full map.

The owner is non-technical. Make the smallest change that satisfies the
request, keep the surrounding style, verify with a build + preview, and explain
what you changed in plain language.

## Where the content lives

Body content of each page is in `src/pages/`:

| Page | File | URL |
|------|------|-----|
| Home | `src/pages/index.html` | `/` |
| About | `src/pages/about.html` | `/about` |
| Services | `src/pages/services.html` | `/services` |
| Gallery | `src/pages/gallery.html` | `/gallery` |
| Gallery event (example) | `src/pages/gallery-cliffside.html` | `/gallery/night-before-cliffside` |
| Contact | `src/pages/contact.html` | `/contact` |
| Testimonials | `src/pages/testimonials.html` | `/testimonials` |

Shared pieces are in `src/partials/`:

- `footer.html` — phone, email, Instagram link, "As Featured In", copyright year.
- `header.html` — top navigation links.
- `head.html` — page `<title>`/description come from the `pages` array in
  `scripts/build.mjs`, **not** from here; per-page SEO text is edited there.

Page titles and meta descriptions (what shows in Google results and browser
tabs) live in the `pages` array at the top of `scripts/build.mjs`, one entry
per page.

## How to make a text edit

1. Find the right file from the table above.
2. Edit the wording in place, preserving the existing tags and inline `style`
   attributes around it. Don't restyle unless asked.
3. Rebuild and preview (see "Verify" below).

## How to change or add a photo

Images live in `assets/` and are referenced as `/assets/<filename>` in the HTML.

- **Replacing an existing photo:** the simplest, safest option is to save the
  new image into `assets/` under the **same filename** the page already uses —
  no HTML change needed. If it has a different name, update the matching
  `src="/assets/..."` in the relevant page file.
- **Adding a new photo:** put the file in `assets/`, then add an `<img>` in the
  page. Copy the structure of a nearby existing `<img>` (same wrapper `div`,
  same inline styles) so it matches the design. Always give it a meaningful
  `alt` describing the photo.
- **Keep files reasonable.** These are wedding photos and can be large. If a new
  photo is very large (say over ~1.5 MB), mention it to the owner — large images
  slow the page down. You can offer to resize it.
- After swapping images, always rebuild so `assets/` is copied fresh into
  `dist/`.

## Gallery specifics

The Gallery page (`src/pages/gallery.html`) is a grid of cards. Two kinds exist:

- **Placeholder cards** — a `<div class="gallery-placeholder">` with a text
  label instead of a photo, plus a title and location.
- **Photo cards that link to a detail page** — an `<a class="gallery-card"
  href="/gallery/...">` containing an `<img>`, title, and location. See the
  "Night Before Cliffside Soirée" card as the working example.

To turn a placeholder into a real photo card, or to **add a brand-new gallery
event with its own page**, follow `references/add-gallery-page.md` — that flow
touches `scripts/build.mjs` and needs care.

## Verify (do this after every change)

```bash
npm run build      # must end with "Build complete → dist/" and no errors
npm run preview    # opens http://localhost:4173 — check the page you changed
```

If the build errors, read the message — it usually names the file. Fix and
rebuild before telling the owner it's done.

## When you're done

Summarize the change in plain language (which page, what changed) and offer to
publish it with the `publish-website` skill. Don't push to the live site
without the owner's go-ahead.

# Ives & Ivory Events — project guide for Claude

This is the marketing website for **Ives & Ivory Events**, a boutique wedding
and event planning company. The owner is **non-technical** and makes edits by
asking you (Claude) in plain language. Your job is to make the change they ask
for, keep the site working, and explain what you did in everyday terms — not
jargon. When something is risky or ambiguous, ask before acting.

## How the site is built (read this first)

This is a **static site with one small backend function**. There is no
framework (React, Next, etc.). A short Node script stitches HTML pieces
together into finished pages.

- **`src/pages/*.html`** — the body content of each page (Home, About,
  Services, Gallery, Contact, Testimonials). **This is where almost all edits
  happen.**
- **`src/partials/*.html`** — shared pieces reused on every page:
  - `header.html` — top navigation
  - `footer.html` — footer (social links, email, phone, copyright)
  - `head.html` — `<head>` metadata + Google Analytics tag
  - `inquiry-form.html` — the contact/inquiry form (used on Home and Contact)
  - `scripts.html` — the browser JavaScript (menu toggle + form submission)
- **`src/styles.css`** — all styling for the whole site.
- **`assets/`** — images (logo, photos, social-share image).
- **`scripts/build.mjs`** — the build script. It reads the `pages` list at the
  top, injects the shared partials, and writes finished HTML into `dist/`.
- **`api/inquiry.js`** — a Vercel serverless function that receives inquiry-form
  submissions and appends them as a row to a Google Sheet.
- **`api/inquiry-schema.js`** — the single source of truth for the inquiry
  form's fields and their matching Google Sheet columns.
- **`dist/`** — the generated output. **Never edit `dist/` by hand** — it is
  deleted and rebuilt on every build, and it is git-ignored. Edit `src/`
  instead.

**Build flow:** `src/` + `assets/` → `npm run build` → `dist/` → deployed by
Vercel. So the rule of thumb is: **edit files in `src/`, then rebuild.**

## Common commands

```bash
npm install        # once, to install dependencies
npm run build      # build the site into dist/
npm run preview    # serve dist/ at http://localhost:4173 to preview locally
```

There is no automated test suite. "Verify" here means: run `npm run build`
(it must finish with `Build complete → dist/` and no errors), then open the
preview and look at the page you changed.

## How changes go live

The site is hosted on **Vercel** and connected to this GitHub repo:

- Any branch / open pull request gets an automatic **preview deployment** (a
  private URL for that change) — use it to let the owner confirm before shipping.
- Merging a pull request into **`main`** triggers the **production deployment**
  (the live site).

So "publishing" = getting the change committed, pushed to a branch, previewed,
and merged to `main`. See the `publish-website` skill for the exact steps.

Live site: `https://ives-ivory-events.mattech.fyi`

**Owner-facing docs** (point the non-technical owner here when useful):
`README.md`, `docs/GETTING-STARTED.md` (how the site works + how to edit), and
`docs/how-changes-go-live.md` (Git, pull requests, Vercel preview vs.
production, in plain language).

## Editing conventions (match the existing style)

- The pages use a lot of **inline `style="..."`** attributes and a few shared
  CSS classes (`.serif-h`, `.eyebrow`, `.container`, `.gallery-card`, etc.).
  When you add markup, copy the pattern of the surrounding elements rather than
  inventing a new style — it keeps the design consistent.
- Write ampersands in text as `&amp;` and apostrophes/quotes as normal — follow
  what neighboring lines already do.
- Keep every `<img>` tag's `alt` text meaningful (it matters for accessibility
  and SEO).
- Fonts are Cormorant Garamond, Jost, and Playfair Display (loaded from Google
  Fonts in `head.html`). The palette is warm cream (`#fffdfa` / `#f4f1eb`) with
  a slate blue accent (`#7a9cc6`) and dark navy text (`#1c2b3d`).

## Guardrails — be careful around these

These are the places where a well-meaning edit can quietly break the live site
or leak secrets. Slow down and confirm with the owner before changing them.

1. **`scripts/build.mjs`** — the `pages` array registers every page. Adding or
   renaming a page means editing this list. A typo here can drop a page from the
   build. Always rebuild and confirm the page still writes.
2. **The inquiry form** (`src/partials/inquiry-form.html`,
   `api/inquiry.js`, `api/inquiry-schema.js`, and the form JS in
   `src/partials/scripts.html`). These four must stay in sync — the browser
   field names, the server validation, and the Sheet columns all reference each
   other. Use the `edit-inquiry-form` skill; changing one file alone will drop
   or misplace real customer inquiries.
3. **Secrets / environment variables.** The Google Sheets integration relies on
   `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, and `GOOGLE_SHEET_ID`,
   set in Vercel's project settings (and locally in a git-ignored `.env` that is
   never committed). Never print these values, never commit them, and never
   paste a private key into a file that gets pushed.
4. **Analytics tag** (`G-...` in `src/partials/head.html`) — leave it unless the
   owner explicitly asks to change tracking.
5. **`dist/`, `node_modules/`, `.vercel/`, `.env*`** — all generated or secret;
   never hand-edit or commit them (they are git-ignored).

## Working style for this repo

- Prefer the smallest change that satisfies the request.
- After any content or code change, run `npm run build` to prove it still
  builds, and offer to show a local preview.
- Explain what you changed and where in plain language, since the owner will
  read it. Avoid unexplained jargon.
- Follow the branch/commit/publish steps in the `publish-website` skill —
  don't push straight to `main` without the owner's say-so.

# Ives & Ivory Events — Website

This is the website for **Ives & Ivory Events**. It's a small, fast website
that you can keep updating over time — mostly by **just asking Claude** to make
the change for you in plain English.

Live site: **https://ives-ivory-events.mattech.fyi**

> **The site is already set up and hosted.** You don't need to configure
> hosting or connect anything — publishing happens automatically through Git.
> Just start editing.
>
> **New here? Start with these guides:**
> - **[Getting Started](./docs/GETTING-STARTED.md)** — how the site works and
>   how to edit it, written for non-technical readers.
> - **[How Changes Go Live](./docs/how-changes-go-live.md)** — a plain-language
>   explanation of Git, pull requests, and preview vs. live versions.
>
> *(There's also a [Vercel setup guide](./docs/connect-to-vercel.md), but it's
> reference-only for whoever manages hosting — you won't need it.)*

---

## The short version (if you read nothing else)

- You don't need to know how to code. Open this project in Claude and describe
  what you want changed — for example, *"Change the tagline on the home page to
  …"* or *"Add a new photo to the gallery."*
- Claude has a built-in guide for this project (a file called `CLAUDE.md`) plus
  step-by-step **skills** for the common tasks, so it already knows how the site
  is put together and how to avoid breaking things.
- After Claude makes a change, ask it to **build and preview** so you can see it
  before it goes live.
- When you're happy, ask Claude to **publish** it. The live site updates
  automatically within a couple of minutes.

---

## What you can ask Claude to do

Here are the everyday tasks, and the skill Claude uses for each. You don't have
to name the skill — Claude picks the right one from what you ask. These names
are just so you know what's covered.

| You want to… | Just say something like… | Skill Claude uses |
|---|---|---|
| Change wording on a page | *"Update the About page — change 'nearly eight years' to 'over eight years.'"* | `edit-website-content` |
| Swap or add a photo | *"Replace the founder headshot with the new photo I added to `assets/`."* | `edit-website-content` |
| Add a new gallery event | *"Add a new gallery event called 'Tuscan Vineyard Wedding' with these photos."* | `edit-website-content` |
| Change a testimonial | *"Add a testimonial from Jordan to the testimonials page."* | `edit-website-content` |
| Change the contact/inquiry form | *"Add a 'Preferred contact method' question to the inquiry form."* | `edit-inquiry-form` |
| Update footer info | *"Update the phone number in the footer to …"* | `edit-website-content` |
| Put changes live | *"Publish these changes to the live site."* | `publish-website` |

**A tip that makes edits much easier:** tell Claude to *show you a preview*
before publishing. It can build the site and open a local preview so you can
check it looks right first.

---

## How the site is structured

You mostly don't need this — but here's the map, in plain terms.

- **`src/pages/`** — the words and layout of each page (Home, About, Services,
  Gallery, Contact, Testimonials). **This is where most edits happen.**
- **`src/partials/`** — pieces shared across every page: the top menu
  (`header.html`), the footer (`footer.html`), and the inquiry form
  (`inquiry-form.html`).
- **`src/styles.css`** — the colors, fonts, and spacing for the whole site.
- **`assets/`** — the images (logo, photos). Drop a new photo here and tell
  Claude to use it.
- **`api/`** — the small bit of behind-the-scenes code that saves inquiry-form
  submissions into a **Google Sheet**.
- **`scripts/build.mjs`** — the "assembler" that turns the pieces above into the
  finished website.
- **`dist/`** — the finished website the assembler produces. **Don't edit this
  by hand** — it gets regenerated every time.

### Where do inquiry submissions go?

When someone fills out the inquiry form, their answers are appended as a new row
in a **Google Sheet**. That connection is configured with private credentials
stored securely in Vercel (the hosting service) — they are never part of this
project's files. If the form ever stops saving submissions, that's the first
thing to check with whoever manages the Vercel account.

---

## How the site goes live (hosting)

The site is already hosted on **Vercel** and connected to this project's GitHub
repository — **that setup is done, and you never have to touch it.** Everything
happens through Git: whenever changes reach the **main** branch (by merging a
pull request), Vercel automatically rebuilds and publishes the live site —
usually within a minute or two. There's no "deploy" button to press and no
dashboard to log into; asking Claude to **publish** takes care of everything.

Before a change is live, Vercel also builds a private **preview deployment** for
the pull request — a real URL showing just that change, so you can check it
without affecting visitors. The full walkthrough of branches, pull requests, and
preview vs. production deployments is in
**[How Changes Go Live](./docs/how-changes-go-live.md)**.

---

## For a developer (optional / technical)

Static site assembled by a Node build script; deployed on Vercel with one
serverless function.

```bash
npm install        # install dependencies
npm run build      # build src/ + assets/ into dist/
npm run preview    # serve dist/ at http://localhost:4173
```

- No framework; `scripts/build.mjs` injects `src/partials/*` into
  `src/pages/*` and writes `dist/`. Page routes are registered in the `pages`
  array at the top of that script.
- `api/inquiry.js` validates form input and appends a row to a Google Sheet
  via a service account. Required env vars: `GOOGLE_SERVICE_ACCOUNT_EMAIL`,
  `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID` (set in Vercel; locally in a
  git-ignored `.env`). `api/inquiry-schema.js` is the single source of truth
  mapping form fields → Sheet columns.
- Project conventions and guardrails for AI-assisted edits live in
  **`CLAUDE.md`**; task-specific playbooks live in **`.claude/skills/`**.

---

## Getting help

If something looks broken on the live site and Claude can't sort it out, contact
whoever manages the Vercel and GitHub accounts for this project. Nothing you do
in a preview affects the live site until you publish, so it's safe to experiment.

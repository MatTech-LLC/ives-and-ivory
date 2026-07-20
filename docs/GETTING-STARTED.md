# Getting Started — Editing the Ives & Ivory Website

Welcome! You're now looking after the **Ives & Ivory Events** website. The good
news: you don't need to know how to code. You'll make changes by **asking Claude
in plain English**, previewing the result, and then publishing it.

This guide walks you through how the site is put together, how to make your first
edit, and how to get it live. It's written for someone brand new to this.

Companion guide: once you've got the hang of editing, read
**[How Changes Go Live](./how-changes-go-live.md)** for a friendly explanation
of the behind-the-scenes tools (Git, pull requests, and Vercel previews).

> **Hosting is already set up — nothing to configure.** The site is live at
> `ives-ivory-events.mattech.fyi` and connected to this project through Git, so
> publishing happens automatically when changes are merged. You don't need to
> connect Vercel or set anything up. Just start editing.

---

## 1. What this website is

It's the marketing site for Ives & Ivory Events. Visitors can read about the
business, browse a gallery of past celebrations, and send an inquiry through a
form. The live site is:

**https://ives-ivory-events.mattech.fyi**

It's a **static website**, which just means the pages are pre-built and load
fast. There's one small "smart" piece: when a visitor submits the inquiry form,
their answers are automatically saved into a **Google Sheet** so you have a tidy
list of leads.

---

## 2. How the site is organized (the simple map)

Think of the website like a magazine assembled from parts. You edit the parts;
a little helper called the **build** stitches them into the finished pages.

- **The pages** live in a folder called `src/pages/`. There's one file per page:
  Home, About, Services, Gallery, Contact, Testimonials. **This is where most of
  your edits will happen.**
- **The shared pieces** live in `src/pages/`'s neighbor, `src/partials/` — things
  that appear on every page, like the top menu and the footer (your phone number,
  email, and social links).
- **The photos** live in a folder called `assets/`. To use a new photo, you (or
  Claude) put the image file there.
- **The finished website** is produced into a folder called `dist/`. You never
  touch this one — it gets rebuilt automatically every time.

You don't have to memorize any of this. Claude knows the map. You just describe
what you want, and it finds the right file.

---

## 3. The golden rule: edit → preview → publish

Every change follows the same three beats:

1. **Edit** — tell Claude what you want changed.
2. **Preview** — look at the change before anyone else can, to make sure it's
   right.
3. **Publish** — put it on the live site.

Nothing you do reaches the real website until step 3, so you can experiment
freely. If a preview looks wrong, just ask Claude to fix it and preview again.

---

## 4. How to make your first edit

Open this project in Claude and simply describe the change. You don't need
special commands — normal sentences work best. A few examples:

- *"On the About page, change 'nearly eight years' to 'over eight years.'"*
- *"Update the phone number in the footer to 860-555-0199."*
- *"Add this photo I dropped into the assets folder to the gallery, titled
  'Autumn Vineyard Wedding' in Napa, California."*
- *"Fix the typo on the Services page — 'bespoke' is spelled 'bespoke.'"*

**Tips for good results:**

- **Say which page.** "On the Contact page…" helps Claude go straight to the
  right place.
- **Quote the exact words** you want changed when you can. It removes any guessing.
- **One change at a time** is easiest to review, but you can batch a few related
  edits.
- **Ask to see it.** After Claude makes the change, say *"show me a preview"* —
  more on that next.

---

## 5. Previewing your change

There are two ways to see a change before it's live. You'll mostly use the
second one.

**A) A quick local preview.** Ask Claude to *"build and preview the site."* It
runs the build and opens a temporary local copy (at an address like
`http://localhost:4173`) so you can click around. This is instant and great for a
first look.

**B) A shareable preview link (recommended before publishing).** When you're
ready to publish, Claude puts your change on a special branch and opens a **pull
request** (don't worry about the term — it's just a proposed change). Vercel, the
service that hosts the site, then automatically builds a **preview deployment**:
a real, private web address showing *only your change*, separate from the live
site. You can open it on your phone, send it to someone for a second opinion, and
confirm everything looks right — all without affecting visitors.

The **[How Changes Go Live](./how-changes-go-live.md)** guide explains pull
requests and preview deployments in more depth.

---

## 6. Working on your own computer (optional)

Most of the time you can work entirely through Claude and never think about this.
But if you (or a helper) want to run the site **on your own computer** — to make
edits and see them instantly at a local address before anything is shared — here
is the whole picture in plain terms.

**What "working locally" means.** You keep a copy of the project on your own
machine, make changes there, and preview them on your computer only. Nobody else
can see them. It's the most private sandbox there is — even more so than a
preview link, because it never leaves your laptop until you publish.

**What you need (one-time setup):**

1. **Node.js** — a free program that runs the site's build. Install the "LTS"
   version from <https://nodejs.org>. (This is the only real prerequisite.)
2. **The project on your computer** — a copy of this project's files. If Claude
   is already running in this project on your machine, you're set. Otherwise a
   helper can "clone" it from GitHub for you once.

**First-time-only step.** In the project folder, this downloads the building
blocks the site needs:

```
npm install
```

You only rerun that if someone tells you the project's dependencies changed.

**If you were sent a set of secret values (an "env").** You may be given a small
block of settings that let the inquiry form connect to its Google Sheet. These
are like passwords — keep them private. To use them locally, save them in a file
named exactly **`.env`** in the project folder (ask Claude to *"put these env
values into a `.env` file"* and paste them in). That file is automatically kept
out of Git, so it's never shared or published. **You don't need it for ordinary
text and photo edits** — it only matters if you're testing the inquiry form
locally. The live site already has these values configured, so the real form
works regardless.

**The everyday local loop.** Two commands:

```
npm run build      # assemble the finished site into the dist/ folder
npm run preview    # view it at http://localhost:4173 in your browser
```

`npm run preview` gives you a local web address (`http://localhost:4173`) that
only works on your computer. Open it in a browser to click through the site.
When you change a file, run `npm run build` again and refresh the page to see the
update. To stop the preview, press `Ctrl + C` in the same window.

**The easiest version:** you don't have to type any of these. Once the project is
on your computer with Node installed, just tell Claude *"build and preview the
site locally,"* and it runs these for you and points you to the local address.

**Local vs. the preview link vs. live** — three levels, most private to most
public:

- **Local (your computer)** — only you can see it; nothing is shared.
- **Preview deployment (a pull request link)** — a private URL you can share for
  a second opinion; still not the live site.
- **Production (live)** — the real website at `ives-ivory-events.mattech.fyi`,
  updated only when you publish.

Working locally is entirely optional. Editing through Claude and checking the
preview link is enough for most changes.

---

## 7. Publishing (making it live)

When the preview looks good, tell Claude to *"publish it"* (or approve/merge the
pull request). Merging the change is what tells Vercel to update the **real**
website. It usually takes a minute or two, then it's live at
`ives-ivory-events.mattech.fyi`.

To confirm, refresh the live site — ideally with a **hard refresh** or in a
private/incognito window, so you're not seeing an old saved copy in your browser.

---

## 8. A few things to leave alone (or ask about first)

You really can't hurt anything through previews. But a few areas are more
delicate, so let Claude handle them carefully and ask if you're unsure:

- **The inquiry form.** It's wired to your Google Sheet. Changing its questions
  needs several files kept in step, or submissions could be lost. Claude has a
  dedicated checklist for this — just describe what you want and let it do the
  full job.
- **Passwords and secret keys.** The site uses private credentials to talk to
  Google Sheets. These are stored securely in Vercel, never in the project
  files. Don't paste secrets into files, and if Claude ever asks you to commit
  something that looks like a password or key, say no.
- **The `dist/` folder** and anything that looks auto-generated. It's rebuilt
  every time; hand-edits there are pointless and get wiped.

---

## 9. If something looks broken

- A preview looked wrong? Just ask Claude to fix it — the live site is untouched
  until you publish.
- The live site looks wrong after publishing? Ask Claude to help, or roll back.
  Because every change goes through a pull request, there's always a clean
  history to undo from.
- The inquiry form stopped saving to the Sheet? That's usually a credentials
  issue on the hosting side — contact whoever manages the Vercel and Google
  accounts for the business.

---

## Quick reference

| I want to… | Say to Claude… |
|---|---|
| Change wording | *"On the [page], change '[old text]' to '[new text].'"* |
| Swap a photo | *"Replace [which photo] with the new one in the assets folder."* |
| Add a gallery event | *"Add a gallery event called '[name]' in [location] with these photos."* |
| See it first | *"Build and preview the site."* |
| Get a shareable preview | *"Publish this"* → Claude opens a pull request with a preview link |
| Make it live | Approve/merge the pull request, or say *"merge it."* |

You've got this. Start with one small edit, preview it, and publish — the rest
becomes second nature quickly.

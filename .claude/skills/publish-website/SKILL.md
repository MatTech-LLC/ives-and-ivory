---
name: publish-website
description: >-
  Use this skill when the user wants to put website changes live — "publish
  this", "make it live", "deploy the site", "push my changes", "update the real
  website", or similar. It covers the safe end-to-end flow: rebuild, preview so
  the owner can confirm, then commit and push so Vercel automatically deploys.
  Trigger whenever the user is done editing and wants the change to reach the
  live site at ives-ivory-events.mattech.fyi. Do NOT use this for making the
  edits themselves (see edit-website-content or edit-inquiry-form).
---

# Publishing the Ives & Ivory website

The site is hosted on **Vercel**, connected to this GitHub repo. Two deployment
types matter:

- **Preview deployment** — Vercel automatically builds any branch / pull request
  at its own private URL, separate from the live site. This is the safe way for
  the owner to see a change on a real address before it ships.
- **Production deployment** — the live site at `ives-ivory-events.mattech.fyi`,
  rebuilt automatically **only when a change lands on the `main` branch** (i.e.
  when a pull request is merged).

So publishing means: verify the change, push it to a branch and open a pull
request (which gets a preview URL), let the owner confirm on the preview, then
merge to `main` so production updates. There is no manual "deploy" button to
press. The plain-language version of all this is in
`docs/how-changes-go-live.md` — point the owner there if they're unsure.

The owner is non-technical, so **confirm before anything irreversible**
(pushing, opening a PR, and especially merging) and explain each step plainly.

## Step 1 — verify it builds and looks right

Never publish something you haven't built. Run:

```bash
npm run build      # must end with "Build complete → dist/" and no errors
npm run preview    # http://localhost:4173 — look at the changed page
```

If the build fails, stop and fix it first — do not publish a broken build.

## Step 2 — show the owner what will change

Run `git status` and `git diff` to see exactly what changed, and summarize it in
plain language ("the About page tagline, and one new photo"). Make sure nothing
unexpected is staged — in particular, confirm you are **not** about to commit
`dist/`, `node_modules/`, `.vercel/`, or any `.env*` file. These are all
git-ignored already; if any show up, something is wrong — investigate, don't
force them in.

## Step 3 — commit on a branch (not directly on main)

Do the work on a feature branch and open a pull request for the owner to merge,
rather than pushing straight to `main`. This gives a moment to review and an easy
undo.

```bash
git checkout -b update-<short-description>     # e.g. update-about-tagline
git add -A
git commit -m "Clear description of the change"
git push -u origin update-<short-description>
```

If a push fails due to a transient network error, retry a few times with a short
backoff before giving up.

## Step 4 — open a pull request and share the preview

Ask the owner if they'd like you to **open a pull request** (recommended — it
gives a visible review + merge button, and a preview URL). Only open a PR when
they ask you to.

Once the PR is open, **Vercel automatically builds a preview deployment** — a
private URL showing just this change, separate from the live site. Point the
owner to it (Vercel posts the link on the PR) so they can confirm the change on a
real address before it ships. If they want tweaks, make them on the same branch
and push again — the preview refreshes automatically.

## Step 5 — merge to go live, then confirm

Merging the pull request into `main` is what triggers the **production
deployment** (the live site). Only merge when the owner approves. After merging,
production takes a minute or two to build. Tell the owner to refresh
**https://ives-ivory-events.mattech.fyi** (a hard refresh, or a private window,
avoids seeing a cached old copy) and check the change is there.

If a change touched the **inquiry form**, remind them to submit one test inquiry
and confirm the row lands in the Google Sheet with the value in the right
column — that path can only be fully tested on the live site.

## What not to do

- Don't push directly to `main` without the owner's go-ahead.
- Don't commit generated or secret files (`dist/`, `node_modules/`, `.vercel/`,
  `.env*`). They're git-ignored for a reason.
- Don't publish a build that errored.

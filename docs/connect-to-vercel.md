# Reference — Connecting the Site to Vercel (hosting setup)

> **⚠️ You almost certainly do NOT need this guide.** The site is **already
> hosted on Vercel and connected to this project**, and it deploys automatically
> through Git. If you're the new owner just here to edit the site, skip this
> entirely and read **[Getting Started](./GETTING-STARTED.md)** instead.
>
> This document is kept only as a reference for whoever manages hosting — for
> example, if the site ever needs to be set up again from scratch or moved to a
> different Vercel account.

**Read this only if the website isn't hosted yet, or you're setting up hosting
under a new account.** This is a one-time setup. Once it's done, you never repeat
it — from then on, publishing a change is just merging a pull request (see
[How Changes Go Live](./how-changes-go-live.md)).

**Vercel** is the service that builds this project and serves it to the public.
It works by connecting to the project's home on **GitHub** and watching for
changes. So the setup is really just: *give Vercel permission to see the GitHub
project, tell it a couple of settings, add a few secret values, and point your
web address at it.*

It's written for a non-technical person. A few steps (the secret values and the
web address) touch information only the original setup person has — those are
clearly flagged as **"get help here."** You can do the rest yourself.

---

## Before you start — what to have handy

- The **login** for the GitHub account that owns the project
  (`MatTech-LLC/ives-and-ivory`), or an invite to it.
- A **Vercel account** — you'll make one in Step 1 (it's free to start).
- The **three secret values** for the inquiry form's Google Sheet connection
  (Step 5). If you don't have these, that's normal — see that step for who to
  ask.
- Access to wherever the web address **`ives-ivory-events.mattech.fyi`** is
  managed, if you want to connect that domain (Step 6). Optional to start.

> **Tip:** You can complete Steps 1–4 and have a working site on a temporary
> Vercel address first, then come back for Steps 5 and 6 once you've gathered
> the secret values and domain access. Nothing breaks by doing it in stages.

---

## Step 1 — Create a Vercel account (sign in with GitHub)

1. Go to **https://vercel.com** and click **Sign Up**.
2. Choose **Continue with GitHub** and sign in with the GitHub account that has
   access to the project. Signing up this way links the two services from the
   start, which is exactly what we want.
3. If asked whether it's for personal or team use, either is fine to begin with.

---

## Step 2 — Import the project from GitHub

1. In Vercel, click **Add New…** → **Project**.
2. You'll see a list of GitHub repositories ("repository" = a project's files on
   GitHub). Find **`MatTech-LLC/ives-and-ivory`** and click **Import**.

**If you don't see the project in the list:** Vercel needs permission to view it.
Click **Adjust GitHub App Permissions** (or **Configure GitHub App**), and either
grant access to **All repositories** or specifically add
**`MatTech-LLC/ives-and-ivory`**. Then come back — it'll appear. (If the project
is owned by an organization, an admin of that organization may need to approve
this.)

---

## Step 3 — Check the build settings (they're mostly automatic)

The project already includes its own settings file (`vercel.json`), so Vercel
should fill these in for you. On the import screen, just confirm they look like
this and change them only if they don't:

- **Framework Preset:** *Other* (this site doesn't use a framework — that's fine)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

You don't need to understand these — just confirm they match. If Vercel already
shows them, leave them as-is.

---

## Step 4 — Deploy for the first time

Click **Deploy**. Vercel will build the site (this takes a minute or two) and
then show a success screen with a temporary web address like
`ives-and-ivory-xxxx.vercel.app`. Open it — the website should appear. 🎉

At this point the site is **live on a Vercel address**, and future changes will
auto-deploy. Two things remain: making the **inquiry form** save submissions
(Step 5), and putting the site on its **real web address** (Step 6).

---

## Step 5 — Add the inquiry form's secret values (important)

The website works immediately, but the **inquiry form won't save submissions to
your Google Sheet** until three secret values are added. These are like
passwords, so they're never stored in the project's files — they live safely in
Vercel's settings.

**Where to add them:** In Vercel, open the project → **Settings** →
**Environment Variables**. Add these three, one at a time (choose all
environments — Production, Preview, Development — when asked):

| Name (type exactly) | What it is |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | The Google "service account" email address that's allowed to write to the Sheet |
| `GOOGLE_PRIVATE_KEY` | The private key (a long block of text) that authorizes it |
| `GOOGLE_SHEET_ID` | The ID of the Google Sheet that collects inquiries |

**Where do these values come from?** They were created when the form was first
built, using a Google account and a Google Sheet. **Get help here:** ask whoever
originally set up the site (or whoever manages the business's Google account) for
these three values. Don't invent or guess them.

**One formatting note for the private key:** paste it exactly as given. If it was
provided as one long line containing the characters `\n`, paste it just like
that — the site's code knows how to read that format. If you're unsure, ask the
person who gave you the values to confirm the exact format.

**After adding them**, trigger a fresh deploy so they take effect: in Vercel, go
to the project's **Deployments** tab, open the latest one, and choose
**Redeploy**. Then submit a **test inquiry** on the site and confirm a new row
appears in the Google Sheet. If it doesn't, double-check the three names are
spelled exactly right and the values are correct.

> If you'd rather not handle this step alone, this is a good moment to sit with
> Claude or a technical helper — the values are sensitive and the spelling
> matters.

---

## Step 6 — Connect the real web address (custom domain)

To serve the site at **`ives-ivory-events.mattech.fyi`** instead of the
temporary `.vercel.app` address:

1. In Vercel, open the project → **Settings** → **Domains**.
2. Type `ives-ivory-events.mattech.fyi` and click **Add**.
3. Vercel will show one or more **DNS records** to add (usually a `CNAME` or `A`
   record). These have to be entered wherever the `mattech.fyi` domain is
   managed (the domain registrar or DNS provider).

**Get help here:** adding DNS records is done in the account that controls the
`mattech.fyi` domain — ask whoever manages that domain, and give them the exact
record Vercel displays. Once the record is in place, Vercel automatically
verifies it and switches the site over (this can take anywhere from a few minutes
to a few hours). Vercel also sets up the padlock (HTTPS) for you.

---

## You're done — what happens from now on

Once connected, you never repeat this. From here, the normal rhythm applies:

- A change on a **branch / pull request** → Vercel builds a **private preview**
  link automatically.
- **Merging** a pull request into **`main`** → Vercel updates the **live** site.

That everyday flow is explained in
**[How Changes Go Live](./how-changes-go-live.md)**, and how to make edits is in
**[Getting Started](./GETTING-STARTED.md)**.

---

## Quick troubleshooting

- **The project isn't in Vercel's import list** → grant the Vercel GitHub app
  access to the repository (Step 2), and have an org admin approve if needed.
- **The build failed on Vercel** → confirm the Step 3 settings (especially Build
  Command `npm run build` and Output Directory `dist`). Ask Claude to look at the
  build log message.
- **The inquiry form doesn't save to the Sheet** → the three environment
  variables in Step 5 are missing, misspelled, or wrong — re-check them and
  redeploy.
- **The custom domain shows an error or "invalid configuration"** → the DNS
  record from Step 6 isn't in place yet, or is still propagating. Recheck the
  record with whoever manages the domain.

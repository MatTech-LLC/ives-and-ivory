# How Changes Go Live — Git, Pull Requests & Vercel

This guide explains the behind-the-scenes machinery that takes an edit from
"Claude changed a file" to "it's on the live website." It's written for a
non-technical reader. You don't need to operate any of this by hand — Claude
does the steps — but understanding the shape of it makes the whole process feel
a lot less mysterious (and helps you spot when something's off).

There are three players:

1. **Git & GitHub** — keep a safe, versioned history of the website's files.
2. **Pull requests** — the way a change is proposed, previewed, and approved.
3. **Vercel** — the host that builds the site and publishes it (in two flavors:
   **preview** and **production**).

---

## 1. Git & GitHub — the website's "track changes" and safety net

**Git** is a system that records the full history of the project's files. Every
change is saved as a **commit** — a labeled snapshot ("Updated the About page
tagline"). Because every snapshot is kept, you can always see what changed, when,
and undo back to any earlier point. Think of it as *Track Changes* for the whole
website, with an unlimited undo history.

**GitHub** is the website where that history lives online (this project is at
`MatTech-LLC/ives-and-ivory`). It's the shared source of truth that your host,
Vercel, watches.

A couple of terms you'll hear:

- **Branch** — a parallel copy of the project where changes can be made safely
  without touching the real thing. The **main** branch is the official version
  that becomes the live website. When Claude makes an edit for you, it works on a
  *separate* branch first — so the live site is never at risk mid-edit.
- **Commit** — one saved snapshot of a change, with a short description.
- **Push** — uploading your commits from the working copy up to GitHub.

**Why this matters to you:** nothing is ever truly lost, and the live site can't
break just because an edit is in progress — edits happen on a side branch until
you approve them.

---

## 2. Pull requests — proposing and approving a change

A **pull request** (often shortened to **PR**) is a formal proposal that says:
*"Here are the changes on my branch — please review them and, if they look good,
merge them into main."*

Even though it's usually just you, the pull request is valuable because it gives
you three things:

- **A clear summary** of exactly what changed.
- **A preview link** to see the change on a real web address before it's live
  (see the Vercel section below).
- **An approve button** — merging the PR is the deliberate "yes, ship it" moment.

The typical flow, which Claude runs for you:

1. Claude makes your edit on a **new branch**.
2. Claude **commits** the change (a labeled snapshot) and **pushes** it to
   GitHub.
3. Claude **opens a pull request** for that branch.
4. Vercel automatically builds a **preview** of the PR and posts the link on it.
5. You review the preview. Happy? **Merge** the pull request.
6. Merging puts the change onto **main**, which triggers the live update.

**To merge**, you can just tell Claude *"merge it,"* or click the green
**Merge** button on the pull request page on GitHub. Not happy yet? Ask for
changes — Claude updates the same branch, and the preview refreshes
automatically.

---

## 3. Vercel — preview vs. production deployments

**Vercel** is the service that hosts the website. It's connected to the GitHub
project and watches it constantly. Whenever something changes on GitHub, Vercel
rebuilds the affected version of the site automatically. It builds **two kinds**
of deployments, and the difference is the key thing to understand.

### Preview deployments (safe, private, per change)

Every time you have a change on a branch / pull request, Vercel builds a
**preview deployment**: a complete, working copy of the site *with your change
applied*, at its **own unique web address**. It is **separate from the live
site** and visitors never see it.

- The link appears right on the pull request (Vercel posts it there).
- It's a real URL you can open on any device or share for a second opinion.
- It updates automatically each time the change is revised.

This is your safety net: you always get to *see the actual result* before it
reaches the public.

### Production deployment (the real, live website)

The **production deployment** is the real website at
**`ives-ivory-events.mattech.fyi`**. Vercel builds and publishes this
**only when a change lands on the `main` branch** — which happens when you
**merge a pull request**.

So the rule is simple:

> **Branch / pull request → preview deployment (private).
> Merge into `main` → production deployment (live).**

After a merge, production takes a minute or two to build. Then refresh the live
site (a **hard refresh** or a private window avoids seeing an old cached copy)
to confirm your change is there.

---

## Putting it all together

Here's the whole journey of one edit, end to end:

1. You ask Claude for a change.
2. Claude edits the file(s) on a **new branch**, **commits**, and **pushes** to
   **GitHub**.
3. Claude opens a **pull request**.
4. **Vercel** builds a **preview deployment** and the link lands on the PR.
5. You open the preview and check it. (Ask for tweaks if needed — repeat.)
6. You **merge** the pull request.
7. Merging updates **`main`**, so **Vercel** builds the **production
   deployment** — the change is now **live**.

Two mental anchors that make it all click:

- **A change is never live until you merge.** Everything before that is private
  and reversible.
- **Preview = your change on a private URL. Production = the real site.** Same
  build, two audiences.

---

## Mini-glossary

- **Git** — the system that tracks every version of the project's files.
- **GitHub** — the online home of that history (`MatTech-LLC/ives-and-ivory`).
- **Branch** — a safe side-copy for making changes; **main** is the live version.
- **Commit** — one saved, labeled snapshot of a change.
- **Push** — send commits up to GitHub.
- **Pull request (PR)** — a proposed change you review and then merge.
- **Merge** — accept a pull request, moving its changes into **main**.
- **Vercel** — the host that builds and serves the site.
- **Preview deployment** — a private, per-change copy at its own URL.
- **Production deployment** — the real, public site at
  `ives-ivory-events.mattech.fyi`.

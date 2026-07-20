---
name: edit-inquiry-form
description: >-
  Use this skill whenever the user wants to change the Ives & Ivory Events
  inquiry / contact form — adding, removing, renaming, or reordering a field
  (e.g. "add a 'Preferred contact method' question", "make phone required",
  "add a new option to the Event Type dropdown", "remove the mailing address
  field"), or anything about where submissions are saved. This form feeds real
  customer inquiries into a Google Sheet, and the browser form, the server
  code, and the Sheet columns must stay in sync — a change to one file alone
  will drop or misplace submissions. Trigger on any mention of the inquiry
  form, contact form, form fields, dropdown options, required fields, or the
  Google Sheet the inquiries go into. Use edit-website-content instead for
  ordinary page text and photos.
---

# Editing the Ives & Ivory inquiry form

The inquiry form is the business's lead pipeline: every submission becomes a row
in a Google Sheet. The danger is that the form spans **four files that must
agree**. Change the visible field but not the server/schema, and real inquiries
silently lose that answer — or the whole submission fails. Treat this as a
sync task, not a single edit.

Read `CLAUDE.md` for the overall project map if you haven't this session.

## The four files that must stay in sync

1. **`src/partials/inquiry-form.html`** — the visible form. Each input has a
   `name="..."` (e.g. `name="phone"`). That `name` is the contract with the
   server.
2. **`src/partials/scripts.html`** — the browser JavaScript that reads the form
   and POSTs it to `/api/inquiry`. It builds a `payload` object by reading each
   field with `data.get('<name>')`. New fields must be added here, and any
   custom client-side validation lives here too.
3. **`api/inquiry.js`** — the server function. It reads each field off the
   request `body`, validates required fields (`REQUIRED` array) and formats, then
   writes a row. New fields must be pulled into its `payload` object.
4. **`api/inquiry-schema.js`** — the single source of truth for **column order**.
   `INQUIRY_COLUMNS` is an array of `{ key, header }` — `key` is the field name,
   `header` is the Google Sheet column label. The server builds each row by
   mapping over this array, and `INQUIRY_RANGE` (`Inquiries!A:P`) covers the
   columns.

Field `name` (HTML) === `key` (schema) === the property read in the JS payload
=== the property read in `api/inquiry.js`. Keep that one string identical across
all four.

## Playbook: adding a new field

1. **HTML** (`inquiry-form.html`): add the `<label>` + input, copying a similar
   existing field's structure and classes. Pick a clear `name`, e.g.
   `preferredContact`. Mark it `required` only if the owner wants it required.
2. **Client JS** (`scripts.html`): in the `submit` handler's `payload` object,
   add `preferredContact: String(data.get('preferredContact') || '').trim(),`
   (mirror how the other simple text fields are read). Checkboxes and special
   fields need the same handling as their existing siblings — copy the closest
   example.
3. **Server** (`api/inquiry.js`): add `preferredContact: str(body.preferredContact),`
   to the `payload`. Add it to the `REQUIRED` array only if it's a required
   field. Add format validation only if it needs it (see the phone/date/guest
   examples already there).
4. **Schema** (`api/inquiry-schema.js`): add
   `{ key: 'preferredContact', header: 'Preferred Contact' }` to
   `INQUIRY_COLUMNS`. **Where you put it in the array = which Sheet column it
   lands in.** Adding at the end appends a new rightmost column.
5. **Update the Sheet range if the column count changed.** `INQUIRY_RANGE` is
   `Inquiries!A:P` — that's 16 columns (A→P). If your addition makes 17 columns,
   widen it to `A:Q`, and so on. If you don't, the new column may be cut off.

### The Google Sheet needs a matching header

The code appends data rows; it does not manage the Sheet's header row. When you
add or reorder columns, the owner (or whoever manages the Sheet) should update
the header row in the Google Sheet to match the new `header` labels/order, so
the columns stay readable. Call this out explicitly — you can't do it from the
code, and it's easy to forget.

## Playbook: dropdown / checkbox options

Adding an **Event Type** option, a **How Did You Hear** option, or a **Services**
checkbox is HTML-only — edit `inquiry-form.html`. These are free-form strings
saved as-is, so no schema change is needed. Just match the existing `<option>`
or `<label class="inquiry-check">` markup.

## Playbook: removing / renaming / reordering

- **Removing** a field: remove it from all four files, and note that its Sheet
  column will now stop receiving data (don't delete historical data).
- **Renaming** a field's `name`/`key`: change it in all four files together, or
  submissions break. The Sheet `header` label can change freely (cosmetic).
- **Reordering** columns: reorder entries in `INQUIRY_COLUMNS` — that alone
  changes column order. Keep the Sheet header row in step.

## Verify

```bash
npm run build      # must succeed
npm run preview    # http://localhost:4173/contact — the form should render fully
```

A full end-to-end test (an actual submission reaching the Sheet) requires the
live environment and the Google credentials, which aren't available locally. So
locally, confirm: the build passes, the form renders with the new field, and the
same field `name`/`key` string appears in all four files. Tell the owner that
the real save-to-Sheet path should be spot-checked after publishing (submit a
test inquiry, confirm the row appears with the value in the right column).

Never print, commit, or hardcode the Google credentials
(`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`). They
live in Vercel's settings and a git-ignored `.env`, and must stay out of the
repo.

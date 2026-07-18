/**
 * Single source of truth for inquiry columns.
 * Order matches the Google Sheet header row (A→P).
 * `key` is the JSON / form field name; `header` is the Sheet column label.
 */
export const INQUIRY_COLUMNS = [
  { key: 'submittedAt', header: 'Submitted At' },
  { key: 'name', header: 'Your Name' },
  { key: 'partnerName', header: "Partner's Name" },
  { key: 'email', header: 'Email Address' },
  { key: 'phone', header: 'Phone Number' },
  { key: 'eventType', header: 'Event Type' },
  { key: 'eventDate', header: 'Event Date' },
  { key: 'venue', header: 'Venue' },
  { key: 'cityState', header: 'City & State' },
  { key: 'mailingAddress', header: 'Mailing Address' },
  { key: 'guestCount', header: 'Estimated Guest Count' },
  { key: 'budget', header: 'Estimated Budget' },
  { key: 'services', header: 'Services' },
  { key: 'message', header: 'About Your Celebration' },
  { key: 'referralSource', header: 'How Did You Hear' },
  { key: 'formPage', header: 'Form Page' },
];

export const INQUIRY_HEADERS = INQUIRY_COLUMNS.map((c) => c.header);
export const INQUIRY_SHEET_TAB = 'Inquiries';
export const INQUIRY_RANGE = `${INQUIRY_SHEET_TAB}!A:P`;

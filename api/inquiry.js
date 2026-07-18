import { google } from 'googleapis';
import { INQUIRY_COLUMNS, INQUIRY_RANGE } from './inquiry-schema.js';

const REQUIRED = ['name', 'email', 'eventType'];

function str(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function getPrivateKey() {
  const key = process.env.GOOGLE_PRIVATE_KEY;
  if (!key) return '';
  return key.replace(/\\n/g, '\n');
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};

  // Honeypot — treat as success so bots don't retry
  if (str(body.website)) {
    return res.status(200).json({ ok: true });
  }

  const payload = {
    submittedAt: new Date().toISOString(),
    name: str(body.name),
    partnerName: str(body.partnerName),
    email: str(body.email),
    phone: str(body.phone),
    eventType: str(body.eventType),
    eventDate: str(body.eventDate),
    venue: str(body.venue),
    cityState: str(body.cityState),
    mailingAddress: str(body.mailingAddress),
    guestCount: str(body.guestCount),
    budget: str(body.budget),
    services: Array.isArray(body.services)
      ? body.services.map(str).filter(Boolean).join('; ')
      : str(body.services),
    message: str(body.message),
    referralSource: str(body.referralSource),
    formPage: str(body.formPage) || 'unknown',
  };

  for (const field of REQUIRED) {
    if (!payload[field]) {
      return res.status(400).json({ ok: false, error: `Missing required field: ${field}` });
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email address' });
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = getPrivateKey();
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !privateKey || !sheetId) {
    console.error('Missing Google Sheets env vars');
    return res.status(500).json({ ok: false, error: 'Server configuration error' });
  }

  try {
    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const row = INQUIRY_COLUMNS.map((col) => payload[col.key] ?? '');

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: INQUIRY_RANGE,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Sheets append failed', err);
    return res.status(500).json({ ok: false, error: 'Failed to save inquiry' });
  }
}

import { getVercelOidcToken } from '@vercel/oidc';
import { ExternalAccountClient } from 'google-auth-library';
import { google } from 'googleapis';
import { INQUIRY_COLUMNS, INQUIRY_RANGE } from './inquiry-schema.js';

const REQUIRED = ['name', 'email', 'eventType'];

function str(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Keyless Google auth: Vercel's OIDC token is exchanged through Workload
 * Identity Federation for short-lived credentials that impersonate the
 * service account. No private key is stored anywhere.
 */
function getGoogleAuthClient() {
  const projectNumber = process.env.GCP_PROJECT_NUMBER;
  const poolId = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID;
  const providerId = process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;
  const serviceAccountEmail = process.env.GCP_SERVICE_ACCOUNT_EMAIL;

  if (!projectNumber || !poolId || !providerId || !serviceAccountEmail) return null;

  return ExternalAccountClient.fromJSON({
    type: 'external_account',
    audience: `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${poolId}/providers/${providerId}`,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    token_url: 'https://sts.googleapis.com/v1/token',
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:generateAccessToken`,
    subject_token_supplier: { getSubjectToken: () => getVercelOidcToken() },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
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

  if (payload.phone) {
    const phoneDigits = payload.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15 || /[a-zA-Z]/.test(payload.phone)) {
      return res.status(400).json({ ok: false, error: 'Invalid phone number' });
    }
  }

  if (payload.guestCount && !/^\d+$/.test(payload.guestCount)) {
    return res.status(400).json({ ok: false, error: 'Guest count must be a whole number' });
  }

  if (payload.guestCount) {
    const guests = Number(payload.guestCount);
    if (guests < 1 || guests > 10000) {
      return res.status(400).json({ ok: false, error: 'Guest count out of range' });
    }
  }

  if (payload.budget) {
    const budgetDigits = payload.budget.replace(/[$,\s]/g, '');
    if (!/^\d+(\.\d{1,2})?$/.test(budgetDigits)) {
      return res.status(400).json({ ok: false, error: 'Invalid budget amount' });
    }
  }

  if (payload.eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(payload.eventDate)) {
    return res.status(400).json({ ok: false, error: 'Invalid event date' });
  }

  const auth = getGoogleAuthClient();
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!auth || !sheetId) {
    console.error('Missing Google Sheets env vars');
    return res.status(500).json({ ok: false, error: 'Server configuration error' });
  }

  try {
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

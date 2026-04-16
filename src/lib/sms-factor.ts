// SMS Factor client — transactional SMS API
// Docs: https://dev.smsfactor.com/

const API_URL = 'https://api.smsfactor.com/send';

function normalizePhoneNumber(raw: string): string | null {
  // Strip everything except digits and leading +
  let cleaned = raw.trim().replace(/[\s.\-()]/g, '');

  if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1);
  } else if (cleaned.startsWith('00')) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0')) {
    // French domestic format: 06... → 336...
    cleaned = '33' + cleaned.slice(1);
  }

  if (!/^\d{8,15}$/.test(cleaned)) return null;
  return cleaned;
}

export async function sendSms(params: {
  to: string;
  text: string;
  sender?: string;
}): Promise<{ success: boolean; error?: string; messageId?: string }> {
  const token = process.env.SMSFACTOR_API_KEY;
  if (!token) return { success: false, error: 'Missing SMSFACTOR_API_KEY' };

  const to = normalizePhoneNumber(params.to);
  if (!to) return { success: false, error: `Invalid phone number: ${params.to}` };

  const sender = params.sender || process.env.SMSFACTOR_SENDER || 'Linova';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ to, text: params.text, sender }),
    });

    const data = await res.json().catch(() => ({}));

    // SMS Factor returns { status: 1, ... } on success, status: 0 on error
    if (!res.ok || data?.status === 0) {
      return {
        success: false,
        error: data?.message || `HTTP ${res.status}`,
      };
    }

    return { success: true, messageId: data?.ticket || data?.report_id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

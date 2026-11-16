// Rattrape pour Kevin & Nesrine : crée les 7 prélèvements planifiés chez GoCardless
// + met à jour la ligne candidature_mandates (status=active, mandate_id, customer_id, iban_last4, payments).
// Usage: node rattrape_mandates.mjs
// Env:  GOCARDLESS_ACCESS_TOKEN, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from '@supabase/supabase-js';

const GC_TOKEN = process.env.GOCARDLESS_ACCESS_TOKEN;
if (!GC_TOKEN) throw new Error('GOCARDLESS_ACCESS_TOKEN missing');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CASES = [
  {
    label: 'Kevin Franck KAMDEM MAMBOU',
    candidatureId: 'c6c1e9a9-b3bd-4d36-88d4-265ae4604e91',
    billingRequestId: 'BRQ01M668FNPZW7M297C73GQEG2Y2',
    mandateId: 'MD01M669PK3B32G6CJ3J2QR6GPYQ',
    customerId: 'CU01MGMSQC0AQ753Y7NJJY1TVBQN',
    email: 'kamdemkevinfranck2@gmail.com',
    amounts: [80000, 80000, 80000, 80000, 80000, 80000, 80000], // cents
    startDate: '2026-12-05',
    soldeCents: 560000,
    nb: 7,
  },
  {
    label: 'Nesrine Benkaci-Ouargli',
    candidatureId: '5ef8791f-9ccb-4ec2-bbc6-109d9ab47146',
    billingRequestId: 'BRQ01M6EEQ8AM1PZ1HPG6JVZ9JEFK',
    mandateId: 'MD01M6EEW3WYZVWFYPGKKXNJGJH2',
    customerId: 'CU01MGWZYYMMM7JQHWCJZQP9M1RS',
    email: 'nesrine.benkaci92@outlook.fr',
    amounts: [65714, 65714, 65714, 65714, 65714, 65714, 65716],
    startDate: '2026-12-05',
    soldeCents: 460000,
    nb: 7,
  },
];

function addMonthsIso(iso, n) {
  const d = new Date(iso + 'T00:00:00Z');
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  const day = Math.min(d.getUTCDate(), lastDay);
  const yyyy = target.getUTCFullYear();
  const mm = String(target.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function gcFetch(path, init = {}) {
  const res = await fetch(`https://api.gocardless.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${GC_TOKEN}`,
      'GoCardless-Version': '2015-07-06',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Idempotency-Key': init.idemp || Math.random().toString(36).slice(2) + Date.now().toString(36),
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method || 'GET'} ${path} -> ${res.status} ${text}`);
  return text ? JSON.parse(text) : {};
}

async function fetchIbanLast4(mandateId) {
  const m = await gcFetch(`/mandates/${mandateId}`);
  const cbaId = m.mandates?.links?.customer_bank_account;
  if (!cbaId) return null;
  const cba = await gcFetch(`/customer_bank_accounts/${cbaId}`);
  return cba.customer_bank_accounts?.account_number_ending || null;
}

async function alreadyScheduled(mandateId) {
  const list = await gcFetch(`/payments?mandate=${encodeURIComponent(mandateId)}&limit=20`);
  return (list.payments || []).filter((p) => (p.description || '').includes('Linova — solde'));
}

for (const c of CASES) {
  console.log(`\n=== ${c.label} ===`);

  const existing = await alreadyScheduled(c.mandateId);
  if (existing.length > 0) {
    console.log(` déjà planifiés (${existing.length}) — on réutilise sans recréer`);
    const payments = existing.map((p) => ({
      id: p.id,
      amount: p.amount,
      charge_date: p.charge_date,
      status: p.status,
    }));
    const ibanLast4 = await fetchIbanLast4(c.mandateId).catch(() => null);
    const { error } = await supabase
      .from('candidature_mandates')
      .update({
        gocardless_mandate_id: c.mandateId,
        gocardless_customer_id: c.customerId,
        iban_last4: ibanLast4,
        status: 'active',
        payments,
      })
      .eq('candidature_id', c.candidatureId)
      .eq('billing_request_id', c.billingRequestId);
    if (error) console.error(' DB update error:', error.message);
    else console.log(` DB sync OK · iban ${ibanLast4}`);
    continue;
  }

  const created = [];
  for (let i = 0; i < c.amounts.length; i++) {
    const chargeDate = addMonthsIso(c.startDate, i);
    const amount = c.amounts[i];
    const idemp = `rattrape-${c.candidatureId.slice(0, 8)}-${i + 1}`;
    const pay = await gcFetch('/payments', {
      method: 'POST',
      idemp,
      body: JSON.stringify({
        payments: {
          amount: String(amount),
          currency: 'EUR',
          charge_date: chargeDate,
          description: `Linova — solde scolarité ${i + 1}/${c.amounts.length}`,
          retry_if_possible: true,
          metadata: {
            t: 'solde',
            i: `${i + 1}/${c.amounts.length}`,
            e: c.email.slice(0, 200),
          },
          links: { mandate: c.mandateId },
        },
      }),
    });
    const p = pay.payments;
    created.push({ id: p.id, amount, charge_date: p.charge_date || chargeDate, status: p.status || 'pending_submission' });
    console.log(` prélèvement ${i + 1}/${c.amounts.length} : ${(amount / 100).toFixed(2)} € le ${p.charge_date || chargeDate} · ${p.id}`);
  }

  const ibanLast4 = await fetchIbanLast4(c.mandateId).catch(() => null);
  const { error } = await supabase
    .from('candidature_mandates')
    .update({
      gocardless_mandate_id: c.mandateId,
      gocardless_customer_id: c.customerId,
      iban_last4: ibanLast4,
      status: 'active',
      payments: created,
    })
    .eq('candidature_id', c.candidatureId)
    .eq('billing_request_id', c.billingRequestId);
  if (error) console.error(' DB update error:', error.message);
  else console.log(` DB sync OK · iban ${ibanLast4} · ${created.length} prélèvements`);
}

console.log('\nTerminé.');

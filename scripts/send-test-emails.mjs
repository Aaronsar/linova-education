/**
 * Envoi de 3 emails de test (Inscription / Dossier admission / Candidature non retenue).
 *
 * Charge BREVO_API_KEY + EMAIL_TEST_REDIRECT depuis .env.local et exécute
 * un fichier TS qui appelle les fonctions de src/lib/resend-emails.ts via tsx.
 *
 * Usage : node scripts/send-test-emails.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = {};
for (const line of readFileSync(resolve(__dirname, '../.env.local'), 'utf-8').split('\n')) {
  const i = line.indexOf('=');
  if (i === -1 || line.trim().startsWith('#')) continue;
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/s, '$1');
}

const redirect = env.EMAIL_TEST_REDIRECT || 'aaron@diploma-sante.fr';
if (!env.BREVO_API_KEY) {
  console.error('❌ BREVO_API_KEY manquante dans .env.local');
  process.exit(1);
}

console.log(`✉️  Redirection emails → ${redirect}\n`);

const tsRunner = resolve(__dirname, '_run-test-emails.ts');
const result = spawnSync('npx', ['tsx', tsRunner], {
  stdio: 'inherit',
  env: {
    ...process.env,
    BREVO_API_KEY: env.BREVO_API_KEY,
    EMAIL_TEST_REDIRECT: redirect,
  },
});
process.exit(result.status || 0);

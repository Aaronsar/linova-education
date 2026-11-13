'use client';

/**
 * Snippet officiel Meta Pixel — installé sur toutes les pages du site
 * (cf. plan de taggage Linova : pixel ID 1439116920860998).
 *
 * Inclut le PageView automatique. Les événements custom (CompleteRegistration,
 * InitiateCheckout, CandidatureBTSBM) sont déclenchés depuis ContactForm
 * via le helper `trackPixelEvent` ci-dessous.
 *
 * Le pixel est un traceur publicitaire : il n'est chargé qu'après l'accord
 * du visiteur (bandeau cookies), comme le demande la CNIL.
 */

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import Script from 'next/script';

export const META_PIXEL_ID = '1439116920860998';

/** Liste officielle des "Standard Events" Meta Pixel (=> fbq('track', ...)) */
const STANDARD_FB_EVENTS = new Set([
  'AddPaymentInfo',
  'AddToCart',
  'AddToWishlist',
  'CompleteRegistration',
  'Contact',
  'CustomizeProduct',
  'Donate',
  'FindLocation',
  'InitiateCheckout',
  'Lead',
  'PageView',
  'Purchase',
  'Schedule',
  'Search',
  'StartTrial',
  'SubmitApplication',
  'Subscribe',
  'ViewContent',
]);

/** Déclenche un événement Pixel. Auto-détecte standard vs custom. */
export function trackPixelEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  if (!w.fbq) return;
  const verb = STANDARD_FB_EVENTS.has(eventName) ? 'track' : 'trackCustom';
  if (params) w.fbq(verb, eventName, params);
  else w.fbq(verb, eventName);
}

function PixelScripts() {
  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
          `.trim(),
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

// ─── Consentement cookies ───────────────────────────────────────────────────

const CONSENT_KEY = 'linova-cookie-consent';
const CONSENT_EVENT = 'linova-cookie-consent-change';
const CONSENT_TTL_MS = 183 * 24 * 60 * 60 * 1000;
type Consent = 'accepted' | 'refused' | 'unknown' | 'server';

function readConsent(): Consent {
  try {
    // Format : « accepted:1731500000000 ». Le choix est redemandé au bout de 6 mois.
    const [v, at] = (window.localStorage.getItem(CONSENT_KEY) || '').split(':');
    if (v !== 'accepted' && v !== 'refused') return 'unknown';
    if (!at || Date.now() - Number(at) > CONSENT_TTL_MS) return 'unknown';
    return v;
  } catch {
    return 'unknown';
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function saveConsent(value: 'accepted' | 'refused') {
  try {
    window.localStorage.setItem(CONSENT_KEY, `${value}:${Date.now()}`);
  } catch {
    /* stockage indisponible : le choix vaut pour la page en cours */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Rouvre le bandeau pour changer d'avis (lien « Gérer mes cookies »). */
export function resetCookieConsent() {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function CookieSettingsButton({ className = '' }: { className?: string }) {
  return (
    <button type="button" onClick={resetCookieConsent} className={className}>
      Gérer mes cookies
    </button>
  );
}

export default function MetaPixel() {
  const consent = useSyncExternalStore<Consent>(subscribe, readConsent, () => 'server');

  if (consent === 'accepted') return <PixelScripts />;
  if (consent !== 'unknown') return null;

  return (
    <div
      role="dialog"
      aria-label="Cookies"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[90] bg-white rounded-2xl shadow-2xl border border-gray-100 p-5"
    >
      <p className="font-bold text-dark mb-1">Cookies</p>
      <p className="text-sm text-gray-600 leading-relaxed">
        Avec votre accord, nous utilisons un cookie de mesure publicitaire (Meta) pour savoir si nos campagnes
        fonctionnent. Vous pouvez refuser : le site marche exactement pareil.{' '}
        <Link href="/politique-de-confidentialite" className="text-teal font-semibold hover:underline">
          En savoir plus
        </Link>
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => saveConsent('refused')}
          className="flex-1 px-4 py-2.5 rounded-full border-2 border-dark text-dark text-sm font-semibold hover:bg-dark hover:text-white transition-colors cursor-pointer"
        >
          Refuser
        </button>
        <button
          type="button"
          onClick={() => saveConsent('accepted')}
          className="flex-1 px-4 py-2.5 rounded-full border-2 border-dark bg-dark text-white text-sm font-semibold hover:brightness-110 transition-colors cursor-pointer"
        >
          Accepter
        </button>
      </div>
    </div>
  );
}

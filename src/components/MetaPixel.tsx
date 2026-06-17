'use client';

/**
 * Snippet officiel Meta Pixel — installé sur toutes les pages du site
 * (cf. plan de taggage Linova : pixel ID 1439116920860998).
 *
 * Inclut le PageView automatique. Les événements custom (CompleteRegistration,
 * InitiateCheckout, CandidatureBTSBM) sont déclenchés depuis ContactForm
 * via le helper `trackPixelEvent` ci-dessous.
 */

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

export default function MetaPixel() {
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

'use client';

import { useEffect, useRef } from 'react';

export default function ContactForm({ embedded = true }: { embedded?: boolean }) {
  const formRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current || !formRef.current) return;
    scriptLoaded.current = true;

    // Load HubSpot script
    const script = document.createElement('script');
    script.src = '//js-eu1.hsforms.net/forms/embed/v2.js';
    script.charset = 'utf-8';
    script.async = true;
    script.onload = () => {
      if (window.hbspt && formRef.current) {
        window.hbspt.forms.create({
          portalId: '26711031',
          formId: '214e4f18-6c73-4398-be44-a10b6bd399f2',
          region: 'eu1',
          target: `#hubspot-form-container`,
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      scriptLoaded.current = false;
    };
  }, []);

  const containerClass = embedded
    ? 'bg-white rounded-2xl shadow-xl p-6 max-w-sm ml-auto'
    : '';

  return (
    <div className={containerClass}>
      <h3 className="font-[var(--font-outfit)] text-xl font-bold text-dark mb-1">
        Candidater au BTS Biologie M&eacute;dicale
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Remplissez le formulaire, notre &eacute;quipe vous recontacte sous 48h.
      </p>
      <div id="hubspot-form-container" ref={formRef} />
    </div>
  );
}

// Type declaration for HubSpot
declare global {
  interface Window {
    hbspt: {
      forms: {
        create: (config: {
          portalId: string;
          formId: string;
          region: string;
          target?: string;
        }) => void;
      };
    };
  }
}

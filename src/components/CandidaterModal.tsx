'use client';

import { useState, useEffect } from 'react';
import ContactForm from './ContactForm';

export function CandidaterButton({
  children = 'Candidater',
  className = '',
  variant = 'yellow',
}: {
  children?: React.ReactNode;
  className?: string;
  variant?: 'yellow' | 'outline' | 'teal' | 'white';
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all cursor-pointer';
  const variants = {
    yellow: 'bg-yellow text-dark hover:brightness-95',
    outline: 'border-2 border-dark text-dark hover:bg-dark hover:text-white',
    teal: 'bg-teal text-white hover:brightness-95',
    white: 'border-2 border-white text-white hover:bg-white hover:text-navy',
  };
  const defaultSize = 'px-8 py-3.5 text-base';

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className || defaultSize} candidater-btn`}
      onClick={() => {
        window.dispatchEvent(new CustomEvent('open-candidater-modal'));
      }}
    >
      {children}
    </button>
  );
}

export default function CandidaterModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-candidater-modal', handler);
    return () => window.removeEventListener('open-candidater-modal', handler);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
        >
          <svg className="w-4 h-4 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 pt-8">
          <ContactForm embedded={false} form="contact" />
        </div>
      </div>
    </div>
  );
}

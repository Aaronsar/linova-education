'use client';

import { CandidaterButton } from './CandidaterModal';

export default function CTASection({
  title = "Prêt à rejoindre Linova ?",
  description = "Faites le premier pas vers votre carrière dans les métiers de la santé.",
  primaryText = "Candidater",
  secondaryText = "Demander des informations",
}: {
  title?: string;
  description?: string;
  primaryText?: string;
  primaryHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="py-20 bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{title}</h2>
        <p className="text-gray-300 text-lg mb-10">{description}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <CandidaterButton className="px-8 py-3.5 text-lg">
            {primaryText}
          </CandidaterButton>
          <CandidaterButton variant="white" className="px-8 py-3.5 text-lg">
            {secondaryText}
          </CandidaterButton>
        </div>
      </div>
    </section>
  );
}

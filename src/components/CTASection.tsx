import Link from 'next/link';

export default function CTASection({
  title = "Prêt à rejoindre Linova ?",
  description = "Faites le premier pas vers votre carrière dans les métiers de la santé.",
  primaryText = "Candidater",
  primaryHref = "/infos-pratiques/admission",
  secondaryText = "Notre brochure",
  secondaryHref = "#brochure",
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
          <Link
            href={primaryHref}
            className="px-8 py-3.5 bg-yellow text-dark font-semibold rounded-full hover:brightness-95 transition-all text-lg"
          >
            {primaryText}
          </Link>
          <Link
            href={secondaryHref}
            className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-navy transition-all text-lg"
          >
            {secondaryText}
          </Link>
        </div>
      </div>
    </section>
  );
}

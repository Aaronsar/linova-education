import Link from 'next/link';
import Image from 'next/image';
import { CandidaterButton } from './CandidaterModal';
import CTASection from './CTASection';
import FAQ from './FAQ';

interface RelatedArticle {
  title: string;
  slug: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogArticleProps {
  title: string;
  subtitle?: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
  imageAlt?: string;
  children: React.ReactNode;
  relatedArticles?: RelatedArticle[];
  faqItems?: FAQItem[];
}

export default function BlogArticle({
  title,
  subtitle,
  date,
  readTime,
  category,
  image,
  imageAlt,
  children,
  relatedArticles = [],
  faqItems = [],
}: BlogArticleProps) {
  // JSON-LD FAQ Schema for GEO
  const faqSchema = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  } : null;

  // JSON-LD Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": subtitle || "",
    "datePublished": date,
    "author": {
      "@type": "Organization",
      "name": "Linova Education",
      "url": "https://linova-education.fr",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Linova Education",
      "logo": {
        "@type": "ImageObject",
        "url": "https://linova-education.fr/images/logos/logo-noir-bleu.svg",
      },
    },
    ...(image ? { "image": `https://linova-education.fr${image}` } : {}),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero */}
      <section className="bg-navy py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/blog" className="text-gray-400 hover:text-teal transition-colors text-sm">
              Blog
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-teal text-sm">{category}</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-gray-300 leading-relaxed">{subtitle}</p>
          )}
          <div className="flex items-center gap-4 mt-8 text-sm text-gray-400">
            <span>{date}</span>
            <span>-</span>
            <span>{readTime} de lecture</span>
          </div>
        </div>
      </section>

      {/* Image */}
      {image && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="relative rounded-2xl overflow-hidden aspect-[21/9]">
            <Image src={image} alt={imageAlt || title} fill className="object-cover" />
          </div>
        </div>
      )}

      {/* Article body */}
      <article className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none
            [&>h2]:font-[var(--font-outfit)] [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:font-bold [&>h2]:text-dark [&>h2]:mt-12 [&>h2]:mb-6
            [&>h3]:font-[var(--font-outfit)] [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-dark [&>h3]:mt-8 [&>h3]:mb-4
            [&>p]:text-gray-600 [&>p]:leading-relaxed [&>p]:mb-6
            [&>ul]:space-y-2 [&>ul]:mb-6 [&>ul]:pl-0
            [&>ul>li]:flex [&>ul>li]:items-start [&>ul>li]:gap-3 [&>ul>li]:text-gray-600
            [&>ul>li]:before:content-[''] [&>ul>li]:before:w-2 [&>ul>li]:before:h-2 [&>ul>li]:before:rounded-full [&>ul>li]:before:bg-teal [&>ul>li]:before:mt-2 [&>ul>li]:before:flex-shrink-0
            [&>blockquote]:border-l-4 [&>blockquote]:border-teal [&>blockquote]:bg-light [&>blockquote]:p-6 [&>blockquote]:rounded-r-xl [&>blockquote]:my-8 [&>blockquote]:italic [&>blockquote]:text-dark
            [&>strong]:text-dark
            [&>a]:text-teal [&>a]:underline [&>a]:hover:text-navy
          ">
            {children}
          </div>

          {/* Mid-article CTA */}
          <div className="my-12 bg-navy rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-3">Vous souhaitez exercer ce metier ?</h3>
            <p className="text-gray-300 text-sm mb-6">Le BTS Biologie Medicale de Linova vous forme en 2 ans, en initial ou alternance.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <CandidaterButton className="px-6 py-2.5 text-sm">Candidater</CandidaterButton>
              <Link href="/formations/bts-biologie-medicale" className="px-6 py-2.5 text-sm border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-navy transition-all">
                Voir la formation
              </Link>
            </div>
          </div>

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <h3 className="font-[var(--font-outfit)] text-2xl font-bold text-dark mb-8">Articles connexes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles.map((article, i) => (
                  <Link
                    key={i}
                    href={`/blog/${article.slug}`}
                    className="group bg-light rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-bold text-dark group-hover:text-teal transition-colors">{article.title}</h4>
                    <span className="text-sm text-teal mt-2 inline-block">Lire l&apos;article →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* FAQ Section with Schema */}
      {faqItems.length > 0 && (
        <FAQ items={faqItems} title="Questions frequentes" />
      )}

      <CTASection />

      {/* Sticky CTA bar - mobile + desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 py-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-dark">Interessé par ce métier ?</p>
            <p className="text-xs text-gray-500">BTS Biologie Medicale - Initial ou alternance</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <CandidaterButton className="px-6 py-2.5 text-sm flex-1 sm:flex-none">
              Candidater
            </CandidaterButton>
            <a
              href="tel:+33189719944"
              className="px-4 py-2.5 text-sm border-2 border-dark text-dark font-semibold rounded-full hover:bg-dark hover:text-white transition-all hidden sm:inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Appeler
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import BlogArticle from '@/components/BlogArticle';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jhopwqpbaiyjfoggvcaf.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impob3B3cXBiYWl5amZvZ2d2Y2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTI2OTEsImV4cCI6MjA4ODYyODY5MX0.rz3TJZryPxEf3P5kQgpzQkwN9aF8_F4eo4F03CEYVPs'
);

interface ArticleSection {
  id: string;
  type: 'heading' | 'paragraph' | 'callout' | 'list' | 'faq';
  level?: 'h2' | 'h3';
  content?: string;
  variant?: string;
  items?: string[];
  questions?: { question: string; answer: string }[];
}

async function getArticle(slug: string) {
  const { data, error } = await supabase
    .from('linova_articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Article introuvable' };

  return {
    title: article.meta_title || `${article.title} | Linova Éducation`,
    description: article.meta_description || article.excerpt || '',
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt || '',
      type: 'article',
    },
  };
}

function renderSection(section: ArticleSection) {
  switch (section.type) {
    case 'heading':
      if (section.level === 'h3') {
        return <h3 key={section.id}>{section.content}</h3>;
      }
      return <h2 key={section.id}>{section.content}</h2>;

    case 'paragraph':
      return (
        <p key={section.id} dangerouslySetInnerHTML={{ __html: section.content || '' }} />
      );

    case 'callout': {
      const isConseil = section.variant === 'conseil';
      const isAttention = section.variant === 'attention';
      const bg = isConseil ? 'bg-yellow/10 border-yellow/40' : isAttention ? 'bg-red-50 border-red-200' : 'bg-teal/10 border-teal/30';
      const icon = isConseil ? '✅' : isAttention ? '⚠️' : '💡';
      return (
        <div key={section.id} className={`my-6 rounded-xl p-5 border ${bg} not-prose`}>
          <p className="text-sm text-gray-700">
            <span className="mr-2">{icon}</span>
            <span dangerouslySetInnerHTML={{ __html: section.content || '' }} />
          </p>
        </div>
      );
    }

    case 'list':
      return (
        <ul key={section.id}>
          {(section.items || []).map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );

    case 'faq':
      // FAQ is handled separately via faqItems prop
      return null;

    default:
      return null;
  }
}

export default async function DynamicBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const sections: ArticleSection[] = article.sections || [];
  const faqSection = sections.find(s => s.type === 'faq');
  const faqItems = faqSection?.questions || [];
  const contentSections = sections.filter(s => s.type !== 'faq');

  const formattedDate = new Date(article.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <BlogArticle
      title={article.title}
      date={formattedDate}
      readTime={article.read_time || '5 min'}
      category={article.category || 'Formation'}
      faqItems={faqItems.length > 0 ? faqItems : undefined}
    >
      {contentSections.map(section => renderSection(section))}
    </BlogArticle>
  );
}

export const revalidate = 60; // Revalidate every minute

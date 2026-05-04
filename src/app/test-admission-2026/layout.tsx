import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Test d'admission 2026 — BTS Biologie Médicale | Linova",
  description:
    "QCM d'admission 2026 au BTS Biologie Médicale de Linova Éducation. 20 questions portant sur l'hygiène, la biologie, la biochimie, l'hématologie, la chimie et la traçabilité.",
  alternates: { canonical: '/test-admission-2026' },
  robots: { index: false, follow: false },
};

export default function TestAdmissionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

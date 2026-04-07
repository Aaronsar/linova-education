import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dossier d'inscription - BTS Biologie Medicale Alternance",
  robots: { index: false, follow: false },
};

export default function DossierLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

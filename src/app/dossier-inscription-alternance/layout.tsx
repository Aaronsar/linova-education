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
  return (
    <>
      <style>{`
        header.sticky, footer { display: none !important; }
        main { margin: 0 !important; padding: 0 !important; }
      `}</style>
      {children}
    </>
  );
}

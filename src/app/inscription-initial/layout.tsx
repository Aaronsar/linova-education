import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dossier d'inscription — BTS Biologie Médicale Formation initiale",
  robots: { index: false, follow: false },
};

export default function InscriptionInitialLayout({
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

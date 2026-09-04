import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dossier d'inscription — BTS Biologie Médicale, entrée en 2ᵉ année",
  robots: { index: false, follow: false },
};

export default function InscriptionInitial2aLayout({
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

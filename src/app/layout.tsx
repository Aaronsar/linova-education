import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Linova Éducation - L'école des métiers de la santé",
    template: "%s | Linova Éducation",
  },
  description:
    "Linova Éducation, école spécialisée dans les métiers de la santé à Paris. BTS Biologie Médicale en initial et alternance. Certification Qualiopi.",
  keywords: [
    "BTS Biologie Médicale",
    "école santé Paris",
    "formation laboratoire",
    "alternance santé",
    "Linova",
    "Qualiopi",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Linova Éducation",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

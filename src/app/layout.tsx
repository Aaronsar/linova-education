import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CandidaterModal from "@/components/CandidaterModal";
import BrochureModal from "@/components/BrochureModal";

export const metadata: Metadata = {
  metadataBase: new URL("https://linova-education.fr"),
  title: {
    default: "Linova Éducation - L'école des métiers de la santé à Paris",
    template: "%s | Linova Éducation",
  },
  description:
    "Linova Éducation, école spécialisée dans les métiers de la santé à Paris 12e. BTS Biologie Médicale en initial et alternance. Certification Qualiopi. 80% d'insertion à 6 mois.",
  keywords: [
    "BTS Biologie Médicale",
    "BTS Biologie Médicale Paris",
    "école santé Paris",
    "formation laboratoire",
    "alternance biologie médicale",
    "technicien laboratoire formation",
    "Linova Éducation",
    "Qualiopi",
    "formation santé alternance",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Linova Éducation",
    title: "Linova Éducation - L'école des métiers de la santé",
    description:
      "BTS Biologie Médicale en initial et alternance à Paris. École certifiée Qualiopi. 80% d'insertion professionnelle à 6 mois.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linova Éducation - L'école des métiers de la santé",
    description: "BTS Biologie Médicale en initial et alternance à Paris. Certifié Qualiopi.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Linova Éducation",
  url: "https://linova-education.fr",
  logo: "https://linova-education.fr/images/logo.png",
  description:
    "École spécialisée dans les métiers de la santé à Paris. BTS Biologie Médicale en initial et alternance.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "85 Avenue Ledru-Rollin",
    addressLocality: "Paris",
    postalCode: "75012",
    addressCountry: "FR",
  },
  telephone: "+33189719944",
  email: "contact@linova-education.fr",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Formations",
    itemListElement: [
      {
        "@type": "Course",
        name: "BTS Biologie Médicale",
        description:
          "Diplôme national en 2 ans pour devenir technicien de laboratoire médical. RNCP 40027.",
        provider: { "@type": "EducationalOrganization", name: "Linova Éducation" },
        timeRequired: "P2Y",
        educationalCredentialAwarded: "BTS Biologie Médicale (RNCP 40027)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CandidaterModal />
        <BrochureModal />
      </body>
    </html>
  );
}

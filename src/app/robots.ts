import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dossier-inscription-alternance', '/espace-candidature'],
    },
    sitemap: 'https://linova-education.fr/sitemap.xml',
  };
}

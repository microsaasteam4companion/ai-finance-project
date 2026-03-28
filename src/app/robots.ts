import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'], // Protect private paths
    },
    sitemap: 'https://fingenius.entrext.com/sitemap.xml',
  };
}

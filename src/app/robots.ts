import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/knowledge',
          '/knowledge/*',
          '/fraud-prevention',
          '/security',
          '/privacy',
          '/terms',
          '/contact',
          '/report',
          '/report/track',
        ],
        disallow: ['/authority/*', '/api/authority/*', '/api/auth/*'],
      },
    ],
    sitemap: 'https://edsecurehub.gov/sitemap.xml',
  };
}

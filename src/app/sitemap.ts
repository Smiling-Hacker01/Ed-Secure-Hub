import { MetadataRoute } from 'next';
import { SEED_BLOG_POSTS } from '@/lib/db/seed-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://edsecurehub.gov';

  const staticRoutes = [
    '',
    '/about',
    '/knowledge',
    '/fraud-prevention',
    '/report',
    '/report/track',
    '/security',
    '/privacy',
    '/terms',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const blogRoutes = SEED_BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/knowledge/${post.slug}`,
    lastModified: post.published_at,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}

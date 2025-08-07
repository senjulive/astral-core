import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

const APP_URL = env.NEXT_PUBLIC_APP_URL || 'https://astralcore.io';

// Static routes that should be included in sitemap
const staticRoutes = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/dashboard', priority: 0.9, changefreq: 'daily' },
  { path: '/about', priority: 0.8, changefreq: 'weekly' },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/login', priority: 0.6, changefreq: 'monthly' },
  { path: '/register', priority: 0.6, changefreq: 'monthly' },
  { path: '/help', priority: 0.6, changefreq: 'weekly' },
  { path: '/faq', priority: 0.6, changefreq: 'weekly' },
  { path: '/terms', priority: 0.4, changefreq: 'yearly' },
  { path: '/privacy', priority: 0.4, changefreq: 'yearly' },
];

function generateSitemapXML(routes: typeof staticRoutes): string {
  const currentDate = new Date().toISOString();

  const urlEntries = routes
    .map(
      (route) => `
  <url>
    <loc>${APP_URL}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml" 
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${urlEntries}
</urlset>`;
}

export async function GET() {
  try {
    // In a real application, you might want to fetch dynamic routes from your database
    // For example: blog posts, user profiles, product pages, etc.
    const allRoutes = [...staticRoutes];

    // Add dynamic routes if needed
    // const dynamicRoutes = await fetchDynamicRoutes();
    // allRoutes.push(...dynamicRoutes);

    const sitemap = generateSitemapXML(allRoutes);

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, must-revalidate', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

// Function to fetch dynamic routes (example)
// async function fetchDynamicRoutes() {
//   try {
//     // Example: Fetch blog posts
//     // const posts = await db.posts.findMany({ where: { published: true } });
//     // return posts.map(post => ({
//     //   path: `/blog/${post.slug}`,
//     //   priority: 0.7,
//     //   changefreq: 'weekly' as const,
//     // }));
//     return [];
//   } catch (error) {
//     console.error('Error fetching dynamic routes:', error);
//     return [];
//   }
// }

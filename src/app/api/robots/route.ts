import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

const APP_URL = env.NEXT_PUBLIC_APP_URL || 'https://astralcore.io';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin areas
Disallow: /admin/
Disallow: /moderator/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow important pages
Allow: /api/sitemap
Allow: /api/robots

# Specific bot instructions
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Social media crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# SEO crawlers
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10

User-agent: MJ12bot
Crawl-delay: 10

# Block aggressive crawlers
User-agent: BLEXBot
Disallow: /

User-agent: DataForSeoBot
Disallow: /

# Sitemap location
Sitemap: ${APP_URL}/sitemap.xml
Sitemap: ${APP_URL}/api/sitemap

# Crawl delay for general bots
Crawl-delay: 1`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, must-revalidate', // Cache for 24 hours
    },
  });
}

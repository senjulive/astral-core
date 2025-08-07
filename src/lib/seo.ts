import { Metadata } from 'next';
import { env } from './env';

const APP_NAME = env.NEXT_PUBLIC_APP_NAME;
const APP_URL = env.NEXT_PUBLIC_APP_URL || 'https://astralcore.io';
const DEFAULT_DESCRIPTION = 'Advanced Trading Platform - AstralCore Hyperdrive Technology for Professional Cryptocurrency Trading';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  canonical?: string;
  type?: 'website' | 'article';
}

export function generateMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image = '/og-image.png',
  noindex = false,
  canonical,
  type = 'website',
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} - Advanced Trading Platform`;
  const imageUrl = image.startsWith('http') ? image : `${APP_URL}${image}`;

  return {
    title: fullTitle,
    description,
    applicationName: APP_NAME,
    authors: [{ name: 'AstralCore Team' }],
    keywords: [
      'trading platform',
      'cryptocurrency',
      'blockchain',
      'astralcore',
      'hyperdrive',
      'crypto trading',
      'trading bot',
      'portfolio management',
      'defi',
      'financial technology',
    ],
    creator: 'AstralCore',
    publisher: 'AstralCore',
    formatDetection: {
      telephone: false,
    },
    metadataBase: new URL(APP_URL),
    alternates: {
      canonical: canonical || '',
    },
    openGraph: {
      type,
      locale: 'en_US',
      url: canonical || APP_URL,
      title: fullTitle,
      description,
      siteName: APP_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${APP_NAME} - ${title || 'Advanced Trading Platform'}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@astralcore',
      creator: '@astralcore',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    verification: {
      google: 'your-google-site-verification',
      yandex: 'your-yandex-verification',
      yahoo: 'your-yahoo-verification',
    },
    category: 'finance',
  };
}

export function generateStructuredData({
  title,
  description = DEFAULT_DESCRIPTION,
  image = '/og-image.png',
  type = 'WebApplication',
}: {
  title?: string;
  description?: string;
  image?: string;
  type?: 'WebApplication' | 'Article' | 'Product';
}) {
  const imageUrl = image.startsWith('http') ? image : `${APP_URL}${image}`;

  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    name: title || APP_NAME,
    description,
    url: APP_URL,
    image: imageUrl,
    author: {
      '@type': 'Organization',
      name: 'AstralCore',
      url: APP_URL,
    },
  };

  if (type === 'WebApplication') {
    return {
      ...baseStructuredData,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Advanced Trading Tools',
        'Real-time Market Data',
        'Portfolio Management',
        'Automated Trading Bots',
        'Risk Management',
      ],
    };
  }

  if (type === 'Article') {
    return {
      ...baseStructuredData,
      '@type': 'Article',
      headline: title,
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      publisher: {
        '@type': 'Organization',
        name: 'AstralCore',
        logo: {
          '@type': 'ImageObject',
          url: `${APP_URL}/logo.png`,
        },
      },
    };
  }

  return baseStructuredData;
}

// SEO-friendly URL slug generator
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Breadcrumb generator
export function generateBreadcrumbs(path: string) {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: APP_URL,
    },
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      '@type': 'ListItem',
      position: index + 2,
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      item: `${APP_URL}${currentPath}`,
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs,
  };
}

// FAQ structured data generator
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Organization structured data
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: APP_URL,
    logo: `${APP_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'Customer Service',
      email: 'support@astralcore.io',
    },
    sameAs: [
      'https://twitter.com/astralcore',
      'https://linkedin.com/company/astralcore',
      'https://github.com/astralcore',
    ],
    foundingDate: '2024',
    description: DEFAULT_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
  };
}

// Product structured data for trading features
export function generateProductStructuredData(productName: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description,
    brand: {
      '@type': 'Brand',
      name: APP_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
    },
  };
}

// Meta tags for social sharing
export function getSocialMetaTags({
  title,
  description = DEFAULT_DESCRIPTION,
  image = '/og-image.png',
  url = APP_URL,
}: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}) {
  const fullTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} - Advanced Trading Platform`;
  const imageUrl = image.startsWith('http') ? image : `${APP_URL}${image}`;

  return [
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: APP_NAME },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: url },
    { property: 'og:locale', content: 'en_US' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@astralcore' },
    { name: 'twitter:creator', content: '@astralcore' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },

    // Additional meta tags
    { name: 'description', content: description },
    { name: 'keywords', content: 'trading, cryptocurrency, blockchain, astralcore, hyperdrive' },
    { name: 'author', content: 'AstralCore Team' },
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow' },
  ];
}

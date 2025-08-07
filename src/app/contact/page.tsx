import { DynamicPage } from '@/components/dynamic-page';
import * as fs from 'fs/promises';
import * as path from 'path';
import { type WebPage } from '@/hooks/use-web-pages';

async function getPageData(): Promise<WebPage | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'web-pages.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const pages: WebPage[] = JSON.parse(data);
    return pages.find(page => page.route === '/contact') || null;
  } catch (error) {
    console.error('Error loading page data:', error);
    return null;
  }
}

export default async function ContactPage() {
  const pageData = await getPageData();
  
  if (!pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Our Team</h1>
          <p className="text-xl text-gray-300 mb-8">
            Get in touch with our expert team for support and inquiries.
          </p>
          <a 
            href="mailto:support@astralcore.com"
            className="text-blue-400 hover:text-blue-300 text-lg font-medium"
          >
            support@astralcore.com
          </a>
        </div>
      </div>
    );
  }

  return <DynamicPage page={pageData} />;
}

export const metadata = {
  title: 'Contact Us - AstralCore',
  description: 'Get in touch with our team for support and inquiries.',
};

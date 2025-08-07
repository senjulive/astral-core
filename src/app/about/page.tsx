import { DynamicPage } from '@/components/dynamic-page';
import * as fs from 'fs/promises';
import * as path from 'path';
import { type WebPage } from '@/hooks/use-web-pages';

async function getPageData(): Promise<WebPage | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'web-pages.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const pages: WebPage[] = JSON.parse(data);
    return pages.find(page => page.route === '/about') || null;
  } catch (error) {
    console.error('Error loading page data:', error);
    return null;
  }
}

export default async function AboutPage() {
  const pageData = await getPageData();
  
  if (!pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">About AstralCore</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We are pioneering the future of quantum trading technology, combining advanced artificial intelligence 
            with revolutionary blockchain protocols to create the most sophisticated trading platform ever conceived.
          </p>
        </div>
      </div>
    );
  }

  return <DynamicPage page={pageData} />;
}

export const metadata = {
  title: 'About Us - AstralCore',
  description: 'Learn about AstralCore and our mission to revolutionize quantum trading technology.',
};

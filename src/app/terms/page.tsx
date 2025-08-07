import { DynamicPage } from '@/components/dynamic-page';
import * as fs from 'fs/promises';
import * as path from 'path';
import { type WebPage } from '@/hooks/use-web-pages';

async function getPageData(): Promise<WebPage | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'web-pages.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const pages: WebPage[] = JSON.parse(data);
    return pages.find(page => page.route === '/terms') || null;
  } catch (error) {
    console.error('Error loading page data:', error);
    return null;
  }
}

export default async function TermsPage() {
  const pageData = await getPageData();
  
  if (!pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-gray-300 mb-6">
              By using AstralCore services, you agree to these terms and conditions.
            </p>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Use License</h2>
            <p className="text-gray-300 mb-4">
              Permission is granted to temporarily access and use AstralCore services for personal, non-commercial transitory viewing only.
            </p>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Disclaimer</h2>
            <p className="text-gray-300 mb-4">
              The materials on AstralCore's website are provided on an 'as is' basis. AstralCore makes no warranties, expressed or implied.
            </p>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Limitations</h2>
            <p className="text-gray-300 mb-4">
              In no event shall AstralCore or its suppliers be liable for any damages arising out of the use or inability to use the materials.
            </p>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Governing Law</h2>
            <p className="text-gray-300 mb-4">
              These terms and conditions are governed by and construed in accordance with applicable laws.
            </p>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about these terms, please contact us at{' '}
              <a href="mailto:legal@astralcore.com" className="text-blue-400 hover:text-blue-300">
                legal@astralcore.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <DynamicPage page={pageData} />;
}

export const metadata = {
  title: 'Terms of Service - AstralCore',
  description: 'Read the terms and conditions for using AstralCore services.',
};

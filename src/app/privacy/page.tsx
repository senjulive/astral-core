import { DynamicPage } from '@/components/dynamic-page';
import * as fs from 'fs/promises';
import * as path from 'path';
import { type WebPage } from '@/hooks/use-web-pages';

async function getPageData(): Promise<WebPage | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'web-pages.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const pages: WebPage[] = JSON.parse(data);
    return pages.find(page => page.route === '/privacy') || null;
  } catch (error) {
    console.error('Error loading page data:', error);
    return null;
  }
}

export default async function PrivacyPage() {
  const pageData = await getPageData();
  
  if (!pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-gray-300 mb-6">
              At AstralCore, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.
            </p>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Information We Collect</h2>
            <p className="text-gray-300 mb-4">
              We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
            </p>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">
              We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
            </p>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Information Sharing</h2>
            <p className="text-gray-300 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Security</h2>
            <p className="text-gray-300 mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about this privacy policy, please contact us at{' '}
              <a href="mailto:privacy@astralcore.com" className="text-blue-400 hover:text-blue-300">
                privacy@astralcore.com
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
  title: 'Privacy Policy - AstralCore',
  description: 'Learn about how AstralCore protects your privacy and personal information.',
};

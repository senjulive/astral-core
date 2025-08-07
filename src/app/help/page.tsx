import { DynamicPage } from '@/components/dynamic-page';
import * as fs from 'fs/promises';
import * as path from 'path';
import { type WebPage } from '@/hooks/use-web-pages';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, BookOpen, MessageCircle, Settings, Shield, Zap } from 'lucide-react';

async function getPageData(): Promise<WebPage | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'web-pages.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const pages: WebPage[] = JSON.parse(data);
    return pages.find(page => page.route === '/help') || null;
  } catch (error) {
    console.error('Error loading page data:', error);
    return null;
  }
}

export default async function HelpPage() {
  const pageData = await getPageData();
  
  if (!pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="pt-16 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
              <p className="text-xl text-gray-300">
                Everything you need to know about using AstralCore
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Getting Started
                  </CardTitle>
                  <CardDescription>
                    Quick start guide and basic setup
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    Learn how to create your account and start trading with quantum technology.
                  </p>
                  <Link href="/faq">
                    <Button variant="outline" size="sm">
                      View Guide
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-400" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    Configure your trading settings, security, and profile information.
                  </p>
                  <Link href="/dashboard/security">
                    <Button variant="outline" size="sm">
                      Manage Account
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Security
                  </CardTitle>
                  <CardDescription>
                    Keep your account safe and secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    Learn about our security features and how to protect your account.
                  </p>
                  <Link href="/dashboard/security">
                    <Button variant="outline" size="sm">
                      Security Settings
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    Trading Guide
                  </CardTitle>
                  <CardDescription>
                    Master quantum trading strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    Comprehensive guide to using our quantum trading algorithms.
                  </p>
                  <Link href="/dashboard/trading">
                    <Button variant="outline" size="sm">
                      Learn Trading
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-cyan-400" />
                    Support Chat
                  </CardTitle>
                  <CardDescription>
                    Get real-time help from our team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    Chat with our support team for immediate assistance.
                  </p>
                  <Link href="/dashboard/support">
                    <Button variant="outline" size="sm">
                      Start Chat
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-orange-400" />
                    FAQ
                  </CardTitle>
                  <CardDescription>
                    Frequently asked questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    Find quick answers to common questions.
                  </p>
                  <Link href="/faq">
                    <Button variant="outline" size="sm">
                      View FAQ
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
              <p className="text-gray-300 mb-6">
                Our support team is available 24/7 to assist you
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                    Contact Support
                  </Button>
                </Link>
                <a href="mailto:support@astralcore.com">
                  <Button variant="outline">
                    Email Us
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <DynamicPage page={pageData} />;
}

export const metadata = {
  title: 'Help Center - AstralCore',
  description: 'Get help and support for using AstralCore quantum trading platform.',
};

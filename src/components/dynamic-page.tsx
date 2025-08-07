'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MainNav } from '@/components/navigation/main-nav';
import { type WebPage, type PageContent } from '@/hooks/use-web-pages';

interface DynamicPageProps {
  page: WebPage;
}

export function DynamicPage({ page }: DynamicPageProps) {
  const renderContent = (content: PageContent) => {
    const baseClasses = content.metadata?.className || '';
    const style = content.metadata?.style ? JSON.parse(content.metadata.style) : undefined;

    switch (content.type) {
      case 'text':
        return (
          <div 
            key={content.id}
            className={baseClasses}
            style={style}
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        );

      case 'image':
        return (
          <div key={content.id} className="relative">
            <Image
              src={content.content}
              alt={content.metadata?.alt || 'Image'}
              width={800}
              height={400}
              className={baseClasses}
              style={style}
            />
          </div>
        );

      case 'link':
        const href = content.metadata?.href || '#';
        const isExternal = href.startsWith('http') || href.startsWith('mailto:');
        
        if (isExternal) {
          return (
            <a
              key={content.id}
              href={href}
              className={baseClasses}
              style={style}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.content}
            </a>
          );
        }

        return (
          <Link
            key={content.id}
            href={href}
            className={baseClasses}
            style={style}
          >
            {content.content}
          </Link>
        );

      case 'button':
        const buttonHref = content.metadata?.href || '#';
        const isExternalButton = buttonHref.startsWith('http') || buttonHref.startsWith('mailto:');
        
        if (isExternalButton) {
          return (
            <a
              key={content.id}
              href={buttonHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                className={baseClasses}
                style={style}
              >
                {content.content}
              </Button>
            </a>
          );
        }

        return (
          <Link key={content.id} href={buttonHref}>
            <Button 
              className={baseClasses}
              style={style}
            >
              {content.content}
            </Button>
          </Link>
        );

      case 'badge':
        return (
          <Badge 
            key={content.id}
            className={baseClasses}
            style={style}
          >
            {content.content}
          </Badge>
        );

      default:
        return (
          <div key={content.id} className={baseClasses} style={style}>
            {content.content}
          </div>
        );
    }
  };

  const groupContentBySection = (content: PageContent[]) => {
    const sections: { [key: string]: PageContent[] } = {};
    content.forEach(item => {
      if (!sections[item.section]) {
        sections[item.section] = [];
      }
      sections[item.section].push(item);
    });
    return sections;
  };

  const sections = groupContentBySection(page.content);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Navigation */}
      <MainNav />

      {/* Page Content */}
      <main className="pt-16">
        {Object.entries(sections).map(([sectionName, sectionContent]) => (
          <section 
            key={sectionName}
            className={`py-12 px-4 ${
              sectionName === 'hero' ? 'py-20 text-center' : ''
            }`}
          >
            <div className="max-w-7xl mx-auto">
              <div className={`space-y-6 ${
                sectionName === 'hero' ? 'space-y-8' : ''
              }`}>
                {sectionContent.map(renderContent)}
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold text-white">AstralCore</span>
              </div>
              <p className="text-gray-400 text-sm">
                Quantum trading technology for the future
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Dashboard
                </Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Pricing
                </Link>
                <Link href="/features" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Features
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <Link href="/help" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Help Center
                </Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Contact Us
                </Link>
                <Link href="/faq" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  FAQ
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 AstralCore. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

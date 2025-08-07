'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Users, 
  Mail, 
  Shield, 
  HelpCircle, 
  Settings, 
  ShoppingCart,
  Briefcase,
  Newspaper,
  Map
} from 'lucide-react';
import { type WebPage } from '@/hooks/use-web-pages';

interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Business' | 'Legal' | 'Support' | 'Marketing';
  icon: React.ReactNode;
  route: string;
  pageData: Omit<WebPage, 'id' | 'lastModified'>;
}

const pageTemplates: PageTemplate[] = [
  // Business Pages
  {
    id: 'about-us',
    name: 'About Us',
    description: 'Company information and mission',
    category: 'Business',
    icon: <Users className="w-5 h-5" />,
    route: '/about',
    pageData: {
      name: 'About Us',
      route: '/about',
      title: 'About Us - AstralCore',
      description: 'Learn about AstralCore and our mission',
      status: 'draft',
      content: [
        {
          id: 'about-hero-title',
          pageId: 'about',
          section: 'hero',
          type: 'text',
          content: 'About AstralCore',
          metadata: {
            className: 'text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent text-center'
          }
        },
        {
          id: 'about-description',
          pageId: 'about',
          section: 'hero',
          type: 'text',
          content: 'We are pioneering the future of quantum trading technology',
          metadata: {
            className: 'text-xl text-gray-300 text-center max-w-2xl mx-auto'
          }
        }
      ]
    }
  },
  {
    id: 'contact-us',
    name: 'Contact Us',
    description: 'Contact information and form',
    category: 'Business',
    icon: <Mail className="w-5 h-5" />,
    route: '/contact',
    pageData: {
      name: 'Contact Us',
      route: '/contact',
      title: 'Contact Us - AstralCore',
      description: 'Get in touch with our team',
      status: 'draft',
      content: [
        {
          id: 'contact-title',
          pageId: 'contact',
          section: 'hero',
          type: 'text',
          content: 'Contact Our Team',
          metadata: {
            className: 'text-4xl font-bold text-white text-center'
          }
        },
        {
          id: 'contact-email',
          pageId: 'contact',
          section: 'contact-info',
          type: 'link',
          content: 'support@astralcore.com',
          metadata: {
            className: 'text-blue-400 hover:text-blue-300 text-lg',
            href: 'mailto:support@astralcore.com'
          }
        }
      ]
    }
  },
  {
    id: 'services',
    name: 'Services',
    description: 'Company services and offerings',
    category: 'Business',
    icon: <Briefcase className="w-5 h-5" />,
    route: '/services',
    pageData: {
      name: 'Services',
      route: '/services',
      title: 'Services - AstralCore',
      description: 'Explore our quantum trading services',
      status: 'draft',
      content: [
        {
          id: 'services-title',
          pageId: 'services',
          section: 'hero',
          type: 'text',
          content: 'Our Services',
          metadata: {
            className: 'text-4xl font-bold text-white text-center'
          }
        },
        {
          id: 'services-subtitle',
          pageId: 'services',
          section: 'hero',
          type: 'text',
          content: 'Advanced quantum trading solutions for everyone',
          metadata: {
            className: 'text-xl text-gray-300 text-center'
          }
        }
      ]
    }
  },

  // Legal Pages
  {
    id: 'privacy-policy',
    name: 'Privacy Policy',
    description: 'Privacy policy and data protection',
    category: 'Legal',
    icon: <Shield className="w-5 h-5" />,
    route: '/privacy',
    pageData: {
      name: 'Privacy Policy',
      route: '/privacy',
      title: 'Privacy Policy - AstralCore',
      description: 'How we protect your privacy and data',
      status: 'draft',
      content: [
        {
          id: 'privacy-title',
          pageId: 'privacy',
          section: 'hero',
          type: 'text',
          content: 'Privacy Policy',
          metadata: {
            className: 'text-4xl font-bold text-white'
          }
        },
        {
          id: 'privacy-intro',
          pageId: 'privacy',
          section: 'content',
          type: 'text',
          content: 'At AstralCore, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.',
          metadata: {
            className: 'text-lg text-gray-300 leading-relaxed'
          }
        }
      ]
    }
  },
  {
    id: 'terms-of-service',
    name: 'Terms of Service',
    description: 'Terms and conditions',
    category: 'Legal',
    icon: <FileText className="w-5 h-5" />,
    route: '/terms',
    pageData: {
      name: 'Terms of Service',
      route: '/terms',
      title: 'Terms of Service - AstralCore',
      description: 'Terms and conditions for using our platform',
      status: 'draft',
      content: [
        {
          id: 'terms-title',
          pageId: 'terms',
          section: 'hero',
          type: 'text',
          content: 'Terms of Service',
          metadata: {
            className: 'text-4xl font-bold text-white'
          }
        },
        {
          id: 'terms-intro',
          pageId: 'terms',
          section: 'content',
          type: 'text',
          content: 'By using AstralCore services, you agree to these terms and conditions.',
          metadata: {
            className: 'text-lg text-gray-300 leading-relaxed'
          }
        }
      ]
    }
  },

  // Support Pages
  {
    id: 'faq',
    name: 'FAQ',
    description: 'Frequently asked questions',
    category: 'Support',
    icon: <HelpCircle className="w-5 h-5" />,
    route: '/faq',
    pageData: {
      name: 'FAQ',
      route: '/faq',
      title: 'FAQ - AstralCore',
      description: 'Frequently asked questions and answers',
      status: 'draft',
      content: [
        {
          id: 'faq-title',
          pageId: 'faq',
          section: 'hero',
          type: 'text',
          content: 'Frequently Asked Questions',
          metadata: {
            className: 'text-4xl font-bold text-white text-center'
          }
        },
        {
          id: 'faq-subtitle',
          pageId: 'faq',
          section: 'hero',
          type: 'text',
          content: 'Find answers to common questions about AstralCore',
          metadata: {
            className: 'text-xl text-gray-300 text-center'
          }
        }
      ]
    }
  },
  {
    id: 'help-center',
    name: 'Help Center',
    description: 'Support documentation and guides',
    category: 'Support',
    icon: <Settings className="w-5 h-5" />,
    route: '/help',
    pageData: {
      name: 'Help Center',
      route: '/help',
      title: 'Help Center - AstralCore',
      description: 'Get help and support for AstralCore',
      status: 'draft',
      content: [
        {
          id: 'help-title',
          pageId: 'help',
          section: 'hero',
          type: 'text',
          content: 'Help Center',
          metadata: {
            className: 'text-4xl font-bold text-white text-center'
          }
        },
        {
          id: 'help-description',
          pageId: 'help',
          section: 'hero',
          type: 'text',
          content: 'Everything you need to know about using AstralCore',
          metadata: {
            className: 'text-xl text-gray-300 text-center'
          }
        }
      ]
    }
  },

  // Marketing Pages
  {
    id: 'pricing',
    name: 'Pricing',
    description: 'Pricing plans and packages',
    category: 'Marketing',
    icon: <ShoppingCart className="w-5 h-5" />,
    route: '/pricing',
    pageData: {
      name: 'Pricing',
      route: '/pricing',
      title: 'Pricing - AstralCore',
      description: 'Choose the perfect plan for your trading needs',
      status: 'draft',
      content: [
        {
          id: 'pricing-title',
          pageId: 'pricing',
          section: 'hero',
          type: 'text',
          content: 'Pricing Plans',
          metadata: {
            className: 'text-4xl font-bold text-white text-center'
          }
        },
        {
          id: 'pricing-subtitle',
          pageId: 'pricing',
          section: 'hero',
          type: 'text',
          content: 'Choose the perfect plan for your quantum trading journey',
          metadata: {
            className: 'text-xl text-gray-300 text-center'
          }
        }
      ]
    }
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'News and articles',
    category: 'Marketing',
    icon: <Newspaper className="w-5 h-5" />,
    route: '/blog',
    pageData: {
      name: 'Blog',
      route: '/blog',
      title: 'Blog - AstralCore',
      description: 'Latest news and insights from AstralCore',
      status: 'draft',
      content: [
        {
          id: 'blog-title',
          pageId: 'blog',
          section: 'hero',
          type: 'text',
          content: 'AstralCore Blog',
          metadata: {
            className: 'text-4xl font-bold text-white text-center'
          }
        },
        {
          id: 'blog-subtitle',
          pageId: 'blog',
          section: 'hero',
          type: 'text',
          content: 'Latest insights from the quantum trading frontier',
          metadata: {
            className: 'text-xl text-gray-300 text-center'
          }
        }
      ]
    }
  }
];

interface PageTemplatesProps {
  onTemplateSelect: (template: PageTemplate) => void;
}

export function PageTemplates({ onTemplateSelect }: PageTemplatesProps) {
  const categories = ['Business', 'Legal', 'Support', 'Marketing'] as const;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Page Templates</h3>
        <p className="text-gray-300">Pre-built pages for common website needs</p>
      </div>

      {categories.map(category => (
        <div key={category}>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            {category === 'Business' && <Briefcase className="w-5 h-5 text-blue-400" />}
            {category === 'Legal' && <Shield className="w-5 h-5 text-red-400" />}
            {category === 'Support' && <HelpCircle className="w-5 h-5 text-green-400" />}
            {category === 'Marketing' && <ShoppingCart className="w-5 h-5 text-purple-400" />}
            {category}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageTemplates
              .filter(template => template.category === category)
              .map(template => (
                <Card 
                  key={template.id} 
                  className="bg-black/20 border-border/30 hover:border-border/50 transition-all duration-200 cursor-pointer group"
                  onClick={() => onTemplateSelect(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-400">
                        {template.icon}
                      </div>
                      <div>
                        <CardTitle className="text-white text-sm group-hover:text-blue-300 transition-colors">
                          {template.name}
                        </CardTitle>
                        <p className="text-xs text-gray-400 mt-1">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {template.route}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={
                          template.category === 'Business' ? 'border-blue-400/50 text-blue-300' :
                          template.category === 'Legal' ? 'border-red-400/50 text-red-300' :
                          template.category === 'Support' ? 'border-green-400/50 text-green-300' :
                          'border-purple-400/50 text-purple-300'
                        }
                      >
                        {template.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

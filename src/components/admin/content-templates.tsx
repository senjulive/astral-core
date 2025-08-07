'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Type, 
  Image, 
  Link, 
  Users, 
  Mail, 
  Shield, 
  FileText, 
  Zap,
  Star,
  Copy
} from 'lucide-react';
import { type PageContent } from '@/hooks/use-web-pages';

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Hero' | 'Content' | 'Navigation' | 'Media' | 'Call-to-Action';
  icon: React.ReactNode;
  content: Omit<PageContent, 'id' | 'pageId'>;
}

const contentTemplates: ContentTemplate[] = [
  // Hero Section Templates
  {
    id: 'hero-title-gradient',
    name: 'Gradient Hero Title',
    description: 'Large gradient title with quantum styling',
    category: 'Hero',
    icon: <Type className="w-5 h-5" />,
    content: {
      section: 'hero',
      type: 'text',
      content: 'Your Amazing Title Here',
      metadata: {
        className: 'text-4xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent'
      }
    }
  },
  {
    id: 'hero-subtitle',
    name: 'Hero Subtitle',
    description: 'Elegant subtitle with tracking',
    category: 'Hero',
    icon: <Type className="w-5 h-5" />,
    content: {
      section: 'hero',
      type: 'text',
      content: 'Your Subtitle Text',
      metadata: {
        className: 'text-xl sm:text-2xl text-gray-300 font-light tracking-wide'
      }
    }
  },
  {
    id: 'cta-button-primary',
    name: 'Primary CTA Button',
    description: 'Gradient call-to-action button',
    category: 'Call-to-Action',
    icon: <Zap className="w-5 h-5" />,
    content: {
      section: 'hero',
      type: 'button',
      content: 'Get Started Now',
      metadata: {
        className: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-all duration-300',
        href: '/register'
      }
    }
  },

  // Content Section Templates
  {
    id: 'section-title',
    name: 'Section Title',
    description: 'Clean section heading',
    category: 'Content',
    icon: <FileText className="w-5 h-5" />,
    content: {
      section: 'content',
      type: 'text',
      content: 'Section Title',
      metadata: {
        className: 'text-3xl sm:text-4xl font-bold text-white text-center'
      }
    }
  },
  {
    id: 'paragraph-text',
    name: 'Paragraph Text',
    description: 'Regular paragraph content',
    category: 'Content',
    icon: <Type className="w-5 h-5" />,
    content: {
      section: 'content',
      type: 'text',
      content: 'Your paragraph content goes here. This text will be displayed with proper spacing and typography.',
      metadata: {
        className: 'text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto'
      }
    }
  },
  {
    id: 'feature-card-title',
    name: 'Feature Card Title',
    description: 'Feature or service title',
    category: 'Content',
    icon: <Star className="w-5 h-5" />,
    content: {
      section: 'features',
      type: 'text',
      content: 'Feature Name',
      metadata: {
        className: 'text-xl font-semibold text-white'
      }
    }
  },

  // Media Templates
  {
    id: 'hero-image',
    name: 'Hero Image',
    description: 'Large hero section image',
    category: 'Media',
    icon: <Image className="w-5 h-5" />,
    content: {
      section: 'hero',
      type: 'image',
      content: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      metadata: {
        alt: 'Hero image description',
        className: 'w-full h-96 object-cover rounded-lg'
      }
    }
  },
  {
    id: 'feature-icon',
    name: 'Feature Icon',
    description: 'Small feature or service icon',
    category: 'Media',
    icon: <Shield className="w-5 h-5" />,
    content: {
      section: 'features',
      type: 'image',
      content: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100',
      metadata: {
        alt: 'Feature icon',
        className: 'w-16 h-16 rounded-lg'
      }
    }
  },

  // Navigation Templates
  {
    id: 'nav-link-primary',
    name: 'Primary Navigation Link',
    description: 'Main navigation link',
    category: 'Navigation',
    icon: <Link className="w-5 h-5" />,
    content: {
      section: 'navigation',
      type: 'link',
      content: 'Home',
      metadata: {
        className: 'text-white hover:text-blue-400 font-medium transition-colors',
        href: '/'
      }
    }
  },
  {
    id: 'footer-link',
    name: 'Footer Link',
    description: 'Footer navigation link',
    category: 'Navigation',
    icon: <Link className="w-5 h-5" />,
    content: {
      section: 'footer',
      type: 'link',
      content: 'Privacy Policy',
      metadata: {
        className: 'text-gray-400 hover:text-white text-sm transition-colors',
        href: '/privacy'
      }
    }
  },

  // Special Templates
  {
    id: 'contact-email',
    name: 'Contact Email',
    description: 'Email contact link',
    category: 'Call-to-Action',
    icon: <Mail className="w-5 h-5" />,
    content: {
      section: 'contact',
      type: 'link',
      content: 'contact@astralcore.com',
      metadata: {
        className: 'text-blue-400 hover:text-blue-300 font-medium',
        href: 'mailto:contact@astralcore.com'
      }
    }
  },
  {
    id: 'team-member',
    name: 'Team Member',
    description: 'Team member information',
    category: 'Content',
    icon: <Users className="w-5 h-5" />,
    content: {
      section: 'team',
      type: 'text',
      content: 'John Doe - CEO & Founder',
      metadata: {
        className: 'text-lg font-semibold text-white'
      }
    }
  }
];

interface ContentTemplatesProps {
  onTemplateSelect: (template: ContentTemplate) => void;
}

export function ContentTemplates({ onTemplateSelect }: ContentTemplatesProps) {
  const categories = ['Hero', 'Content', 'Navigation', 'Media', 'Call-to-Action'] as const;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Content Templates</h3>
        <p className="text-gray-300">Quick-start templates for common content types</p>
      </div>

      {categories.map(category => (
        <div key={category}>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            {category === 'Hero' && <Zap className="w-5 h-5 text-yellow-400" />}
            {category === 'Content' && <FileText className="w-5 h-5 text-blue-400" />}
            {category === 'Navigation' && <Link className="w-5 h-5 text-cyan-400" />}
            {category === 'Media' && <Image className="w-5 h-5 text-purple-400" />}
            {category === 'Call-to-Action' && <Star className="w-5 h-5 text-green-400" />}
            {category}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {contentTemplates
              .filter(template => template.category === category)
              .map(template => (
                <Card 
                  key={template.id} 
                  className="bg-black/20 border-border/30 hover:border-border/50 transition-all duration-200 cursor-pointer group"
                  onClick={() => onTemplateSelect(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-blue-400 mt-1">
                          {template.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-white text-sm group-hover:text-blue-300 transition-colors">
                            {template.name}
                          </h5>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {template.description}
                          </p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {template.content.type}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
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

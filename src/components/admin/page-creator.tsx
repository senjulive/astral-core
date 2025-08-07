'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useWebPages } from '@/hooks/use-web-pages';
import { PageLayouts } from './page-templates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, FileText, Layout } from 'lucide-react';

interface PageCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onPageCreated?: () => void;
}

export function PageCreator({ isOpen, onClose, onPageCreated }: PageCreatorProps) {
  const [formData, setFormData] = useState({
    name: '',
    route: '',
    title: '',
    description: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const { createPage } = useWebPages();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.route) {
      toast({
        title: 'Error',
        description: 'Name and route are required',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.route.startsWith('/')) {
      setFormData(prev => ({ ...prev, route: `/${prev.route}` }));
    }

    setIsCreating(true);
    try {
      await createPage(formData);
      setFormData({ name: '', route: '', title: '', description: '' });
      onClose();
      onPageCreated?.();
      toast({
        title: 'Success',
        description: 'Page created successfully'
      });
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsCreating(false);
    }
  };

  const handleLayoutSelect = async (template: any) => {
    setIsCreating(true);
    try {
      const pageData = {
        name: template.pageData.name,
        route: template.pageData.route,
        title: template.pageData.title,
        description: template.pageData.description
      };

      const newPage = await createPage(pageData);

      // Add template content to the new page
      if (template.pageData.content && template.pageData.content.length > 0) {
        // Note: In a real implementation, you'd want to batch add these contents
        // For now, we'll create the page and let the user add content manually
      }

      onClose();
      onPageCreated?.();
      toast({
        title: 'Success',
        description: `${template.name} page created successfully`
      });
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', route: '', title: '', description: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-black/80 backdrop-blur-xl border-border/40 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-400" />
                Create New Page
              </CardTitle>
              <CardDescription>
                Add a new page to your website
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="templates" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Layouts
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Custom
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-400">
                  Choose from pre-built page templates
                </p>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                <PageLayouts onLayoutSelect={handleLayoutSelect} />
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="page-name">Page Name *</Label>
                  <Input
                    id="page-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-black/20 border-border/40 text-white"
                    placeholder="e.g., Contact Us"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="page-route">Route *</Label>
                  <Input
                    id="page-route"
                    value={formData.route}
                    onChange={(e) => setFormData(prev => ({ ...prev, route: e.target.value }))}
                    className="bg-black/20 border-border/40 text-white"
                    placeholder="e.g., /contact"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Must start with / (e.g., /contact, /about)
                  </p>
                </div>

                <div>
                  <Label htmlFor="page-title">Page Title</Label>
                  <Input
                    id="page-title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-black/20 border-border/40 text-white"
                    placeholder="e.g., Contact Us - AstralCore"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Used for browser title and SEO
                  </p>
                </div>

                <div>
                  <Label htmlFor="page-description">Description</Label>
                  <Textarea
                    id="page-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-black/20 border-border/40 text-white"
                    placeholder="Brief description of the page content"
                    rows={3}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Used for meta description and SEO
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex-1"
                  >
                    {isCreating ? (
                      <>
                        <LoadingSpinner />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Page
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

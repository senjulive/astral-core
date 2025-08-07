'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useWebPages, type PageContent, type WebPage } from '@/hooks/use-web-pages';
import { WebEditorHelp } from './web-editor-help';
import { PageCreator } from './page-creator';
import { ContentTemplates } from './content-templates';
import { 
  Edit3, 
  Save, 
  RefreshCw, 
  Eye, 
  Image, 
  Type, 
  Palette, 
  Layout, 
  Monitor,
  Smartphone,
  FileText,
  Upload,
  Link,
  Settings,
  Trash2,
  Plus,
  Copy,
  Download
} from 'lucide-react';

export function WebPageEditor() {
  const {
    pages,
    isLoading,
    error,
    updateContent,
    addContent,
    deleteContent,
    updatePage,
    deletePage
  } = useWebPages();

  const [selectedPage, setSelectedPage] = useState<WebPage | null>(null);
  const [selectedContent, setSelectedContent] = useState<PageContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showPageCreator, setShowPageCreator] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (pages.length > 0 && !selectedPage) {
      setSelectedPage(pages[0]);
    }
  }, [pages, selectedPage]);

  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveContent = async () => {
    if (!selectedContent || !selectedPage) return;

    setIsSaving(true);
    try {
      await updateContent(selectedPage.id, selectedContent.id, selectedContent);
      // Update selected page with the latest data
      const updatedPage = pages.find(p => p.id === selectedPage.id);
      if (updatedPage) {
        setSelectedPage(updatedPage);
      }
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddContent = async () => {
    if (!selectedPage) return;

    try {
      const newContent = await addContent(selectedPage.id, {
        section: 'new-section',
        type: 'text',
        content: 'New content',
        metadata: {
          className: 'text-lg text-gray-300'
        }
      });

      // Update selected page and select the new content
      const updatedPage = pages.find(p => p.id === selectedPage.id);
      if (updatedPage) {
        setSelectedPage(updatedPage);
        setSelectedContent(newContent);
      }
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!selectedPage) return;

    try {
      await deleteContent(selectedPage.id, contentId);

      // Update selected page
      const updatedPage = pages.find(p => p.id === selectedPage.id);
      if (updatedPage) {
        setSelectedPage(updatedPage);
      }

      if (selectedContent?.id === contentId) {
        setSelectedContent(null);
      }
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDuplicateContent = async (content: PageContent) => {
    if (!selectedPage) return;

    try {
      const newContent = await addContent(selectedPage.id, {
        ...content,
        content: `${content.content} (Copy)`,
        metadata: content.metadata
      });

      // Update selected page
      const updatedPage = pages.find(p => p.id === selectedPage.id);
      if (updatedPage) {
        setSelectedPage(updatedPage);
      }
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return;
    }

    try {
      await deletePage(pageId);
      if (selectedPage?.id === pageId) {
        setSelectedPage(pages[0] || null);
      }
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleTemplateSelect = async (template: any) => {
    if (!selectedPage) {
      toast({
        title: 'No Page Selected',
        description: 'Please select a page first before adding template content',
        variant: 'destructive'
      });
      return;
    }

    try {
      const newContent = await addContent(selectedPage.id, template.content);

      // Update selected page and select the new content
      const updatedPage = pages.find(p => p.id === selectedPage.id);
      if (updatedPage) {
        setSelectedPage(updatedPage);
        setSelectedContent(newContent);
      }

      toast({
        title: 'Template Added',
        description: `${template.name} has been added to your page`
      });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const renderContentEditor = () => {
    if (!selectedContent) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a content item to edit</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Edit Content</h3>
            <p className="text-sm text-muted-foreground">ID: {selectedContent.id}</p>
          </div>
          <Badge variant="outline" className={
            selectedContent.type === 'text' ? 'border-blue-400/50 text-blue-300' :
            selectedContent.type === 'image' ? 'border-purple-400/50 text-purple-300' :
            selectedContent.type === 'link' ? 'border-cyan-400/50 text-cyan-300' :
            'border-gray-400/50 text-gray-300'
          }>
            {selectedContent.type}
          </Badge>
        </div>

        <div className="grid gap-4">
          <div>
            <Label htmlFor="content-section">Section</Label>
            <Input
              id="content-section"
              value={selectedContent.section}
              onChange={(e) => setSelectedContent({
                ...selectedContent,
                section: e.target.value
              })}
              className="bg-black/20 border-border/40 text-white"
            />
          </div>

          <div>
            <Label htmlFor="content-type">Type</Label>
            <select
              id="content-type"
              value={selectedContent.type}
              onChange={(e) => setSelectedContent({
                ...selectedContent,
                type: e.target.value as PageContent['type']
              })}
              className="w-full p-2 bg-black/20 border border-border/40 rounded-md text-white"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="link">Link</option>
              <option value="badge">Badge</option>
              <option value="button">Button</option>
            </select>
          </div>

          <div>
            <Label htmlFor="content-value">Content</Label>
            {selectedContent.type === 'text' ? (
              <Textarea
                id="content-value"
                value={selectedContent.content}
                onChange={(e) => setSelectedContent({
                  ...selectedContent,
                  content: e.target.value
                })}
                className="bg-black/20 border-border/40 text-white min-h-[100px]"
                placeholder="Enter text content..."
              />
            ) : (
              <Input
                id="content-value"
                value={selectedContent.content}
                onChange={(e) => setSelectedContent({
                  ...selectedContent,
                  content: e.target.value
                })}
                className="bg-black/20 border-border/40 text-white"
                placeholder={
                  selectedContent.type === 'image' ? 'Enter image URL...' :
                  selectedContent.type === 'link' ? 'Enter link URL...' :
                  'Enter content...'
                }
              />
            )}
          </div>

          {selectedContent.type === 'image' && (
            <div>
              <Label htmlFor="content-alt">Alt Text</Label>
              <Input
                id="content-alt"
                value={selectedContent.metadata?.alt || ''}
                onChange={(e) => setSelectedContent({
                  ...selectedContent,
                  metadata: {
                    ...selectedContent.metadata,
                    alt: e.target.value
                  }
                })}
                className="bg-black/20 border-border/40 text-white"
                placeholder="Enter alt text for accessibility..."
              />
            </div>
          )}

          {selectedContent.type === 'link' && (
            <div>
              <Label htmlFor="content-href">Link URL</Label>
              <Input
                id="content-href"
                value={selectedContent.metadata?.href || ''}
                onChange={(e) => setSelectedContent({
                  ...selectedContent,
                  metadata: {
                    ...selectedContent.metadata,
                    href: e.target.value
                  }
                })}
                className="bg-black/20 border-border/40 text-white"
                placeholder="Enter link destination..."
              />
            </div>
          )}

          <div>
            <Label htmlFor="content-className">CSS Classes</Label>
            <Textarea
              id="content-className"
              value={selectedContent.metadata?.className || ''}
              onChange={(e) => setSelectedContent({
                ...selectedContent,
                metadata: {
                  ...selectedContent.metadata,
                  className: e.target.value
                }
              })}
              className="bg-black/20 border-border/40 text-white"
              placeholder="Enter CSS classes..."
            />
          </div>

          <div>
            <Label htmlFor="content-style">Custom Styles</Label>
            <Textarea
              id="content-style"
              value={selectedContent.metadata?.style || ''}
              onChange={(e) => setSelectedContent({
                ...selectedContent,
                metadata: {
                  ...selectedContent.metadata,
                  style: e.target.value
                }
              })}
              className="bg-black/20 border-border/40 text-white"
              placeholder="Enter custom CSS styles..."
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSaveContent}
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isSaving ? (
              <>
                <LoadingSpinner />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setSelectedContent(null)}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Web Page Editor</h2>
          <p className="text-muted-foreground">
            Edit website content, text, images, and styling
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}
          >
            {previewMode === 'desktop' ? (
              <Monitor className="w-4 h-4 mr-2" />
            ) : (
              <Smartphone className="w-4 h-4 mr-2" />
            )}
            {previewMode === 'desktop' ? 'Desktop' : 'Mobile'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(selectedPage?.route || '/', '_blank')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Pages List */}
        <div className="lg:col-span-1">
          <Card className="bg-black/40 backdrop-blur-xl border-border/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Pages
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowPageCreator(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New
                </Button>
              </div>
              <div className="pt-2">
                <Input
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/20 border-border/40 text-white"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {filteredPages.map((page) => (
                    <div
                      key={page.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedPage?.id === page.id
                          ? 'border-blue-400/50 bg-blue-400/10'
                          : 'border-border/30 hover:border-border/50 hover:bg-muted/5'
                      }`}
                      onClick={() => setSelectedPage(page)}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white text-sm">{page.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              page.status === 'published' ? 'border-green-400/50 text-green-300' :
                              page.status === 'draft' ? 'border-yellow-400/50 text-yellow-300' :
                              'border-gray-400/50 text-gray-300'
                            }
                          >
                            {page.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePage(page.id);
                            }}
                            className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{page.route}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {page.content.length} content items
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="help" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="help">Help Guide</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Page Settings</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Content List */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Edit3 className="w-5 h-5" />
                        Content Items
                      </CardTitle>
                      <Button
                        size="sm"
                        onClick={handleAddContent}
                        className="bg-gradient-to-r from-green-500 to-emerald-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                    {selectedPage && (
                      <CardDescription>
                        {selectedPage.name} • {selectedPage.content.length} items
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-2">
                        {selectedPage?.content.map((content) => (
                          <div
                            key={content.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                              selectedContent?.id === content.id
                                ? 'border-blue-400/50 bg-blue-400/10'
                                : 'border-border/30 hover:border-border/50 hover:bg-muted/5'
                            }`}
                            onClick={() => setSelectedContent(content)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {content.type === 'text' && <Type className="w-4 h-4 text-blue-400" />}
                                {content.type === 'image' && <Image className="w-4 h-4 text-purple-400" />}
                                {content.type === 'link' && <Link className="w-4 h-4 text-cyan-400" />}
                                <span className="font-medium text-white text-sm">
                                  {content.section}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicateContent(content);
                                  }}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteContent(content.id);
                                  }}
                                >
                                  <Trash2 className="w-3 h-3 text-red-400" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {content.content}
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {content.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Content Editor */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Editor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderContentEditor()}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                <CardHeader>
                  <CardTitle className="text-white">Page Settings</CardTitle>
                  <CardDescription>
                    Configure page metadata and SEO settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPage && (
                    <>
                      <div>
                        <Label htmlFor="page-title">Page Title</Label>
                        <Input
                          id="page-title"
                          value={selectedPage.title}
                          onChange={(e) => setSelectedPage({
                            ...selectedPage,
                            title: e.target.value
                          })}
                          className="bg-black/20 border-border/40 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="page-description">Description</Label>
                        <Textarea
                          id="page-description"
                          value={selectedPage.description}
                          onChange={(e) => setSelectedPage({
                            ...selectedPage,
                            description: e.target.value
                          })}
                          className="bg-black/20 border-border/40 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="page-route">Route</Label>
                        <Input
                          id="page-route"
                          value={selectedPage.route}
                          onChange={(e) => setSelectedPage({
                            ...selectedPage,
                            route: e.target.value
                          })}
                          className="bg-black/20 border-border/40 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="page-status">Status</Label>
                        <select
                          id="page-status"
                          value={selectedPage.status}
                          onChange={(e) => setSelectedPage({
                            ...selectedPage,
                            status: e.target.value as WebPage['status']
                          })}
                          className="w-full p-2 bg-black/20 border border-border/40 rounded-md text-white"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      <Button
                        onClick={async () => {
                          if (selectedPage) {
                            try {
                              await updatePage(selectedPage.id, selectedPage);
                            } catch (error) {
                              // Error handled by hook
                            }
                          }
                        }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Page Settings
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="help" className="space-y-4">
              <WebEditorHelp />
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                <CardHeader>
                  <CardTitle className="text-white">Content Templates</CardTitle>
                  <CardDescription>
                    {selectedPage ?
                      `Click any template to add it to "${selectedPage.name}"` :
                      'Select a page first to use templates'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentTemplates onTemplateSelect={handleTemplateSelect} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Live Preview
                  </CardTitle>
                  <CardDescription>
                    Preview how your changes will look on the website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border border-border/40 rounded-lg overflow-hidden">
                    <div className={`bg-black/20 ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                      <iframe
                        src={selectedPage?.route || '/'}
                        className={`w-full border-0 ${previewMode === 'mobile' ? 'h-[600px]' : 'h-[800px]'}`}
                        title="Page Preview"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <PageCreator
        isOpen={showPageCreator}
        onClose={() => setShowPageCreator(false)}
        onPageCreated={() => {
          // Auto-select the new page when created
          if (pages.length > 0) {
            setSelectedPage(pages[pages.length - 1]);
          }
        }}
      />
    </div>
  );
}

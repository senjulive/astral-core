import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface PageContent {
  id: string;
  pageId: string;
  section: string;
  type: 'text' | 'image' | 'link' | 'badge' | 'button';
  content: string;
  metadata?: {
    className?: string;
    alt?: string;
    href?: string;
    style?: string;
  };
}

export interface WebPage {
  id: string;
  name: string;
  route: string;
  title: string;
  description: string;
  lastModified: string;
  status: 'published' | 'draft' | 'archived';
  content: PageContent[];
}

export function useWebPages() {
  const [pages, setPages] = useState<WebPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all web pages
  const fetchPages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/web-pages');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setPages(data.pages || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pages';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update page content
  const updatePage = async (pageId: string, updates: Partial<WebPage>) => {
    try {
      const response = await fetch('/api/admin/web-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId,
          pageSettings: updates.content ? undefined : updates,
          content: updates.content,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update local state
      setPages(prevPages =>
        prevPages.map(page =>
          page.id === pageId ? data.page : page
        )
      );

      toast({
        title: 'Success',
        description: 'Page updated successfully',
      });

      return data.page;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update page';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Update specific content item
  const updateContent = async (pageId: string, contentId: string, content: Partial<PageContent>) => {
    try {
      const response = await fetch('/api/admin/web-pages/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId,
          contentId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update local state
      setPages(prevPages =>
        prevPages.map(page => {
          if (page.id === pageId) {
            return {
              ...page,
              content: page.content.map(item =>
                item.id === contentId ? data.content : item
              ),
              lastModified: new Date().toISOString()
            };
          }
          return page;
        })
      );

      toast({
        title: 'Success',
        description: 'Content updated successfully',
      });

      return data.content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update content';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Add new content item
  const addContent = async (pageId: string, content: Partial<PageContent>) => {
    try {
      const response = await fetch('/api/admin/web-pages/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update local state
      setPages(prevPages =>
        prevPages.map(page => {
          if (page.id === pageId) {
            return {
              ...page,
              content: [...page.content, data.content],
              lastModified: new Date().toISOString()
            };
          }
          return page;
        })
      );

      toast({
        title: 'Success',
        description: 'Content added successfully',
      });

      return data.content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add content';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Delete content item
  const deleteContent = async (pageId: string, contentId: string) => {
    try {
      const response = await fetch(`/api/admin/web-pages/content?pageId=${pageId}&contentId=${contentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Update local state
      setPages(prevPages =>
        prevPages.map(page => {
          if (page.id === pageId) {
            return {
              ...page,
              content: page.content.filter(item => item.id !== contentId),
              lastModified: new Date().toISOString()
            };
          }
          return page;
        })
      );

      toast({
        title: 'Success',
        description: 'Content deleted successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete content';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Create new page
  const createPage = async (pageData: { name: string; route: string; title?: string; description?: string }) => {
    try {
      const response = await fetch('/api/admin/web-pages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update local state
      setPages(prevPages => [...prevPages, data.page]);

      toast({
        title: 'Success',
        description: 'Page created successfully',
      });

      return data.page;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create page';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Delete page
  const deletePage = async (pageId: string) => {
    try {
      const response = await fetch(`/api/admin/web-pages?pageId=${pageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Update local state
      setPages(prevPages => prevPages.filter(page => page.id !== pageId));

      toast({
        title: 'Success',
        description: 'Page deleted successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete page';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return {
    pages,
    isLoading,
    error,
    fetchPages,
    updatePage,
    updateContent,
    addContent,
    deleteContent,
    createPage,
    deletePage,
  };
}

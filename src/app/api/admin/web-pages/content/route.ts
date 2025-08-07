import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';

const WEB_PAGES_FILE = path.join(process.cwd(), 'data', 'web-pages.json');

interface PageContent {
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

interface WebPage {
  id: string;
  name: string;
  route: string;
  title: string;
  description: string;
  lastModified: string;
  status: 'published' | 'draft' | 'archived';
  content: PageContent[];
}

async function readWebPages(): Promise<WebPage[]> {
  try {
    const data = await fs.readFile(WEB_PAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeWebPages(pages: WebPage[]): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data');
  
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  await fs.writeFile(WEB_PAGES_FILE, JSON.stringify(pages, null, 2), 'utf-8');
}

// POST - Update specific content item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pageId, contentId, content } = body;

    if (!pageId || !contentId || !content) {
      return NextResponse.json(
        { error: 'Page ID, content ID, and content are required' },
        { status: 400 }
      );
    }

    const pages = await readWebPages();
    const pageIndex = pages.findIndex(page => page.id === pageId);

    if (pageIndex === -1) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    const contentIndex = pages[pageIndex].content.findIndex(item => item.id === contentId);

    if (contentIndex === -1) {
      return NextResponse.json(
        { error: 'Content item not found' },
        { status: 404 }
      );
    }

    // Update the content item
    pages[pageIndex].content[contentIndex] = {
      ...pages[pageIndex].content[contentIndex],
      ...content,
      id: contentId,
      pageId: pageId
    };

    pages[pageIndex].lastModified = new Date().toISOString();

    await writeWebPages(pages);

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      content: pages[pageIndex].content[contentIndex]
    });
  } catch (error: any) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update content' },
      { status: 500 }
    );
  }
}

// PUT - Add new content item
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { pageId, content } = body;

    if (!pageId || !content) {
      return NextResponse.json(
        { error: 'Page ID and content are required' },
        { status: 400 }
      );
    }

    const pages = await readWebPages();
    const pageIndex = pages.findIndex(page => page.id === pageId);

    if (pageIndex === -1) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    const newContent: PageContent = {
      id: `content-${Date.now()}`,
      pageId,
      section: content.section || 'new-section',
      type: content.type || 'text',
      content: content.content || 'New content',
      metadata: content.metadata || {}
    };

    pages[pageIndex].content.push(newContent);
    pages[pageIndex].lastModified = new Date().toISOString();

    await writeWebPages(pages);

    return NextResponse.json({
      success: true,
      message: 'Content added successfully',
      content: newContent
    });
  } catch (error: any) {
    console.error('Error adding content:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add content' },
      { status: 500 }
    );
  }
}

// DELETE - Delete content item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    const contentId = searchParams.get('contentId');

    if (!pageId || !contentId) {
      return NextResponse.json(
        { error: 'Page ID and content ID are required' },
        { status: 400 }
      );
    }

    const pages = await readWebPages();
    const pageIndex = pages.findIndex(page => page.id === pageId);

    if (pageIndex === -1) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    const originalLength = pages[pageIndex].content.length;
    pages[pageIndex].content = pages[pageIndex].content.filter(item => item.id !== contentId);

    if (pages[pageIndex].content.length === originalLength) {
      return NextResponse.json(
        { error: 'Content item not found' },
        { status: 404 }
      );
    }

    pages[pageIndex].lastModified = new Date().toISOString();

    await writeWebPages(pages);

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete content' },
      { status: 500 }
    );
  }
}

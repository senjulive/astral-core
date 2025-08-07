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
    // Return default pages if file doesn't exist
    const defaultPages: WebPage[] = [
      {
        id: 'welcome',
        name: 'Welcome Page',
        route: '/',
        title: 'AstralCore - Quantum Trading Platform',
        description: 'Main landing page with hero section and features',
        lastModified: new Date().toISOString(),
        status: 'published',
        content: [
          {
            id: 'hero-title',
            pageId: 'welcome',
            section: 'hero',
            type: 'text',
            content: 'AstralCore',
            metadata: {
              className: 'text-6xl sm:text-8xl lg:text-9xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent'
            }
          },
          {
            id: 'hero-subtitle',
            pageId: 'welcome',
            section: 'hero',
            type: 'text',
            content: 'Quantum Hyperdrive v5.0',
            metadata: {
              className: 'text-xl sm:text-2xl text-indigo-300 font-medium tracking-[0.3em] uppercase'
            }
          },
          {
            id: 'hero-description',
            pageId: 'welcome',
            section: 'hero',
            type: 'text',
            content: 'Experience the next evolution in trading technology. Our Quantum Hyperdrive processes infinite market possibilities to generate autonomous wealth through advanced neural algorithms.',
            metadata: {
              className: 'text-xl sm:text-2xl lg:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed'
            }
          }
        ]
      }
    ];
    
    // Create the file with default data
    await writeWebPages(defaultPages);
    return defaultPages;
  }
}

async function writeWebPages(pages: WebPage[]): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data');
  
  // Ensure data directory exists
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  await fs.writeFile(WEB_PAGES_FILE, JSON.stringify(pages, null, 2), 'utf-8');
}

// GET - Fetch all web pages
export async function GET() {
  try {
    const pages = await readWebPages();
    return NextResponse.json({ pages });
  } catch (error: any) {
    console.error('Error fetching web pages:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch web pages' },
      { status: 500 }
    );
  }
}

// POST - Update web page content
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pageId, content, pageSettings } = body;

    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
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

    // Update page content if provided
    if (content) {
      pages[pageIndex].content = content;
    }

    // Update page settings if provided
    if (pageSettings) {
      pages[pageIndex] = {
        ...pages[pageIndex],
        ...pageSettings
      };
    }

    pages[pageIndex].lastModified = new Date().toISOString();

    await writeWebPages(pages);

    return NextResponse.json({
      success: true,
      message: 'Page updated successfully',
      page: pages[pageIndex]
    });
  } catch (error: any) {
    console.error('Error updating web page:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update web page' },
      { status: 500 }
    );
  }
}

// PUT - Create new web page
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, route, title, description } = body;

    if (!name || !route) {
      return NextResponse.json(
        { error: 'Name and route are required' },
        { status: 400 }
      );
    }

    const pages = await readWebPages();

    // Check if route already exists
    if (pages.some(page => page.route === route)) {
      return NextResponse.json(
        { error: 'A page with this route already exists' },
        { status: 400 }
      );
    }

    const newPage: WebPage = {
      id: `page-${Date.now()}`,
      name,
      route,
      title: title || name,
      description: description || '',
      lastModified: new Date().toISOString(),
      status: 'draft',
      content: []
    };

    pages.push(newPage);
    await writeWebPages(pages);

    return NextResponse.json({
      success: true,
      message: 'Page created successfully',
      page: newPage
    });
  } catch (error: any) {
    console.error('Error creating web page:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create web page' },
      { status: 500 }
    );
  }
}

// DELETE - Delete web page
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    const pages = await readWebPages();
    const filteredPages = pages.filter(page => page.id !== pageId);

    if (filteredPages.length === pages.length) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    await writeWebPages(filteredPages);

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting web page:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete web page' },
      { status: 500 }
    );
  }
}

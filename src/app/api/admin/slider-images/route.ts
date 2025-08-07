import { NextRequest, NextResponse } from 'next/server';

interface SliderImage {
  id: string;
  url: string;
  alt: string;
  title: string;
  description: string;
  isActive: boolean;
  order: number;
  page: 'login' | 'register' | 'both';
  createdAt: string;
  updatedAt: string;
}

// Mock data - in production this would connect to a real database
let sliderImages: SliderImage[] = [
  {
    id: '1',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2F455981bebcca4f578c6e51a508f1d4e7?format=webp&width=1920',
    alt: 'Quantum AI Neural Network',
    title: 'Quantum Neural Processing',
    description: 'Advanced AI algorithms powering next-generation trading strategies',
    isActive: true,
    order: 1,
    page: 'both',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2F15d29863e19d4693b48a94b86f8336da?format=webp&width=1920',
    alt: 'AstralCore Hyperdrive System',
    title: 'Hyperdrive Trading Engine',
    description: 'Real-time market analysis with quantum-enhanced prediction models',
    isActive: true,
    order: 2,
    page: 'login',
    createdAt: '2024-01-14T08:00:00Z',
    updatedAt: '2024-01-14T08:00:00Z'
  },
  {
    id: '3',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Faa19381a004d49dabf38b45dce30fd13?format=webp&width=800',
    alt: 'Quantum Security Matrix',
    title: 'Quantum Security Matrix',
    description: 'Military-grade encryption protecting your digital assets with quantum technology',
    isActive: true,
    order: 3,
    page: 'register',
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T14:20:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    
    let filteredImages = sliderImages;
    
    if (page && page !== 'both') {
      filteredImages = sliderImages.filter(img => 
        img.page === page || img.page === 'both'
      );
    }
    
    // Sort by order
    filteredImages.sort((a, b) => a.order - b.order);
    
    return NextResponse.json({
      success: true,
      data: filteredImages
    });
  } catch (error) {
    console.error('Error fetching slider images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch slider images' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newImage: SliderImage = {
      id: Date.now().toString(),
      url: body.url,
      alt: body.alt,
      title: body.title,
      description: body.description,
      isActive: body.isActive ?? true,
      order: body.order ?? sliderImages.length + 1,
      page: body.page ?? 'both',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    sliderImages.push(newImage);
    
    return NextResponse.json({
      success: true,
      data: newImage
    });
  } catch (error) {
    console.error('Error creating slider image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create slider image' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const imageIndex = sliderImages.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Slider image not found' },
        { status: 404 }
      );
    }
    
    sliderImages[imageIndex] = {
      ...sliderImages[imageIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: sliderImages[imageIndex]
    });
  } catch (error) {
    console.error('Error updating slider image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update slider image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Image ID is required' },
        { status: 400 }
      );
    }
    
    const initialLength = sliderImages.length;
    sliderImages = sliderImages.filter(img => img.id !== id);
    
    if (sliderImages.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Slider image not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Slider image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting slider image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete slider image' },
      { status: 500 }
    );
  }
}

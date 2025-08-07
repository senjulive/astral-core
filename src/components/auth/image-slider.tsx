"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideImage {
  id: string;
  url: string;
  alt: string;
  title: string;
  description: string;
}

const defaultImages: SlideImage[] = [
  {
    id: '1',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2F455981bebcca4f578c6e51a508f1d4e7?format=webp&width=1920',
    alt: 'Hyperdrive AI Neural Network',
    title: 'Hyperdrive Neural Processing',
    description: 'Advanced AI algorithms powering next-generation trading strategies'
  },
  {
    id: '2',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2F15d29863e19d4693b48a94b86f8336da?format=webp&width=1920',
    alt: 'AstralCore Hyperdrive System',
    title: 'Hyperdrive Trading Engine',
    description: 'Real-time market analysis with hyperdrive-enhanced prediction models'
  },
  {
    id: '3',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Faa19381a004d49dabf38b45dce30fd13?format=webp&width=800',
    alt: 'Hyperdrive Security Matrix',
    title: 'Hyperdrive Security Matrix',
    description: 'Military-grade encryption protecting your digital assets with hyperdrive technology'
  }
];

export function ImageSlider() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [images, setImages] = React.useState<SlideImage[]>(defaultImages);
  const [isLoading, setIsLoading] = React.useState(false);

  // Auto-slide functionality
  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  // Load images from admin settings (this would be replaced with actual API call)
  React.useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      try {
        // Simulate API call to get admin-configured images
        // const response = await fetch('/api/admin/slider-images');
        // const adminImages = await response.json();
        // setImages(adminImages.length > 0 ? adminImages : defaultImages);
        
        // For now, use default images
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        setImages(defaultImages);
      } catch (error) {
        console.error('Failed to load slider images:', error);
        setImages(defaultImages);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="relative overflow-hidden border-blue-400/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl">
          <CardContent className="p-0">
            <div className="relative h-48 sm:h-64 bg-black/20 animate-pulse flex items-center justify-center">
              <div className="text-blue-400">Loading hyperdrive imagery...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="group relative overflow-hidden border-blue-400/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl hover:border-blue-400/40 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(59,130,246,0.2)]">
        <CardContent className="p-0">
          <div className="relative h-48 sm:h-64 overflow-hidden">
            {/* Main Image */}
            <img
              src={currentImage.url}
              alt={currentImage.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Holographic Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] group-hover:opacity-80 transition-opacity duration-500" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {currentImage.title}
                </h2>
                <p className="text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed drop-shadow">
                  {currentImage.description}
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/20 text-white z-20"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/20 text-white z-20"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Play/Pause Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/20 text-white z-20"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            {/* Current Image Indicator */}
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-xl rounded-full px-3 py-1 border border-white/20 z-20">
              <span className="text-white text-xs font-medium">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300 border-2",
                  index === currentIndex
                    ? "bg-blue-400 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                    : "bg-white/20 border-white/40 hover:bg-white/40"
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

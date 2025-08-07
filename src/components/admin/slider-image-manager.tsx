'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Image as ImageIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Eye, 
  Upload,
  Move,
  Brain,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

const mockSliderImages: SliderImage[] = [
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

export function SliderImageManager() {
  const [images, setImages] = React.useState<SliderImage[]>(mockSliderImages);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingImage, setEditingImage] = React.useState<SliderImage | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState('');
  const [formData, setFormData] = React.useState({
    url: '',
    alt: '',
    title: '',
    description: '',
    isActive: true,
    order: 1,
    page: 'both' as SliderImage['page']
  });

  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      url: '',
      alt: '',
      title: '',
      description: '',
      isActive: true,
      order: images.length + 1,
      page: 'both'
    });
    setEditingImage(null);
    setPreviewUrl('');
  };

  const handleEdit = (image: SliderImage) => {
    setEditingImage(image);
    setFormData({
      url: image.url,
      alt: image.alt,
      title: image.title,
      description: image.description,
      isActive: image.isActive,
      order: image.order,
      page: image.page
    });
    setPreviewUrl(image.url);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.url || !formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newImage: SliderImage = {
      id: editingImage?.id || Date.now().toString(),
      ...formData,
      createdAt: editingImage?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingImage) {
      setImages(prev => prev.map(img => img.id === editingImage.id ? newImage : img));
      toast({
        title: "Success",
        description: "Slider image updated successfully."
      });
    } else {
      setImages(prev => [...prev, newImage]);
      toast({
        title: "Success",
        description: "New slider image added successfully."
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    toast({
      title: "Success",
      description: "Slider image deleted successfully."
    });
  };

  const toggleImageStatus = (id: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, isActive: !img.isActive } : img
    ));
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, url }));
    setPreviewUrl(url);
  };

  const getPageBadgeColor = (page: SliderImage['page']) => {
    switch (page) {
      case 'login': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'register': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'both': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const stats = {
    totalImages: images.length,
    activeImages: images.filter(img => img.isActive).length,
    loginImages: images.filter(img => img.page === 'login' || img.page === 'both').length,
    registerImages: images.filter(img => img.page === 'register' || img.page === 'both').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-lg border border-blue-400/20">
            <ImageIcon className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Slider Image Manager</h2>
            <p className="text-sm text-gray-400">Manage login & register page slider images</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => resetForm()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-black/90 backdrop-blur-xl border-border/40">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingImage ? 'Edit Slider Image' : 'Add New Slider Image'}
              </DialogTitle>
              <DialogDescription>
                Configure slider image for login and register pages
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Image URL</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter image title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter image description"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alt">Alt Text</Label>
                  <Input
                    id="alt"
                    value={formData.alt}
                    onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                    placeholder="Enter alt text for accessibility"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="page">Display Page</Label>
                    <select
                      id="page"
                      value={formData.page}
                      onChange={(e) => setFormData(prev => ({ ...prev, page: e.target.value as SliderImage['page'] }))}
                      className="w-full px-3 py-2 bg-black/20 border border-border/40 rounded-md text-white"
                    >
                      <option value="both">Both Pages</option>
                      <option value="login">Login Only</option>
                      <option value="register">Register Only</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Active Image</Label>
                </div>
              </div>
              
              {/* Preview */}
              <div className="space-y-4">
                <div>
                  <Label>Image Preview</Label>
                  <div className="mt-2 border border-border/40 rounded-lg overflow-hidden bg-black/20">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                        onError={() => setPreviewUrl('')}
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Enter image URL to preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {formData.title && (
                  <div className="p-4 bg-black/20 rounded-lg border border-border/40">
                    <h3 className="font-bold text-white mb-2">{formData.title}</h3>
                    <p className="text-sm text-gray-300">{formData.description}</p>
                    <div className="mt-2">
                      <Badge className={cn("text-xs", getPageBadgeColor(formData.page))}>
                        {formData.page}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-purple-600">
                <Save className="h-4 w-4 mr-2" />
                {editingImage ? 'Update' : 'Create'} Image
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Images</p>
                <p className="text-2xl font-bold text-white">{stats.totalImages}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Images</p>
                <p className="text-2xl font-bold text-green-400">{stats.activeImages}</p>
              </div>
              <Zap className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Login Images</p>
                <p className="text-2xl font-bold text-blue-400">{stats.loginImages}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Register Images</p>
                <p className="text-2xl font-bold text-purple-400">{stats.registerImages}</p>
              </div>
              <Plus className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Images Table */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardHeader>
          <CardTitle className="text-white">Slider Images</CardTitle>
          <CardDescription>Manage all slider images for authentication pages</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.sort((a, b) => a.order - b.order).map((image) => (
                <TableRow key={image.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden border border-border/40">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{image.alt}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-white">{image.title}</p>
                      <p className="text-sm text-gray-400 line-clamp-2">{image.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", getPageBadgeColor(image.page))}>
                      {image.page}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{image.order}</span>
                      <Move className="h-3 w-3 text-gray-400" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={image.isActive ? "default" : "secondary"}>
                      {image.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(image.url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleImageStatus(image.id)}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(image)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(image.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

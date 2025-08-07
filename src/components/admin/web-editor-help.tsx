'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Edit3, 
  Image, 
  Type, 
  Link, 
  Palette, 
  Save, 
  Eye,
  Plus,
  Trash2,
  Copy,
  Monitor,
  Smartphone,
  HelpCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export function WebEditorHelp() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Web Page Editor Guide</h2>
        <p className="text-muted-foreground">
          Learn how to edit website content, text, images, and styling
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Getting Started */}
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-400" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Basic steps to edit your website content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-white">Select a Page</h4>
                  <p className="text-sm text-muted-foreground">Choose from the available pages in the left sidebar</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-white">Select Content</h4>
                  <p className="text-sm text-muted-foreground">Click on any content item to edit it</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-white">Make Changes</h4>
                  <p className="text-sm text-muted-foreground">Edit text, update images, or modify styling</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h4 className="font-semibold text-white">Save Changes</h4>
                  <p className="text-sm text-muted-foreground">Click "Save Changes" to update the website</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Types */}
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-purple-400" />
              Content Types
            </CardTitle>
            <CardDescription>
              Different types of content you can edit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-blue-400/20 rounded-lg bg-blue-400/5">
                <Type className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="font-semibold text-white">Text</h4>
                  <p className="text-sm text-muted-foreground">Headings, paragraphs, and descriptions</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border border-purple-400/20 rounded-lg bg-purple-400/5">
                <Image className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="font-semibold text-white">Images</h4>
                  <p className="text-sm text-muted-foreground">Pictures, logos, and visual content</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border border-cyan-400/20 rounded-lg bg-cyan-400/5">
                <Link className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="font-semibold text-white">Links</h4>
                  <p className="text-sm text-muted-foreground">Navigation and external links</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border border-green-400/20 rounded-lg bg-green-400/5">
                <Palette className="w-5 h-5 text-green-400" />
                <div>
                  <h4 className="font-semibold text-white">Styling</h4>
                  <p className="text-sm text-muted-foreground">Colors, fonts, and CSS classes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editor Actions */}
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Save className="w-5 h-5 text-green-400" />
              Editor Actions
            </CardTitle>
            <CardDescription>
              Available actions in the editor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-2 border border-border/30 rounded-lg">
                <Plus className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white">Add Content</span>
              </div>
              
              <div className="flex items-center gap-2 p-2 border border-border/30 rounded-lg">
                <Copy className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white">Duplicate</span>
              </div>
              
              <div className="flex items-center gap-2 p-2 border border-border/30 rounded-lg">
                <Trash2 className="w-4 h-4 text-red-400" />
                <span className="text-sm text-white">Delete</span>
              </div>
              
              <div className="flex items-center gap-2 p-2 border border-border/30 rounded-lg">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white">Preview</span>
              </div>
              
              <div className="flex items-center gap-2 p-2 border border-border/30 rounded-lg">
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-white">Desktop View</span>
              </div>
              
              <div className="flex items-center gap-2 p-2 border border-border/30 rounded-lg">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-white">Mobile View</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips & Best Practices */}
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Tips & Best Practices
            </CardTitle>
            <CardDescription>
              Make the most of the web editor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Alert className="border-green-400/20 bg-green-400/5">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-200">
                  Always preview your changes before saving to ensure they look correct
                </AlertDescription>
              </Alert>
              
              <Alert className="border-blue-400/20 bg-blue-400/5">
                <CheckCircle className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-200">
                  Use meaningful section names to organize your content effectively
                </AlertDescription>
              </Alert>
              
              <Alert className="border-purple-400/20 bg-purple-400/5">
                <CheckCircle className="h-4 w-4 text-purple-400" />
                <AlertDescription className="text-purple-200">
                  Test your images URLs before saving to avoid broken images
                </AlertDescription>
              </Alert>
              
              <Alert className="border-yellow-400/20 bg-yellow-400/5">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-200">
                  Be careful when editing CSS classes - invalid classes may break styling
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Overview */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardHeader>
          <CardTitle className="text-white">Available Pages</CardTitle>
          <CardDescription>
            Pages you can edit with the Web Page Editor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border border-border/30 rounded-lg text-center">
              <h4 className="font-semibold text-white mb-2">Welcome Page</h4>
              <Badge variant="outline" className="border-green-400/50 text-green-300">Published</Badge>
              <p className="text-xs text-muted-foreground mt-2">Main landing page</p>
            </div>
            
            <div className="p-4 border border-border/30 rounded-lg text-center">
              <h4 className="font-semibold text-white mb-2">Login Page</h4>
              <Badge variant="outline" className="border-green-400/50 text-green-300">Published</Badge>
              <p className="text-xs text-muted-foreground mt-2">User authentication</p>
            </div>
            
            <div className="p-4 border border-border/30 rounded-lg text-center">
              <h4 className="font-semibold text-white mb-2">Register Page</h4>
              <Badge variant="outline" className="border-green-400/50 text-green-300">Published</Badge>
              <p className="text-xs text-muted-foreground mt-2">User registration</p>
            </div>
            
            <div className="p-4 border border-border/30 rounded-lg text-center">
              <h4 className="font-semibold text-white mb-2">Password Recovery</h4>
              <Badge variant="outline" className="border-green-400/50 text-green-300">Published</Badge>
              <p className="text-xs text-muted-foreground mt-2">Password reset</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

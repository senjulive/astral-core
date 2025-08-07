"use client";

import * as React from "react";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { getUserRank } from "@/lib/ranks";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { 
  MessageSquare, 
  Heart,
  Share2,
  MessageCircle,
  Send,
  Image as ImageIcon,
  Video,
  Smile,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Flag,
  Users,
  TrendingUp,
  Globe,
  Zap,
  Sparkles,
  Eye,
  Calendar,
  Plus,
  X,
  Minimize2
} from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';

// Import rank icons
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';
import type { SVGProps } from 'react';

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const rankIcons: Record<string, IconComponent> = {
    RecruitRankIcon,
    BronzeRankIcon,
    SilverRankIcon,
    GoldRankIcon,
    PlatinumRankIcon,
    DiamondRankIcon,
    Users,
};

// Types for blog functionality
interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    rank: string;
  };
  content: string;
  images?: string[];
  video?: string;
  createdAt: Date;
  likes: number;
  shares: number;
  comments: Comment[];
  isLiked: boolean;
  isBookmarked: boolean;
  visibility: "public" | "members" | "private";
}

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    rank: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

// Sample data
const samplePosts: Post[] = [
  {
    id: "post_1",
    author: {
      id: "user_1",
      name: "Alex Neural",
      username: "@alexneural",
      avatar: "",
      rank: "Diamond"
    },
    content: "Just hit $10k profit this month with the AstralCore hyperdrive! The neural networks are incredible. Anyone else seeing similar results? #AstralCore #Trading",
    images: ["https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop"],
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    likes: 42,
    shares: 8,
    comments: [],
    isLiked: false,
    isBookmarked: true,
    visibility: "public"
  },
  {
    id: "post_2",
    author: {
      id: "user_2",
      name: "Sarah Quantum",
      username: "@sarahq",
      avatar: "",
      rank: "Platinum"
    },
    content: "New to AstralCore and loving the community! Quick question - what's the best tier to start with for consistent profits? Looking for advice from experienced traders.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 23,
    shares: 3,
    comments: [
      {
        id: "comment_1",
        author: {
          id: "user_3",
          name: "Mike Elite",
          username: "@mikeelite",
          avatar: "",
          rank: "Gold"
        },
        content: "I'd recommend starting with the Silver tier. Good balance of profit and risk!",
        createdAt: new Date(Date.now() - 1000 * 60 * 90),
        likes: 5,
        isLiked: false
      }
    ],
    isLiked: true,
    isBookmarked: false,
    visibility: "public"
  }
];

export function SpaceView() {
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [posts, setPosts] = React.useState<Post[]>(samplePosts);
  const [newPost, setNewPost] = React.useState("");
  const [selectedImages, setSelectedImages] = React.useState<string[]>([]);
  const [currentTab, setCurrentTab] = React.useState<"feed" | "trending" | "community">("feed");
  const [isChatFloating, setIsChatFloating] = React.useState(false);
  const [isChatMinimized, setIsChatMinimized] = React.useState(false);

  const { user } = useUser();
  const { toast } = useToast();

  React.useEffect(() => {
    if (user?.id) {
      getOrCreateWallet(user.id).then((walletData) => {
        setWallet(walletData);
        setIsLoading(false);
      });
    }
  }, [user]);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: `post_${Date.now()}`,
      author: {
        id: user?.id || "unknown",
        name: wallet?.profile?.username || user?.email?.split("@")[0] || "Unknown User",
        username: `@${wallet?.profile?.username || "user"}`,
        avatar: wallet?.profile?.avatarUrl,
        rank: getUserRank(wallet?.balances?.usdt || 0).name
      },
      content: newPost,
      images: selectedImages,
      createdAt: new Date(),
      likes: 0,
      shares: 0,
      comments: [],
      isLiked: false,
      isBookmarked: false,
      visibility: "public"
    };

    setPosts(prev => [post, ...prev]);
    setNewPost("");
    setSelectedImages([]);
    
    toast({
      title: "Post Shared!",
      description: "Your post has been shared with the AstralCore community.",
    });
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleSharePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
    toast({
      title: "Post Shared!",
      description: "Post has been shared to your network.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalBalance = wallet?.balances?.usdt ?? 0;
  const rank = getUserRank(totalBalance);
  const RankIcon = rankIcons[rank.Icon] || Users;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Space Header - Mobile Optimized */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-pink-400/30 rounded-full blur-lg animate-neural-pulse"></div>
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 relative border-2 border-pink-400/40 backdrop-blur-xl">
                  <AvatarImage
                    src={wallet?.profile?.avatarUrl}
                    alt={wallet?.profile?.username || 'User'}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-pink-500/30 to-purple-500/20 text-pink-400 font-bold text-lg backdrop-blur-xl">
                    <Globe className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    AstralCore Space
                  </h1>
                </div>
                <p className="text-sm text-gray-400 mb-3">Connect, share, and grow with the quantum community</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge className={cn("flex items-center gap-1 text-xs", rank.className)}>
                    <RankIcon className="h-3 w-3" />
                    Hyperdrive {rank.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-pink-400/40 text-pink-300 bg-pink-400/10">
                    <Users className="h-3 w-3 mr-1" />
                    Community
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsChatFloating(!isChatFloating)}
                className="flex-1 sm:flex-none"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
              <Button
                size="sm"
                className="flex-1 sm:flex-none bg-gradient-to-r from-pink-500 to-purple-600"
                onClick={() => setCurrentTab("feed")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats - Mobile Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-pink-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-pink-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-pink-500/20 to-pink-600/10 p-2 rounded-lg border border-pink-400/30">
                <Users className="h-5 w-5 mx-auto text-pink-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-pink-400">1.2k</p>
            <p className="text-xs text-gray-400">Members</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-purple-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-purple-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-2 rounded-lg border border-purple-400/30">
                <MessageSquare className="h-5 w-5 mx-auto text-purple-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-purple-400">{posts.length}</p>
            <p className="text-xs text-gray-400">Posts</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-blue-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-2 rounded-lg border border-blue-400/30">
                <TrendingUp className="h-5 w-5 mx-auto text-blue-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-blue-400">24h</p>
            <p className="text-xs text-gray-400">Active</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-green-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500/20 to-green-600/10 p-2 rounded-lg border border-green-400/30">
                <Heart className="h-5 w-5 mx-auto text-green-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-green-400">
              {posts.reduce((acc, post) => acc + post.likes, 0)}
            </p>
            <p className="text-xs text-gray-400">Likes</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-black/20 backdrop-blur-xl rounded-lg border border-border/40">
        <button
          onClick={() => setCurrentTab("feed")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "feed"
              ? "bg-gradient-to-r from-pink-500/20 to-purple-500/10 border border-pink-400/40 text-pink-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Globe className="h-4 w-4 inline mr-2" />
          Feed
        </button>
        <button
          onClick={() => setCurrentTab("trending")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "trending"
              ? "bg-gradient-to-r from-purple-500/20 to-blue-500/10 border border-purple-400/40 text-purple-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <TrendingUp className="h-4 w-4 inline mr-2" />
          Trending
        </button>
        <button
          onClick={() => setCurrentTab("community")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "community"
              ? "bg-gradient-to-r from-blue-500/20 to-green-500/10 border border-blue-400/40 text-blue-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Community
        </button>
      </div>

      {/* Create Post Section */}
      {currentTab === "feed" && (
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 border border-border/40">
                <AvatarImage
                  src={wallet?.profile?.avatarUrl}
                  alt={wallet?.profile?.username || 'User'}
                />
                <AvatarFallback className="bg-gradient-to-br from-pink-500/30 to-purple-500/20 text-pink-400">
                  {wallet?.profile?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="Share your AstralCore journey with the community..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="bg-black/20 border-border/40 resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-pink-400">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Photo
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
                      <Video className="h-4 w-4 mr-2" />
                      Video
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-yellow-400">
                      <Smile className="h-4 w-4 mr-2" />
                      Feeling
                    </Button>
                  </div>
                  <Button 
                    onClick={handleCreatePost}
                    disabled={!newPost.trim()}
                    className="bg-gradient-to-r from-pink-500 to-purple-600"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-black/40 backdrop-blur-xl border-border/40">
            <CardContent className="p-4">
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="h-10 w-10 border border-border/40">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback className="bg-gradient-to-br from-pink-500/30 to-purple-500/20 text-pink-400">
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white text-sm">{post.author.name}</h4>
                    <span className="text-xs text-gray-400">{post.author.username}</span>
                    <Badge variant="outline" className="text-xs border-purple-400/40 text-purple-300 bg-purple-400/10">
                      {post.author.rank}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-300 text-sm leading-relaxed mb-3">{post.content}</p>
                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 rounded-lg overflow-hidden">
                    {post.images.map((image, index) => (
                      <div key={index} className="relative aspect-video">
                        <Image
                          src={image}
                          alt={`Post image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikePost(post.id)}
                    className={cn(
                      "text-gray-400 hover:text-red-400",
                      post.isLiked && "text-red-400"
                    )}
                  >
                    <Heart className={cn("h-4 w-4 mr-2", post.isLiked && "fill-current")} />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {post.comments.length}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSharePost(post.id)}
                    className="text-gray-400 hover:text-green-400"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {post.shares}
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-yellow-400">
                  <Bookmark className={cn("h-4 w-4", post.isBookmarked && "fill-current text-yellow-400")} />
                </Button>
              </div>

              {/* Comments Section */}
              {post.comments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/40 space-y-3">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 border border-border/40">
                        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                        <AvatarFallback className="bg-gradient-to-br from-gray-500/30 to-gray-600/20 text-gray-400 text-xs">
                          {comment.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-xs">{comment.author.name}</span>
                            <Badge variant="outline" className="text-xs border-gray-600/40 text-gray-400 bg-gray-600/10">
                              {comment.author.rank}
                            </Badge>
                          </div>
                          <p className="text-gray-300 text-xs">{comment.content}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-400 h-6 px-2">
                            <Heart className="h-3 w-3 mr-1" />
                            {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-400 h-6 px-2">
                            Reply
                          </Button>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating Chat */}
      {isChatFloating && (
        <div className={cn(
          "fixed bottom-4 right-4 w-80 h-96 bg-black/90 backdrop-blur-xl border border-border/40 rounded-lg shadow-2xl z-50 transition-all duration-300",
          isChatMinimized && "h-12 w-64"
        )}>
          <div className="flex items-center justify-between p-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-pink-400" />
              <span className="font-medium text-white text-sm">Live Chat</span>
              <Badge variant="outline" className="text-xs border-green-400/40 text-green-300 bg-green-400/10">
                Online
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatMinimized(!isChatMinimized)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatFloating(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {!isChatMinimized && (
            <>
              <div className="flex-1 p-3 overflow-y-auto h-80">
                <div className="space-y-3">
                  <div className="text-center text-xs text-gray-500">
                    Welcome to AstralCore Live Chat
                  </div>
                  {/* Sample chat messages */}
                  <div className="flex gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500/30 to-purple-500/20 text-blue-400 text-xs">
                        A
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-800/50 rounded-lg p-2">
                        <p className="text-xs text-gray-300">Hey everyone! Market's looking good today 🚀</p>
                      </div>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 border-t border-border/40">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    className="bg-black/20 border-border/40 text-sm"
                  />
                  <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600">
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Community Guidelines */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border-blue-400/20">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Sparkles className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-200">
                <strong>Community Guidelines:</strong> Share your trading insights, help fellow members, and maintain a positive environment. Posts are moderated to ensure quality discussions about AstralCore and cryptocurrency trading.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

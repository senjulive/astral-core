'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Send, Users, Crown, Shield, Star, Clock, Image, File, Smile } from 'lucide-react';
import { getUserRank } from '@/lib/ranks';
import { getCurrentTier } from '@/lib/tiers';

interface ClanMessage {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  text: string;
  timestamp: number;
  rank: any;
  tier: any;
  type?: 'text' | 'image' | 'file' | 'system';
}

interface ClanMember {
  id: string;
  displayName: string;
  avatarUrl?: string;
  role: 'leader' | 'member';
  rank: any;
  tier: any;
  lastSeen: number;
  isOnline: boolean;
}

interface ClanData {
  id: string;
  name: string;
  avatarUrl: string;
  leaderId: string;
  memberCount: number;
  members: ClanMember[];
  description?: string;
}

interface SquadClanChatProps {
  clanId: string;
  currentUserId?: string;
}

export function SquadClanChat({ clanId, currentUserId = 'mock-user-123' }: SquadClanChatProps) {
  const [messages, setMessages] = useState<ClanMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [clanData, setClanData] = useState<ClanData | null>(null);
  const [activeMembers, setActiveMembers] = useState<ClanMember[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mock clan data
  const mockClanData: ClanData = {
    id: clanId,
    name: 'Elite Quantum Traders',
    avatarUrl: 'https://i.pravatar.cc/100?u=clan-' + clanId,
    leaderId: 'leader-001',
    memberCount: 12,
    description: 'Top-tier trading clan specializing in quantum algorithms and high-frequency strategies.',
    members: [
      {
        id: 'leader-001',
        displayName: 'QuantumLeader',
        avatarUrl: 'https://i.pravatar.cc/40?u=leader-001',
        role: 'leader',
        rank: getUserRank(50000),
        tier: getCurrentTier(50000, []),
        lastSeen: Date.now(),
        isOnline: true,
      },
      {
        id: 'member-001',
        displayName: 'CryptoNinja',
        avatarUrl: 'https://i.pravatar.cc/40?u=member-001',
        role: 'member',
        rank: getUserRank(25000),
        tier: getCurrentTier(25000, []),
        lastSeen: Date.now() - 300000, // 5 minutes ago
        isOnline: true,
      },
      {
        id: 'member-002',
        displayName: 'AlgoMaster',
        avatarUrl: 'https://i.pravatar.cc/40?u=member-002',
        role: 'member',
        rank: getUserRank(15000),
        tier: getCurrentTier(15000, []),
        lastSeen: Date.now() - 600000, // 10 minutes ago
        isOnline: false,
      },
      {
        id: currentUserId,
        displayName: 'You',
        role: 'member',
        rank: getUserRank(5000),
        tier: getCurrentTier(5000, []),
        lastSeen: Date.now(),
        isOnline: true,
      },
    ],
  };

  // Mock messages
  const mockMessages: ClanMessage[] = [
    {
      id: 'msg-1',
      userId: 'leader-001',
      displayName: 'QuantumLeader',
      avatarUrl: 'https://i.pravatar.cc/40?u=leader-001',
      text: 'Welcome to the Elite Quantum Traders clan chat! Let\'s discuss today\'s market opportunities.',
      timestamp: Date.now() - 3600000,
      rank: getUserRank(50000),
      tier: getCurrentTier(50000, []),
      type: 'text',
    },
    {
      id: 'msg-2',
      userId: 'member-001',
      displayName: 'CryptoNinja',
      avatarUrl: 'https://i.pravatar.cc/40?u=member-001',
      text: 'I\'m seeing some great opportunities in the BTC/USDT pair. The quantum indicators are showing strong bullish signals.',
      timestamp: Date.now() - 3000000,
      rank: getUserRank(25000),
      tier: getCurrentTier(25000, []),
      type: 'text',
    },
    {
      id: 'msg-3',
      userId: 'member-002',
      displayName: 'AlgoMaster',
      avatarUrl: 'https://i.pravatar.cc/40?u=member-002',
      text: 'Agreed! My neural network analysis shows a 78% probability of upward movement in the next 4 hours.',
      timestamp: Date.now() - 2700000,
      rank: getUserRank(15000),
      tier: getCurrentTier(15000, []),
      type: 'text',
    },
    {
      id: 'msg-4',
      userId: 'system',
      displayName: 'System',
      text: 'CryptoNinja achieved a new milestone: 100 profitable trades!',
      timestamp: Date.now() - 1800000,
      rank: { name: 'System', className: 'text-blue-400' },
      tier: null,
      type: 'system',
    },
  ];

  useEffect(() => {
    // Simulate loading clan data and messages
    const loadClanData = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setClanData(mockClanData);
        setMessages(mockMessages);
        setActiveMembers(mockClanData.members.filter(m => m.isOnline));
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load clan chat data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadClanData();
  }, [clanId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const message: ClanMessage = {
        id: `msg-${Date.now()}`,
        userId: currentUserId,
        displayName: 'You',
        text: newMessage,
        timestamp: Date.now(),
        rank: getUserRank(5000),
        tier: getCurrentTier(5000, []),
        type: 'text',
      };

      // Add message immediately for better UX
      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // In a real app, send to API
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: 'Message sent',
        description: 'Your message has been sent to the clan.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!clanData) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Clan not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Main Chat Area */}
      <div className="lg:col-span-3">
        <Card className="h-[600px] bg-black/40 backdrop-blur-xl border-border/40">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={clanData.avatarUrl} />
                <AvatarFallback>{clanData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  {clanData.name}
                  <Badge variant="outline" className="border-blue-400/50 text-blue-300">
                    <Users className="w-3 h-3 mr-1" />
                    {clanData.memberCount}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{clanData.description}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex flex-col h-[480px]">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    {message.type !== 'system' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={message.avatarUrl} />
                        <AvatarFallback>
                          {message.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`flex-1 ${message.type === 'system' ? 'text-center' : ''}`}>
                      {message.type === 'system' ? (
                        <div className="bg-blue-500/20 rounded-lg p-2 border border-blue-400/30">
                          <p className="text-sm text-blue-300">{message.text}</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white text-sm">
                              {message.displayName}
                            </span>
                            {message.userId === clanData.leaderId && (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            )}
                            <Badge 
                              variant="outline" 
                              className={`text-xs px-1 py-0 ${message.rank.className}`}
                            >
                              {message.rank.name}
                            </Badge>
                            {message.tier && (
                              <Badge variant="outline" className="text-xs px-1 py-0 border-purple-400/50 text-purple-300">
                                {message.tier.name}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <div className="bg-muted/20 rounded-lg p-2 border border-border/40">
                            <p className="text-sm text-gray-300">{message.text}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="mt-4 flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-black/20 border-border/40 focus:border-blue-400/60 text-white placeholder:text-gray-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isSending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Members */}
      <div className="lg:col-span-1">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Members ({clanData.memberCount})
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {/* Online Members */}
              <div>
                <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online ({activeMembers.length})
                </h4>
                <div className="space-y-2">
                  {clanData.members.filter(m => m.isOnline).map((member) => (
                    <div key={member.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/10 border border-border/30">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback>{member.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-white truncate">
                            {member.displayName}
                          </span>
                          {member.role === 'leader' && (
                            <Crown className="w-3 h-3 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs px-1 py-0 ${member.rank.className}`}
                          >
                            {member.rank.name}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-border/40" />

              {/* Offline Members */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  Offline ({clanData.members.filter(m => !m.isOnline).length})
                </h4>
                <div className="space-y-2">
                  {clanData.members.filter(m => !m.isOnline).map((member) => (
                    <div key={member.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/10 border border-border/30 opacity-60">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback>{member.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-white truncate">
                            {member.displayName}
                          </span>
                          {member.role === 'leader' && (
                            <Crown className="w-3 h-3 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {formatLastSeen(member.lastSeen)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

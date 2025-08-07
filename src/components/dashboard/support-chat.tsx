'use client';

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Send, Paperclip, Users, Bot, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";
import { supportTicketSchema, chatMessageSchema } from "@/lib/validators";
import { AstralLogo } from "../icons/astral-logo";
import * as z from "zod";

type SupportTicketValues = z.infer<typeof supportTicketSchema>;
type ChatMessageValues = z.infer<typeof chatMessageSchema>;

type SupportMessage = {
  id: string;
  content: string;
  timestamp: number;
  isUser: boolean;
  isAgent?: boolean;
  agentName?: string;
  status?: "sent" | "delivered" | "read";
};

type SupportTicket = {
  id: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "open" | "pending" | "resolved" | "closed";
  createdAt: string;
  lastUpdate: string;
  messages: SupportMessage[];
};

const mockTickets: SupportTicket[] = [
  {
    id: "TICKET-001",
    subject: "Unable to withdraw funds",
    category: "withdrawal",
    priority: "high",
    status: "open",
    createdAt: "2024-01-15T09:00:00Z",
    lastUpdate: "2024-01-15T14:30:00Z",
    messages: [
      {
        id: "msg_1",
        content: "I've been trying to withdraw my USDT but the transaction keeps failing. Can you help?",
        timestamp: Date.now() - 18000000,
        isUser: true,
        status: "read"
      },
      {
        id: "msg_2", 
        content: "Hello! I'm Sarah from support. I can help you with your withdrawal issue. Can you please provide your transaction ID?",
        timestamp: Date.now() - 14400000,
        isUser: false,
        isAgent: true,
        agentName: "Sarah",
        status: "read"
      }
    ]
  }
];

const quickActions = [
  { label: "Check Account Status", action: "account_status" },
  { label: "Withdrawal Issues", action: "withdrawal_help" },
  { label: "Trading Bot Support", action: "bot_support" },
  { label: "Security Concerns", action: "security_help" },
];

const faqs = [
  {
    question: "How long does verification take?",
    answer: "Account verification typically takes 24-48 hours during business days. You'll receive an email notification once completed."
  },
  {
    question: "What are the withdrawal limits?",
    answer: "Withdrawal limits depend on your verification level. Verified accounts can withdraw up to $10,000 daily, while unverified accounts have a $500 daily limit."
  },
  {
    question: "How does the trading bot work?",
    answer: "Our CORE trading bot uses advanced grid trading algorithms to automatically buy low and sell high, generating profits from market volatility."
  },
  {
    question: "Is my money safe?",
    answer: "Yes, we use industry-standard security measures including cold storage, 2FA, and regular security audits to protect your funds."
  }
];

export function SupportChat() {
  const { user, wallet } = useUser();
  const { toast } = useToast();
  const [activeTicket, setActiveTicket] = React.useState<SupportTicket | null>(null);
  const [messages, setMessages] = React.useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [tickets, setTickets] = React.useState<SupportTicket[]>(mockTickets);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const ticketForm = useForm<SupportTicketValues>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      subject: "",
      category: "technical",
      priority: "medium",
      message: "",
    },
  });

  const messageForm = useForm<ChatMessageValues>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      message: "",
      type: "text",
    },
  });

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  React.useEffect(() => {
    if (activeTicket) {
      setMessages(activeTicket.messages);
    }
  }, [activeTicket]);

  const onSubmitTicket = async (values: SupportTicketValues) => {
    setIsLoading(true);
    try {
      const newTicket: SupportTicket = {
        id: `TICKET-${Date.now()}`,
        subject: values.subject,
        category: values.category,
        priority: values.priority,
        status: "open",
        createdAt: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        messages: [
          {
            id: `msg_${Date.now()}`,
            content: values.message,
            timestamp: Date.now(),
            isUser: true,
            status: "sent"
          },
          {
            id: `msg_auto_${Date.now()}`,
            content: "Thank you for contacting AstralCore support. We've received your ticket and one of our agents will respond within 24 hours.",
            timestamp: Date.now() + 1000,
            isUser: false,
            isAgent: true,
            agentName: "AstralCore Support",
            status: "delivered"
          }
        ]
      };

      setTickets(prev => [newTicket, ...prev]);
      setActiveTicket(newTicket);
      ticketForm.reset();
      
      toast({
        title: "Support Ticket Created",
        description: `Ticket ${newTicket.id} has been submitted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create support ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitMessage = async (values: ChatMessageValues) => {
    if (!activeTicket || !values.message.trim()) return;

    const newMessage: SupportMessage = {
      id: `msg_${Date.now()}`,
      content: values.message,
      timestamp: Date.now(),
      isUser: true,
      status: "sent"
    };

    setMessages(prev => [...prev, newMessage]);
    messageForm.reset();

    // Simulate auto-response delay
    setTimeout(() => {
      const autoResponse: SupportMessage = {
        id: `msg_auto_${Date.now()}`,
        content: "Thanks for your message! An agent will respond shortly.",
        timestamp: Date.now(),
        isUser: false,
        isAgent: true,
        agentName: "AstralCore Bot",
        status: "delivered"
      };
      setMessages(prev => [...prev, autoResponse]);
    }, 2000);
  };

  const handleQuickAction = (action: string) => {
    let response = "";
    switch (action) {
      case "account_status":
        response = `Your account status: ${wallet?.profile?.verificationStatus === 'verified' ? 'Verified' : 'Pending Verification'}. Balance: $${wallet?.balances?.usdt?.toFixed(2) || '0.00'} USDT`;
        break;
      case "withdrawal_help":
        response = "For withdrawal issues, please ensure: 1) Your account is verified 2) You have sufficient balance 3) Withdrawal address is correct. If issues persist, please contact support.";
        break;
      case "bot_support":
        response = "Our trading bot is running optimally. Make sure you have sufficient balance to enable automatic trading. Visit the Trading page to configure your bot settings.";
        break;
      case "security_help":
        response = "For security concerns, immediately change your password and enable 2FA. If you suspect unauthorized access, contact support immediately.";
        break;
      default:
        response = "How can I help you today?";
    }

    const botMessage: SupportMessage = {
      id: `msg_bot_${Date.now()}`,
      content: response,
      timestamp: Date.now(),
      isUser: false,
      isAgent: true,
      agentName: "AstralCore Assistant",
      status: "delivered"
    };

    if (activeTicket) {
      setMessages(prev => [...prev, botMessage]);
    } else {
      // Create a new quick support session
      const quickTicket: SupportTicket = {
        id: `QUICK-${Date.now()}`,
        subject: "Quick Support",
        category: "technical",
        priority: "medium",
        status: "open",
        createdAt: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        messages: [botMessage]
      };
      setActiveTicket(quickTicket);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Support
          </CardTitle>
          <CardDescription>
            Get help with your account, trading, and platform questions
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="new">New Ticket</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Help</CardTitle>
                <CardDescription>Get instant answers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    {action.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Chat Interface */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Support Chat
                  {activeTicket && (
                    <Badge variant="outline">
                      {activeTicket.id}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Chat with our support team for immediate assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[400px] pr-4" viewportRef={scrollAreaRef}>
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <AstralLogo className="h-16 w-16 opacity-50" />
                      <div>
                        <p className="font-medium">Welcome to AstralCore Support</p>
                        <p className="text-sm text-muted-foreground">
                          How can we help you today? Use the quick actions or start a conversation.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-3",
                            message.isUser ? "justify-end" : "justify-start"
                          )}
                        >
                          {!message.isUser && (
                            <Avatar className="h-8 w-8">
                              {message.isAgent ? (
                                <AvatarImage src="/support-avatar.png" />
                              ) : (
                                <AstralLogo className="h-6 w-6" />
                              )}
                              <AvatarFallback>
                                {message.agentName ? message.agentName[0] : 'S'}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className={cn(
                            "max-w-xs lg:max-w-md space-y-1",
                            message.isUser && "items-end"
                          )}>
                            {!message.isUser && message.agentName && (
                              <p className="text-xs text-muted-foreground">
                                {message.agentName}
                              </p>
                            )}
                            <div className={cn(
                              "rounded-lg px-3 py-2 text-sm",
                              message.isUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}>
                              {message.content}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span>{format(new Date(message.timestamp), "HH:mm")}</span>
                              {message.isUser && message.status && (
                                <>
                                  <span>•</span>
                                  {message.status === "sent" && <Clock className="h-3 w-3" />}
                                  {message.status === "delivered" && <CheckCircle className="h-3 w-3" />}
                                  {message.status === "read" && <CheckCircle className="h-3 w-3 text-blue-500" />}
                                </>
                              )}
                            </div>
                          </div>

                          {message.isUser && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={wallet?.profile?.avatarUrl} />
                              <AvatarFallback>
                                {(wallet?.profile?.username || user?.email || 'U')[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Form {...messageForm}>
                  <form
                    onSubmit={messageForm.handleSubmit(onSubmitMessage)}
                    className="flex w-full gap-2"
                  >
                    <FormField
                      control={messageForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Type your message..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </Form>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>View and manage your support requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() => setActiveTicket(ticket)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{ticket.subject}</p>
                        <Badge
                          variant={
                            ticket.status === "open" ? "destructive" :
                            ticket.status === "pending" ? "secondary" :
                            ticket.status === "resolved" ? "default" : "outline"
                          }
                        >
                          {ticket.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {ticket.id} • Created {format(new Date(ticket.createdAt), "PPp")}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions and answers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    {index < faqs.length - 1 && <hr className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>
                Describe your issue and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...ticketForm}>
                <form onSubmit={ticketForm.handleSubmit(onSubmitTicket)} className="space-y-4">
                  <FormField
                    control={ticketForm.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of your issue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={ticketForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technical">Technical Issue</SelectItem>
                              <SelectItem value="account">Account Related</SelectItem>
                              <SelectItem value="trading">Trading & Bot</SelectItem>
                              <SelectItem value="deposit">Deposit Issues</SelectItem>
                              <SelectItem value="withdrawal">Withdrawal Issues</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={ticketForm.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={ticketForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide detailed information about your issue..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Creating..." : "Create Ticket"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

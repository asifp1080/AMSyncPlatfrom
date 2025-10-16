"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  Paperclip,
  MoreVertical,
  Clock,
  CheckCircle,
  User,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import PortalShell from "@/components/portal/PortalShell";
import { useAuth } from "@/contexts/AuthProvider";

interface Message {
  id: string;
  sender: 'customer' | 'staff';
  text: string;
  sentAt: Date;
  readByStaff?: boolean;
}

interface SupportThread {
  id: string;
  subject: string;
  status: 'OPEN' | 'PENDING' | 'CLOSED';
  createdAt: Date;
  lastUpdatedAt: Date;
}

// Mock data - will be replaced with Firestore queries
const mockThread: SupportThread = {
  id: "1",
  subject: "Question about policy coverage",
  status: "OPEN",
  createdAt: new Date("2024-01-15T10:30:00"),
  lastUpdatedAt: new Date("2024-01-15T14:45:00"),
};

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "customer",
    text: "Hi, I have a question about my auto insurance coverage. Does my policy cover rental cars when my car is being repaired?",
    sentAt: new Date("2024-01-15T10:30:00"),
  },
  {
    id: "2",
    sender: "staff",
    text: "Hello! Thank you for reaching out. Yes, your comprehensive auto policy includes rental car coverage up to $30 per day for up to 30 days while your vehicle is being repaired due to a covered claim. Would you like me to send you the specific details of your coverage?",
    sentAt: new Date("2024-01-15T11:15:00"),
    readByStaff: true,
  },
  {
    id: "3",
    sender: "customer",
    text: "That's great! Yes, please send me the details. Also, do I need to use a specific rental company or can I choose any?",
    sentAt: new Date("2024-01-15T14:45:00"),
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPEN':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-amber-100 text-amber-800';
    case 'CLOSED':
      return 'bg-slate-100 text-slate-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

const formatTime = (date: Date) => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default function SupportThreadPage() {
  const params = useParams();
  const router = useRouter();
  const { customer } = useAuth();
  const { toast } = useToast();
  
  const [thread, setThread] = useState<SupportThread>(mockThread);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    
    const message: Message = {
      id: Date.now().toString(),
      sender: "customer",
      text: newMessage,
      sentAt: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
    
    // Update thread last updated time
    setThread(prev => ({
      ...prev,
      lastUpdatedAt: new Date(),
    }));

    // Simulate sending delay
    setTimeout(() => {
      setSending(false);
      toast({
        title: "Message sent",
        description: "Our support team will respond soon.",
      });
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const closeThread = () => {
    setThread(prev => ({ ...prev, status: 'CLOSED' }));
    toast({
      title: "Thread closed",
      description: "This conversation has been marked as resolved.",
    });
  };

  return (
    <PortalShell>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{thread.subject}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(thread.status)}>
                  {thread.status}
                </Badge>
                <span className="text-sm text-slate-500">
                  Created {formatTime(thread.createdAt)}
                </span>
              </div>
            </div>
          </div>
          
          {thread.status !== 'CLOSED' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={closeThread}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Messages */}
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.sender === 'customer' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.sender === 'staff' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-[#4169E1] rounded-full flex items-center justify-center">
                        <Headphones className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg px-4 py-3",
                      message.sender === 'customer'
                        ? "bg-[#4169E1] text-white"
                        : "bg-slate-100 text-slate-900"
                    )}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p
                      className={cn(
                        "text-xs mt-2",
                        message.sender === 'customer'
                          ? "text-blue-100"
                          : "text-slate-500"
                      )}
                    >
                      {formatTime(message.sentAt)}
                    </p>
                  </div>

                  {message.sender === 'customer' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-slate-600" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {thread.status !== 'CLOSED' && (
              <div className="border-t p-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      disabled
                      title="Attachments (coming soon)"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            )}

            {thread.status === 'CLOSED' && (
              <div className="border-t p-4 text-center">
                <p className="text-sm text-slate-500">
                  This conversation has been closed. 
                  <Button variant="link" className="p-0 ml-1 h-auto" onClick={() => router.push('/portal/support')}>
                    Start a new conversation
                  </Button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
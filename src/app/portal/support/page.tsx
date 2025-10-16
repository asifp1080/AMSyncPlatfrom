"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Plus,
  Send,
  Paperclip,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import PortalShell from "@/components/portal/PortalShell";
import { useAuth } from "@/contexts/AuthProvider";

interface SupportThread {
  id: string;
  subject: string;
  status: "OPEN" | "PENDING" | "CLOSED";
  createdAt: Date;
  lastUpdatedAt: Date;
  messageCount: number;
  lastMessage?: string;
}

// Mock data - will be replaced with Firestore queries
const mockThreads: SupportThread[] = [
  {
    id: "1",
    subject: "Question about policy coverage",
    status: "OPEN",
    createdAt: new Date("2024-01-15T10:30:00"),
    lastUpdatedAt: new Date("2024-01-15T14:45:00"),
    messageCount: 3,
    lastMessage: "Thank you for the clarification. I have one more question...",
  },
  {
    id: "2",
    subject: "Claim status inquiry",
    status: "PENDING",
    createdAt: new Date("2024-01-12T09:15:00"),
    lastUpdatedAt: new Date("2024-01-14T16:20:00"),
    messageCount: 5,
    lastMessage:
      "We're reviewing your claim and will get back to you within 24 hours.",
  },
  {
    id: "3",
    subject: "Payment method update",
    status: "CLOSED",
    createdAt: new Date("2024-01-08T11:00:00"),
    lastUpdatedAt: new Date("2024-01-10T13:30:00"),
    messageCount: 2,
    lastMessage: "Your payment method has been successfully updated.",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "OPEN":
      return <MessageCircle className="h-4 w-4 text-green-600" />;
    case "PENDING":
      return <Clock className="h-4 w-4 text-amber-600" />;
    case "CLOSED":
      return <CheckCircle className="h-4 w-4 text-slate-600" />;
    default:
      return <MessageCircle className="h-4 w-4 text-slate-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "OPEN":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-amber-100 text-amber-800";
    case "CLOSED":
      return "bg-slate-100 text-slate-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
};

export default function SupportPage() {
  const [threads, setThreads] = useState<SupportThread[]>(mockThreads);
  const [newThreadOpen, setNewThreadOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const { customer } = useAuth();
  const { toast } = useToast();

  const openThreads = threads.filter((t) => t.status === "OPEN").length;
  const pendingThreads = threads.filter((t) => t.status === "PENDING").length;

  const handleCreateThread = async () => {
    if (!newSubject.trim() || !newMessage.trim()) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Create thread in Firestore
      // const threadRef = await addDoc(collection(db, 'supportThreads'), {
      //   orgId: customer.orgId,
      //   customerId: customer.id,
      //   subject: newSubject,
      //   status: 'OPEN',
      //   createdAt: serverTimestamp(),
      //   lastUpdatedAt: serverTimestamp(),
      // });
      //
      // await addDoc(collection(db, 'supportThreads', threadRef.id, 'messages'), {
      //   sender: 'customer',
      //   text: newMessage,
      //   sentAt: serverTimestamp(),
      // });

      const newThread: SupportThread = {
        id: Date.now().toString(),
        subject: newSubject,
        status: "OPEN",
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
        messageCount: 1,
        lastMessage:
          newMessage.substring(0, 100) + (newMessage.length > 100 ? "..." : ""),
      };

      setThreads((prev) => [newThread, ...prev]);
      setNewSubject("");
      setNewMessage("");
      setNewThreadOpen(false);

      toast({
        title: "Support thread created",
        description: "We'll respond to your message soon.",
      });
    } catch (error) {
      console.error("Error creating thread:", error);
      toast({
        title: "Failed to create thread",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <PortalShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Support Chat</h1>
            <p className="text-slate-600 mt-2">
              Get help from our support team
            </p>
          </div>
          <Dialog open={newThreadOpen} onOpenChange={setNewThreadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Start New Conversation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What do you need help with?"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your question or issue..."
                    rows={4}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setNewThreadOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateThread}>
                    Start Conversation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {openThreads}
                  </p>
                  <p className="text-sm text-slate-600">Open</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {pendingThreads}
                  </p>
                  <p className="text-sm text-slate-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {threads.length}
                  </p>
                  <p className="text-sm text-slate-600">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Your Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {threads.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No conversations yet</p>
                <Button onClick={() => setNewThreadOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Start your first conversation
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {threads.map((thread) => (
                  <Link
                    key={thread.id}
                    href={`/portal/support/threads/${thread.id}`}
                    className="block"
                  >
                    <div className="flex items-start justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-2 bg-slate-100 rounded">
                          {getStatusIcon(thread.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-slate-900 truncate">
                              {thread.subject}
                            </h3>
                            <Badge
                              className={cn(
                                "flex-shrink-0",
                                getStatusColor(thread.status),
                              )}
                            >
                              {thread.status}
                            </Badge>
                          </div>
                          {thread.lastMessage && (
                            <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                              {thread.lastMessage}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>{thread.messageCount} messages</span>
                            <span>
                              Updated {formatRelativeTime(thread.lastUpdatedAt)}
                            </span>
                            <span>
                              Created {formatRelativeTime(thread.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}

"use client";

import React, { useState } from "react";
import {
  Bell,
  Shield,
  CreditCard,
  FileText,
  MessageCircle,
  Settings,
  Check,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import PortalShell from "@/components/portal/PortalShell";

interface Notification {
  id: string;
  type: "policy_update" | "payment" | "document" | "chat" | "system";
  title: string;
  body: string;
  relatedId?: string;
  read: boolean;
  createdAt: Date;
}

// Mock data - will be replaced with Firestore queries
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "policy_update",
    title: "Policy Renewed",
    body: "Your auto insurance policy has been successfully renewed for another year.",
    relatedId: "policy-123",
    read: false,
    createdAt: new Date("2024-01-15T10:30:00"),
  },
  {
    id: "2",
    type: "document",
    title: "Document Reviewed",
    body: "Your uploaded driver's license has been reviewed and requires additional information.",
    relatedId: "doc-456",
    read: false,
    createdAt: new Date("2024-01-14T15:45:00"),
  },
  {
    id: "3",
    type: "chat",
    title: "New Message from Support",
    body: "You have received a new message regarding your recent claim inquiry.",
    relatedId: "thread-789",
    read: false,
    createdAt: new Date("2024-01-14T09:20:00"),
  },
  {
    id: "4",
    type: "payment",
    title: "Payment Processed",
    body: "Your monthly premium payment of $125.00 has been successfully processed.",
    relatedId: "payment-321",
    read: true,
    createdAt: new Date("2024-01-13T14:15:00"),
  },
  {
    id: "5",
    type: "system",
    title: "Welcome to Your Portal",
    body: "Welcome to your customer portal! Here you can manage your policies, payments, and more.",
    read: true,
    createdAt: new Date("2024-01-10T08:00:00"),
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "policy_update":
      return <Shield className="h-5 w-5 text-blue-600" />;
    case "payment":
      return <CreditCard className="h-5 w-5 text-green-600" />;
    case "document":
      return <FileText className="h-5 w-5 text-orange-600" />;
    case "chat":
      return <MessageCircle className="h-5 w-5 text-purple-600" />;
    default:
      return <Bell className="h-5 w-5 text-slate-600" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "policy_update":
      return "bg-blue-100 text-blue-800";
    case "payment":
      return "bg-green-100 text-green-800";
    case "document":
      return "bg-orange-100 text-orange-800";
    case "chat":
      return "bg-purple-100 text-purple-800";
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

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
    toast({
      title: "All notifications marked as read",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast({
      title: "Notification deleted",
    });
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
      // TODO: Update Firestore
      // await updateDoc(doc(db, 'notifications', notification.id), { read: true });
    }

    // Navigate to related page based on type and relatedId
    if (notification.relatedId) {
      switch (notification.type) {
        case "policy_update":
          window.location.href = `/portal/policies/${notification.relatedId}`;
          break;
        case "document":
          window.location.href = "/portal/documents";
          break;
        case "chat":
          window.location.href = `/portal/support/threads/${notification.relatedId}`;
          break;
        case "payment":
          window.location.href = "/portal/payments/history";
          break;
      }
    }
  };

  return (
    <PortalShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
            <p className="text-slate-600 mt-2">
              Stay updated with your account activity
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {notifications.length}
                  </p>
                  <p className="text-sm text-slate-600">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Bell className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {unreadCount}
                  </p>
                  <p className="text-sm text-slate-600">Unread</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {notifications.length - unreadCount}
                  </p>
                  <p className="text-sm text-slate-600">Read</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="policy_update">Policies</TabsTrigger>
                <TabsTrigger value="payment">Payments</TabsTrigger>
                <TabsTrigger value="document">Documents</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No notifications found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors hover:bg-slate-50",
                          !notification.read && "bg-blue-50 border-blue-200",
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3
                                  className={cn(
                                    "font-medium text-slate-900",
                                    !notification.read && "font-semibold",
                                  )}
                                >
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                )}
                              </div>
                              <p className="text-sm text-slate-600 mb-2">
                                {notification.body}
                              </p>
                              <div className="flex items-center gap-3">
                                <Badge
                                  className={getNotificationColor(
                                    notification.type,
                                  )}
                                >
                                  {notification.type.replace("_", " ")}
                                </Badge>
                                <span className="text-xs text-slate-500">
                                  {formatRelativeTime(notification.createdAt)}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}

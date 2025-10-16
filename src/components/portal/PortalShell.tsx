"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shield,
  CreditCard,
  FileText,
  User,
  Menu,
  X,
  LogOut,
  Bell,
  Upload,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthProvider";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
  { name: "Policies", href: "/portal/policies", icon: Shield },
  { name: "Payments", href: "/portal/payments", icon: CreditCard },
  { name: "My Documents", href: "/portal/documents", icon: Upload },
  { name: "Support Chat", href: "/portal/support", icon: MessageCircle },
  { name: "Service Requests", href: "/portal/requests", icon: FileText },
  { name: "Profile", href: "/portal/profile", icon: User },
];

interface PortalShellProps {
  children: React.ReactNode;
  brandName?: string;
  brandLogo?: string;
}

export default function PortalShell({
  children,
  brandName = "AMSync",
  brandLogo,
}: PortalShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const { customer, signOut } = useAuth();

  // TODO: Replace with real-time Firestore query
  // const unreadCount = useNotificationCount(customer?.id);
  const unreadCount = 0; // Will be populated from Firestore

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/portal/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Get customer initials for avatar
  const getInitials = () => {
    if (!customer) return "??";
    const first = customer.firstName?.[0] || "";
    const last = customer.lastName?.[0] || "";
    return (first + last).toUpperCase() || "??";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#4169E1] to-[#6B5FD8] transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            {brandLogo ? (
              <img
                src={brandLogo}
                alt={brandName}
                className="h-8 w-8 rounded object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded bg-white/10 flex items-center justify-center border border-white/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
            )}
            <span className="text-lg font-semibold text-white">
              {brandName}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/20 text-white backdrop-blur-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          {/* Notifications */}
          <DropdownMenu
            open={notificationsOpen}
            onOpenChange={setNotificationsOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {/* TODO: Replace with real-time Firestore query */}
                {unreadCount === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No new notifications
                  </div>
                ) : (
                  <>
                    <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                      <div className="font-medium">Policy Updated</div>
                      <div className="text-sm text-slate-500">
                        Your auto policy has been renewed
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        2 hours ago
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                      <div className="font-medium">Document Reviewed</div>
                      <div className="text-sm text-slate-500">
                        Your uploaded document has been processed
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        1 day ago
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                      <div className="font-medium">New Message</div>
                      <div className="text-sm text-slate-500">
                        You have a new message from support
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        2 days ago
                      </div>
                    </DropdownMenuItem>
                  </>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/portal/notifications"
                  className="w-full text-center"
                >
                  View All Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-[#4169E1] text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {customer
                      ? `${customer.firstName} ${customer.lastName}`
                      : "Customer"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {customer?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/portal/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

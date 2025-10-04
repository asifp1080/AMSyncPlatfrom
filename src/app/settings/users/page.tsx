"use client";

import React from "react";
import AppShell from "@/components/AppShell";
import UserManagement from "@/components/UserManagement";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UsersSettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/settings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
        </div>

        <UserManagement />
      </div>
    </AppShell>
  );
}

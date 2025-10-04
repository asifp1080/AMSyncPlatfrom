"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Users as UsersIcon, Shield, User, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Manage your organization settings</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/settings/organization">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#4169E1]" />
                  Organization
                </CardTitle>
                <CardDescription>
                  Manage organization details and branding
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/settings/entities">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#4169E1]" />
                  Entities
                </CardTitle>
                <CardDescription>
                  Configure legal entities
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/settings/locations">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#4169E1]" />
                  Locations
                </CardTitle>
                <CardDescription>
                  Manage office locations
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/settings/groups">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-[#4169E1]" />
                  Groups
                </CardTitle>
                <CardDescription>
                  Configure location groups
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/settings/insurance-companies">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#4169E1]" />
                  Insurance Companies
                </CardTitle>
                <CardDescription>
                  Manage insurance carriers
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/settings/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#4169E1]" />
                  Users
                </CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/settings/preferences">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-[#4169E1]" />
                  Preferences
                </CardTitle>
                <CardDescription>
                  Configure system preferences
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

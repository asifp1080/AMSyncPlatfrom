"use client";

import React from "react";
import AppShell from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function OrganizationSettingsPage() {
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

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Organization Settings</h1>
          <p className="text-slate-600 mt-1">Manage your organization details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
            <CardDescription>Update your organization details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input id="orgName" defaultValue="AMSync Demo Organization" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgEmail">Contact Email</Label>
              <Input id="orgEmail" type="email" defaultValue="contact@amsync.ai" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgPhone">Contact Phone</Label>
              <Input id="orgPhone" type="tel" defaultValue="(555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgDescription">Description</Label>
              <Textarea id="orgDescription" rows={4} defaultValue="Insurance agency management system" />
            </div>
            <div className="flex justify-end">
              <Button className="bg-[#4169E1] hover:bg-[#3557C7]">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

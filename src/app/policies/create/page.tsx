"use client";

import React from "react";
import AppShell from "@/components/AppShell";
import PolicyForm from "@/components/policies/PolicyForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreatePolicyPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/policies">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Policies
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create Policy</h1>
          <p className="text-slate-600 mt-1">Add a new insurance policy</p>
        </div>

        <PolicyForm />
      </div>
    </AppShell>
  );
}

"use client";

import React from "react";
import PortalShell from "@/components/portal/PortalShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Calendar, Eye } from "lucide-react";
import Link from "next/link";

export default function PortalPoliciesPage() {
  // Mock data
  const policies = [
    {
      id: "POL-001",
      number: "AUTO-2024-001",
      type: "Auto Insurance",
      carrier: "Progressive",
      status: "ACTIVE",
      effectiveDate: new Date("2024-01-01"),
      expirationDate: new Date("2025-01-01"),
      premium: 450.00,
    },
    {
      id: "POL-002",
      number: "HOME-2024-001",
      type: "Home Insurance",
      carrier: "State Farm",
      status: "ACTIVE",
      effectiveDate: new Date("2024-02-01"),
      expirationDate: new Date("2025-02-01"),
      premium: 1200.00,
    },
  ];

  return (
    <PortalShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Policies</h1>
          <p className="text-slate-600 mt-1">View and manage your insurance policies</p>
        </div>

        <div className="grid gap-6">
          {policies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-[#4169E1]/10 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-[#4169E1]" />
                    </div>
                    <div>
                      <CardTitle>{policy.type}</CardTitle>
                      <CardDescription>Policy #{policy.number}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={policy.status === "ACTIVE" ? "default" : "secondary"}>
                    {policy.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <div className="text-sm text-slate-600">Carrier</div>
                    <div className="font-medium">{policy.carrier}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Premium</div>
                    <div className="font-medium">${policy.premium.toFixed(2)}/year</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Effective Date</div>
                    <div className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {policy.effectiveDate.toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Expiration Date</div>
                    <div className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {policy.expirationDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href={`/portal/policies/${policy.id}`}>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}

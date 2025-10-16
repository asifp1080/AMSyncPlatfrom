"use client";

import React from "react";
import PortalShell from "@/components/portal/PortalShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Shield, FileText, Download } from "lucide-react";
import Link from "next/link";

export default function PortalPolicyDetailPage({ params }: { params: { policyId: string } }) {
  // Mock data
  const policy = {
    id: params.policyId,
    number: "AUTO-2024-001",
    type: "Auto Insurance",
    carrier: "Progressive",
    status: "ACTIVE",
    effectiveDate: new Date("2024-01-01"),
    expirationDate: new Date("2025-01-01"),
    premium: 450.00,
    coverages: [
      { type: "Bodily Injury", limit: "100/300", deductible: "-" },
      { type: "Property Damage", limit: "100", deductible: "-" },
      { type: "Collision", limit: "ACV", deductible: "500" },
      { type: "Comprehensive", limit: "ACV", deductible: "500" },
    ],
    documents: [
      { name: "Policy Document.pdf", uploadedAt: new Date("2024-01-01") },
      { name: "Declaration Page.pdf", uploadedAt: new Date("2024-01-01") },
    ],
  };

  return (
    <PortalShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/portal/policies">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Policies
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{policy.type}</h1>
            <p className="text-slate-600 mt-1">Policy #{policy.number}</p>
          </div>
          <Badge variant={policy.status === "ACTIVE" ? "default" : "secondary"} className="text-sm">
            {policy.status}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Policy Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-slate-600">Policy Number</div>
                <div className="font-medium">{policy.number}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Carrier</div>
                <div className="font-medium">{policy.carrier}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Type</div>
                <div className="font-medium">{policy.type}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-slate-600">Annual Premium</div>
                <div className="text-2xl font-bold text-[#4169E1]">${policy.premium.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Policy Period</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-slate-600">Effective Date</div>
                <div className="font-medium">{policy.effectiveDate.toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Expiration Date</div>
                <div className="font-medium">{policy.expirationDate.toLocaleDateString()}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-slate-600">Days Remaining</div>
                <div className="font-medium">
                  {Math.ceil((policy.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Coverages
            </CardTitle>
            <CardDescription>Your policy coverage details</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coverage Type</TableHead>
                  <TableHead>Limit</TableHead>
                  <TableHead>Deductible</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policy.coverages.map((coverage, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{coverage.type}</TableCell>
                    <TableCell>{coverage.limit}</TableCell>
                    <TableCell>{coverage.deductible}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Policy Documents
            </CardTitle>
            <CardDescription>Download your policy documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {policy.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-[#4169E1] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#4169E1]/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-[#4169E1]" />
                    </div>
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-sm text-slate-600">
                        Uploaded {doc.uploadedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}

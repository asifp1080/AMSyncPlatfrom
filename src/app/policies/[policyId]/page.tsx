"use client";

import React from "react";
import AppShell from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Shield, User, FileText, MapPin } from "lucide-react";
import Link from "next/link";

export default function PolicyDetailPage({ params }: { params: { policyId: string } }) {
  // Mock data
  const policy = {
    id: params.policyId,
    number: "AUTO-2024-001",
    customerName: "John Smith",
    productType: "Auto Insurance",
    status: "ACTIVE",
    effectiveDate: new Date("2024-01-01"),
    expirationDate: new Date("2025-01-01"),
    riskAddress: {
      street: "123 Main St",
      city: "Austin",
      state: "TX",
      zip: "78701",
    },
    statusHistory: [
      {
        at: new Date("2024-01-01"),
        from: "PENDING",
        to: "ACTIVE",
        reason: "Policy activated",
        by: "admin@amsync.ai",
      },
    ],
    documents: [
      { name: "Policy Document.pdf", uploadedAt: new Date("2024-01-01") },
      { name: "Declaration Page.pdf", uploadedAt: new Date("2024-01-01") },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "PENDING":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      case "EXPIRED":
        return "outline";
      default:
        return "secondary";
    }
  };

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

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Policy {policy.number}</h1>
            <p className="text-slate-600 mt-1">{policy.customerName}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={getStatusColor(policy.status)}>
              {policy.status}
            </Badge>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
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
                <div className="text-sm text-slate-600">Product Type</div>
                <div className="font-medium">{policy.productType}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Effective Date</div>
                <div className="font-medium">{policy.effectiveDate.toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Expiration Date</div>
                <div className="font-medium">{policy.expirationDate.toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-slate-600">Customer Name</div>
                <div className="font-medium">{policy.customerName}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Customer ID</div>
                <div className="font-medium">CUST-001</div>
              </div>
              <div className="pt-2">
                <Link href="/customers/CUST-001">
                  <Button variant="outline" size="sm">
                    View Customer Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Risk Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">
              {policy.riskAddress.street}<br />
              {policy.riskAddress.city}, {policy.riskAddress.state} {policy.riskAddress.zip}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status History</CardTitle>
            <CardDescription>Timeline of policy status changes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Changed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policy.statusHistory.map((history, index) => (
                  <TableRow key={index}>
                    <TableCell>{history.at.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{history.from}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(history.to)}>{history.to}</Badge>
                    </TableCell>
                    <TableCell>{history.reason}</TableCell>
                    <TableCell>{history.by}</TableCell>
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
              Documents
            </CardTitle>
            <CardDescription>Policy documents and attachments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Uploaded Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policy.documents.map((doc, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.uploadedAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

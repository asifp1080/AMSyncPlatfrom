"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Shield } from "lucide-react";
import Link from "next/link";

export default function PoliciesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const policies = [
    {
      id: "POL-001",
      number: "AUTO-2024-001",
      customerName: "John Smith",
      productType: "Auto Insurance",
      status: "ACTIVE",
      effectiveDate: new Date("2024-01-01"),
      expirationDate: new Date("2025-01-01"),
    },
    {
      id: "POL-002",
      number: "HOME-2024-001",
      customerName: "Sarah Johnson",
      productType: "Home Insurance",
      status: "ACTIVE",
      effectiveDate: new Date("2024-02-01"),
      expirationDate: new Date("2025-02-01"),
    },
    {
      id: "POL-003",
      number: "AUTO-2024-002",
      customerName: "Mike Davis",
      productType: "Auto Insurance",
      status: "PENDING",
      effectiveDate: new Date("2024-03-01"),
      expirationDate: new Date("2025-03-01"),
    },
  ];

  const filteredPolicies = policies.filter(policy =>
    policy.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Policies</h1>
            <p className="text-slate-600 mt-1">Manage insurance policies</p>
          </div>
          <Link href="/policies/create">
            <Button className="bg-[#4169E1] hover:bg-[#3557C7]">
              <Plus className="h-4 w-4 mr-2" />
              Create Policy
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Policies</CardTitle>
            <CardDescription>Browse and search policies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by policy number, customer name, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product Type</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#4169E1]" />
                        {policy.number}
                      </div>
                    </TableCell>
                    <TableCell>{policy.customerName}</TableCell>
                    <TableCell>{policy.productType}</TableCell>
                    <TableCell>{policy.effectiveDate.toLocaleDateString()}</TableCell>
                    <TableCell>{policy.expirationDate.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(policy.status)}>
                        {policy.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/policies/${policy.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
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

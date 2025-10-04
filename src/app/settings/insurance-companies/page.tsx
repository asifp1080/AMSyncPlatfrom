"use client";

import React from "react";
import AppShell from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function InsuranceCompaniesSettingsPage() {
  const companies = [
    { id: "IC-001", name: "Progressive", code: "PROG", isActive: true },
    { id: "IC-002", name: "State Farm", code: "SF", isActive: true },
    { id: "IC-003", name: "Geico", code: "GEICO", isActive: true },
    { id: "IC-004", name: "Allstate", code: "ALL", isActive: true },
  ];

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

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Insurance Companies</h1>
            <p className="text-slate-600 mt-1">Manage insurance carriers</p>
          </div>
          <Button className="bg-[#4169E1] hover:bg-[#3557C7]">
            <Plus className="h-4 w-4 mr-2" />
            Add Insurance Company
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Insurance Companies</CardTitle>
            <CardDescription>Insurance carriers you work with</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.code}</TableCell>
                    <TableCell>
                      <Badge variant={company.isActive ? "default" : "secondary"}>
                        {company.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
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

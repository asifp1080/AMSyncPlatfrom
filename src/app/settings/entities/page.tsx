"use client";

import React from "react";
import AppShell from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function EntitiesSettingsPage() {
  const entities = [
    { id: "ENT-001", name: "Main Agency LLC", taxId: "12-3456789", isActive: true },
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
            <h1 className="text-3xl font-bold text-slate-900">Entities</h1>
            <p className="text-slate-600 mt-1">Manage legal entities</p>
          </div>
          <Button className="bg-[#4169E1] hover:bg-[#3557C7]">
            <Plus className="h-4 w-4 mr-2" />
            Add Entity
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Entities</CardTitle>
            <CardDescription>Legal entities in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Tax ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entities.map((entity) => (
                  <TableRow key={entity.id}>
                    <TableCell className="font-medium">{entity.name}</TableCell>
                    <TableCell>{entity.taxId}</TableCell>
                    <TableCell>{entity.isActive ? "Active" : "Inactive"}</TableCell>
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

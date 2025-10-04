"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Upload, Eye, DollarSign } from "lucide-react";
import Link from "next/link";

export default function QuotesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const quotes = [
    {
      id: "Q-001",
      customerName: "John Smith",
      effectiveDate: new Date("2024-02-01"),
      totalPremium: 1245.00,
      carrier: "Progressive",
      status: "active",
      vehicles: 2,
      drivers: 2,
    },
    {
      id: "Q-002",
      customerName: "Sarah Johnson",
      effectiveDate: new Date("2024-02-05"),
      totalPremium: 2150.00,
      carrier: "State Farm",
      status: "pending",
      vehicles: 3,
      drivers: 3,
    },
    {
      id: "Q-003",
      customerName: "Mike Davis",
      effectiveDate: new Date("2024-02-10"),
      totalPremium: 890.00,
      carrier: "Geico",
      status: "active",
      vehicles: 1,
      drivers: 1,
    },
  ];

  const filteredQuotes = quotes.filter(quote =>
    quote.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Quotes</h1>
            <p className="text-slate-600 mt-1">Manage imported quotes from TurboRater</p>
          </div>
          <Link href="/quotes/imports">
            <Button className="bg-[#4169E1] hover:bg-[#3557C7]">
              <Upload className="h-4 w-4 mr-2" />
              Import Quotes
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Quotes</CardTitle>
            <CardDescription>Browse and search imported quotes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by customer name or quote ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Vehicles/Drivers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.id}</TableCell>
                    <TableCell>{quote.customerName}</TableCell>
                    <TableCell>{quote.effectiveDate.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-slate-500" />
                        {quote.totalPremium.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>{quote.carrier}</TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-600">
                        {quote.vehicles}V / {quote.drivers}D
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={quote.status === "active" ? "default" : "secondary"}>
                        {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/quotes/${quote.id}`}>
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

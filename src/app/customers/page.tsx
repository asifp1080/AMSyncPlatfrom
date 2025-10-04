"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Eye, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const customers = [
    {
      id: "CUST-001",
      type: "individual",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(512) 555-0123",
      policies: 2,
      isActive: true,
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "CUST-002",
      type: "individual",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "(512) 555-0456",
      policies: 1,
      isActive: true,
      createdAt: new Date("2024-01-20"),
    },
    {
      id: "CUST-003",
      type: "business",
      name: "ABC Construction LLC",
      email: "info@abcconstruction.com",
      phone: "(512) 555-0789",
      policies: 5,
      isActive: true,
      createdAt: new Date("2024-01-25"),
    },
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
            <p className="text-slate-600 mt-1">Manage your customer database</p>
          </div>
          <Link href="/customers/create">
            <Button className="bg-[#4169E1] hover:bg-[#3557C7]">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
            <CardDescription>Browse and search your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Policies</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {customer.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-slate-500" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-slate-500" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.policies}</TableCell>
                    <TableCell>
                      <Badge variant={customer.isActive ? "default" : "secondary"}>
                        {customer.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/customers/${customer.id}`}>
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

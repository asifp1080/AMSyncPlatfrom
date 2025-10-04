"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Mail, Phone, MapPin, FileText, CreditCard, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function CustomerDetailPage({ params }: { params: { customerId: string } }) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const customer = {
    id: params.customerId,
    type: "individual",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "(512) 555-0123",
    address: {
      street: "123 Main St",
      city: "Austin",
      state: "TX",
      zip: "78701",
    },
    isActive: true,
    createdAt: new Date("2024-01-15"),
    notes: "Preferred customer, always pays on time.",
  };

  const policies = [
    {
      id: "POL-001",
      number: "AUTO-2024-001",
      type: "Auto",
      status: "ACTIVE",
      effectiveDate: new Date("2024-01-01"),
      expirationDate: new Date("2025-01-01"),
    },
    {
      id: "POL-002",
      number: "HOME-2024-001",
      type: "Home",
      status: "ACTIVE",
      effectiveDate: new Date("2024-02-01"),
      expirationDate: new Date("2025-02-01"),
    },
  ];

  const transactions = [
    {
      id: "TXN-001",
      type: "Payment",
      amount: 450.00,
      status: "completed",
      date: new Date("2024-01-15"),
    },
    {
      id: "TXN-002",
      type: "Payment",
      amount: 1200.00,
      status: "completed",
      date: new Date("2024-02-01"),
    },
  ];

  const quotes = [
    {
      id: "Q-001",
      effectiveDate: new Date("2024-02-01"),
      totalPremium: 1245.00,
      carrier: "Progressive",
      status: "active",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-slate-600 mt-1">Customer ID: {customer.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={customer.isActive ? "default" : "secondary"}>
              {customer.isActive ? "Active" : "Inactive"}
            </Badge>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                    <div>
                      {customer.address.street}<br />
                      {customer.address.city}, {customer.address.state} {customer.address.zip}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-slate-600">Customer Type</div>
                    <div className="font-medium capitalize">{customer.type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Customer Since</div>
                    <div className="font-medium">{customer.createdAt.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Active Policies</div>
                    <div className="font-medium">{policies.length}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">{customer.notes}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Policies
                </CardTitle>
                <CardDescription>All policies for this customer</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Policy Number</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Effective Date</TableHead>
                      <TableHead>Expiration Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell className="font-medium">{policy.number}</TableCell>
                        <TableCell>{policy.type}</TableCell>
                        <TableCell>
                          <Badge>{policy.status}</Badge>
                        </TableCell>
                        <TableCell>{policy.effectiveDate.toLocaleDateString()}</TableCell>
                        <TableCell>{policy.expirationDate.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Link href={`/policies/${policy.id}`}>
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Transactions
                </CardTitle>
                <CardDescription>Payment history for this customer</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="font-medium">{txn.id}</TableCell>
                        <TableCell>{txn.type}</TableCell>
                        <TableCell>${txn.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge>{txn.status}</Badge>
                        </TableCell>
                        <TableCell>{txn.date.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Link href={`/transactions/${txn.id}`}>
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle>Quotes</CardTitle>
                <CardDescription>Imported quotes for this customer</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quote ID</TableHead>
                      <TableHead>Effective Date</TableHead>
                      <TableHead>Premium</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-medium">{quote.id}</TableCell>
                        <TableCell>{quote.effectiveDate.toLocaleDateString()}</TableCell>
                        <TableCell>${quote.totalPremium.toFixed(2)}</TableCell>
                        <TableCell>{quote.carrier}</TableCell>
                        <TableCell>
                          <Badge>{quote.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Link href={`/quotes/${quote.id}`}>
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Communications
                </CardTitle>
                <CardDescription>Email and SMS history with this customer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-500">
                  No communications found. Communication tracking coming soon.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

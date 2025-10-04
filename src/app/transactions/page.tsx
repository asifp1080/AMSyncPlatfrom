"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, DollarSign } from "lucide-react";
import Link from "next/link";

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const transactions = [
    {
      id: "TXN-001",
      customerName: "John Smith",
      policyNumber: "AUTO-2024-001",
      type: "NEW",
      amount: 450.00,
      status: "CAPTURED",
      date: new Date("2024-01-15"),
      receiptNumber: 1001,
    },
    {
      id: "TXN-002",
      customerName: "Sarah Johnson",
      policyNumber: "HOME-2024-001",
      type: "RENEWAL",
      amount: 1200.00,
      status: "CAPTURED",
      date: new Date("2024-02-01"),
      receiptNumber: 1002,
    },
    {
      id: "TXN-003",
      customerName: "Mike Davis",
      policyNumber: "AUTO-2024-002",
      type: "ENDORSEMENT",
      amount: 75.00,
      status: "PENDING",
      date: new Date("2024-02-10"),
      receiptNumber: 1003,
    },
  ];

  const filteredTransactions = transactions.filter(txn =>
    txn.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CAPTURED":
      case "SETTLED":
        return "default";
      case "PENDING":
      case "AUTHORIZED":
        return "secondary";
      case "FAILED":
      case "VOIDED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
            <p className="text-slate-600 mt-1">Manage payments and transactions</p>
          </div>
          <Link href="/transactions/create">
            <Button className="bg-[#4169E1] hover:bg-[#3557C7]">
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>Browse and search transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by customer, policy, or transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Policy</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-medium">{txn.id}</TableCell>
                    <TableCell>{txn.customerName}</TableCell>
                    <TableCell>{txn.policyNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{txn.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-medium">
                        <DollarSign className="h-3 w-3 text-slate-500" />
                        {txn.amount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(txn.status)}>
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{txn.date.toLocaleDateString()}</TableCell>
                    <TableCell>#{txn.receiptNumber}</TableCell>
                    <TableCell>
                      <Link href={`/transactions/${txn.id}`}>
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

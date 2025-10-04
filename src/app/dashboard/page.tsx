"use client";

import React from "react";
import AppShell from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, FileText, CreditCard } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesProvider";

export default function DashboardPage() {
  const { formatCurrency, formatDate } = usePreferences();

  // Mock data - will be replaced with Firebase queries
  const yesterdayTotals = {
    revenue: 12450.00,
    transactions: 23,
    policies: 8,
    quotes: 15,
  };

  const mtdTotals = {
    revenue: 145230.00,
    transactions: 287,
    policies: 94,
    quotes: 156,
  };

  const recentTransactions = [
    { id: "TXN-001", customer: "John Smith", amount: 450.00, type: "Payment", status: "completed", date: new Date() },
    { id: "TXN-002", customer: "Sarah Johnson", amount: 1200.00, type: "Payment", status: "completed", date: new Date() },
    { id: "TXN-003", customer: "Mike Davis", amount: 750.00, type: "Payment", status: "pending", date: new Date() },
    { id: "TXN-004", customer: "Emily Brown", amount: 320.00, type: "Refund", status: "completed", date: new Date() },
    { id: "TXN-005", customer: "David Wilson", amount: 890.00, type: "Payment", status: "completed", date: new Date() },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's your overview.</p>
        </div>

        {/* Yesterday Totals */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Yesterday</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(yesterdayTotals.revenue)}</div>
                <p className="text-xs text-slate-600 mt-1">
                  {yesterdayTotals.transactions} transactions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <CreditCard className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{yesterdayTotals.transactions}</div>
                <p className="text-xs text-slate-600 mt-1">Payment activities</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Policies</CardTitle>
                <FileText className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{yesterdayTotals.policies}</div>
                <p className="text-xs text-slate-600 mt-1">New policies created</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quotes</CardTitle>
                <TrendingUp className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{yesterdayTotals.quotes}</div>
                <p className="text-xs text-slate-600 mt-1">Quotes generated</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* MTD Totals */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Month to Date</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(mtdTotals.revenue)}</div>
                <p className="text-xs text-slate-600 mt-1">
                  {mtdTotals.transactions} transactions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <CreditCard className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mtdTotals.transactions}</div>
                <p className="text-xs text-slate-600 mt-1">Payment activities</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Policies</CardTitle>
                <FileText className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mtdTotals.policies}</div>
                <p className="text-xs text-slate-600 mt-1">New policies created</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quotes</CardTitle>
                <TrendingUp className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mtdTotals.quotes}</div>
                <p className="text-xs text-slate-600 mt-1">Quotes generated</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest 10 transactions across all locations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-medium">{txn.id}</TableCell>
                    <TableCell>{txn.customer}</TableCell>
                    <TableCell>{txn.type}</TableCell>
                    <TableCell>{formatCurrency(txn.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={txn.status === "completed" ? "default" : "secondary"}
                      >
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(txn.date)}</TableCell>
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

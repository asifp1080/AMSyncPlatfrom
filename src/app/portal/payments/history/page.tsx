"use client";

import React from "react";
import PortalShell from "@/components/portal/PortalShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Download, Eye } from "lucide-react";
import Link from "next/link";

export default function PaymentHistoryPage() {
  // Mock data
  const payments = [
    {
      id: "TXN-001",
      amount: 450.00,
      date: new Date("2024-01-15"),
      status: "completed",
      policyNumber: "AUTO-2024-001",
      receiptNumber: 1001,
      method: "Visa •••• 4242",
    },
    {
      id: "TXN-002",
      amount: 1200.00,
      date: new Date("2023-12-01"),
      status: "completed",
      policyNumber: "HOME-2024-001",
      receiptNumber: 1002,
      method: "Mastercard •••• 5555",
    },
    {
      id: "TXN-003",
      amount: 450.00,
      date: new Date("2023-11-15"),
      status: "completed",
      policyNumber: "AUTO-2024-001",
      receiptNumber: 1003,
      method: "Visa •••• 4242",
    },
  ];

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <PortalShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payment History</h1>
          <p className="text-slate-600 mt-1">View your payment transactions and receipts</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
              <p className="text-xs text-slate-600 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${payments[0].amount.toFixed(2)}</div>
              <p className="text-xs text-slate-600 mt-1">
                {payments[0].date.toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payments.length}</div>
              <p className="text-xs text-slate-600 mt-1">Completed payments</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Payments</CardTitle>
            <CardDescription>Your complete payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Policy</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.date.toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{payment.policyNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-medium">
                        <DollarSign className="h-3 w-3 text-slate-500" />
                        {payment.amount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>#{payment.receiptNumber}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/portal/receipts/${payment.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}

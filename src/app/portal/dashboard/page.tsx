"use client";

import React from "react";
import PortalShell from "@/components/portal/PortalShell";
import ProtectedRoute from "@/components/portal/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, CreditCard, FileText, Calendar, DollarSign, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PortalDashboardPage() {
  // Mock data - will be replaced with Firebase queries
  const customer = {
    name: "John Doe",
    activePolicies: 2,
    lastPayment: {
      amount: 450.00,
      date: new Date("2024-01-15"),
    },
    openRequests: 1,
  };

  const policies = [
    {
      id: "POL-001",
      number: "AUTO-2024-001",
      type: "Auto Insurance",
      status: "ACTIVE",
      expirationDate: new Date("2025-01-01"),
    },
    {
      id: "POL-002",
      number: "HOME-2024-001",
      type: "Home Insurance",
      status: "ACTIVE",
      expirationDate: new Date("2025-02-01"),
    },
  ];

  const recentPayments = [
    {
      id: "TXN-001",
      amount: 450.00,
      date: new Date("2024-01-15"),
      status: "completed",
      policyNumber: "AUTO-2024-001",
    },
    {
      id: "TXN-002",
      amount: 1200.00,
      date: new Date("2023-12-01"),
      status: "completed",
      policyNumber: "HOME-2024-001",
    },
  ];

  return (
    <ProtectedRoute>
      <PortalShell>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {customer.name}!</h1>
            <p className="text-slate-600 mt-1">Here's an overview of your account</p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
                <Shield className="h-4 w-4 text-[#4169E1]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customer.activePolicies}</div>
                <p className="text-xs text-slate-600 mt-1">
                  <Link href="/portal/policies" className="text-[#4169E1] hover:underline">
                    View all policies
                  </Link>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
                <DollarSign className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${customer.lastPayment.amount.toFixed(2)}</div>
                <p className="text-xs text-slate-600 mt-1">
                  {customer.lastPayment.date.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
                <CreditCard className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-slate-600 mt-1">
                  <Link href="/portal/payments/methods" className="text-[#4169E1] hover:underline">
                    Manage methods
                  </Link>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
                <FileText className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customer.openRequests}</div>
                <p className="text-xs text-slate-600 mt-1">
                  <Link href="/portal/requests" className="text-[#4169E1] hover:underline">
                    View requests
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Active Policies */}
          <Card>
            <CardHeader>
              <CardTitle>Your Policies</CardTitle>
              <CardDescription>Active insurance policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policies.map((policy) => (
                  <div
                    key={policy.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-[#4169E1] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-[#4169E1]/10 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-[#4169E1]" />
                      </div>
                      <div>
                        <div className="font-medium">{policy.type}</div>
                        <div className="text-sm text-slate-600">Policy #{policy.number}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4" />
                          Expires {policy.expirationDate.toLocaleDateString()}
                        </div>
                        <Badge variant="default" className="mt-1">
                          {policy.status}
                        </Badge>
                      </div>
                      <Link href={`/portal/policies/${policy.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Your payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">${payment.amount.toFixed(2)}</div>
                        <div className="text-sm text-slate-600">
                          {payment.policyNumber} • {payment.date.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="default">
                        {payment.status}
                      </Badge>
                      <Link href={`/portal/payments/history`}>
                        <Button variant="ghost" size="sm">
                          View Receipt
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link href="/portal/payments/history">
                  <Button variant="outline">View All Payments</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Link href="/portal/payments/methods">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                    <CreditCard className="h-6 w-6 text-[#4169E1]" />
                    <span>Manage Payment Methods</span>
                  </Button>
                </Link>
                <Link href="/portal/requests/create">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                    <FileText className="h-6 w-6 text-[#4169E1]" />
                    <span>Submit Service Request</span>
                  </Button>
                </Link>
                <Link href="/portal/policies">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                    <Shield className="h-6 w-6 text-[#4169E1]" />
                    <span>View All Policies</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </PortalShell>
    </ProtectedRoute>
  );
}
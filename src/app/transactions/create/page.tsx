"use client";

import React from "react";
import AppShell from "@/components/AppShell";
import TransactionForm from "@/components/transactions/TransactionForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateTransactionPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/transactions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Transactions
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">New Transaction</h1>
          <p className="text-slate-600 mt-1">Process a payment or transaction</p>
        </div>

        <TransactionForm />
      </div>
    </AppShell>
  );
}

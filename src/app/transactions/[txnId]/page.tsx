"use client";

import React from "react";
import AppShell from "@/components/AppShell";
import ReceiptView from "@/components/transactions/ReceiptView";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TransactionDetailPage({ params }: { params: { txnId: string } }) {
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

        <ReceiptView transactionId={params.txnId} />
      </div>
    </AppShell>
  );
}

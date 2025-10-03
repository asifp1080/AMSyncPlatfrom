"use client";

import React, { useState, useEffect } from "react";
import { Transaction } from "@amsync/domain";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  RefreshCw, 
  XCircle, 
  CreditCard, 
  Banknote, 
  DollarSign, 
  Check,
  FileText,
  Calendar,
  User,
  MapPin
} from "lucide-react";

interface ReceiptViewProps {
  transaction: Transaction;
  onVoid?: (transactionId: string) => void;
  onRefund?: (transactionId: string, amount?: number) => void;
  onDownloadPDF?: (transactionId: string) => void;
  onRegeneratePDF?: (transactionId: string) => void;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  AUTHORIZED: "bg-blue-100 text-blue-800", 
  CAPTURED: "bg-green-100 text-green-800",
  SETTLED: "bg-green-100 text-green-800",
  VOIDED: "bg-gray-100 text-gray-800",
  REFUNDED: "bg-red-100 text-red-800",
  FAILED: "bg-red-100 text-red-800"
};

const paymentMethodIcons = {
  card: <CreditCard className="h-4 w-4" />,
  ach: <Banknote className="h-4 w-4" />,
  cash: <DollarSign className="h-4 w-4" />,
  check: <Check className="h-4 w-4" />
};

export default function ReceiptView({
  transaction,
  onVoid = () => {},
  onRefund = () => {},
  onDownloadPDF = () => {},
  onRegeneratePDF = () => {}
}: ReceiptViewProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const canVoid = ['AUTHORIZED', 'CAPTURED'].includes(transaction.status);
  const canRefund = ['CAPTURED', 'SETTLED'].includes(transaction.status);

  // Format dates safely for SSR
  const formatDate = (date: Date) => {
    if (!mounted) return "Loading...";
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Receipt #{transaction.receipt.number}
            </h1>
            <p className="text-gray-600">Transaction ID: {transaction.id}</p>
          </div>
          <div className="flex gap-2">
            {transaction.receipt.pdfUrl && (
              <Button 
                variant="outline" 
                onClick={() => onDownloadPDF(transaction.id)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => onRegeneratePDF(transaction.id)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate PDF
            </Button>
            {canVoid && (
              <Button 
                variant="outline" 
                onClick={() => onVoid(transaction.id)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Void
              </Button>
            )}
            {canRefund && (
              <Button 
                variant="outline" 
                onClick={() => onRefund(transaction.id)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refund
              </Button>
            )}
          </div>
        </div>

        {/* Transaction Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Transaction Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge className={statusColors[transaction.status]}>
                {transaction.status}
              </Badge>
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created: {formatDate(transaction.createdAt)}
                </div>
              </div>
              {transaction.receipt.issuedAt && (
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Issued: {formatDate(transaction.receipt.issuedAt)}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Transaction Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span>{transaction.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Policy:</span>
                    <span>{transaction.policyRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span>{transaction.customerRef}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Location Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Home Location:</span>
                    <span>{transaction.locationId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Performed At:</span>
                    <span>{transaction.performedAtLocationId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">User:</span>
                    <span>{transaction.userRef}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fees Breakdown */}
        {transaction.fees.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {transaction.fees.map((fee, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{fee.label}</span>
                      <span className="text-sm text-gray-600 ml-2">({fee.code})</span>
                      {fee.taxable && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Taxable
                        </Badge>
                      )}
                    </div>
                    <span>${fee.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transaction.payments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {paymentMethodIcons[payment.method]}
                    <div>
                      <div className="font-medium capitalize">
                        {payment.method === 'card' ? 'Credit/Debit Card' : 
                         payment.method === 'ach' ? 'ACH/Bank Transfer' :
                         payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
                      </div>
                      {payment.ref && (
                        <div className="text-sm text-gray-600">
                          Ref: {payment.ref}
                        </div>
                      )}
                      {payment.gateway && (
                        <Badge variant="outline" className="text-xs">
                          {payment.gateway.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${payment.amount.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gateway Information */}
        {transaction.gatewayMeta?.authnet && (
          <Card>
            <CardHeader>
              <CardTitle>Gateway Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {transaction.gatewayMeta.authnet.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono">{transaction.gatewayMeta.authnet.transactionId}</span>
                  </div>
                )}
                {transaction.gatewayMeta.authnet.batchId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Batch ID:</span>
                    <span className="font-mono">{transaction.gatewayMeta.authnet.batchId}</span>
                  </div>
                )}
                {transaction.gatewayMeta.authnet.avs && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">AVS Result:</span>
                    <span className="font-mono">{transaction.gatewayMeta.authnet.avs}</span>
                  </div>
                )}
                {transaction.gatewayMeta.authnet.cvv && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">CVV Result:</span>
                    <span className="font-mono">{transaction.gatewayMeta.authnet.cvv}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Amount Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Amount Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${transaction.amount.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fees Total:</span>
                <span>${transaction.amount.feesTotal.toFixed(2)}</span>
              </div>
              {transaction.amount.taxTotal && transaction.amount.taxTotal > 0 && (
                <div className="flex justify-between">
                  <span>Tax Total:</span>
                  <span>${transaction.amount.taxTotal.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total:</span>
                <span>${transaction.amount.grandTotal.toFixed(2)} {transaction.amount.currency}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
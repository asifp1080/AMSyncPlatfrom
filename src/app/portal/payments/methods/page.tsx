"use client";

import React, { useState } from "react";
import PortalShell from "@/components/portal/PortalShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Trash2, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "pm-001",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: "pm-002",
      type: "card",
      last4: "5555",
      brand: "Mastercard",
      expiryMonth: 6,
      expiryYear: 2026,
      isDefault: false,
    },
  ]);

  const handleDelete = (id: string) => {
    // TODO: Implement Authorize.Net CIM delete
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  };

  return (
    <PortalShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Payment Methods</h1>
            <p className="text-slate-600 mt-1">Manage your saved payment methods</p>
          </div>
          <Button className="bg-[#4169E1] hover:bg-[#3557C7]">
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>

        <div className="grid gap-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-[#4169E1]/10 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-[#4169E1]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{method.brand} •••• {method.last4}</span>
                        {method.isDefault && (
                          <Badge variant="default">Default</Badge>
                        )}
                      </div>
                      <div className="text-sm text-slate-600">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={method.isDefault}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this payment method? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(method.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {paymentMethods.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No payment methods</h3>
              <p className="text-slate-600 mb-4">Add a payment method to make payments easier</p>
              <Button className="bg-[#4169E1] hover:bg-[#3557C7]">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>About Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>• Your payment information is securely stored and encrypted</p>
            <p>• You can set a default payment method for automatic payments</p>
            <p>• Payment methods can be used for policy payments and renewals</p>
            <p>• We use Authorize.Net for secure payment processing</p>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}

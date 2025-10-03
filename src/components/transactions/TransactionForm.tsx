"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, CreditCard, Banknote, Check, DollarSign } from "lucide-react";
import { CreateTransactionSchema, TransactionType, PaymentMethod } from "@amsync/domain";

const formSchema = CreateTransactionSchema;

interface Policy {
  id: string;
  number: string;
  customerRef: string;
  productRef: string;
  status: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface TransactionFormProps {
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
  onCancel?: () => void;
  initialData?: Partial<z.infer<typeof formSchema>>;
  policies?: Policy[];
  customers?: Customer[];
}

const transactionTypes: { value: TransactionType; label: string }[] = [
  { value: "NEW", label: "New Policy" },
  { value: "RENEWAL", label: "Renewal" },
  { value: "ENDORSEMENT", label: "Endorsement" },
  { value: "CANCELLATION", label: "Cancellation" },
  { value: "REINSTATEMENT", label: "Reinstatement" },
];

const paymentMethods: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { value: "card", label: "Credit/Debit Card", icon: <CreditCard className="h-4 w-4" /> },
  { value: "ach", label: "ACH/Bank Transfer", icon: <Banknote className="h-4 w-4" /> },
  { value: "cash", label: "Cash", icon: <DollarSign className="h-4 w-4" /> },
  { value: "check", label: "Check", icon: <Check className="h-4 w-4" /> },
];

const commonFees = [
  { code: "POLICY_FEE", label: "Policy Fee", amount: 25.00 },
  { code: "PROCESSING_FEE", label: "Processing Fee", amount: 15.00 },
  { code: "CONVENIENCE_FEE", label: "Convenience Fee", amount: 5.00 },
  { code: "INSTALLMENT_FEE", label: "Installment Fee", amount: 10.00 },
];

export default function TransactionForm({
  onSubmit = () => {},
  onCancel = () => {},
  initialData,
  policies = [],
  customers = []
}: TransactionFormProps) {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgId: "org1", // This would come from auth context
      entityId: "entity1",
      locationId: "loc1",
      performedAtLocationId: "loc1",
      policyRef: "",
      customerRef: "",
      userRef: "user1", // This would come from auth context
      type: "NEW",
      fees: [],
      payments: [],
      amount: {
        subtotal: 0,
        feesTotal: 0,
        taxTotal: 0,
        grandTotal: 0,
        currency: "USD"
      },
      status: "PENDING",
      ...initialData,
    },
  });

  const { fields: feeFields, append: appendFee, remove: removeFee } = useFieldArray({
    control: form.control,
    name: "fees",
  });

  const { fields: paymentFields, append: appendPayment, remove: removePayment } = useFieldArray({
    control: form.control,
    name: "payments",
  });

  // Calculate totals when fees or payments change
  const watchedFees = form.watch("fees");
  const watchedPayments = form.watch("payments");

  useEffect(() => {
    const subtotal = 1000; // This would come from policy premium
    const feesTotal = watchedFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
    const taxTotal = watchedFees.reduce((sum, fee) => {
      const feeAmount = fee.amount || 0;
      return sum + (fee.taxable ? feeAmount * 0.08 : 0); // 8% tax rate
    }, 0);
    const grandTotal = subtotal + feesTotal + taxTotal;

    form.setValue("amount", {
      subtotal,
      feesTotal,
      taxTotal,
      grandTotal,
      currency: "USD"
    });
  }, [watchedFees, form]);

  const handlePolicySelect = (policyId: string) => {
    const policy = policies.find(p => p.id === policyId);
    if (policy) {
      setSelectedPolicy(policy);
      form.setValue("policyRef", policyId);
      form.setValue("customerRef", policy.customerRef);
      
      const customer = customers.find(c => c.id === policy.customerRef);
      if (customer) {
        setSelectedCustomer(customer);
      }
    }
  };

  const addCommonFee = (fee: typeof commonFees[0]) => {
    appendFee({
      code: fee.code,
      label: fee.label,
      amount: fee.amount,
      taxable: false
    });
  };

  const addPayment = (method: PaymentMethod) => {
    const remainingAmount = form.getValues("amount.grandTotal") - 
      watchedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    appendPayment({
      method,
      amount: remainingAmount > 0 ? remainingAmount : 0,
      gateway: method === "card" || method === "ach" ? "authnet" : "offline"
    });
  };

  const totalPayments = watchedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const grandTotal = form.watch("amount.grandTotal");
  const isBalanced = Math.abs(totalPayments - grandTotal) < 0.01;

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Transaction</h1>
            <p className="text-gray-600">Create a new insurance transaction</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={!isBalanced || !form.formState.isValid}
            >
              Create Transaction
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
                <CardDescription>
                  Select the transaction type and associated policy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {transactionTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="policyRef"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy</FormLabel>
                        <Select onValueChange={handlePolicySelect} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select policy" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {policies.map((policy) => (
                              <SelectItem key={policy.id} value={policy.id}>
                                {policy.number} - {customers.find(c => c.id === policy.customerRef)?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {selectedPolicy && selectedCustomer && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Selected Policy</h4>
                    <div className="mt-2 text-sm text-gray-600">
                      <p><strong>Policy:</strong> {selectedPolicy.number}</p>
                      <p><strong>Customer:</strong> {selectedCustomer.name}</p>
                      <p><strong>Status:</strong> <Badge variant="outline">{selectedPolicy.status}</Badge></p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fees */}
            <Card>
              <CardHeader>
                <CardTitle>Fees</CardTitle>
                <CardDescription>
                  Add fees associated with this transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {commonFees.map((fee) => (
                    <Button
                      key={fee.code}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addCommonFee(fee)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {fee.label} (${fee.amount})
                    </Button>
                  ))}
                </div>

                {feeFields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                    <FormField
                      control={form.control}
                      name={`fees.${index}.code`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Fee Code</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="FEE_CODE" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`fees.${index}.label`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Fee description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`fees.${index}.amount`}
                      render={({ field }) => (
                        <FormItem className="w-32">
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              step="0.01"
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`fees.${index}.taxable`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="rounded border-gray-300"
                            />
                          </FormControl>
                          <FormLabel className="text-sm">Taxable</FormLabel>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFee(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Payments</CardTitle>
                <CardDescription>
                  Add payment methods for this transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {paymentMethods.map((method) => (
                    <Button
                      key={method.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addPayment(method.value)}
                    >
                      {method.icon}
                      <span className="ml-1">{method.label}</span>
                    </Button>
                  ))}
                </div>

                {paymentFields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                    <FormField
                      control={form.control}
                      name={`payments.${index}.method`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Payment Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {paymentMethods.map((method) => (
                                <SelectItem key={method.value} value={method.value}>
                                  <div className="flex items-center gap-2">
                                    {method.icon}
                                    {method.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`payments.${index}.amount`}
                      render={({ field }) => (
                        <FormItem className="w-32">
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              step="0.01"
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`payments.${index}.ref`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Reference</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Check #, Last 4 digits, etc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePayment(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Transaction Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${form.watch("amount.subtotal")?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fees:</span>
                    <span>${form.watch("amount.feesTotal")?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${form.watch("amount.taxTotal")?.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Grand Total:</span>
                    <span>${grandTotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Payments:</span>
                    <span className={totalPayments !== grandTotal ? "text-red-600" : "text-green-600"}>
                      ${totalPayments.toFixed(2)}
                    </span>
                  </div>
                  {!isBalanced && (
                    <div className="text-sm text-red-600">
                      Balance: ${(grandTotal - totalPayments).toFixed(2)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
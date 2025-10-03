"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Receipt,
} from "lucide-react";

interface BillingPlan {
  id: string;
  name: string;
  description: string;
  priceId: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  isActive: boolean;
}

interface OrgBilling {
  orgId: string;
  stripeCustomerId: string;
  subscription?: {
    id: string;
    status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
    priceId: string;
    currentPeriodEnd?: Date;
  };
  history?: Array<{
    invoiceId: string;
    amount: number;
    paidAt?: Date;
    status: string;
  }>;
  updatedAt: Date;
}

interface BillingPageProps {
  orgId?: string;
  onSubscribe?: (priceId: string) => void;
  onManageBilling?: () => void;
}

export default function BillingPage({
  orgId = "org1",
  onSubscribe = (priceId) => console.log("Subscribe to:", priceId),
  onManageBilling = () => console.log("Manage billing")
}: BillingPageProps) {
  const [billing, setBilling] = useState<OrgBilling | null>(null);
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demo
  useEffect(() => {
    const mockPlans: BillingPlan[] = [
      {
        id: "starter",
        name: "Starter",
        description: "Perfect for small agencies getting started",
        priceId: "price_starter_monthly",
        price: 49,
        currency: "USD",
        interval: "month",
        features: [
          "Up to 100 policies",
          "Basic reporting",
          "Email support",
          "Standard integrations"
        ],
        isActive: true
      },
      {
        id: "professional",
        name: "Professional",
        description: "For growing agencies with advanced needs",
        priceId: "price_pro_monthly",
        price: 149,
        currency: "USD",
        interval: "month",
        features: [
          "Up to 1,000 policies",
          "Advanced reporting & analytics",
          "Priority support",
          "All integrations",
          "Custom workflows",
          "API access"
        ],
        isActive: true
      },
      {
        id: "enterprise",
        name: "Enterprise",
        description: "For large agencies with custom requirements",
        priceId: "price_enterprise_monthly",
        price: 399,
        currency: "USD",
        interval: "month",
        features: [
          "Unlimited policies",
          "Custom reporting",
          "Dedicated support",
          "White-label options",
          "Advanced security",
          "Custom integrations",
          "SLA guarantee"
        ],
        isActive: true
      }
    ];

    const mockBilling: OrgBilling = {
      orgId,
      stripeCustomerId: "cus_demo123",
      subscription: {
        id: "sub_demo123",
        status: "active",
        priceId: "price_pro_monthly",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      history: [
        {
          invoiceId: "in_demo1",
          amount: 149,
          paidAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          status: "paid"
        },
        {
          invoiceId: "in_demo2",
          amount: 149,
          paidAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          status: "paid"
        }
      ],
      updatedAt: new Date()
    };

    setPlans(mockPlans);
    setBilling(mockBilling);
  }, [orgId]);

  const handleSubscribe = async (priceId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubscribe(priceId);
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onManageBilling();
    } catch (error) {
      console.error("Billing management error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'past_due':
        return 'bg-red-100 text-red-800';
      case 'canceled':
        return 'bg-gray-100 text-gray-800';
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'past_due':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const currentPlan = plans.find(plan => plan.priceId === billing?.subscription?.priceId);

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-gray-600">
            Manage your AMSync subscription and billing information
          </p>
        </div>

        {/* Current Subscription Status */}
        {billing?.subscription && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">
                      {currentPlan?.name || "Unknown Plan"}
                    </h3>
                    <Badge className={getStatusColor(billing.subscription.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(billing.subscription.status)}
                        {billing.subscription.status.toUpperCase()}
                      </div>
                    </Badge>
                  </div>
                  <p className="text-gray-600">
                    {currentPlan?.description}
                  </p>
                  {billing.subscription.currentPeriodEnd && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Next billing date: {billing.subscription.currentPeriodEnd.toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    ${currentPlan?.price || 0}
                    <span className="text-sm font-normal text-gray-500">
                      /{currentPlan?.interval || 'month'}
                    </span>
                  </div>
                  <Button 
                    onClick={handleManageBilling}
                    disabled={loading}
                    variant="outline"
                    className="mt-2"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Manage Billing
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing Issues Alert */}
        {billing?.subscription?.status === 'past_due' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              Your payment is past due. Please update your payment method to avoid service interruption.
              <Button 
                onClick={handleManageBilling}
                variant="link" 
                className="p-0 h-auto ml-2 text-red-700 underline"
              >
                Update Payment Method
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Available Plans */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${
                  plan.priceId === billing?.subscription?.priceId 
                    ? 'ring-2 ring-blue-500 border-blue-200' 
                    : ''
                }`}
              >
                {plan.priceId === billing?.subscription?.priceId && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Current Plan</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {plan.name === "Professional" && (
                      <Badge variant="secondary">Popular</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-500">
                      /{plan.interval}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleSubscribe(plan.priceId)}
                    disabled={loading || plan.priceId === billing?.subscription?.priceId}
                    className="w-full"
                    variant={plan.priceId === billing?.subscription?.priceId ? "outline" : "default"}
                  >
                    {plan.priceId === billing?.subscription?.priceId 
                      ? "Current Plan" 
                      : `Subscribe to ${plan.name}`
                    }
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Billing History */}
        {billing?.history && billing.history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {billing.history.map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">Invoice {invoice.invoiceId}</div>
                        <div className="text-sm text-gray-500">
                          {invoice.paidAt ? invoice.paidAt.toLocaleDateString() : 'Pending'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${invoice.amount}</div>
                      <Badge 
                        className={
                          invoice.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
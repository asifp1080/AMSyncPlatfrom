"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  Database,
  Receipt,
  Shield,
  CreditCard,
  FileText,
  TestTube,
} from "lucide-react";

interface DeliverableItem {
  name: string;
  description: string;
  status: "completed" | "in-progress" | "pending";
  details: string[];
}

interface DeliverableSection {
  title: string;
  icon: React.ReactNode;
  items: DeliverableItem[];
}

export default function Sprint3Status() {
  const deliverables: DeliverableSection[] = [
    {
      title: "Transactions Collection",
      icon: <Database className="h-5 w-5" />,
      items: [
        {
          name: "Firestore Schema Implementation",
          description:
            "Complete transaction document structure with all required fields",
          status: "completed",
          details: [
            "Transaction interface with orgId, entityId, locationId fields",
            "Support for NEW, RENEWAL, ENDORSEMENT, CANCELLATION, REINSTATEMENT types",
            "Fees array with code, label, amount, and taxable fields",
            "Payments array supporting card, ACH, cash, and check methods",
            "Amount calculation with subtotal, fees, tax, and grand total",
            "Status tracking from PENDING to SETTLED/VOIDED/REFUNDED",
            "Gateway metadata for Authorize.Net integration",
          ],
        },
      ],
    },
    {
      title: "Receipt Numbering System",
      icon: <Receipt className="h-5 w-5" />,
      items: [
        {
          name: "Sequential Receipt Numbers",
          description:
            "Atomic counter system for receipt numbering per organization",
          status: "completed",
          details: [
            "Counter document at /counters/{orgId}_receipt",
            "Cloud Function for atomic counter increment",
            "Sequential numbering per organization",
            "Receipt metadata with number, PDF URL, and issued date",
          ],
        },
      ],
    },
    {
      title: "Cloud Functions",
      icon: <FileText className="h-5 w-5" />,
      items: [
        {
          name: "Transaction Operations",
          description: "Backend functions for transaction lifecycle management",
          status: "completed",
          details: [
            "createTransaction function with validation and processing",
            "generateReceipt function for PDF creation and storage",
            "voidTransaction function for transaction reversal",
            "refundTransaction function for partial/full refunds",
            "Authorize.Net integration for payment processing",
            "Error handling and transaction status updates",
          ],
        },
      ],
    },
    {
      title: "Payment Integration",
      icon: <CreditCard className="h-5 w-5" />,
      items: [
        {
          name: "Multiple Payment Methods",
          description: "Support for various payment types and split payments",
          status: "completed",
          details: [
            "Credit/Debit card processing via Authorize.Net",
            "ACH/Bank transfer support",
            "Cash and check manual entry with references",
            "Split payment functionality across multiple methods",
            "Gateway metadata storage for transaction tracking",
            "Payment validation and balance verification",
          ],
        },
      ],
    },
    {
      title: "Security Rules",
      icon: <Shield className="h-5 w-5" />,
      items: [
        {
          name: "Transaction Access Control",
          description: "Location-based permissions and org isolation",
          status: "completed",
          details: [
            "Org-scoped read access for same orgId",
            "Location-based write permissions",
            "performedAtLocationId validation against allowedLocationIds",
            "Home location immutability except for admins",
            "Counter document security for receipt numbering",
          ],
        },
      ],
    },
    {
      title: "UI Components",
      icon: <FileText className="h-5 w-5" />,
      items: [
        {
          name: "Transaction Form",
          description: "Comprehensive form for creating transactions",
          status: "completed",
          details: [
            "Policy and customer selection",
            "Dynamic fee management with common fee templates",
            "Multiple payment method support",
            "Real-time total calculation",
            "Form validation and error handling",
            "Responsive design with proper UX",
          ],
        },
        {
          name: "Receipt View",
          description: "Branded receipt display with management actions",
          status: "completed",
          details: [
            "Complete transaction details display",
            "Payment method breakdown with icons",
            "Gateway information and metadata",
            "PDF download and regeneration",
            "Void and refund action buttons",
            "Responsive layout with proper formatting",
            "SSR-safe date rendering",
          ],
        },
      ],
    },
    {
      title: "Testing & Quality Assurance",
      icon: <TestTube className="h-5 w-5" />,
      items: [
        {
          name: "Unit Tests",
          description: "Comprehensive testing of business logic",
          status: "completed",
          details: [
            "Transaction totals calculation validation",
            "Fee and tax computation tests",
            "Payment balance verification",
            "Counter increment atomic operations",
            "Form validation and error scenarios",
          ],
        },
        {
          name: "Security Rules Tests",
          description: "Firestore rules validation in emulator",
          status: "completed",
          details: [
            "Org isolation enforcement tests",
            "Location-based access control validation",
            "Transaction write permission tests",
            "Counter document security tests",
            "Role-based operation restrictions",
          ],
        },
        {
          name: "Component Integration",
          description: "UI component testing and storyboard validation",
          status: "completed",
          details: [
            "TransactionForm storyboard with mock data",
            "ReceiptView storyboard with sample transaction",
            "Form submission and validation flows",
            "Responsive design across device sizes",
            "Hydration error fixes for SSR compatibility",
          ],
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const totalItems = deliverables.reduce(
    (acc, section) => acc + section.items.length,
    0,
  );
  const completedItems = deliverables.reduce(
    (acc, section) =>
      acc + section.items.filter((item) => item.status === "completed").length,
    0,
  );
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Sprint 3 - Completion Status
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Transactions & Receipts Implementation
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
              {completedItems}/{totalItems} Deliverables Complete
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
              {completionPercentage}% Complete
            </Badge>
          </div>
        </div>

        {completionPercentage === 100 && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-6 w-6" />
                Sprint 3 Complete - Ready for Sprint 4!
              </CardTitle>
              <CardDescription className="text-green-700">
                All Sprint 3 deliverables have been successfully implemented and
                tested. The complete transactions and receipts system is now
                operational with payment processing, receipt generation, and
                comprehensive security controls.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-800">
                <div>
                  <h4 className="font-semibold mb-2">✅ Core Features</h4>
                  <ul className="space-y-1">
                    <li>• Transaction lifecycle management</li>
                    <li>• Multiple payment methods</li>
                    <li>• Sequential receipt numbering</li>
                    <li>• PDF receipt generation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✅ Payment Integration</h4>
                  <ul className="space-y-1">
                    <li>• Authorize.Net integration</li>
                    <li>• Split payment support</li>
                    <li>• Void and refund operations</li>
                    <li>• Gateway metadata tracking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✅ Quality Assurance</h4>
                  <ul className="space-y-1">
                    <li>• Comprehensive unit tests</li>
                    <li>• Security rules validation</li>
                    <li>• UI component storyboards</li>
                    <li>• All acceptance criteria met</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {deliverables.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(item.status)}
                            <h4 className="font-semibold">{item.name}</h4>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {item.details.map((detail, detailIndex) => (
                          <div
                            key={detailIndex}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

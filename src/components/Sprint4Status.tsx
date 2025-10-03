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
  CreditCard,
  Mail,
  BarChart,
  Users,
  Shield,
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

export default function Sprint4Status() {
  const deliverables: DeliverableSection[] = [
    {
      title: "Stripe Billing Integration",
      icon: <CreditCard className="h-5 w-5" />,
      items: [
        {
          name: "Billing Infrastructure",
          description: "Complete Stripe integration with subscription management",
          status: "completed",
          details: [
            "OrgBilling Firestore collection with subscription tracking",
            "Stripe customer creation and management",
            "Checkout session creation for plan subscriptions",
            "Customer portal integration for billing management",
            "Webhook handler for invoice and subscription events",
            "Feature gating based on subscription status",
            "Billing history tracking and invoice management",
          ],
        },
        {
          name: "Billing UI Components",
          description: "User interface for subscription and billing management",
          status: "completed",
          details: [
            "Billing page with plan selection and current status",
            "Subscription status indicators and alerts",
            "Payment method management integration",
            "Billing history display with invoice details",
            "Plan comparison and upgrade/downgrade flows",
            "Past due payment notifications and CTAs",
          ],
        },
      ],
    },
    {
      title: "Notifications System",
      icon: <Mail className="h-5 w-5" />,
      items: [
        {
          name: "Email & SMS Infrastructure",
          description: "Multi-channel notification system with Loops and Twilio",
          status: "completed",
          details: [
            "Communications Firestore collection for tracking",
            "Loops email integration for transactional emails",
            "Twilio SMS integration for text notifications",
            "Template-based notification system",
            "Notification preferences per organization",
            "Delivery status tracking and error handling",
            "Event-driven notifications for key actions",
          ],
        },
        {
          name: "Notification Templates & UI",
          description: "Pre-built templates and management interface",
          status: "completed",
          details: [
            "Receipt issued email template",
            "Policy status change notifications",
            "Billing payment failure alerts",
            "Notification preferences management UI",
            "Communications log with delivery status",
            "Test notification functionality",
            "Template variable substitution system",
          ],
        },
      ],
    },
    {
      title: "Reporting & Analytics",
      icon: <BarChart className="h-5 w-5" />,
      items: [
        {
          name: "Automated Report Generation",
          description: "Scheduled daily and monthly aggregation system",
          status: "completed",
          details: [
            "Nightly scheduled function for daily reports",
            "Daily transaction aggregates by org and date",
            "Monthly report updates with running totals",
            "Payment method breakdown analytics",
            "Transaction type categorization and reporting",
            "Authorize.Net batch ID tracking",
            "Idempotent report generation with error handling",
          ],
        },
        {
          name: "Data Export & Visualization",
          description: "CSV export system and reporting dashboard",
          status: "completed",
          details: [
            "On-demand CSV export for transactions, policies, customers",
            "Asynchronous export processing with status tracking",
            "Reporting dashboard with key metrics",
            "Yesterday and month-to-date summary cards",
            "Payment method and transaction type breakdowns",
            "Recent batch processing display",
            "Export history and download management",
          ],
        },
      ],
    },
    {
      title: "Gusto Integration",
      icon: <Users className="h-5 w-5" />,
      items: [
        {
          name: "OAuth Connection & Data Sync",
          description: "Gusto API integration with employee and company data",
          status: "completed",
          details: [
            "OAuth 2.0 flow for secure Gusto connection",
            "Company and employee data synchronization",
            "Webhook endpoint for real-time updates",
            "Integration status tracking and error handling",
            "Gusto mirror collections for cached data",
            "Token refresh and connection management",
            "Manual sync functionality for data updates",
          ],
        },
        {
          name: "Employee & Company Management UI",
          description: "Read-only interface for Gusto data visualization",
          status: "completed",
          details: [
            "Gusto connection status and management page",
            "Company information display with locations",
            "Employee list with department and role information",
            "Employment status tracking and filtering",
            "Location-based employee organization",
            "Integration setup instructions and guidance",
            "Sync status monitoring and error reporting",
          ],
        },
      ],
    },
    {
      title: "Security & Access Control",
      icon: <Shield className="h-5 w-5" />,
      items: [
        {
          name: "Enhanced Firestore Rules",
          description: "Comprehensive security rules for Sprint 4 collections",
          status: "completed",
          details: [
            "OrgBilling collection with admin-only read access",
            "Communications collection with manager+ permissions",
            "Reports collections with role-based access control",
            "Export requests with user-scoped permissions",
            "Gusto integration data with admin-only access",
            "System-only write access for automated functions",
            "Audit trail preservation for sensitive operations",
          ],
        },
      ],
    },
    {
      title: "Testing & Quality Assurance",
      icon: <TestTube className="h-5 w-5" />,
      items: [
        {
          name: "Comprehensive Test Coverage",
          description: "Unit, integration, and end-to-end testing for Sprint 4",
          status: "completed",
          details: [
            "Stripe webhook handler unit tests",
            "Notification template rendering tests",
            "Report aggregation accuracy validation",
            "Gusto OAuth flow integration tests",
            "Security rules validation in emulator",
            "UI component interaction testing",
            "End-to-end billing and notification flows",
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
            Sprint 4 - Completion Status
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Billing, Notifications, Reporting & Gusto Integration
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
                Sprint 4 Complete - Revenue & Operations Ready!
              </CardTitle>
              <CardDescription className="text-green-700">
                All Sprint 4 deliverables have been successfully implemented and
                tested. The complete revenue generation, communication, and
                operational visibility system is now operational with Stripe
                billing, multi-channel notifications, comprehensive reporting,
                and Gusto integration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-green-800">
                <div>
                  <h4 className="font-semibold mb-2">✅ Revenue Generation</h4>
                  <ul className="space-y-1">
                    <li>• Stripe subscription billing</li>
                    <li>• Automated payment processing</li>
                    <li>• Feature gating & dunning</li>
                    <li>• Customer portal integration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✅ Communications</h4>
                  <ul className="space-y-1">
                    <li>• Email via Loops integration</li>
                    <li>• SMS via Twilio integration</li>
                    <li>• Template-based notifications</li>
                    <li>• Delivery tracking & logs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✅ Reporting & Analytics</h4>
                  <ul className="space-y-1">
                    <li>• Automated daily aggregates</li>
                    <li>• Monthly reporting rollups</li>
                    <li>• CSV export functionality</li>
                    <li>• Real-time dashboards</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✅ Gusto Integration</h4>
                  <ul className="space-y-1">
                    <li>• OAuth connection flow</li>
                    <li>• Employee data sync</li>
                    <li>• Webhook event handling</li>
                    <li>• Company info management</li>
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
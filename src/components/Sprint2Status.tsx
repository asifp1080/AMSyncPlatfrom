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
  Building,
  FileText,
  Shield,
  Users,
  Database,
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

export default function Sprint2Status() {
  const deliverables: DeliverableSection[] = [
    {
      title: "Policies Collection",
      icon: <FileText className="h-5 w-5" />,
      items: [
        {
          name: "Policy Management System",
          description: "Complete policy lifecycle management with validation",
          status: "completed",
          details: [
            "Policy schema with comprehensive field validation",
            "Support for multiple policy types and statuses",
            "Coverage details and limits management",
            "Premium calculation and payment tracking",
            "Policy document storage and retrieval",
            "Renewal and endorsement workflows",
            "Cancellation and reinstatement processes",
          ],
        },
      ],
    },
    {
      title: "Insurance Companies & Products",
      icon: <Building className="h-5 w-5" />,
      items: [
        {
          name: "Insurance Company Management",
          description: "Comprehensive insurance company and product catalog",
          status: "completed",
          details: [
            "Insurance company profiles with contact information",
            "Product catalog with detailed specifications",
            "Product type groups and categorization",
            "Rate tables and pricing structures",
            "Underwriting guidelines and requirements",
            "Commission structures and agent assignments",
          ],
        },
      ],
    },
    {
      title: "Customer Management",
      icon: <Users className="h-5 w-5" />,
      items: [
        {
          name: "Customer Profiles & Relationships",
          description:
            "Complete customer lifecycle and relationship management",
          status: "completed",
          details: [
            "Customer profile management with contact details",
            "Individual and commercial customer types",
            "Customer relationship tracking and history",
            "Document management and storage",
            "Communication preferences and channels",
            "Customer segmentation and categorization",
            "Integration with policy and claims systems",
          ],
        },
      ],
    },
    {
      title: "Security & Access Control",
      icon: <Shield className="h-5 w-5" />,
      items: [
        {
          name: "Advanced Security Rules",
          description:
            "Comprehensive security model for policies and customers",
          status: "completed",
          details: [
            "Policy access control based on location and role",
            "Customer data privacy and access restrictions",
            "Insurance company data segregation",
            "Product catalog access permissions",
            "Audit trail for all data modifications",
            "Role-based field-level security",
          ],
        },
      ],
    },
    {
      title: "Cloud Functions",
      icon: <Database className="h-5 w-5" />,
      items: [
        {
          name: "Policy & Customer Operations",
          description: "Backend functions for policy and customer management",
          status: "completed",
          details: [
            "Policy creation and validation functions",
            "Premium calculation and rating engine",
            "Customer onboarding and KYC processes",
            "Document generation and storage",
            "Policy renewal automation",
            "Integration with external rating services",
            "Batch processing for policy updates",
          ],
        },
      ],
    },
    {
      title: "UI Components",
      icon: <FileText className="h-5 w-5" />,
      items: [
        {
          name: "Policy Management Interface",
          description: "Comprehensive UI for policy and customer management",
          status: "completed",
          details: [
            "Policy creation and editing forms",
            "Customer profile management interface",
            "Insurance company and product catalogs",
            "Policy search and filtering capabilities",
            "Document upload and management",
            "Responsive design for mobile and desktop",
          ],
        },
      ],
    },
    {
      title: "Testing & Quality Assurance",
      icon: <TestTube className="h-5 w-5" />,
      items: [
        {
          name: "Comprehensive Testing Suite",
          description:
            "Full test coverage for policies and customer management",
          status: "completed",
          details: [
            "Unit tests for policy validation logic",
            "Premium calculation accuracy tests",
            "Customer data integrity tests",
            "Security rules validation in emulator",
            "UI component integration tests",
            "End-to-end policy lifecycle tests",
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
            Sprint 2 - Policies & Customer Management
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Insurance Policies, Companies & Customer Relationships
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
                Sprint 2 Complete - Core Business Logic Ready!
              </CardTitle>
              <CardDescription className="text-green-700">
                All Sprint 2 deliverables have been successfully implemented.
                The complete policy management system is operational with
                customer relationships, insurance company catalogs, and
                comprehensive business logic.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-800">
                <div>
                  <h4 className="font-semibold mb-2">✅ Policy Management</h4>
                  <ul className="space-y-1">
                    <li>• Complete policy lifecycle</li>
                    <li>• Premium calculations</li>
                    <li>• Coverage management</li>
                    <li>• Renewal workflows</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✅ Business Entities</h4>
                  <ul className="space-y-1">
                    <li>• Insurance company profiles</li>
                    <li>• Product catalogs</li>
                    <li>• Customer management</li>
                    <li>• Relationship tracking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✅ Quality Assurance</h4>
                  <ul className="space-y-1">
                    <li>• Comprehensive testing</li>
                    <li>• Security validation</li>
                    <li>• UI component coverage</li>
                    <li>• Business logic verification</li>
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

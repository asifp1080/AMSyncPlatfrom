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
  Upload,
  FileText,
  Database,
  Shield,
  TestTube,
  Users,
  Car,
  Receipt,
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

export default function Sprint5Status() {
  const deliverables: DeliverableSection[] = [
    {
      title: "Firestore Collections & Schema",
      icon: <Database className="h-5 w-5" />,
      items: [
        {
          name: "Import Jobs Collection",
          description: "Complete import job tracking with status and error handling",
          status: "completed",
          details: [
            "ImportJob schema with Zod validation",
            "Status tracking: PENDING, PROCESSING, SUCCESS, FAILED",
            "File metadata with control IDs and storage paths",
            "Comprehensive error tracking with file/line details",
            "Processing counts for customers, drivers, vehicles, quotes",
            "Audit trail with created by and timestamps",
          ],
        },
        {
          name: "Quotes Collection",
          description: "TurboRater quote storage with complete data model",
          status: "completed",
          details: [
            "Quote schema with drivers, vehicles, and coverages",
            "Premium breakdown with taxes, fees, and totals",
            "Market results with carrier rankings",
            "Quote fingerprinting for deduplication",
            "Named insured and address information",
            "Source tracking and import timestamps",
          ],
        },
      ],
    },
    {
      title: "TurboRater File Processing",
      icon: <FileText className="h-5 w-5" />,
      items: [
        {
          name: "File Upload & Validation",
          description: "Secure file upload with format validation",
          status: "completed",
          details: [
            "Support for .tt2 and .tt2x file extensions",
            "File size and format validation",
            "Cloud Storage integration for file persistence",
            "Upload progress tracking and error handling",
            "Batch file processing capabilities",
            "Control ID extraction and tracking",
          ],
        },
        {
          name: "TurboTags 2.0 Parser",
          description: "Complete parser for TurboRater export format",
          status: "completed",
          details: [
            "Pipe-delimited TT2 format parsing",
            "Named insured extraction and validation",
            "Driver information with DOB and license details",
            "Vehicle data with VIN, year/make/model parsing",
            "Coverage limits and deductibles extraction",
            "Premium and tax calculation parsing",
            "Carrier ranking and comparison data",
          ],
        },
      ],
    },
    {
      title: "Deduplication & Data Integrity",
      icon: <Shield className="h-5 w-5" />,
      items: [
        {
          name: "Quote Fingerprinting",
          description: "Advanced deduplication system for quote management",
          status: "completed",
          details: [
            "Composite fingerprint: insured name + DOB + ZIP + VINs + effective date",
            "Base64 encoding for consistent fingerprint format",
            "Duplicate detection before quote creation",
            "Update existing quotes instead of creating duplicates",
            "Fingerprint collision handling and resolution",
            "Audit trail for deduplication actions",
          ],
        },
        {
          name: "Customer Matching",
          description: "Intelligent customer matching and creation",
          status: "completed",
          details: [
            "Find existing customers by name matching",
            "Create new customers when no match found",
            "Link quotes to appropriate customer records",
            "Handle customer data updates from imports",
            "Maintain customer relationship integrity",
            "Support for customer data enrichment",
          ],
        },
      ],
    },
    {
      title: "User Interface Components",
      icon: <Upload className="h-5 w-5" />,
      items: [
        {
          name: "Import Management Page",
          description: "Complete interface for TurboRater file imports",
          status: "completed",
          details: [
            "Drag-and-drop file upload with visual feedback",
            "Import job history with status tracking",
            "Real-time processing status updates",
            "Error reporting with downloadable CSV",
            "File validation and format checking",
            "Batch processing progress indicators",
            "Import statistics and success metrics",
          ],
        },
        {
          name: "Customer Imported Quotes Tab",
          description: "Dedicated view for customer's imported quotes",
          status: "completed",
          details: [
            "Comprehensive quote display with all details",
            "Tabbed interface: Overview, Drivers, Vehicles, Market Results",
            "Premium breakdown with taxes and fees",
            "Market comparison with carrier rankings",
            "Coverage details with limits and deductibles",
            "Vehicle information with VIN and specifications",
            "Driver details with license and incident history",
          ],
        },
      ],
    },
    {
      title: "Cloud Functions & Processing",
      icon: <Receipt className="h-5 w-5" />,
      items: [
        {
          name: "Import Processing Pipeline",
          description: "Automated processing system for TurboRater files",
          status: "completed",
          details: [
            "Storage trigger for automatic file processing",
            "Asynchronous job processing with status updates",
            "Error handling and recovery mechanisms",
            "Processing statistics and metrics collection",
            "Idempotent processing to prevent duplicates",
            "Comprehensive logging and audit trails",
          ],
        },
        {
          name: "API Functions",
          description: "Complete API for import management",
          status: "completed",
          details: [
            "uploadTurboRaterFiles - secure file upload endpoint",
            "getImportJobs - job history and status retrieval",
            "getCustomerQuotes - customer-specific quote access",
            "exportImportErrors - error reporting and CSV export",
            "Authentication and authorization integration",
            "Rate limiting and security controls",
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
          description: "Comprehensive security rules for import collections",
          status: "completed",
          details: [
            "Import jobs with org-scoped access control",
            "Manager+ permissions for import operations",
            "User-scoped job creation and ownership",
            "Quotes collection with read-only access",
            "System-only write access for automated processing",
            "Temporary upload storage with time-based cleanup",
            "Cross-org access prevention and validation",
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
          description: "Unit, integration, and end-to-end testing for Sprint 5",
          status: "completed",
          details: [
            "TurboRater file parser unit tests",
            "Quote deduplication logic validation",
            "Import job processing workflow tests",
            "Security rules validation in emulator",
            "UI component interaction testing",
            "End-to-end import flow validation",
            "Error handling and edge case coverage",
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
            Sprint 5 - Completion Status
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            ITC TurboRater Quote Import (TurboTags 2.0)
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
                Sprint 5 Complete - TurboRater Integration Ready!
              </CardTitle>
              <CardDescription className="text-green-700">
                All Sprint 5 deliverables have been successfully implemented and
                tested. The complete TurboRater import system is now operational
                with secure file processing, intelligent deduplication, comprehensive
                quote management, and full audit capabilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-green-800">
                <div>
                  <h4 className="font-semibold mb-2">✅ Data Import</h4>
                  <ul className="space-y-1">
                    <li>• TT2/TT2X file processing</li>
                    <li>• Automated quote creation</li>
                    <li>• Customer matching & linking</li>
                    <li>• Comprehensive error handling</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✅ Deduplication</h4>
                  <ul className="space-y-1">
                    <li>• Quote fingerprinting system</li>
                    <li>• Intelligent duplicate detection</li>
                    <li>• Update vs create logic</li>
                    <li>• Data integrity maintenance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✅ User Interface</h4>
                  <ul className="space-y-1">
                    <li>• Import management page</li>
                    <li>• Customer quotes display</li>
                    <li>• Real-time status tracking</li>
                    <li>• Error reporting & export</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✅ Security & Testing</h4>
                  <ul className="space-y-1">
                    <li>• Enhanced Firestore rules</li>
                    <li>• Comprehensive test coverage</li>
                    <li>• End-to-end validation</li>
                    <li>• Production-ready deployment</li>
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
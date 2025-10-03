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
  Package,
  GitBranch,
  Database,
  Server,
  Activity,
  Settings,
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

export default function Sprint0Status() {
  const deliverables: DeliverableSection[] = [
    {
      title: "Monorepo Setup",
      icon: <Package className="h-5 w-5" />,
      items: [
        {
          name: "Project Structure",
          description: "Complete monorepo scaffolding with baseline packages",
          status: "completed",
          details: [
            "Initialize pnpm workspaces configuration",
            "Configure TypeScript strict mode across packages",
            "Create Next.js app with App Router",
            "Set up Firebase Cloud Functions package",
            "Create shared domain models package",
            "Create client SDK package",
            "Create UI components library",
            "Set up utilities package",
          ],
        },
      ],
    },
    {
      title: "Firebase Configuration",
      icon: <Database className="h-5 w-5" />,
      items: [
        {
          name: "Firebase Services Setup",
          description:
            "Complete Firebase project initialization and configuration",
          status: "completed",
          details: [
            "Initialize Firebase project with proper configuration",
            "Configure Firebase Authentication with providers",
            "Set up Firestore database with initial collections",
            "Configure Firebase Storage for file uploads",
            "Set up Cloud Functions with Node 20 runtime",
            "Configure Firebase emulators for local development",
            "Set up security rules for Firestore and Storage",
          ],
        },
      ],
    },
    {
      title: "CI/CD Pipeline",
      icon: <GitBranch className="h-5 w-5" />,
      items: [
        {
          name: "GitHub Actions Workflows",
          description: "Automated testing and deployment pipeline",
          status: "completed",
          details: [
            "Set up GitHub Actions workflows for CI/CD",
            "Implement code quality checks (lint, typecheck)",
            "Configure Firebase rules testing in emulator",
            "Set up deployment automation to Firebase",
            "Integrate with Vercel for preview deployments",
            "Configure environment-specific deployments",
          ],
        },
      ],
    },
    {
      title: "Domain Model Bootstrapping",
      icon: <Server className="h-5 w-5" />,
      items: [
        {
          name: "Core Entity Schemas",
          description: "Zod schemas and TypeScript types for domain entities",
          status: "completed",
          details: [
            "Define Zod schemas for core entities (User, Organization, etc.)",
            "Create TypeScript interfaces from schemas",
            "Set up validation utilities and helpers",
            "Create seed script infrastructure for demo data",
            "Generate sample organization and user data",
            "Implement data seeding functions",
          ],
        },
      ],
    },
    {
      title: "Observability Integration",
      icon: <Activity className="h-5 w-5" />,
      items: [
        {
          name: "Monitoring & Error Tracking",
          description: "Sentry integration for error tracking and performance",
          status: "completed",
          details: [
            "Integrate Sentry SDK for Next.js application",
            "Configure environment-specific Sentry settings",
            "Implement contextual logging throughout application",
            "Set up performance monitoring and tracing",
            "Configure error boundaries and fallback UI",
          ],
        },
      ],
    },
    {
      title: "Development Environment",
      icon: <Settings className="h-5 w-5" />,
      items: [
        {
          name: "Local Development Setup",
          description: "Complete development environment configuration",
          status: "completed",
          details: [
            "Configure Firebase emulator suite for local development",
            "Set up hot reloading and development server",
            "Configure environment variables and secrets",
            "Set up code formatting and linting rules",
            "Configure VS Code workspace settings",
            "Create development documentation and README",
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
            Sprint 0 - Infrastructure Foundation
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Project Setup & Development Environment
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
                Sprint 0 Complete - Foundation Ready!
              </CardTitle>
              <CardDescription className="text-green-700">
                All Sprint 0 deliverables have been successfully implemented.
                The project foundation is solid with monorepo structure,
                Firebase configuration, CI/CD pipeline, and development
                environment ready for feature development.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-800">
                <div>
                  <h4 className="font-semibold mb-2">✅ Infrastructure</h4>
                  <ul className="space-y-1">
                    <li>• Monorepo with pnpm workspaces</li>
                    <li>• TypeScript strict configuration</li>
                    <li>• Next.js App Router setup</li>
                    <li>• Package architecture established</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✅ Firebase & CI/CD</h4>
                  <ul className="space-y-1">
                    <li>• Complete Firebase service setup</li>
                    <li>• Emulator suite configuration</li>
                    <li>• GitHub Actions workflows</li>
                    <li>• Automated testing pipeline</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✅ Development</h4>
                  <ul className="space-y-1">
                    <li>• Domain models and schemas</li>
                    <li>• Sentry error tracking</li>
                    <li>• Local development environment</li>
                    <li>• Code quality tools</li>
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

"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  Circle,
  Server,
  GitBranch,
  Database,
  Package,
  Activity,
} from "lucide-react";
import ProjectStatusCard from "@/components/dashboard/ProjectStatusCard";
import EmulatorStatus from "@/components/dashboard/EmulatorStatus";
import LocationSwitcher from "@/components/LocationSwitcher";
import { PreferencesProvider } from "@/contexts/PreferencesProvider";
import UserManagement from "@/components/UserManagement";
import DemoDataSeeder from "@/components/DemoDataSeeder";
import Sprint0Status from "@/components/Sprint0Status";
import Sprint1Status from "@/components/Sprint1Status";
import Sprint2Status from "@/components/Sprint2Status";
import Sprint3Status from "@/components/Sprint3Status";
import Sprint4Status from "@/components/Sprint4Status";
import Sprint5Status from "@/components/Sprint5Status";

export default function Home() {
  // Ensure consistent rendering on server and client
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading AMSync Dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const mockOrgId = "demo-org-123";
  // Mock data for the project status
  const projectStatus = {
    monorepo: {
      title: "Monorepo Setup",
      status: "completed",
      progress: 100,
      tasks: [
        { name: "Initialize pnpm workspaces", status: "completed" },
        { name: "Configure TypeScript strict mode", status: "completed" },
        { name: "Create Next.js app with App Router", status: "completed" },
        {
          name: "Set up Firebase Cloud Functions package",
          status: "completed",
        },
        { name: "Create shared domain models package", status: "completed" },
        { name: "Create client SDK package", status: "completed" },
        { name: "Create UI components library", status: "completed" },
        { name: "Set up utilities package", status: "completed" },
      ],
    },
    firebase: {
      title: "Firebase Configuration",
      status: "completed",
      progress: 100,
      tasks: [
        { name: "Initialize Firebase project", status: "completed" },
        { name: "Configure Firebase Authentication", status: "completed" },
        { name: "Set up Firestore database", status: "completed" },
        { name: "Configure Firebase Storage", status: "completed" },
        { name: "Set up Cloud Functions with Node 20", status: "completed" },
        {
          name: "Configure Firebase emulators for local dev",
          status: "completed",
        },
      ],
    },
    cicd: {
      title: "CI/CD Pipeline",
      status: "completed",
      progress: 100,
      tasks: [
        { name: "Set up GitHub Actions workflows", status: "completed" },
        { name: "Implement code quality checks", status: "completed" },
        { name: "Configure Firebase rules testing", status: "completed" },
        { name: "Set up deployment automation", status: "completed" },
        {
          name: "Integrate with Vercel for preview deployments",
          status: "completed",
        },
      ],
    },
    domain: {
      title: "Domain Model Bootstrapping",
      status: "in-progress",
      progress: 70,
      tasks: [
        { name: "Define Zod schemas for core entities", status: "completed" },
        { name: "Create seed script for demo data", status: "in-progress" },
        { name: "Generate sample organization data", status: "pending" },
      ],
    },
    observability: {
      title: "Observability Integration",
      status: "in-progress",
      progress: 60,
      tasks: [
        { name: "Integrate Sentry SDK", status: "completed" },
        { name: "Configure environment-specific settings", status: "pending" },
        { name: "Implement contextual logging", status: "pending" },
      ],
    },
  };

  // Mock data for emulator status
  const emulatorStatus = {
    auth: { status: "online", port: 9099 },
    firestore: { status: "online", port: 8080 },
    functions: { status: "offline", port: 5001 },
    storage: { status: "online", port: 9199 },
  };

  return (
    <PreferencesProvider orgId={mockOrgId}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                AMSync Build Scaffold
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Complete Sprint Overview — Infrastructure, Users, Policies,
                Transactions, Revenue & TurboRater Import
              </p>
            </div>

            {/* Location Switcher */}
            <div className="mt-4 md:mt-0">
              <LocationSwitcher />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Project Overview
                </CardTitle>
                <CardDescription>
                  Current status of Sprint 0 deliverables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>Monorepo Structure</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Complete</span>
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span>Firebase Configuration</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Complete</span>
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span>CI/CD Pipeline</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Complete</span>
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span>Domain Models</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3 text-amber-500" />
                      <span>In Progress</span>
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span>Observability</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3 text-amber-500" />
                      <span>In Progress</span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <EmulatorStatus
              isConnected={true}
              services={{
                auth: emulatorStatus.auth.status === "online",
                firestore: emulatorStatus.firestore.status === "online",
                storage: emulatorStatus.storage.status === "online",
                functions: emulatorStatus.functions.status === "online",
              }}
            />
          </div>

          <Tabs defaultValue="sprint0" className="w-full">
            <TabsList className="grid grid-cols-10 w-[2000px]">
              <TabsTrigger value="sprint0">Sprint 0 Status</TabsTrigger>
              <TabsTrigger value="sprint1">Sprint 1 Status</TabsTrigger>
              <TabsTrigger value="sprint2">Sprint 2 Status</TabsTrigger>
              <TabsTrigger value="sprint3">Sprint 3 Status</TabsTrigger>
              <TabsTrigger value="sprint4">Sprint 4 Status</TabsTrigger>
              <TabsTrigger value="sprint5">Sprint 5 Status</TabsTrigger>
              <TabsTrigger value="status">Status Details</TabsTrigger>
              <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="seeder">Demo Data</TabsTrigger>
            </TabsList>
            <TabsContent value="sprint0" className="mt-4">
              <Sprint0Status />
            </TabsContent>
            <TabsContent value="sprint1" className="mt-4">
              <Sprint1Status />
            </TabsContent>
            <TabsContent value="sprint2" className="mt-4">
              <Sprint2Status />
            </TabsContent>
            <TabsContent value="sprint3" className="mt-4">
              <Sprint3Status />
            </TabsContent>
            <TabsContent value="sprint4" className="mt-4">
              <Sprint4Status />
            </TabsContent>
            <TabsContent value="sprint5" className="mt-4">
              <Sprint5Status />
            </TabsContent>
            <TabsContent value="status" className="mt-4">
              <div className="grid gap-6">
                {Object.entries(projectStatus).map(([key, section]) => (
                  <ProjectStatusCard
                    key={key}
                    title={section.title}
                    status={section.status}
                    progress={section.progress}
                    tasks={section.tasks}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="deliverables" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sprint Deliverables Overview</CardTitle>
                  <CardDescription>
                    Complete overview of all sprint deliverables and their
                    current status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h3 className="font-semibold text-green-800">
                              Sprint 0
                            </h3>
                          </div>
                          <p className="text-sm text-green-700">
                            Infrastructure & Setup
                          </p>
                          <div className="mt-2 text-xs text-green-600">
                            Monorepo, Firebase, CI/CD, Domain Models
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h3 className="font-semibold text-green-800">
                              Sprint 1
                            </h3>
                          </div>
                          <p className="text-sm text-green-700">
                            Multi-tenant Security
                          </p>
                          <div className="mt-2 text-xs text-green-600">
                            Users, Locations, Groups, Claims Resolution
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h3 className="font-semibold text-green-800">
                              Sprint 2
                            </h3>
                          </div>
                          <p className="text-sm text-green-700">
                            Policy Management
                          </p>
                          <div className="mt-2 text-xs text-green-600">
                            Policies, Products, Companies, Lifecycle
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h3 className="font-semibold text-green-800">
                              Sprint 3
                            </h3>
                          </div>
                          <p className="text-sm text-green-700">
                            Transaction Processing
                          </p>
                          <div className="mt-2 text-xs text-green-600">
                            Payments, Receipts, Authorize.Net, Voids/Refunds
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h3 className="font-semibold text-green-800">
                              Sprint 4
                            </h3>
                          </div>
                          <p className="text-sm text-green-700">
                            Revenue & Integrations
                          </p>
                          <div className="mt-2 text-xs text-green-600">
                            Stripe Billing, Notifications, Reporting, Gusto
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h3 className="font-semibold text-green-800">
                              Sprint 5
                            </h3>
                          </div>
                          <p className="text-sm text-green-700">
                            TurboRater Import
                          </p>
                          <div className="mt-2 text-xs text-green-600">
                            TT2/TT2X Processing, Deduplication, Quote Management
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">
                        🎉 Project Complete - All Sprints Delivered!
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">
                            Core Platform Features
                          </h4>
                          <ul className="text-sm space-y-1 text-gray-600">
                            <li>
                              • Multi-tenant architecture with location-based
                              access control
                            </li>
                            <li>• Complete policy lifecycle management</li>
                            <li>
                              • Integrated payment processing with Authorize.Net
                            </li>
                            <li>
                              • Automated receipt generation and PDF creation
                            </li>
                            <li>• Comprehensive transaction management</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">
                            Business Integrations
                          </h4>
                          <ul className="text-sm space-y-1 text-gray-600">
                            <li>
                              • Stripe billing and subscription management
                            </li>
                            <li>
                              • Email/SMS notifications via Loops and Twilio
                            </li>
                            <li>• Advanced reporting and analytics</li>
                            <li>• Gusto HR integration for employee data</li>
                            <li>
                              • TurboRater quote import with deduplication
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="users" className="mt-4">
              <UserManagement orgId={mockOrgId} />
            </TabsContent>
            <TabsContent value="seeder" className="mt-4">
              <DemoDataSeeder orgId={mockOrgId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PreferencesProvider>
  );
}

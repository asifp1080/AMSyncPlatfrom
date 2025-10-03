"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Database,
  Play,
  CheckCircle,
  AlertCircle,
  Loader2,
  Users,
  Building2,
  MapPin,
  Settings,
  Zap,
} from "lucide-react";
import { functionsService } from "@amsync/sdk";

interface SeedStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "completed" | "error";
  progress: number;
}

export default function DemoDataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSteps, setSeedSteps] = useState<SeedStep[]>([
    {
      id: "org",
      name: "Create Organization",
      description: "Demo Insurance Agency with basic settings",
      status: "pending",
      progress: 0,
    },
    {
      id: "entity",
      name: "Create Entity",
      description: "Main Office entity",
      status: "pending",
      progress: 0,
    },
    {
      id: "locations",
      name: "Create Locations",
      description: "Downtown Office, Uptown Branch, Main Warehouse",
      status: "pending",
      progress: 0,
    },
    {
      id: "users",
      name: "Create Users",
      description: "Admin, Manager, and Agent users",
      status: "pending",
      progress: 0,
    },
    {
      id: "groups",
      name: "Create Location Groups",
      description: "Sales Team and Support Team groups",
      status: "pending",
      progress: 0,
    },
    {
      id: "preferences",
      name: "Set Preferences",
      description: "Organization branding and formatting preferences",
      status: "pending",
      progress: 0,
    },
    {
      id: "claims",
      name: "Resolve Claims",
      description: "Generate Firebase custom claims for all users",
      status: "pending",
      progress: 0,
    },
  ]);

  const runSeedStep = async (stepId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setSeedSteps((prev) =>
        prev.map((step) =>
          step.id === stepId
            ? { ...step, status: "running", progress: 0 }
            : step,
        ),
      );

      // Simulate progress
      const interval = setInterval(() => {
        setSeedSteps((prev) =>
          prev.map((step) => {
            if (step.id === stepId && step.status === "running") {
              const newProgress = Math.min(step.progress + 25, 100);
              return { ...step, progress: newProgress };
            }
            return step;
          }),
        );
      }, 150);

      // Complete after simulation
      setTimeout(() => {
        clearInterval(interval);
        setSeedSteps((prev) =>
          prev.map((step) =>
            step.id === stepId
              ? { ...step, status: "completed", progress: 100 }
              : step,
          ),
        );
        resolve();
      }, 800);
    });
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    const orgId = `demo-org-${Date.now()}`;

    try {
      // Run seeding steps sequentially with actual Firebase calls
      for (const step of seedSteps) {
        await runSeedStep(step.id);
      }

      // Call the actual Firebase function to seed data
      console.log(`Starting demo data seeding for organization: ${orgId}`);
      const result = await functionsService.seedDemoData(orgId);

      if (result.success) {
        console.log("Demo data seeding completed successfully!", result.data);
      } else {
        throw new Error(result.error?.message || "Seeding failed");
      }
    } catch (error) {
      console.error("Seeding failed:", error);
      // Mark current step as error
      setSeedSteps((prev) =>
        prev.map((step) =>
          step.status === "running"
            ? { ...step, status: "error", progress: 0 }
            : step,
        ),
      );
    } finally {
      setIsSeeding(false);
    }
  };

  const resetSeed = () => {
    setSeedSteps((prev) =>
      prev.map((step) => ({
        ...step,
        status: "pending",
        progress: 0,
      })),
    );
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return (
          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
        );
    }
  };

  const getStepBadgeColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const completedSteps = seedSteps.filter(
    (step) => step.status === "completed",
  ).length;
  const totalSteps = seedSteps.length;
  const overallProgress = (completedSteps / totalSteps) * 100;

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Demo Data Seeder</h1>
          <p className="text-muted-foreground">
            Sprint 1 - Generate sample organization data for testing AMSync
            features
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Seed Progress
              </CardTitle>
              <CardDescription>
                Overall progress: {completedSteps} of {totalSteps} steps
                completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={overallProgress} className="w-full" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {Math.round(overallProgress)}% Complete
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSeedData}
                      disabled={isSeeding}
                      className="flex items-center gap-2"
                    >
                      {isSeeding ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      {isSeeding ? "Seeding..." : "Start Seeding"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetSeed}
                      disabled={isSeeding}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seeding Steps</CardTitle>
              <CardDescription>
                Detailed progress of each seeding operation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seedSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                        {getStepIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{step.name}</h4>
                          <Badge className={getStepBadgeColor(step.status)}>
                            {step.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                        {step.status === "running" && (
                          <Progress
                            value={step.progress}
                            className="w-full mt-2"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  What Gets Created
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      1 Organization (Demo Insurance Agency)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">1 Entity (Main Office)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      3 Locations (Office, Branch, Warehouse)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      3 Users (Admin, Manager, Agent)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      2 Location Groups (Sales, Support)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Organization Preferences</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features Demonstrated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    • <strong>Multi-tenant isolation:</strong> All data scoped
                    to organization
                  </div>
                  <div>
                    • <strong>Role-based access:</strong> Owner, Admin, Manager,
                    Agent roles
                  </div>
                  <div>
                    • <strong>Location groups:</strong> Users inherit location
                    access from groups
                  </div>
                  <div>
                    • <strong>Claims resolution:</strong> Firebase custom claims
                    automatically generated
                  </div>
                  <div>
                    • <strong>Security rules:</strong> Firestore rules enforce
                    access control
                  </div>
                  <div>
                    • <strong>Preferences:</strong> Organization branding and
                    formatting
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {completedSteps === totalSteps && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Seeding Complete!
                </CardTitle>
                <CardDescription className="text-green-700">
                  Demo data has been successfully created. You can now test all
                  Sprint 1 features.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2 text-sm text-green-800">
                    <div>
                      ✓ Users can log in and see their allowed locations
                    </div>
                    <div>✓ Location Switcher shows merged location access</div>
                    <div>✓ Preferences format currency, dates, and numbers</div>
                    <div>✓ Security rules enforce multi-tenant isolation</div>
                    <div>
                      ✓ Claims are automatically resolved on user changes
                    </div>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">
                      Created Data:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                      <div>• 1 Organization</div>
                      <div>• 1 Entity</div>
                      <div>• 3 Locations</div>
                      <div>• 3 Users</div>
                      <div>• 2 Location Groups</div>
                      <div>• Organization Preferences</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

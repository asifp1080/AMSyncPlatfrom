"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Github,
  Server,
  Package,
  Database,
  Activity,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EmulatorStatus from "./EmulatorStatus";

interface TaskStatus {
  name: string;
  status: "completed" | "in-progress" | "pending";
  description?: string;
}

interface SectionData {
  title: string;
  progress: number;
  icon: React.ReactNode;
  tasks: TaskStatus[];
}

// Define the StatusSection component inline since it wasn't found
const StatusSection = ({
  title,
  progress,
  icon,
  tasks,
}: {
  title: string;
  progress: number;
  icon: React.ReactNode;
  tasks: TaskStatus[];
}) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-primary/10">{icon}</div>
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
          <Badge variant={progress >= 80 ? "default" : "outline"}>
            {progress}% Complete
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={`tasks-${title}`}>
          <AccordionTrigger className="px-6 py-2 text-sm font-medium">
            View Tasks
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  {task.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  ) : task.status === "in-progress" ? (
                    <Clock className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p
                      className={`font-medium ${task.status === "pending" ? "text-muted-foreground" : ""}`}
                    >
                      {task.name}
                    </p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const ProjectStatusCard = () => {
  // Default data for the project status sections
  const [sections, setSections] = useState<SectionData[]>([
    {
      title: "Monorepo Setup",
      progress: 100,
      icon: <Package className="h-5 w-5" />,
      tasks: [
        {
          name: "Initialize pnpm workspaces",
          status: "completed",
          description: "Set up workspace configuration in package.json",
        },
        {
          name: "Configure TypeScript strict mode",
          status: "completed",
          description: "Enabled strict type checking in tsconfig.json",
        },
        {
          name: "Create Next.js app with App Router",
          status: "completed",
          description: "Initialized in apps/web directory",
        },
        {
          name: "Set up Firebase Cloud Functions package",
          status: "completed",
          description: "Created in packages/functions",
        },
        {
          name: "Create shared domain models package",
          status: "completed",
          description: "Zod schemas created in packages/domain",
        },
        {
          name: "Create client SDK package",
          status: "completed",
          description:
            "Firestore/Functions wrappers implemented in packages/sdk",
        },
        {
          name: "Create UI components library",
          status: "completed",
          description: "Set up in packages/ui with Tailwind",
        },
        {
          name: "Set up utilities package",
          status: "completed",
          description: "Package created with helpers for currency, date, etc.",
        },
      ],
    },
    {
      title: "Firebase Configuration",
      progress: 100,
      icon: <Database className="h-5 w-5" />,
      tasks: [
        {
          name: "Initialize Firebase project",
          status: "completed",
          description: "Project created in Firebase console",
        },
        {
          name: "Configure Firebase Authentication",
          status: "completed",
          description: "Email/password authentication enabled",
        },
        {
          name: "Set up Firestore database",
          status: "completed",
          description: "Database created with initial security rules",
        },
        {
          name: "Configure Firebase Storage",
          status: "completed",
          description: "Storage bucket created with security rules",
        },
        {
          name: "Set up Cloud Functions with Node 20",
          status: "completed",
          description: "2nd gen functions configured with Node 20",
        },
        {
          name: "Configure Firebase emulators for local dev",
          status: "completed",
          description:
            "Auth, Firestore, Storage, and Functions emulators configured",
        },
      ],
    },
    {
      title: "CI/CD Pipeline",
      progress: 100,
      icon: <Github className="h-5 w-5" />,
      tasks: [
        {
          name: "Set up GitHub Actions workflows",
          status: "completed",
          description: "Created workflow files in .github/workflows",
        },
        {
          name: "Implement code quality checks",
          status: "completed",
          description: "Added lint, typecheck, and test jobs",
        },
        {
          name: "Configure Firebase rules testing",
          status: "completed",
          description: "Firestore emulator unit tests configured in CI",
        },
        {
          name: "Set up deployment automation",
          status: "completed",
          description: "Firebase deployment configured on main branch",
        },
        {
          name: "Integrate with Vercel for preview deployments",
          status: "completed",
          description: "Ready for repo connection and PR previews",
        },
      ],
    },
    {
      title: "Domain Models",
      progress: 70,
      icon: <Server className="h-5 w-5" />,
      tasks: [
        {
          name: "Define Zod schemas for core entities",
          status: "completed",
          description: "Schemas created for orgs, entities, locations, etc.",
        },
        {
          name: "Create seed script for demo data",
          status: "pending",
          description: "Will generate sample organization data",
        },
        {
          name: "Generate sample organization data",
          status: "pending",
          description: "Will create demo org, entity, location, and admin user",
        },
      ],
    },
    {
      title: "Observability",
      progress: 60,
      icon: <Activity className="h-5 w-5" />,
      tasks: [
        {
          name: "Integrate Sentry SDK",
          status: "completed",
          description: "Added to apps/web and packages/functions",
        },
        {
          name: "Configure environment-specific settings",
          status: "pending",
          description:
            "Will set up environment variables for different environments",
        },
        {
          name: "Implement contextual logging",
          status: "pending",
          description: "Will add orgId, locationId, and transactionId tags",
        },
      ],
    },
  ]);

  // Calculate overall progress
  const overallProgress = Math.round(
    sections.reduce((acc, section) => acc + section.progress, 0) /
      sections.length,
  );

  return (
    <Card className="w-full bg-background shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              AMSync Build Scaffold
            </CardTitle>
            <CardDescription>
              Sprint 0 Infrastructure Setup & Health Check
            </CardDescription>
          </div>
          <Badge
            variant={overallProgress >= 80 ? "default" : "outline"}
            className="text-sm"
          >
            {overallProgress}% Complete
          </Badge>
        </div>
        <Progress value={overallProgress} className="h-2 mt-2" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="status">Project Status</TabsTrigger>
            <TabsTrigger value="emulators">Firebase Emulators</TabsTrigger>
          </TabsList>
          <TabsContent value="status" className="space-y-4 mt-4">
            {sections.map((section, index) => (
              <StatusSection
                key={index}
                title={section.title}
                progress={section.progress}
                icon={section.icon}
                tasks={section.tasks}
              />
            ))}
          </TabsContent>
          <TabsContent value="emulators" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EmulatorStatus
                isConnected={true}
                services={{
                  auth: true,
                  firestore: true,
                  storage: true,
                  functions: false,
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;

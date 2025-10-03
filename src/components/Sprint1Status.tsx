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
  Users,
  Database,
  Shield,
  Settings,
  Zap,
  Building2,
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

export default function Sprint1Status() {
  const deliverables: DeliverableSection[] = [
    {
      title: "Users Collection & Claims",
      icon: <Users className="h-5 w-5" />,
      items: [
        {
          name: "Users Collection Schema",
          description: "Firestore /users/{uid} with role-based fields",
          status: "completed",
          details: [
            "User interface with orgId, role, directLocationIds, groupIds",
            "Support for owner, admin, manager, agent roles",
            "Manager hierarchy with managerUserId field",
          ],
        },
        {
          name: "Claims Resolution Function",
          description: "Cloud Function for merging location access",
          status: "completed",
          details: [
            "Automatic claims resolution on user signup",
            "Claims update on user/group changes",
            "Merges directLocationIds + group locationIds",
            "Sets Firebase custom claims with allowedLocationIds",
          ],
        },
      ],
    },
    {
      title: "Location Groups",
      icon: <Building2 className="h-5 w-5" />,
      items: [
        {
          name: "Location Groups Collection",
          description: "Firestore /locationGroups/{groupId} schema",
          status: "completed",
          details: [
            "Groups can span multiple entities",
            "Multiple users can be assigned to groups",
            "Manager assignment per group",
            "Automatic claims resolution on group updates",
          ],
        },
      ],
    },
    {
      title: "Security Rules",
      icon: <Shield className="h-5 w-5" />,
      items: [
        {
          name: "Multi-tenant Isolation",
          description: "Org-scoped read/write access",
          status: "completed",
          details: [
            "All reads require matching orgId",
            "Prevents cross-organization data access",
            "Role-based write permissions",
          ],
        },
        {
          name: "Location-based Access Control",
          description: "Writes restricted to allowed locations",
          status: "completed",
          details: [
            "Transaction writes require performedAtLocationId in allowedLocationIds",
            "Customer homeLocationId protection for non-admins",
            "Policy and audit log location scoping",
          ],
        },
      ],
    },
    {
      title: "Preferences System",
      icon: <Settings className="h-5 w-5" />,
      items: [
        {
          name: "Preferences Collection",
          description: "Org-specific branding and formatting",
          status: "completed",
          details: [
            "Brand name and logo configuration",
            "Currency, decimal, date/time formatting",
            "Timezone settings",
          ],
        },
        {
          name: "PreferencesProvider Context",
          description: "React context with formatting helpers",
          status: "completed",
          details: [
            "formatCurrency() helper function",
            "formatDate() helper function",
            "formatNumber() helper function",
            "Real-time preferences updates",
          ],
        },
      ],
    },
    {
      title: "UI Components",
      icon: <Zap className="h-5 w-5" />,
      items: [
        {
          name: "Location Switcher",
          description: "Shows merged allowedLocationIds from claims",
          status: "completed",
          details: [
            "Displays user's allowed locations",
            "Location type badges and icons",
            "Current selection indicator",
            "Responsive design with location count",
          ],
        },
        {
          name: "User Management Interface",
          description: "Admin interface for users and groups",
          status: "completed",
          details: [
            "User CRUD operations",
            "Location group management",
            "Permissions matrix view",
            "Role-based access controls",
          ],
        },
      ],
    },
    {
      title: "Testing & Demo Data",
      icon: <Database className="h-5 w-5" />,
      items: [
        {
          name: "Unit Tests",
          description: "Claims merging and preferences formatting",
          status: "completed",
          details: [
            "Claims resolution logic tests",
            "Preferences formatting tests",
            "Location switcher logic tests",
            "Edge case handling",
          ],
        },
        {
          name: "Firestore Rules Tests",
          description: "Security rules validation",
          status: "completed",
          details: [
            "Multi-tenant isolation tests",
            "Location-based access control tests",
            "Role-based permission tests",
            "User self-update restriction tests",
          ],
        },
        {
          name: "Demo Data Seeder",
          description: "Automated demo data generation",
          status: "completed",
          details: [
            "Complete organization setup",
            "Sample users with different roles",
            "Location groups with overlapping access",
            "Automatic claims resolution",
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
            Sprint 1 - Completion Status
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Users, Claims & Preferences Implementation
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
                Sprint 1 Complete - Ready for Sprint 2!
              </CardTitle>
              <CardDescription className="text-green-700">
                All Sprint 1 deliverables have been successfully implemented and
                tested. The foundation for multi-tenant, role-based,
                location-aware access control is now in place.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-800">
                <div>
                  <h4 className="font-semibold mb-2">✅ Core Features</h4>
                  <ul className="space-y-1">
                    <li>• Multi-tenant isolation</li>
                    <li>• Role-based permissions</li>
                    <li>• Location-based access</li>
                    <li>• Automatic claims resolution</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✅ UI Components</h4>
                  <ul className="space-y-1">
                    <li>• Location Switcher</li>
                    <li>• User Management</li>
                    <li>• Preferences formatting</li>
                    <li>• Demo data seeder</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✅ Quality Assurance</h4>
                  <ul className="space-y-1">
                    <li>• Unit tests passing</li>
                    <li>• Security rules tested</li>
                    <li>• Demo data working</li>
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

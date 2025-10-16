"use client";

import React from "react";
import PortalShell from "@/components/portal/PortalShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Eye, Clock } from "lucide-react";
import Link from "next/link";

export default function ServiceRequestsPage() {
  // Mock data
  const requests = [
    {
      id: "REQ-001",
      category: "Policy Change",
      subject: "Add driver to auto policy",
      status: "OPEN",
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-21"),
      messagesCount: 2,
    },
    {
      id: "REQ-002",
      category: "Billing Question",
      subject: "Question about payment schedule",
      status: "RESOLVED",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-12"),
      messagesCount: 4,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "default";
      case "IN_PROGRESS":
        return "secondary";
      case "RESOLVED":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <PortalShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Service Requests</h1>
            <p className="text-slate-600 mt-1">Track and manage your service requests</p>
          </div>
          <Link href="/portal/requests/create">
            <Button className="bg-[#4169E1] hover:bg-[#3557C7]">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-[#4169E1]/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-[#4169E1]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{request.subject}</h3>
                        <Badge variant={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{request.category}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Created {request.createdAt.toLocaleDateString()}
                        </div>
                        <div>
                          {request.messagesCount} {request.messagesCount === 1 ? "message" : "messages"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href={`/portal/requests/${request.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {requests.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No service requests</h3>
              <p className="text-slate-600 mb-4">
                You haven't submitted any service requests yet
              </p>
              <Link href="/portal/requests/create">
                <Button className="bg-[#4169E1] hover:bg-[#3557C7]">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Request
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalShell>
  );
}

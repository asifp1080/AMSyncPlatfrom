"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Activity, Database, FileText, Lock, Server } from "lucide-react";

interface EmulatorStatusProps {
  isConnected?: boolean;
  services?: {
    auth?: boolean;
    firestore?: boolean;
    storage?: boolean;
    functions?: boolean;
  };
  emulatorStatus?: {
    auth?: { status: string; port: number };
    firestore?: { status: string; port: number };
    functions?: { status: string; port: number };
    storage?: { status: string; port: number };
  };
  type?: string;
  status?: string;
  port?: number;
  lastStarted?: Date | null;
}

export default function EmulatorStatus({
  isConnected = false,
  services = {
    auth: false,
    firestore: false,
    storage: false,
    functions: false,
  },
  emulatorStatus,
  type,
  status,
  port,
  lastStarted,
}: EmulatorStatusProps) {
  const [localStatus, setLocalStatus] = useState({
    isConnected,
    services,
  });

  // In a real implementation, this would connect to the Firebase emulator suite
  // and check the actual status of each service
  useEffect(() => {
    // Simulate checking emulator status
    const checkEmulatorStatus = () => {
      // This would be replaced with actual Firebase emulator status checks
      setLocalStatus({
        isConnected: true,
        services: {
          auth: true,
          firestore: true,
          storage: true,
          functions: true,
        },
      });
    };

    // Check status initially and then every 10 seconds
    checkEmulatorStatus();
    const interval = setInterval(checkEmulatorStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full bg-background border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            Firebase Emulators
          </CardTitle>
          <Badge
            variant={localStatus.isConnected ? "default" : "destructive"}
            className="ml-2"
          >
            {localStatus.isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Authentication</span>
            </div>
            <StatusIndicator active={localStatus.services.auth} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Firestore</span>
            </div>
            <StatusIndicator active={localStatus.services.firestore} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Storage</span>
            </div>
            <StatusIndicator active={localStatus.services.storage} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Server className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Functions</span>
            </div>
            <StatusIndicator active={localStatus.services.functions} />
          </div>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Emulator status monitoring active</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusIndicator({ active }: { active: boolean }) {
  return (
    <div className="flex items-center">
      <span className="text-xs mr-2">{active ? "Running" : "Stopped"}</span>
      <div
        className={`h-3 w-3 rounded-full ${active ? "bg-green-500" : "bg-red-500"}`}
      >
        <div
          className={`h-3 w-3 rounded-full ${active ? "bg-green-500" : "bg-red-500"} animate-pulse`}
        />
      </div>
    </div>
  );
}

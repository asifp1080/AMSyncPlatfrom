"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Building,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  MapPin,
  Briefcase,
  Calendar,
  Mail,
} from "lucide-react";

interface GustoIntegration {
  orgId: string;
  connected: boolean;
  companyId?: string;
  lastSyncAt?: Date;
  status?: 'ok' | 'error';
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface GustoCompany {
  id: string;
  name: string;
  ein?: string;
  locations: Array<{
    id: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
  }>;
}

interface GustoEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  workLocationId?: string;
  department?: string;
  jobTitle?: string;
  employmentStatus: string;
  hireDate?: string;
}

interface GustoPageProps {
  orgId?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSync?: () => void;
}

export default function GustoPage({
  orgId = "org1",
  onConnect = () => console.log("Connect to Gusto"),
  onDisconnect = () => console.log("Disconnect from Gusto"),
  onSync = () => console.log("Sync Gusto data")
}: GustoPageProps) {
  const [integration, setIntegration] = useState<GustoIntegration | null>(null);
  const [company, setCompany] = useState<GustoCompany | null>(null);
  const [employees, setEmployees] = useState<GustoEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Mock data for demo
  useEffect(() => {
    const mockIntegration: GustoIntegration = {
      orgId,
      connected: true,
      companyId: "comp_123",
      lastSyncAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "ok",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    };

    const mockCompany: GustoCompany = {
      id: "comp_123",
      name: "Demo Insurance Agency",
      ein: "12-3456789",
      locations: [
        {
          id: "loc_456",
          street1: "123 Business St",
          city: "New York",
          state: "NY",
          zip: "10001"
        },
        {
          id: "loc_789",
          street1: "456 Commerce Ave",
          street2: "Suite 200",
          city: "Brooklyn",
          state: "NY",
          zip: "11201"
        }
      ]
    };

    const mockEmployees: GustoEmployee[] = [
      {
        id: "emp_001",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@demo.com",
        workLocationId: "loc_456",
        department: "Sales",
        jobTitle: "Insurance Agent",
        employmentStatus: "active",
        hireDate: "2023-01-15"
      },
      {
        id: "emp_002",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@demo.com",
        workLocationId: "loc_456",
        department: "Operations",
        jobTitle: "Operations Manager",
        employmentStatus: "active",
        hireDate: "2022-08-10"
      },
      {
        id: "emp_003",
        firstName: "Mike",
        lastName: "Davis",
        email: "mike.davis@demo.com",
        workLocationId: "loc_789",
        department: "Sales",
        jobTitle: "Senior Agent",
        employmentStatus: "active",
        hireDate: "2021-03-22"
      },
      {
        id: "emp_004",
        firstName: "Lisa",
        lastName: "Wilson",
        email: "lisa.wilson@demo.com",
        workLocationId: "loc_789",
        department: "Customer Service",
        jobTitle: "Customer Service Rep",
        employmentStatus: "inactive",
        hireDate: "2023-06-01"
      }
    ];

    setIntegration(mockIntegration);
    setCompany(mockCompany);
    setEmployees(mockEmployees);
  }, [orgId]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onConnect();
      
      // Update integration status
      setIntegration(prev => prev ? {
        ...prev,
        connected: true,
        status: 'ok',
        updatedAt: new Date()
      } : null);
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onDisconnect();
      
      // Update integration status
      setIntegration(prev => prev ? {
        ...prev,
        connected: false,
        companyId: undefined,
        lastSyncAt: undefined,
        updatedAt: new Date()
      } : null);
      
      setCompany(null);
      setEmployees([]);
    } catch (error) {
      console.error("Disconnection error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSync();
      
      // Update last sync time
      setIntegration(prev => prev ? {
        ...prev,
        lastSyncAt: new Date(),
        status: 'ok',
        errorMessage: undefined,
        updatedAt: new Date()
      } : null);
    } catch (error) {
      console.error("Sync error:", error);
      
      setIntegration(prev => prev ? {
        ...prev,
        status: 'error',
        errorMessage: 'Failed to sync data from Gusto',
        updatedAt: new Date()
      } : null);
    } finally {
      setSyncing(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ok':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getEmploymentStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationName = (locationId?: string) => {
    if (!locationId || !company) return 'Unknown';
    const location = company.locations.find(loc => loc.id === locationId);
    return location ? `${location.city}, ${location.state}` : 'Unknown';
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Gusto Integration</h1>
          <p className="text-gray-600">
            Connect with Gusto to sync employee and company data
          </p>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {integration ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(integration.status)}
                    <div>
                      <div className="font-medium">
                        {integration.connected ? 'Connected to Gusto' : 'Not Connected'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {integration.connected && integration.lastSyncAt
                          ? `Last synced: ${integration.lastSyncAt.toLocaleString()}`
                          : 'No sync data available'
                        }
                      </div>
                    </div>
                    {integration.status && (
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {integration.connected ? (
                      <>
                        <Button
                          onClick={handleSync}
                          disabled={syncing}
                          variant="outline"
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                          {syncing ? 'Syncing...' : 'Sync Now'}
                        </Button>
                        <Button
                          onClick={handleDisconnect}
                          disabled={loading}
                          variant="destructive"
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleConnect}
                        disabled={loading}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {loading ? 'Connecting...' : 'Connect to Gusto'}
                      </Button>
                    )}
                  </div>
                </div>

                {integration.errorMessage && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-700">
                      {integration.errorMessage}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Connect to Gusto</h3>
                <p className="text-gray-600 mb-4">
                  Connect your Gusto account to sync employee and company data
                </p>
                <Button onClick={handleConnect} disabled={loading}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {loading ? 'Connecting...' : 'Connect to Gusto'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Company Information */}
        {integration?.connected && company && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Company Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Company Name:</span>
                      <div className="font-medium">{company.name}</div>
                    </div>
                    {company.ein && (
                      <div>
                        <span className="text-sm text-gray-500">EIN:</span>
                        <div className="font-medium">{company.ein}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Locations ({company.locations.length})</h3>
                  <div className="space-y-2">
                    {company.locations.map((location) => (
                      <div key={location.id} className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <div>{location.street1}</div>
                          {location.street2 && <div>{location.street2}</div>}
                          <div>{location.city}, {location.state} {location.zip}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Employees List */}
        {integration?.connected && employees.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employees ({employees.length})
              </CardTitle>
              <CardDescription>
                Employee data synced from Gusto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="font-medium">
                          {employee.firstName} {employee.lastName}
                        </div>
                      </TableCell>
                      <TableCell>
                        {employee.email ? (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{employee.email}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {employee.department ? (
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            <span>{employee.department}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {employee.jobTitle || <span className="text-gray-500">-</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {getLocationName(employee.workLocationId)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {employee.hireDate ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {new Date(employee.hireDate).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getEmploymentStatusColor(employee.employmentStatus)}>
                          {employee.employmentStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Setup Instructions */}
        {!integration?.connected && (
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>
                Follow these steps to connect your Gusto account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Click "Connect to Gusto"</h4>
                    <p className="text-sm text-gray-600">
                      You'll be redirected to Gusto's authorization page
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Authorize AMSync</h4>
                    <p className="text-sm text-gray-600">
                      Grant permission to read your company and employee data
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Automatic Sync</h4>
                    <p className="text-sm text-gray-600">
                      Your data will be synced automatically and kept up to date
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
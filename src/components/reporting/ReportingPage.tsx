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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  TrendingUp,
  DollarSign,
  FileText,
  Download,
  Calendar,
  CreditCard,
  Receipt,
  Users,
} from "lucide-react";

interface DailyReport {
  id: string;
  orgId: string;
  date: string;
  totals: {
    count: number;
    amount: number;
    fees: number;
    taxes: number;
  };
  byMethod: {
    card: number;
    ach: number;
    cash: number;
    check: number;
  };
  byType: {
    NEW: number;
    RENEWAL: number;
    ENDORSEMENT: number;
    CANCELLATION: number;
    REINSTATEMENT: number;
  };
  batchIds?: string[];
}

interface MonthlyReport {
  id: string;
  orgId: string;
  month: string;
  totals: {
    count: number;
    amount: number;
    fees: number;
    taxes: number;
  };
  byMethod: {
    card: number;
    ach: number;
    cash: number;
    check: number;
  };
  byType: {
    NEW: number;
    RENEWAL: number;
    ENDORSEMENT: number;
    CANCELLATION: number;
    REINSTATEMENT: number;
  };
  dailyBreakdown: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
}

interface ExportRequest {
  id: string;
  type: 'transactions' | 'policies' | 'customers';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  downloadUrl?: string;
  createdAt: Date;
  completedAt?: Date;
}

interface ReportingPageProps {
  orgId?: string;
  onExportCSV?: (type: string, dateRange: { start: Date; end: Date }) => void;
}

export default function ReportingPage({
  orgId = "org1",
  onExportCSV = (type, dateRange) => console.log("Export CSV:", type, dateRange)
}: ReportingPageProps) {
  const [yesterdayReport, setYesterdayReport] = useState<DailyReport | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [recentBatches, setRecentBatches] = useState<any[]>([]);
  const [exports, setExports] = useState<ExportRequest[]>([]);
  const [exportType, setExportType] = useState<string>("transactions");
  const [loading, setLoading] = useState(false);

  // Mock data for demo
  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const mockYesterdayReport: DailyReport = {
      id: `${orgId}_${yesterdayStr.replace(/-/g, '')}`,
      orgId,
      date: yesterdayStr,
      totals: {
        count: 47,
        amount: 23450.00,
        fees: 1175.00,
        taxes: 234.50
      },
      byMethod: {
        card: 18750.00,
        ach: 3200.00,
        cash: 1250.00,
        check: 250.00
      },
      byType: {
        NEW: 15600.00,
        RENEWAL: 6200.00,
        ENDORSEMENT: 1400.00,
        CANCELLATION: 150.00,
        REINSTATEMENT: 100.00
      },
      batchIds: ['batch_20241201_001', 'batch_20241201_002']
    };

    const currentMonth = new Date().toISOString().substring(0, 7);
    const mockMonthlyReport: MonthlyReport = {
      id: `${orgId}_${currentMonth.replace('-', '')}`,
      orgId,
      month: currentMonth,
      totals: {
        count: 1247,
        amount: 587650.00,
        fees: 29382.50,
        taxes: 5876.50
      },
      byMethod: {
        card: 425000.00,
        ach: 98500.00,
        cash: 45000.00,
        check: 19150.00
      },
      byType: {
        NEW: 385000.00,
        RENEWAL: 156000.00,
        ENDORSEMENT: 32000.00,
        CANCELLATION: 8500.00,
        REINSTATEMENT: 6150.00
      },
      dailyBreakdown: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 11, i + 1).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 60) + 20,
        amount: Math.floor(Math.random() * 30000) + 15000
      }))
    };

    const mockBatches = [
      {
        id: 'batch_20241201_002',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        count: 23,
        amount: 12450.00,
        status: 'SETTLED'
      },
      {
        id: 'batch_20241201_001',
        date: new Date(Date.now() - 6 * 60 * 60 * 1000),
        count: 24,
        amount: 11000.00,
        status: 'SETTLED'
      },
      {
        id: 'batch_20241130_003',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        count: 31,
        amount: 18750.00,
        status: 'SETTLED'
      }
    ];

    const mockExports: ExportRequest[] = [
      {
        id: 'exp_1',
        type: 'transactions',
        status: 'COMPLETED',
        downloadUrl: 'https://storage.googleapis.com/exports/transactions_20241201.csv',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000)
      },
      {
        id: 'exp_2',
        type: 'policies',
        status: 'PROCESSING',
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      }
    ];

    setYesterdayReport(mockYesterdayReport);
    setMonthlyReport(mockMonthlyReport);
    setRecentBatches(mockBatches);
    setExports(mockExports);
  }, [orgId]);

  const handleExportCSV = async () => {
    setLoading(true);
    try {
      const dateRange = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date()
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      onExportCSV(exportType, dateRange);
      
      // Add to exports list
      const newExport: ExportRequest = {
        id: `exp_${Date.now()}`,
        type: exportType as any,
        status: 'PENDING',
        createdAt: new Date()
      };
      
      setExports(prev => [newExport, ...prev]);
      
      // Simulate processing
      setTimeout(() => {
        setExports(prev => prev.map(exp => 
          exp.id === newExport.id 
            ? { 
                ...exp, 
                status: 'COMPLETED' as const, 
                downloadUrl: `https://storage.googleapis.com/exports/${exportType}_${Date.now()}.csv`,
                completedAt: new Date()
              }
            : exp
        ));
      }, 3000);
      
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Reporting & Analytics</h1>
          <p className="text-gray-600">
            View transaction reports, analytics, and export data
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Yesterday Totals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yesterday</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(yesterdayReport?.totals.amount || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {yesterdayReport?.totals.count || 0} transactions
              </p>
            </CardContent>
          </Card>

          {/* Month to Date */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Month to Date</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(monthlyReport?.totals.amount || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {monthlyReport?.totals.count || 0} transactions
              </p>
            </CardContent>
          </Card>

          {/* Total Fees */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fees (MTD)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(monthlyReport?.totals.fees || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Processing fees collected
              </p>
            </CardContent>
          </Card>

          {/* Batches */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Batches</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentBatches.length}</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods Breakdown */}
        {monthlyReport && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods (Month to Date)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(monthlyReport.byMethod.card)}
                  </div>
                  <div className="text-sm text-gray-600">Credit/Debit Cards</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(monthlyReport.byMethod.ach)}
                  </div>
                  <div className="text-sm text-gray-600">ACH/Bank Transfer</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {formatCurrency(monthlyReport.byMethod.cash)}
                  </div>
                  <div className="text-sm text-gray-600">Cash</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(monthlyReport.byMethod.check)}
                  </div>
                  <div className="text-sm text-gray-600">Check</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Batches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Recent Batches
            </CardTitle>
            <CardDescription>
              Payment batches processed through Authorize.Net
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-mono text-sm">
                      {batch.id}
                    </TableCell>
                    <TableCell>
                      {batch.date.toLocaleDateString()}<br />
                      <span className="text-sm text-gray-500">
                        {batch.date.toLocaleTimeString()}
                      </span>
                    </TableCell>
                    <TableCell>{batch.count}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(batch.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        {batch.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Export Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>
              Export transaction, policy, or customer data to CSV
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transactions">Transactions</SelectItem>
                  <SelectItem value="policies">Policies</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExportCSV} disabled={loading}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {/* Export History */}
            {exports.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Recent Exports</h4>
                <div className="space-y-2">
                  {exports.map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium capitalize">
                            {exp.type} Export
                          </div>
                          <div className="text-sm text-gray-500">
                            Created {exp.createdAt.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(exp.status)}>
                          {exp.status}
                        </Badge>
                        {exp.status === 'COMPLETED' && exp.downloadUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(exp.downloadUrl, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
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
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Users,
  Car,
  Receipt,
  Trash2,
} from "lucide-react";

interface ImportJob {
  id: string;
  orgId: string;
  type: 'turborater';
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  files: Array<{
    name: string;
    size: number;
    controlId?: string;
    storagePath: string;
  }>;
  counts?: {
    customers: number;
    drivers: number;
    vehicles: number;
    quotes: number;
  };
  errors?: Array<{
    file: string;
    line?: number;
    code: string;
    message: string;
  }>;
  startedAt: Date;
  finishedAt?: Date;
  createdBy: string;
}

interface ImportPageProps {
  orgId?: string;
  onUploadFiles?: (files: File[]) => void;
  onDownloadErrors?: (jobId: string) => void;
}

export default function ImportPage({
  orgId = "org1",
  onUploadFiles = (files) => console.log("Upload files:", files),
  onDownloadErrors = (jobId) => console.log("Download errors for job:", jobId)
}: ImportPageProps) {
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Mock data for demo
  useEffect(() => {
    const mockJobs: ImportJob[] = [
      {
        id: "job_001",
        orgId,
        type: "turborater",
        status: "SUCCESS",
        files: [
          {
            name: "quotes_batch_001.tt2",
            size: 45678,
            controlId: "CTRL001",
            storagePath: "imports/turborater/org1/job_001/quotes_batch_001.tt2"
          }
        ],
        counts: {
          customers: 15,
          drivers: 28,
          vehicles: 22,
          quotes: 15
        },
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        finishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 45000),
        createdBy: "user123"
      },
      {
        id: "job_002",
        orgId,
        type: "turborater",
        status: "FAILED",
        files: [
          {
            name: "invalid_format.tt2x",
            size: 12345,
            storagePath: "imports/turborater/org1/job_002/invalid_format.tt2x"
          }
        ],
        errors: [
          {
            file: "invalid_format.tt2x",
            line: 15,
            code: "INVALID_FORMAT",
            message: "Missing required field: Named Insured"
          },
          {
            file: "invalid_format.tt2x",
            line: 23,
            code: "INVALID_VIN",
            message: "VIN format is invalid: ABC123"
          }
        ],
        startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        finishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 15000),
        createdBy: "user123"
      },
      {
        id: "job_003",
        orgId,
        type: "turborater",
        status: "PROCESSING",
        files: [
          {
            name: "large_batch.tt2",
            size: 156789,
            controlId: "CTRL003",
            storagePath: "imports/turborater/org1/job_003/large_batch.tt2"
          }
        ],
        startedAt: new Date(Date.now() - 10 * 60 * 1000),
        createdBy: "user123"
      }
    ];

    setJobs(mockJobs);
  }, [orgId]);

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Validate file types
    const validExtensions = ['.tt2', '.tt2x'];
    const invalidFiles = fileArray.filter(file => 
      !validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (invalidFiles.length > 0) {
      alert(`Invalid file types. Only .tt2 and .tt2x files are supported.\nInvalid files: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    setUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onUploadFiles(fileArray);
      
      // Add new job to the list
      const newJob: ImportJob = {
        id: `job_${Date.now()}`,
        orgId,
        type: "turborater",
        status: "PENDING",
        files: fileArray.map(file => ({
          name: file.name,
          size: file.size,
          storagePath: `imports/turborater/${orgId}/job_${Date.now()}/${file.name}`
        })),
        startedAt: new Date(),
        createdBy: "current_user"
      };
      
      setJobs(prev => [newJob, ...prev]);
      
      // Simulate processing
      setTimeout(() => {
        setJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { 
                ...job, 
                status: 'PROCESSING' as const
              }
            : job
        ));
        
        // Simulate completion
        setTimeout(() => {
          setJobs(prev => prev.map(job => 
            job.id === newJob.id 
              ? { 
                  ...job, 
                  status: 'SUCCESS' as const,
                  counts: {
                    customers: Math.floor(Math.random() * 20) + 5,
                    drivers: Math.floor(Math.random() * 40) + 10,
                    vehicles: Math.floor(Math.random() * 30) + 8,
                    quotes: Math.floor(Math.random() * 25) + 5
                  },
                  finishedAt: new Date()
                }
              : job
          ));
        }, 3000);
      }, 1000);
      
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'PROCESSING':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownloadErrors = async (jobId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onDownloadErrors(jobId);
      
      // Simulate CSV download
      const job = jobs.find(j => j.id === jobId);
      if (job?.errors) {
        const csvContent = [
          ['File', 'Line', 'Error Code', 'Message'],
          ...job.errors.map(error => [
            error.file,
            error.line?.toString() || '',
            error.code,
            error.message
          ])
        ].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `import-errors-${jobId}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading errors:", error);
    }
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Import Quotes</h1>
          <p className="text-gray-600">
            Upload TurboRater TT2/TT2X files to import quotes into AMSync
          </p>
        </div>

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload TurboRater Files
            </CardTitle>
            <CardDescription>
              Drag and drop .tt2 or .tt2x files here, or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {dragActive ? 'Drop files here' : 'Upload TurboRater Files'}
              </h3>
              <p className="text-gray-600 mb-4">
                Supports .tt2 and .tt2x file formats
              </p>
              <input
                type="file"
                multiple
                accept=".tt2,.tt2x"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Browse Files'}
              </Button>
            </div>
            
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Supported formats:</strong> TurboTags 2.0 (.tt2) and TurboTags 2.0 Extended (.tt2x) files.
                Files will be processed automatically after upload.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Import Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Import History
            </CardTitle>
            <CardDescription>
              Recent TurboRater import jobs and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No import jobs found. Upload some TurboRater files to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Files</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <Badge className={getStatusColor(job.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(job.status)}
                            {job.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {job.files.map((file, index) => (
                            <div key={index} className="text-sm">
                              <div className="font-medium">{file.name}</div>
                              <div className="text-gray-500">
                                {formatFileSize(file.size)}
                                {file.controlId && ` • Control: ${file.controlId}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {job.startedAt.toLocaleDateString()}<br />
                          <span className="text-gray-500">
                            {job.startedAt.toLocaleTimeString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {job.finishedAt ? (
                          <div className="text-sm">
                            {Math.round((job.finishedAt.getTime() - job.startedAt.getTime()) / 1000)}s
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {job.counts ? (
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Receipt className="h-3 w-3 text-blue-500" />
                              <span>{job.counts.quotes} quotes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3 text-green-500" />
                              <span>{job.counts.customers} customers</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Car className="h-3 w-3 text-purple-500" />
                              <span>{job.counts.vehicles} vehicles</span>
                            </div>
                          </div>
                        ) : job.errors ? (
                          <div className="text-sm text-red-600">
                            {job.errors.length} error{job.errors.length !== 1 ? 's' : ''}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {job.errors && job.errors.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadErrors(job.id)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Errors CSV
                            </Button>
                          )}
                          {job.status === 'FAILED' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Retry logic would go here
                                console.log("Retry job:", job.id);
                              }}
                            >
                              Retry
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Import Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Export from ITC TurboRater</h4>
                  <p className="text-sm text-gray-600">
                    Use TurboRater's export function to generate TT2 or TT2X bridge files
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Upload Files</h4>
                  <p className="text-sm text-gray-600">
                    Drag and drop or browse to upload your TT2/TT2X files
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Automatic Processing</h4>
                  <p className="text-sm text-gray-600">
                    Files are parsed automatically and quotes are created with deduplication
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Review Results</h4>
                  <p className="text-sm text-gray-600">
                    Check import status and download error reports if needed
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
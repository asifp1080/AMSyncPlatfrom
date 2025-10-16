"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  File,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import PortalShell from "@/components/portal/PortalShell";
import { useAuth } from "@/contexts/AuthProvider";

interface DocumentFile {
  id: string;
  fileName: string;
  fileType: string;
  size: number;
  uploadedAt: Date;
  status: 'RECEIVED' | 'REVIEWED' | 'NEEDS_INFO';
  notes?: string;
  downloadUrl?: string;
}

// Mock data - will be replaced with Firestore queries
const mockDocuments: DocumentFile[] = [
  {
    id: "1",
    fileName: "insurance_card.pdf",
    fileType: "application/pdf",
    size: 245760,
    uploadedAt: new Date("2024-01-15"),
    status: "REVIEWED",
    notes: "Document approved and processed",
  },
  {
    id: "2", 
    fileName: "drivers_license.jpg",
    fileType: "image/jpeg",
    size: 1048576,
    uploadedAt: new Date("2024-01-10"),
    status: "NEEDS_INFO",
    notes: "Please provide a clearer image of the back side",
  },
  {
    id: "3",
    fileName: "vehicle_registration.pdf", 
    fileType: "application/pdf",
    size: 512000,
    uploadedAt: new Date("2024-01-08"),
    status: "RECEIVED",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'REVIEWED':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'NEEDS_INFO':
      return <AlertCircle className="h-4 w-4 text-amber-600" />;
    default:
      return <Clock className="h-4 w-4 text-blue-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'REVIEWED':
      return 'bg-green-100 text-green-800';
    case 'NEEDS_INFO':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentFile[]>(mockDocuments);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { customer } = useAuth();
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setUploadProgress(0);

    for (const file of acceptedFiles) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB limit`,
          variant: "destructive",
        });
        continue;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive",
        });
        continue;
      }

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Add to documents list
      const newDocument: DocumentFile = {
        id: Date.now().toString(),
        fileName: file.name,
        fileType: file.type,
        size: file.size,
        uploadedAt: new Date(),
        status: 'RECEIVED',
      };

      setDocuments(prev => [newDocument, ...prev]);

      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded successfully`,
      });
    }

    setUploading(false);
    setUploadProgress(0);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: true,
  });

  const handleDownload = (document: DocumentFile) => {
    // In real implementation, this would use the downloadUrl from Firestore
    toast({
      title: "Download started",
      description: `Downloading ${document.fileName}`,
    });
  };

  return (
    <PortalShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Documents</h1>
          <p className="text-slate-600 mt-2">
            Upload and manage your insurance documents
          </p>
        </div>

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragActive
                  ? "border-[#4169E1] bg-blue-50"
                  : "border-slate-300 hover:border-slate-400"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-lg text-[#4169E1]">Drop files here...</p>
              ) : (
                <div>
                  <p className="text-lg text-slate-600 mb-2">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-sm text-slate-500">
                    Supports PDF, JPG, PNG, GIF, DOC, DOCX (max 10MB each)
                  </p>
                </div>
              )}
            </div>

            {uploading && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Uploading...</span>
                  <span className="text-sm text-slate-600">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              Uploaded Documents ({documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <File className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No documents uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-100 rounded">
                        <File className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">
                          {document.fileName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>{formatFileSize(document.size)}</span>
                          <span>
                            Uploaded {document.uploadedAt.toLocaleDateString()}
                          </span>
                        </div>
                        {document.notes && (
                          <p className="text-sm text-slate-600 mt-1">
                            {document.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={cn("flex items-center gap-1", getStatusColor(document.status))}
                      >
                        {getStatusIcon(document.status)}
                        {document.status.replace('_', ' ')}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(document)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
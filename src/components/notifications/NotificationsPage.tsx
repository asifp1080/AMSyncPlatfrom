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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Mail,
  MessageSquare,
  Settings,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";

interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  defaultFromName?: string;
  defaultFromEmail?: string;
}

interface Communication {
  id: string;
  orgId: string;
  type: 'email' | 'sms';
  template: string;
  to: string;
  subject?: string;
  status: 'QUEUED' | 'SENT' | 'FAILED';
  providerId?: string;
  error?: string;
  createdAt: Date;
  sentAt?: Date;
  related?: {
    txnId?: string;
    policyId?: string;
    customerId?: string;
  };
}

interface NotificationsPageProps {
  orgId?: string;
  onSavePreferences?: (prefs: NotificationPreferences) => void;
  onSendTestEmail?: (email: string) => void;
  onSendTestSMS?: (phone: string) => void;
}

export default function NotificationsPage({
  orgId = "org1",
  onSavePreferences = (prefs) => console.log("Save preferences:", prefs),
  onSendTestEmail = (email) => console.log("Send test email to:", email),
  onSendTestSMS = (phone) => console.log("Send test SMS to:", phone)
}: NotificationsPageProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailEnabled: true,
    smsEnabled: false,
    defaultFromName: "AMSync Insurance",
    defaultFromEmail: "noreply@amsync.com"
  });
  
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [testEmail, setTestEmail] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock data for demo
  useEffect(() => {
    const mockCommunications: Communication[] = [
      {
        id: "comm1",
        orgId,
        type: "email",
        template: "receipt_issued",
        to: "customer@example.com",
        subject: "Your Receipt #1001",
        status: "SENT",
        providerId: "loops_123",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        related: { txnId: "txn_123" }
      },
      {
        id: "comm2",
        orgId,
        type: "email",
        template: "policy_activated",
        to: "john.doe@example.com",
        subject: "Policy Activated - POL-2024-001",
        status: "SENT",
        providerId: "loops_124",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        related: { policyId: "pol_123" }
      },
      {
        id: "comm3",
        orgId,
        type: "sms",
        template: "policy_reminder",
        to: "+1234567890",
        status: "FAILED",
        error: "Invalid phone number format",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        related: { customerId: "cust_123" }
      },
      {
        id: "comm4",
        orgId,
        type: "email",
        template: "billing_payment_failed",
        to: "billing@example.com",
        subject: "Payment Failed - Action Required",
        status: "QUEUED",
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      }
    ];

    setCommunications(mockCommunications);
  }, [orgId]);

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSavePreferences(preferences);
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSendTestEmail(testEmail);
      
      // Add to communications log
      const newComm: Communication = {
        id: `test_${Date.now()}`,
        orgId,
        type: "email",
        template: "test_email",
        to: testEmail,
        subject: "Test Email from AMSync",
        status: "SENT",
        providerId: `loops_${Date.now()}`,
        createdAt: new Date(),
        sentAt: new Date()
      };
      
      setCommunications(prev => [newComm, ...prev]);
      setTestEmail("");
    } catch (error) {
      console.error("Error sending test email:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestSMS = async () => {
    if (!testPhone) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSendTestSMS(testPhone);
      
      // Add to communications log
      const newComm: Communication = {
        id: `test_${Date.now()}`,
        orgId,
        type: "sms",
        template: "test_sms",
        to: testPhone,
        status: "SENT",
        providerId: `twilio_${Date.now()}`,
        createdAt: new Date(),
        sentAt: new Date()
      };
      
      setCommunications(prev => [newComm, ...prev]);
      setTestPhone("");
    } catch (error) {
      console.error("Error sending test SMS:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'QUEUED':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'QUEUED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTemplateDisplayName = (template: string) => {
    const templates: Record<string, string> = {
      'receipt_issued': 'Receipt Issued',
      'policy_activated': 'Policy Activated',
      'policy_cancelled': 'Policy Cancelled',
      'billing_payment_failed': 'Payment Failed',
      'policy_reminder': 'Policy Reminder',
      'test_email': 'Test Email',
      'test_sms': 'Test SMS'
    };
    return templates[template] || template;
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-gray-600">
            Configure email and SMS notification settings for your organization
          </p>
        </div>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Control when and how notifications are sent to customers and staff
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">
                      Send automated emails for receipts, policy updates, and billing
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.emailEnabled}
                  onCheckedChange={(checked) =>
                    setPreferences(prev => ({ ...prev, emailEnabled: checked }))
                  }
                />
              </div>
              
              {preferences.emailEnabled && (
                <div className="ml-8 space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fromName">Default From Name</Label>
                      <Input
                        id="fromName"
                        value={preferences.defaultFromName || ""}
                        onChange={(e) =>
                          setPreferences(prev => ({ ...prev, defaultFromName: e.target.value }))
                        }
                        placeholder="Your Agency Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fromEmail">Default From Email</Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        value={preferences.defaultFromEmail || ""}
                        onChange={(e) =>
                          setPreferences(prev => ({ ...prev, defaultFromEmail: e.target.value }))
                        }
                        placeholder="noreply@youragency.com"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* SMS Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">
                      Send text messages for urgent updates and reminders
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.smsEnabled}
                  onCheckedChange={(checked) =>
                    setPreferences(prev => ({ ...prev, smsEnabled: checked }))
                  }
                />
              </div>
              
              {preferences.smsEnabled && (
                <div className="ml-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    SMS notifications will be sent via Twilio. Make sure customer phone numbers 
                    are properly formatted with country codes.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSavePreferences} disabled={loading}>
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Test Notifications
            </CardTitle>
            <CardDescription>
              Send test notifications to verify your configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Test Email */}
              <div className="space-y-3">
                <Label htmlFor="testEmail">Test Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="testEmail"
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    disabled={!preferences.emailEnabled}
                  />
                  <Button
                    onClick={handleSendTestEmail}
                    disabled={!testEmail || !preferences.emailEnabled || loading}
                    variant="outline"
                  >
                    Send
                  </Button>
                </div>
                {!preferences.emailEnabled && (
                  <p className="text-sm text-gray-500">
                    Enable email notifications to send test emails
                  </p>
                )}
              </div>

              {/* Test SMS */}
              <div className="space-y-3">
                <Label htmlFor="testPhone">Test SMS</Label>
                <div className="flex gap-2">
                  <Input
                    id="testPhone"
                    placeholder="+1234567890"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    disabled={!preferences.smsEnabled}
                  />
                  <Button
                    onClick={handleSendTestSMS}
                    disabled={!testPhone || !preferences.smsEnabled || loading}
                    variant="outline"
                  >
                    Send
                  </Button>
                </div>
                {!preferences.smsEnabled && (
                  <p className="text-sm text-gray-500">
                    Enable SMS notifications to send test messages
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Communications Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Communications Log
            </CardTitle>
            <CardDescription>
              Recent notification activity and delivery status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Related</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communications.map((comm) => (
                  <TableRow key={comm.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {comm.type === 'email' ? (
                          <Mail className="h-4 w-4 text-blue-500" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-green-500" />
                        )}
                        {comm.type.toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {getTemplateDisplayName(comm.template)}
                        </div>
                        {comm.subject && (
                          <div className="text-sm text-gray-500">
                            {comm.subject}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {comm.to}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(comm.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(comm.status)}
                          {comm.status}
                        </div>
                      </Badge>
                      {comm.error && (
                        <div className="text-xs text-red-500 mt-1">
                          {comm.error}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {comm.sentAt ? (
                        <div className="text-sm">
                          {comm.sentAt.toLocaleDateString()}<br />
                          <span className="text-gray-500">
                            {comm.sentAt.toLocaleTimeString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {comm.related && (
                        <div className="text-sm text-gray-600">
                          {comm.related.txnId && `Txn: ${comm.related.txnId}`}
                          {comm.related.policyId && `Policy: ${comm.related.policyId}`}
                          {comm.related.customerId && `Customer: ${comm.related.customerId}`}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
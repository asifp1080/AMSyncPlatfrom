"use client";

import React, { useState } from "react";
import PortalShell from "@/components/portal/PortalShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Paperclip } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateServiceRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement Firebase create service request + Loops email
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/portal/requests");
    } catch (error) {
      console.error("Error creating service request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/portal/requests">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Requests
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Submit Service Request</h1>
          <p className="text-slate-600 mt-1">Let us know how we can help you</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>Provide information about your request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="policy_change">Policy Change</SelectItem>
                      <SelectItem value="claim">Claim Assistance</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="coverage">Coverage Question</SelectItem>
                      <SelectItem value="document">Document Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your request"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed information about your request..."
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policy">Related Policy (Optional)</Label>
                  <Select>
                    <SelectTrigger id="policy">
                      <SelectValue placeholder="Select a policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POL-001">AUTO-2024-001 - Auto Insurance</SelectItem>
                      <SelectItem value="POL-002">HOME-2024-001 - Home Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments (Optional)</Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-[#4169E1] transition-colors cursor-pointer">
                    <Paperclip className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PDF, PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Link href="/portal/requests">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#4169E1] hover:bg-[#3557C7]"
              >
                <Send className="h-4 w-4 mr-2" />
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </PortalShell>
  );
}

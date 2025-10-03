"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  User,
  MapPin,
  Calendar,
  Shield,
} from "lucide-react";
import AddressInput from "@/components/ui/address-input";
import type {
  Policy,
  CreatePolicy,
  PolicyStatus,
  Customer,
  InsuranceProduct,
  Address,
} from "@amsync/domain";

interface PolicyFormProps {
  orgId: string;
}

export default function PolicyForm({ orgId }: PolicyFormProps) {
  // Mock data
  const mockCustomers: Customer[] = [
    {
      id: "cust1",
      organizationId: orgId,
      type: "individual",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "(555) 123-4567",
      isActive: true,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "user1",
    },
    {
      id: "cust2",
      organizationId: orgId,
      type: "business",
      businessName: "ABC Corp",
      email: "contact@abccorp.com",
      phone: "(555) 987-6543",
      isActive: true,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "user1",
    },
  ];

  const mockProducts: InsuranceProduct[] = [
    {
      id: "prod1",
      orgId,
      companyRef: "comp1",
      groupRef: "group1",
      name: "Auto Insurance - Personal",
      lob: "AUTO",
    },
    {
      id: "prod2",
      orgId,
      companyRef: "comp1",
      groupRef: "group1",
      name: "Homeowners Insurance",
      lob: "HOME",
    },
  ];

  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: "pol1",
      orgId,
      entityId: "entity1",
      locationId: "loc1",
      customerRef: "cust1",
      productRef: "prod1",
      number: "POL-2024-001",
      effectiveDate: new Date("2024-01-01"),
      expirationDate: new Date("2024-12-31"),
      status: "ACTIVE",
      statusHistory: [
        {
          at: new Date("2024-01-01"),
          from: "PENDING",
          to: "ACTIVE",
          reason: "Policy bound",
          by: "user1",
        },
      ],
      documents: [],
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ]);

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CreatePolicy>>({
    orgId,
    entityId: "entity1",
    locationId: "loc1",
    customerRef: "",
    productRef: "",
    number: "",
    effectiveDate: new Date(),
    expirationDate: new Date(
      new Date().getFullYear() + 1,
      new Date().getMonth(),
      new Date().getDate(),
    ),
    status: "PENDING",
  });
  const [riskAddress, setRiskAddress] = useState<Partial<Address>>({});

  const handleCreate = () => {
    setSelectedPolicy(null);
    setFormData({
      orgId,
      entityId: "entity1",
      locationId: "loc1",
      customerRef: "",
      productRef: "",
      number: `POL-${new Date().getFullYear()}-${String(policies.length + 1).padStart(3, "0")}`,
      effectiveDate: new Date(),
      expirationDate: new Date(
        new Date().getFullYear() + 1,
        new Date().getMonth(),
        new Date().getDate(),
      ),
      status: "PENDING",
    });
    setRiskAddress({});
    setIsDialogOpen(true);
  };

  const handleEdit = (policy: Policy) => {
    setSelectedPolicy(policy);
    setFormData({
      orgId: policy.orgId,
      entityId: policy.entityId,
      locationId: policy.locationId,
      customerRef: policy.customerRef,
      productRef: policy.productRef,
      number: policy.number,
      effectiveDate: policy.effectiveDate,
      expirationDate: policy.expirationDate,
      status: policy.status,
      underwriting: policy.underwriting,
      policySource: policy.policySource,
    });
    setRiskAddress(policy.riskAddress || {});
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPolicy) {
      // Update existing policy
      setPolicies(
        policies.map((policy) =>
          policy.id === selectedPolicy.id
            ? {
                ...policy,
                ...formData,
                riskAddress:
                  Object.keys(riskAddress).length > 0
                    ? (riskAddress as Address)
                    : undefined,
                updatedAt: new Date(),
              }
            : policy,
        ),
      );
    } else {
      // Create new policy
      const newPolicy: Policy = {
        id: `pol${Date.now()}`,
        ...(formData as CreatePolicy),
        riskAddress:
          Object.keys(riskAddress).length > 0
            ? (riskAddress as Address)
            : undefined,
        statusHistory: [
          {
            at: new Date(),
            from: "",
            to: formData.status || "PENDING",
            reason: "Policy created",
            by: "user1",
          },
        ],
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setPolicies([...policies, newPolicy]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (policyId: string) => {
    setPolicies(policies.filter((policy) => policy.id !== policyId));
  };

  const getStatusColor = (status: PolicyStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "EXPIRED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCustomerName = (customerRef: string) => {
    const customer = mockCustomers.find((c) => c.id === customerRef);
    if (!customer) return "Unknown Customer";
    return customer.type === "individual"
      ? `${customer.firstName} ${customer.lastName}`
      : customer.businessName || "Business Customer";
  };

  const getProductName = (productRef: string) => {
    return (
      mockProducts.find((p) => p.id === productRef)?.name || "Unknown Product"
    );
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Policies</h1>
            <p className="text-muted-foreground">
              Manage insurance policies with lifecycle tracking
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Policy
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Active Policies
            </CardTitle>
            <CardDescription>
              Insurance policies in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell>
                      <div className="font-mono font-medium">
                        {policy.number}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {getCustomerName(policy.customerRef)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        {getProductName(policy.productRef)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(policy.status)}>
                        {policy.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {policy.effectiveDate.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {policy.expirationDate.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(policy)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(policy.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedPolicy ? "Edit Policy" : "Create New Policy"}
              </DialogTitle>
              <DialogDescription>
                Configure policy details, customer, and risk location
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="location">Risk Location</TabsTrigger>
                <TabsTrigger value="underwriting">Underwriting</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="number">Policy Number *</Label>
                      <Input
                        id="number"
                        value={formData.number || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, number: e.target.value })
                        }
                        placeholder="POL-2024-001"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status || "PENDING"}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            status: value as PolicyStatus,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          <SelectItem value="EXPIRED">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerRef">Customer *</Label>
                      <Select
                        value={formData.customerRef || ""}
                        onValueChange={(value) =>
                          setFormData({ ...formData, customerRef: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCustomers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.type === "individual"
                                ? `${customer.firstName} ${customer.lastName}`
                                : customer.businessName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="productRef">Product *</Label>
                      <Select
                        value={formData.productRef || ""}
                        onValueChange={(value) =>
                          setFormData({ ...formData, productRef: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="effectiveDate">Effective Date *</Label>
                      <Input
                        id="effectiveDate"
                        type="date"
                        value={
                          formData.effectiveDate?.toISOString().split("T")[0] ||
                          ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            effectiveDate: new Date(e.target.value),
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="expirationDate">Expiration Date *</Label>
                      <Input
                        id="expirationDate"
                        type="date"
                        value={
                          formData.expirationDate
                            ?.toISOString()
                            .split("T")[0] || ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            expirationDate: new Date(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-4">
                  <AddressInput
                    value={riskAddress}
                    onChange={setRiskAddress}
                    label="Risk Location Address"
                    required={false}
                  />
                </TabsContent>

                <TabsContent value="underwriting" className="space-y-4">
                  <div>
                    <Label htmlFor="underwritingStatus">
                      Underwriting Status
                    </Label>
                    <Select
                      value={formData.underwriting?.status || ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          underwriting: {
                            ...formData.underwriting,
                            status: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select underwriting status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                        <SelectItem value="referred">Referred</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="underwritingNotes">
                      Underwriting Notes
                    </Label>
                    <Input
                      id="underwritingNotes"
                      value={formData.underwriting?.notes || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          underwriting: {
                            ...formData.underwriting,
                            notes: e.target.value,
                          },
                        })
                      }
                      placeholder="Additional underwriting notes..."
                    />
                  </div>
                </TabsContent>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedPolicy ? "Update Policy" : "Create Policy"}
                  </Button>
                </div>
              </form>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

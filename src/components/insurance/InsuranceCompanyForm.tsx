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
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
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
import { Building2, Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import type {
  InsuranceCompany,
  InsuranceCompanyType,
  CreateInsuranceCompany,
} from "@amsync/domain";

interface InsuranceCompanyFormProps {
  orgId: string;
}

export default function InsuranceCompanyForm({
  orgId,
}: InsuranceCompanyFormProps) {
  const [companies, setCompanies] = useState<InsuranceCompany[]>([
    {
      id: "comp1",
      orgId,
      name: "State Farm Insurance",
      companyType: "Carrier",
      naic: "25178",
      agentPortalUrl: "https://agent.statefarm.com",
      paymentUrl: "https://payments.statefarm.com",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "comp2",
      orgId,
      name: "Progressive Insurance",
      companyType: "Carrier",
      naic: "24260",
      agentPortalUrl: "https://agent.progressive.com",
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
    },
  ]);

  const [selectedCompany, setSelectedCompany] =
    useState<InsuranceCompany | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateInsuranceCompany>>({
    orgId,
    name: "",
    companyType: undefined,
    naic: "",
    agentPortalUrl: "",
    paymentUrl: "",
  });

  const handleCreate = () => {
    setSelectedCompany(null);
    setFormData({
      orgId,
      name: "",
      companyType: undefined,
      naic: "",
      agentPortalUrl: "",
      paymentUrl: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (company: InsuranceCompany) => {
    setSelectedCompany(company);
    setFormData({
      orgId: company.orgId,
      name: company.name,
      companyType: company.companyType,
      naic: company.naic,
      agentPortalUrl: company.agentPortalUrl,
      paymentUrl: company.paymentUrl,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCompany) {
      // Update existing company
      setCompanies(
        companies.map((comp) =>
          comp.id === selectedCompany.id
            ? { ...comp, ...formData, updatedAt: new Date() }
            : comp,
        ),
      );
    } else {
      // Create new company
      const newCompany: InsuranceCompany = {
        id: `comp${Date.now()}`,
        ...(formData as CreateInsuranceCompany),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCompanies([...companies, newCompany]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (companyId: string) => {
    setCompanies(companies.filter((comp) => comp.id !== companyId));
  };

  const getCompanyTypeColor = (type?: InsuranceCompanyType) => {
    switch (type) {
      case "Carrier":
        return "bg-blue-100 text-blue-800";
      case "MGA":
        return "bg-green-100 text-green-800";
      case "Broker":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Insurance Companies</h1>
            <p className="text-muted-foreground">
              Manage insurance carriers, MGAs, and brokers
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Companies
            </CardTitle>
            <CardDescription>
              Insurance companies in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>NAIC Code</TableHead>
                  <TableHead>Agent Portal</TableHead>
                  <TableHead>Payment Portal</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="font-medium">{company.name}</div>
                    </TableCell>
                    <TableCell>
                      {company.companyType && (
                        <Badge
                          className={getCompanyTypeColor(company.companyType)}
                        >
                          {company.companyType}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {company.naic || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {company.agentPortalUrl ? (
                        <a
                          href={company.agentPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Portal
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {company.paymentUrl ? (
                        <a
                          href={company.paymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Payments
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(company)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(company.id)}
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedCompany
                  ? "Edit Insurance Company"
                  : "Add Insurance Company"}
              </DialogTitle>
              <DialogDescription>
                Configure company details and portal URLs
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="State Farm Insurance"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="companyType">Company Type</Label>
                  <Select
                    value={formData.companyType || ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        companyType: value as InsuranceCompanyType,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Carrier">Carrier</SelectItem>
                      <SelectItem value="MGA">MGA</SelectItem>
                      <SelectItem value="Broker">Broker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="naic">NAIC Code</Label>
                <Input
                  id="naic"
                  value={formData.naic || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, naic: e.target.value })
                  }
                  placeholder="25178"
                />
              </div>

              <div>
                <Label htmlFor="agentPortalUrl">Agent Portal URL</Label>
                <Input
                  id="agentPortalUrl"
                  type="url"
                  value={formData.agentPortalUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, agentPortalUrl: e.target.value })
                  }
                  placeholder="https://agent.company.com"
                />
              </div>

              <div>
                <Label htmlFor="paymentUrl">Payment Portal URL</Label>
                <Input
                  id="paymentUrl"
                  type="url"
                  value={formData.paymentUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentUrl: e.target.value })
                  }
                  placeholder="https://payments.company.com"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedCompany ? "Update Company" : "Create Company"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

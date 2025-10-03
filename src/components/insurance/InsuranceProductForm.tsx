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
import {
  Plus,
  Edit,
  Trash2,
  ShoppingCart,
  Building2,
  Package,
} from "lucide-react";
import type {
  InsuranceProduct,
  CreateInsuranceProduct,
  LineOfBusiness,
  InsuranceCompany,
  ProductTypeGroup,
} from "@amsync/domain";

interface InsuranceProductFormProps {
  orgId: string;
}

export default function InsuranceProductForm({
  orgId,
}: InsuranceProductFormProps) {
  // Mock data for companies and groups
  const mockCompanies: InsuranceCompany[] = [
    {
      id: "comp1",
      orgId,
      name: "State Farm Insurance",
      companyType: "Carrier",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "comp2",
      orgId,
      name: "Progressive Insurance",
      companyType: "Carrier",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockGroups: ProductTypeGroup[] = [
    {
      id: "group1",
      orgId,
      name: "Personal Lines",
      description: "Auto, Home, Renters, and Umbrella insurance products",
    },
    {
      id: "group2",
      orgId,
      name: "Commercial Lines",
      description: "Business insurance products and coverage",
    },
  ];

  const [products, setProducts] = useState<InsuranceProduct[]>([
    {
      id: "prod1",
      orgId,
      companyRef: "comp1",
      groupRef: "group1",
      name: "Auto Insurance - Personal",
      lob: "AUTO",
      metadata: { minAge: 16, maxAge: 85 },
    },
    {
      id: "prod2",
      orgId,
      companyRef: "comp1",
      groupRef: "group1",
      name: "Homeowners Insurance",
      lob: "HOME",
      metadata: { minCoverage: 100000 },
    },
    {
      id: "prod3",
      orgId,
      companyRef: "comp2",
      groupRef: "group1",
      name: "Renters Insurance",
      lob: "RENTERS",
    },
  ]);

  const [selectedProduct, setSelectedProduct] =
    useState<InsuranceProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateInsuranceProduct>>({
    orgId,
    companyRef: "",
    groupRef: "",
    name: "",
    lob: "AUTO",
  });

  const handleCreate = () => {
    setSelectedProduct(null);
    setFormData({
      orgId,
      companyRef: "",
      groupRef: "",
      name: "",
      lob: "AUTO",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (product: InsuranceProduct) => {
    setSelectedProduct(product);
    setFormData({
      orgId: product.orgId,
      companyRef: product.companyRef,
      groupRef: product.groupRef,
      name: product.name,
      lob: product.lob,
      metadata: product.metadata,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedProduct) {
      // Update existing product
      setProducts(
        products.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, ...formData }
            : product,
        ),
      );
    } else {
      // Create new product
      const newProduct: InsuranceProduct = {
        id: `prod${Date.now()}`,
        ...(formData as CreateInsuranceProduct),
      };
      setProducts([...products, newProduct]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  const getLobColor = (lob: LineOfBusiness) => {
    switch (lob) {
      case "AUTO":
        return "bg-blue-100 text-blue-800";
      case "HOME":
        return "bg-green-100 text-green-800";
      case "RENTERS":
        return "bg-purple-100 text-purple-800";
      case "UMBRELLA":
        return "bg-orange-100 text-orange-800";
      case "COMMERCIAL":
        return "bg-red-100 text-red-800";
      case "LIFE":
        return "bg-pink-100 text-pink-800";
      case "HEALTH":
        return "bg-teal-100 text-teal-800";
      case "DISABILITY":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCompanyName = (companyRef: string) => {
    return (
      mockCompanies.find((c) => c.id === companyRef)?.name || "Unknown Company"
    );
  };

  const getGroupName = (groupRef: string) => {
    return mockGroups.find((g) => g.id === groupRef)?.name || "Unknown Group";
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Insurance Products</h1>
            <p className="text-muted-foreground">
              Manage insurance products by company and line of business
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Products
            </CardTitle>
            <CardDescription>
              Insurance products available in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Line of Business</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {getCompanyName(product.companyRef)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        {getGroupName(product.groupRef)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getLobColor(product.lob)}>
                        {product.lob}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
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
                {selectedProduct
                  ? "Edit Insurance Product"
                  : "Add Insurance Product"}
              </DialogTitle>
              <DialogDescription>
                Configure product details and line of business
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Auto Insurance - Personal"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyRef">Insurance Company *</Label>
                  <Select
                    value={formData.companyRef || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, companyRef: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCompanies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="groupRef">Product Group *</Label>
                  <Select
                    value={formData.groupRef || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, groupRef: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="lob">Line of Business *</Label>
                <Select
                  value={formData.lob || "AUTO"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, lob: value as LineOfBusiness })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select line of business" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUTO">Auto</SelectItem>
                    <SelectItem value="HOME">Home</SelectItem>
                    <SelectItem value="RENTERS">Renters</SelectItem>
                    <SelectItem value="UMBRELLA">Umbrella</SelectItem>
                    <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                    <SelectItem value="LIFE">Life</SelectItem>
                    <SelectItem value="HEALTH">Health</SelectItem>
                    <SelectItem value="DISABILITY">Disability</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
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
                  {selectedProduct ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

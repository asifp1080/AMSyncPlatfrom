"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import type { ProductTypeGroup, CreateProductTypeGroup } from "@amsync/domain";

interface ProductTypeGroupFormProps {
  orgId: string;
}

export default function ProductTypeGroupForm({
  orgId,
}: ProductTypeGroupFormProps) {
  const [groups, setGroups] = useState<ProductTypeGroup[]>([
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
    {
      id: "group3",
      orgId,
      name: "Life & Health",
      description: "Life insurance, health insurance, and disability coverage",
    },
  ]);

  const [selectedGroup, setSelectedGroup] = useState<ProductTypeGroup | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateProductTypeGroup>>({
    orgId,
    name: "",
    description: "",
  });

  const handleCreate = () => {
    setSelectedGroup(null);
    setFormData({
      orgId,
      name: "",
      description: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (group: ProductTypeGroup) => {
    setSelectedGroup(group);
    setFormData({
      orgId: group.orgId,
      name: group.name,
      description: group.description,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedGroup) {
      // Update existing group
      setGroups(
        groups.map((group) =>
          group.id === selectedGroup.id ? { ...group, ...formData } : group,
        ),
      );
    } else {
      // Create new group
      const newGroup: ProductTypeGroup = {
        id: `group${Date.now()}`,
        ...(formData as CreateProductTypeGroup),
      };
      setGroups([...groups, newGroup]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (groupId: string) => {
    setGroups(groups.filter((group) => group.id !== groupId));
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Product Type Groups</h1>
            <p className="text-muted-foreground">
              Organize insurance products into logical groups
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Group
          </Button>
        </div>

        <div className="grid gap-6">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {group.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {group.description || "No description provided"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(group)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(group.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedGroup
                  ? "Edit Product Type Group"
                  : "Add Product Type Group"}
              </DialogTitle>
              <DialogDescription>
                Create logical groupings for your insurance products
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Group Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Personal Lines"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the types of products in this group..."
                  rows={3}
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
                  {selectedGroup ? "Update Group" : "Create Group"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

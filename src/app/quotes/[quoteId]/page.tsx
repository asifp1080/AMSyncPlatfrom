"use client";

import React from "react";
import AppShell from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Car, Users, Shield, DollarSign, FileText } from "lucide-react";
import Link from "next/link";

export default function QuoteDetailPage({ params }: { params: { quoteId: string } }) {
  // Mock data
  const quote = {
    id: params.quoteId,
    customerName: "John Smith",
    effectiveDate: new Date("2024-02-01"),
    expirationDate: new Date("2025-02-01"),
    totalPremium: 1245.00,
    basePremium: 1100.00,
    taxes: 95.00,
    fees: 50.00,
    carrier: "Progressive",
    status: "active",
    namedInsured: {
      name: "John Smith",
      address: "123 Main St",
      city: "Austin",
      state: "TX",
      zip: "78701",
    },
    drivers: [
      {
        id: "D1",
        name: "John Smith",
        dateOfBirth: "1985-05-15",
        licenseNumber: "TX12345678",
        licenseState: "TX",
      },
      {
        id: "D2",
        name: "Jane Smith",
        dateOfBirth: "1987-08-22",
        licenseNumber: "TX87654321",
        licenseState: "TX",
      },
    ],
    vehicles: [
      {
        id: "V1",
        year: 2020,
        make: "Toyota",
        model: "Camry",
        vin: "1HGBH41JXMN109186",
        garagingZip: "78701",
      },
      {
        id: "V2",
        year: 2019,
        make: "Honda",
        model: "CR-V",
        vin: "2HGBH41JXMN109187",
        garagingZip: "78701",
      },
    ],
    coverages: [
      { type: "Bodily Injury", limit: "100/300", deductible: "-" },
      { type: "Property Damage", limit: "100", deductible: "-" },
      { type: "Collision", limit: "ACV", deductible: "500" },
      { type: "Comprehensive", limit: "ACV", deductible: "500" },
    ],
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/quotes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quotes
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Quote {quote.id}</h1>
            <p className="text-slate-600 mt-1">{quote.customerName}</p>
          </div>
          <Badge variant={quote.status === "active" ? "default" : "secondary"} className="text-sm">
            {quote.status}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Named Insured */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Named Insured
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="text-sm text-slate-600">Name</div>
                <div className="font-medium">{quote.namedInsured.name}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Address</div>
                <div className="font-medium">
                  {quote.namedInsured.address}<br />
                  {quote.namedInsured.city}, {quote.namedInsured.state} {quote.namedInsured.zip}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Premium Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Base Premium</span>
                <span className="font-medium">${quote.basePremium.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Taxes</span>
                <span className="font-medium">${quote.taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Fees</span>
                <span className="font-medium">${quote.fees.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total Premium</span>
                <span className="font-bold text-[#4169E1]">${quote.totalPremium.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Carrier</span>
                <span className="font-medium">{quote.carrier}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policy Period */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Policy Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm text-slate-600">Effective Date</div>
                <div className="font-medium">{quote.effectiveDate.toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Expiration Date</div>
                <div className="font-medium">{quote.expirationDate.toLocaleDateString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drivers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Drivers ({quote.drivers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>License Number</TableHead>
                  <TableHead>State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quote.drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell>{driver.dateOfBirth}</TableCell>
                    <TableCell>{driver.licenseNumber}</TableCell>
                    <TableCell>{driver.licenseState}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicles ({quote.vehicles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>VIN</TableHead>
                  <TableHead>Garaging Zip</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quote.vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.make}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell className="font-mono text-sm">{vehicle.vin}</TableCell>
                    <TableCell>{vehicle.garagingZip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Coverages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Coverages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coverage Type</TableHead>
                  <TableHead>Limit</TableHead>
                  <TableHead>Deductible</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quote.coverages.map((coverage, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{coverage.type}</TableCell>
                    <TableCell>{coverage.limit}</TableCell>
                    <TableCell>{coverage.deductible}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

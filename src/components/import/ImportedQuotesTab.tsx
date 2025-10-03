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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileText,
  Car,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Shield,
  Eye,
  ExternalLink,
} from "lucide-react";

interface Quote {
  id: string;
  orgId: string;
  customerRef: string;
  drivers: Array<{
    id: string;
    name: string;
    dateOfBirth?: string;
    licenseNumber?: string;
    licenseState?: string;
    incidents?: Array<{
      type: string;
      date: string;
      description?: string;
    }>;
  }>;
  vehicles: Array<{
    id: string;
    vin?: string;
    year?: number;
    make?: string;
    model?: string;
    garagingZip?: string;
  }>;
  coverages: Array<{
    type: string;
    limit?: string;
    deductible?: string;
  }>;
  premiumBreakdown: {
    basePremium: number;
    taxes: number;
    fees: number;
    totalPremium: number;
  };
  marketResults?: Array<{
    carrier: string;
    premium: number;
    rank: number;
  }>;
  source: 'turborater';
  importedAt: Date;
  quoteFingerprint: string;
  effectiveDate?: Date;
  expirationDate?: Date;
  namedInsured: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

interface ImportedQuotesTabProps {
  customerId?: string;
  customerName?: string;
  onViewQuote?: (quoteId: string) => void;
}

export default function ImportedQuotesTab({
  customerId = "cust_001",
  customerName = "John Smith",
  onViewQuote = (quoteId) => console.log("View quote:", quoteId)
}: ImportedQuotesTabProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demo
  useEffect(() => {
    const mockQuotes: Quote[] = [
      {
        id: "quote_001",
        orgId: "org1",
        customerRef: customerId,
        drivers: [
          {
            id: "driver_1",
            name: "John Smith",
            dateOfBirth: "1980-05-15",
            licenseNumber: "D123456789",
            licenseState: "NY"
          },
          {
            id: "driver_2",
            name: "Jane Smith",
            dateOfBirth: "1982-08-22",
            licenseNumber: "D987654321",
            licenseState: "NY"
          }
        ],
        vehicles: [
          {
            id: "vehicle_1",
            vin: "1HGBH41JXMN109186",
            year: 2022,
            make: "Honda",
            model: "Accord",
            garagingZip: "10001"
          }
        ],
        coverages: [
          { type: "BI", limit: "100/300" },
          { type: "PD", limit: "50" },
          { type: "COMP", deductible: "500" },
          { type: "COLL", deductible: "500" }
        ],
        premiumBreakdown: {
          basePremium: 1200.00,
          taxes: 120.00,
          fees: 50.00,
          totalPremium: 1370.00
        },
        marketResults: [
          { carrier: "State Farm", premium: 1370.00, rank: 1 },
          { carrier: "Geico", premium: 1425.50, rank: 2 },
          { carrier: "Progressive", premium: 1489.75, rank: 3 }
        ],
        source: 'turborater',
        importedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        quoteFingerprint: "abc123def456",
        effectiveDate: new Date(),
        namedInsured: {
          name: customerName,
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zip: "10001"
        }
      },
      {
        id: "quote_002",
        orgId: "org1",
        customerRef: customerId,
        drivers: [
          {
            id: "driver_1",
            name: "John Smith",
            dateOfBirth: "1980-05-15",
            licenseNumber: "D123456789",
            licenseState: "NY"
          }
        ],
        vehicles: [
          {
            id: "vehicle_1",
            vin: "2T1BURHE0JC123456",
            year: 2018,
            make: "Toyota",
            model: "Corolla",
            garagingZip: "10001"
          }
        ],
        coverages: [
          { type: "BI", limit: "50/100" },
          { type: "PD", limit: "25" },
          { type: "COMP", deductible: "1000" },
          { type: "COLL", deductible: "1000" }
        ],
        premiumBreakdown: {
          basePremium: 850.00,
          taxes: 85.00,
          fees: 35.00,
          totalPremium: 970.00
        },
        marketResults: [
          { carrier: "Geico", premium: 970.00, rank: 1 },
          { carrier: "State Farm", premium: 1025.00, rank: 2 },
          { carrier: "Allstate", premium: 1150.00, rank: 3 }
        ],
        source: 'turborater',
        importedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        quoteFingerprint: "def456ghi789",
        effectiveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        namedInsured: {
          name: customerName,
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zip: "10001"
        }
      }
    ];

    setQuotes(mockQuotes);
  }, [customerId, customerName]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCoverageDisplay = (coverages: Quote['coverages']) => {
    return coverages.map(cov => {
      if (cov.limit) return `${cov.type}: ${cov.limit}`;
      if (cov.deductible) return `${cov.type}: $${cov.deductible} ded`;
      return cov.type;
    }).join(' • ');
  };

  const getVehicleDisplay = (vehicle: Quote['vehicles'][0]) => {
    const parts = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean);
    return parts.join(' ') || 'Unknown Vehicle';
  };

  if (quotes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Imported Quotes
          </CardTitle>
          <CardDescription>
            TurboRater quotes imported for {customerName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Imported Quotes</h3>
            <p>No TurboRater quotes have been imported for this customer yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{quotes.length}</div>
                <div className="text-sm text-gray-500">Total Quotes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(Math.min(...quotes.map(q => q.premiumBreakdown.totalPremium)))}
                </div>
                <div className="text-sm text-gray-500">Lowest Premium</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">
                  {quotes.reduce((acc, q) => acc + q.vehicles.length, 0)}
                </div>
                <div className="text-sm text-gray-500">Vehicles Quoted</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">
                  {formatDate(new Date(Math.max(...quotes.map(q => q.importedAt.getTime()))))}
                </div>
                <div className="text-sm text-gray-500">Last Import</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Imported Quotes ({quotes.length})
          </CardTitle>
          <CardDescription>
            TurboRater quotes imported for {customerName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotes.map((quote) => (
              <Card key={quote.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">Quote #{quote.id.slice(-6)}</h3>
                        <Badge variant="secondary">TurboRater</Badge>
                        {quote.effectiveDate && (
                          <Badge variant="outline">
                            Effective: {formatDate(quote.effectiveDate)}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Imported: {formatDate(quote.importedAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(quote.premiumBreakdown.totalPremium)}
                      </div>
                      <div className="text-sm text-gray-500">Total Premium</div>
                    </div>
                  </div>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="drivers">Drivers</TabsTrigger>
                      <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                      <TabsTrigger value="market">Market Results</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Coverages
                          </h4>
                          <div className="text-sm text-gray-600">
                            {getCoverageDisplay(quote.coverages)}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Premium Breakdown
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Base Premium:</span>
                              <span>{formatCurrency(quote.premiumBreakdown.basePremium)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Taxes:</span>
                              <span>{formatCurrency(quote.premiumBreakdown.taxes)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Fees:</span>
                              <span>{formatCurrency(quote.premiumBreakdown.fees)}</span>
                            </div>
                            <div className="flex justify-between font-medium border-t pt-1">
                              <span>Total:</span>
                              <span>{formatCurrency(quote.premiumBreakdown.totalPremium)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="drivers" className="mt-4">
                      <div className="space-y-3">
                        {quote.drivers.map((driver) => (
                          <div key={driver.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <Users className="h-5 w-5 text-blue-500" />
                            <div className="flex-1">
                              <div className="font-medium">{driver.name}</div>
                              <div className="text-sm text-gray-600">
                                {driver.dateOfBirth && `DOB: ${driver.dateOfBirth}`}
                                {driver.licenseNumber && ` • License: ${driver.licenseNumber}`}
                                {driver.licenseState && ` (${driver.licenseState})`}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="vehicles" className="mt-4">
                      <div className="space-y-3">
                        {quote.vehicles.map((vehicle) => (
                          <div key={vehicle.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <Car className="h-5 w-5 text-purple-500" />
                            <div className="flex-1">
                              <div className="font-medium">{getVehicleDisplay(vehicle)}</div>
                              <div className="text-sm text-gray-600">
                                {vehicle.vin && `VIN: ${vehicle.vin}`}
                                {vehicle.garagingZip && (
                                  <span className="flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3" />
                                    Garaged in {vehicle.garagingZip}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="market" className="mt-4">
                      {quote.marketResults && quote.marketResults.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Rank</TableHead>
                              <TableHead>Carrier</TableHead>
                              <TableHead className="text-right">Premium</TableHead>
                              <TableHead className="text-right">Difference</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {quote.marketResults
                              .sort((a, b) => a.rank - b.rank)
                              .map((result) => (
                                <TableRow key={result.carrier}>
                                  <TableCell>
                                    <Badge variant={result.rank === 1 ? "default" : "secondary"}>
                                      #{result.rank}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {result.carrier}
                                  </TableCell>
                                  <TableCell className="text-right font-medium">
                                    {formatCurrency(result.premium)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {result.rank === 1 ? (
                                      <span className="text-green-600 font-medium">Best Rate</span>
                                    ) : (
                                      <span className="text-gray-600">
                                        +{formatCurrency(result.premium - quote.marketResults![0].premium)}
                                      </span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No market comparison data available
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => onViewQuote(quote.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
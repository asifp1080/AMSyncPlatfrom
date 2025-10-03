"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MapPin, ChevronDown, Building2, Users } from "lucide-react";

interface Location {
  id: string;
  name: string;
  code: string;
  type: "office" | "branch" | "warehouse" | "retail" | "headquarters";
  isActive: boolean;
}

interface LocationSwitcherProps {
  currentLocationId?: string;
  allowedLocations?: Location[];
  onLocationChange?: (locationId: string) => void;
  className?: string;
}

export default function LocationSwitcher({
  currentLocationId,
  allowedLocations = [],
  onLocationChange,
  className = "",
}: LocationSwitcherProps) {
  // Mock data if no locations provided
  const mockLocations: Location[] = [
    {
      id: "loc1",
      name: "Downtown Office",
      code: "DT001",
      type: "office",
      isActive: true,
    },
    {
      id: "loc2",
      name: "Uptown Branch",
      code: "UT002",
      type: "branch",
      isActive: true,
    },
    {
      id: "loc3",
      name: "Main Warehouse",
      code: "WH001",
      type: "warehouse",
      isActive: true,
    },
  ];

  const locations =
    allowedLocations.length > 0 ? allowedLocations : mockLocations;

  const defaultLocationId = currentLocationId || locations[0]?.id || "";

  const [selectedLocationId, setSelectedLocationId] =
    useState(defaultLocationId);
  const currentLocation =
    locations.find((loc) => loc.id === selectedLocationId) || locations[0];

  const handleLocationChange = (locationId: string) => {
    setSelectedLocationId(locationId);
    onLocationChange?.(locationId);
  };

  const getLocationIcon = (type: Location["type"]) => {
    switch (type) {
      case "headquarters":
        return <Building2 className="h-4 w-4" />;
      case "office":
        return <Building2 className="h-4 w-4" />;
      case "branch":
        return <MapPin className="h-4 w-4" />;
      case "warehouse":
        return <Building2 className="h-4 w-4" />;
      case "retail":
        return <Building2 className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getLocationTypeColor = (type: Location["type"]) => {
    switch (type) {
      case "headquarters":
        return "bg-purple-100 text-purple-800";
      case "office":
        return "bg-blue-100 text-blue-800";
      case "branch":
        return "bg-green-100 text-green-800";
      case "warehouse":
        return "bg-orange-100 text-orange-800";
      case "retail":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!currentLocation) {
    return (
      <div
        className={`flex items-center gap-2 text-muted-foreground ${className}`}
      >
        <MapPin className="h-4 w-4" />
        <span className="text-sm">No locations available</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 min-w-[200px] justify-between"
          >
            <div className="flex items-center gap-2">
              {getLocationIcon(currentLocation.type)}
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">
                  {currentLocation.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {currentLocation.code}
                </span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[280px]">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Switch Location
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {locations.map((location) => (
            <DropdownMenuItem
              key={location.id}
              onClick={() => handleLocationChange(location.id)}
              className="flex items-center justify-between p-3 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {getLocationIcon(location.type)}
                <div className="flex flex-col">
                  <span className="font-medium">{location.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {location.code}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`text-xs ${getLocationTypeColor(location.type)}`}
                >
                  {location.type}
                </Badge>
                {location.id === selectedLocationId && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
          {locations.length === 0 && (
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">
                No locations available
              </span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Badge variant="outline" className="text-xs">
        {locations.length} location{locations.length !== 1 ? "s" : ""} available
      </Badge>
    </div>
  );
}

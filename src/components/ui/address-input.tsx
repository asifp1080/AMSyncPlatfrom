"use client";

import React from "react";
import { Input } from "./input";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { MapPin } from "lucide-react";
import type { Address } from "@amsync/domain";

interface AddressInputProps {
  value?: Partial<Address>;
  onChange: (address: Partial<Address>) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export default function AddressInput({
  value = {},
  onChange,
  label = "Address",
  required = false,
  className = "",
}: AddressInputProps) {
  const handleFieldChange = (field: keyof Address, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <div className={`bg-white ${className}`}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4" />
            {label}
            {required && <span className="text-red-500">*</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="street1">
              Street Address{" "}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="street1"
              placeholder="123 Main Street"
              value={value.street1 || ""}
              onChange={(e) => handleFieldChange("street1", e.target.value)}
              required={required}
            />
          </div>

          <div>
            <Label htmlFor="street2">Street Address 2 (Optional)</Label>
            <Input
              id="street2"
              placeholder="Apt, Suite, Unit, etc."
              value={value.street2 || ""}
              onChange={(e) => handleFieldChange("street2", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">
                City {required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="city"
                placeholder="New York"
                value={value.city || ""}
                onChange={(e) => handleFieldChange("city", e.target.value)}
                required={required}
              />
            </div>

            <div>
              <Label htmlFor="state">
                State {required && <span className="text-red-500">*</span>}
              </Label>
              <Select
                value={value.state || ""}
                onValueChange={(stateValue) =>
                  handleFieldChange("state", stateValue)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postalCode">
                ZIP Code {required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="postalCode"
                placeholder="10001"
                value={value.postalCode || ""}
                onChange={(e) =>
                  handleFieldChange("postalCode", e.target.value)
                }
                required={required}
              />
            </div>

            <div>
              <Label htmlFor="country">
                Country {required && <span className="text-red-500">*</span>}
              </Label>
              <Select
                value={value.country || "USA"}
                onValueChange={(countryValue) =>
                  handleFieldChange("country", countryValue)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USA">United States</SelectItem>
                  <SelectItem value="CAN">Canada</SelectItem>
                  <SelectItem value="MEX">Mexico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Preferences } from "@amsync/domain";

interface PreferencesContextType {
  preferences: Preferences | null;
  loading: boolean;
  error: string | null;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
  formatNumber: (num: number) => string;
  updatePreferences: (newPreferences: Partial<Preferences>) => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined,
);

interface PreferencesProviderProps {
  children: React.ReactNode;
  orgId?: string;
}

export function PreferencesProvider({
  children,
  orgId,
}: PreferencesProviderProps) {
  // Initialize with default preferences to avoid hydration mismatch
  const defaultPreferences: Preferences = {
    brand: {
      name: "Demo Insurance Agency",
      logoUrl:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&q=80",
    },
    currency: "USD",
    decimals: 2,
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    timezone: "America/New_York",
  };

  const [preferences, setPreferences] = useState<Preferences | null>(
    defaultPreferences,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock Firebase connection - replace with actual Firebase SDK
  useEffect(() => {
    if (!orgId) {
      return;
    }

    const loadPreferences = async () => {
      try {
        setError(null);
        // Preferences are already set to default values
        // In a real implementation, this would fetch from Firestore
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load preferences",
        );
      }
    };

    loadPreferences();
  }, [orgId]);

  const formatCurrency = (amount: number): string => {
    if (!preferences) return amount.toString();

    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      CAD: "C$",
      AUD: "A$",
      CHF: "CHF",
      CNY: "¥",
      INR: "₹",
    };

    const symbol = symbols[preferences.currency] || preferences.currency;
    const formatted = amount.toLocaleString("en-US", {
      minimumFractionDigits: preferences.decimals,
      maximumFractionDigits: preferences.decimals,
    });

    return `${symbol}${formatted}`;
  };

  const formatDate = (date: Date): string => {
    if (!preferences) {
      // Use consistent ISO format to avoid hydration issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${month}/${day}/${year}`;
    }

    // Use consistent formatting to avoid server/client mismatch
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    if (preferences.dateFormat.includes("MM/DD/YYYY")) {
      return `${month}/${day}/${year}`;
    } else if (preferences.dateFormat.includes("DD/MM/YYYY")) {
      return `${day}/${month}/${year}`;
    } else {
      return `${month}/${day}/${year}`;
    }
  };

  const formatNumber = (num: number): string => {
    if (!preferences) return num.toString();

    return num.toLocaleString("en-US", {
      minimumFractionDigits: preferences.decimals,
      maximumFractionDigits: preferences.decimals,
    });
  };

  const updatePreferences = async (
    newPreferences: Partial<Preferences>,
  ): Promise<void> => {
    try {
      // Mock update - replace with actual Firestore call
      if (preferences) {
        const updated = { ...preferences, ...newPreferences };
        setPreferences(updated);
      }
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to update preferences",
      );
    }
  };

  const value: PreferencesContextType = {
    preferences,
    loading,
    error,
    formatCurrency,
    formatDate,
    formatNumber,
    updatePreferences,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}

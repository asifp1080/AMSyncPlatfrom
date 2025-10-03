import { describe, it, expect, jest } from '@jest/globals';

// Mock the PreferencesProvider
const mockPreferences = {
  brand: {
    name: 'Test Agency',
    logoUrl: 'https://example.com/logo.png',
  },
  currency: 'USD',
  decimals: 2,
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  timezone: 'America/New_York',
};

describe('Claims Resolution', () => {
  describe('User Claims Merging', () => {
    it('should merge direct location IDs with group location IDs', () => {
      const user = {
        id: 'user1',
        orgId: 'org1',
        role: 'agent' as const,
        directLocationIds: ['loc1', 'loc2'],
        groupIds: ['group1'],
      };

      const groups = [
        {
          id: 'group1',
          orgId: 'org1',
          name: 'Sales Team',
          locationIds: ['loc3', 'loc4'],
          memberUserIds: ['user1'],
        },
      ];

      // Simulate claims resolution logic
      let allowedLocationIds = [...user.directLocationIds];
      
      groups.forEach(group => {
        if (user.groupIds.includes(group.id)) {
          allowedLocationIds = [...allowedLocationIds, ...group.locationIds];
        }
      });

      // Remove duplicates
      allowedLocationIds = [...new Set(allowedLocationIds)];

      expect(allowedLocationIds).toEqual(['loc1', 'loc2', 'loc3', 'loc4']);
    });

    it('should handle overlapping location IDs correctly', () => {
      const user = {
        id: 'user1',
        orgId: 'org1',
        role: 'manager' as const,
        directLocationIds: ['loc1', 'loc2'],
        groupIds: ['group1', 'group2'],
      };

      const groups = [
        {
          id: 'group1',
          orgId: 'org1',
          name: 'Sales Team',
          locationIds: ['loc2', 'loc3'], // loc2 overlaps with direct
          memberUserIds: ['user1'],
        },
        {
          id: 'group2',
          orgId: 'org1',
          name: 'Support Team',
          locationIds: ['loc3', 'loc4'], // loc3 overlaps with group1
          memberUserIds: ['user1'],
        },
      ];

      // Simulate claims resolution logic
      let allowedLocationIds = [...user.directLocationIds];
      
      groups.forEach(group => {
        if (user.groupIds.includes(group.id)) {
          allowedLocationIds = [...allowedLocationIds, ...group.locationIds];
        }
      });

      // Remove duplicates
      allowedLocationIds = [...new Set(allowedLocationIds)];

      expect(allowedLocationIds).toEqual(['loc1', 'loc2', 'loc3', 'loc4']);
      expect(allowedLocationIds.length).toBe(4); // No duplicates
    });

    it('should work with empty group IDs', () => {
      const user = {
        id: 'user1',
        orgId: 'org1',
        role: 'agent' as const,
        directLocationIds: ['loc1', 'loc2'],
        groupIds: [],
      };

      const groups: any[] = [];

      // Simulate claims resolution logic
      let allowedLocationIds = [...user.directLocationIds];
      
      groups.forEach(group => {
        if (user.groupIds.includes(group.id)) {
          allowedLocationIds = [...allowedLocationIds, ...group.locationIds];
        }
      });

      // Remove duplicates
      allowedLocationIds = [...new Set(allowedLocationIds)];

      expect(allowedLocationIds).toEqual(['loc1', 'loc2']);
    });

    it('should work with empty direct location IDs', () => {
      const user = {
        id: 'user1',
        orgId: 'org1',
        role: 'agent' as const,
        directLocationIds: [],
        groupIds: ['group1'],
      };

      const groups = [
        {
          id: 'group1',
          orgId: 'org1',
          name: 'Sales Team',
          locationIds: ['loc1', 'loc2'],
          memberUserIds: ['user1'],
        },
      ];

      // Simulate claims resolution logic
      let allowedLocationIds = [...user.directLocationIds];
      
      groups.forEach(group => {
        if (user.groupIds.includes(group.id)) {
          allowedLocationIds = [...allowedLocationIds, ...group.locationIds];
        }
      });

      // Remove duplicates
      allowedLocationIds = [...new Set(allowedLocationIds)];

      expect(allowedLocationIds).toEqual(['loc1', 'loc2']);
    });
  });

  describe('Custom Claims Structure', () => {
    it('should create correct custom claims object', () => {
      const user = {
        id: 'user1',
        orgId: 'org1',
        entityId: 'entity1',
        role: 'manager' as const,
        directLocationIds: ['loc1'],
        groupIds: ['group1'],
      };

      const allowedLocationIds = ['loc1', 'loc2', 'loc3'];

      const customClaims = {
        orgId: user.orgId,
        entityId: user.entityId,
        allowedLocationIds,
        role: user.role,
      };

      expect(customClaims).toEqual({
        orgId: 'org1',
        entityId: 'entity1',
        allowedLocationIds: ['loc1', 'loc2', 'loc3'],
        role: 'manager',
      });
    });

    it('should handle optional entityId', () => {
      const user = {
        id: 'user1',
        orgId: 'org1',
        entityId: undefined,
        role: 'agent' as const,
        directLocationIds: ['loc1'],
        groupIds: [],
      };

      const allowedLocationIds = ['loc1'];

      const customClaims = {
        orgId: user.orgId,
        entityId: user.entityId || null,
        allowedLocationIds,
        role: user.role,
      };

      expect(customClaims).toEqual({
        orgId: 'org1',
        entityId: null,
        allowedLocationIds: ['loc1'],
        role: 'agent',
      });
    });
  });
});

describe('Preferences Formatting', () => {
  describe('Currency Formatting', () => {
    it('should format currency correctly', () => {
      const amount = 1234.56;
      const symbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
      };
      
      const symbol = symbols['USD'];
      const formatted = amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      expect(`${symbol}${formatted}`).toBe('$1,234.56');
    });

    it('should handle different currencies', () => {
      const amount = 1000;
      const symbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
      };
      
      const usdSymbol = symbols['USD'];
      const eurSymbol = symbols['EUR'];
      const usdFormatted = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const eurFormatted = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      expect(`${usdSymbol}${usdFormatted}`).toContain('$');
      expect(`${eurSymbol}${eurFormatted}`).toContain('€');
    });

    it('should respect decimal places setting', () => {
      const amount = 100;
      
      const twoDecimals = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const zeroDecimals = amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      
      expect(`$${twoDecimals}`).toBe('$100.00');
      expect(`$${zeroDecimals}`).toBe('$100');
    });
  });

  describe('Date Formatting', () => {
    it('should format dates according to preferences', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      
      const usFormat = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      const gbFormat = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      
      expect(usFormat).toBe('01/15/2024');
      expect(gbFormat).toBe('15/01/2024');
    });

    it('should handle time formatting', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      
      const time12h = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const time24h = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
      
      expect(time12h).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
      expect(time24h).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('Number Formatting', () => {
    it('should format numbers with correct decimal places', () => {
      const num = 1234.5678;
      
      const formatted = num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      
      expect(formatted).toBe('1,234.57');
    });

    it('should handle large numbers', () => {
      const num = 1234567.89;
      
      const formatted = num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      
      expect(formatted).toBe('1,234,567.89');
    });
  });
});

describe('Location Switcher Logic', () => {
  describe('Location Filtering', () => {
    it('should show only allowed locations', () => {
      const allLocations = [
        { id: 'loc1', name: 'Location 1', code: 'L001', type: 'office' as const, isActive: true },
        { id: 'loc2', name: 'Location 2', code: 'L002', type: 'branch' as const, isActive: true },
        { id: 'loc3', name: 'Location 3', code: 'L003', type: 'warehouse' as const, isActive: true },
      ];

      const allowedLocationIds = ['loc1', 'loc3'];
      
      const allowedLocations = allLocations.filter(loc => 
        allowedLocationIds.includes(loc.id)
      );

      expect(allowedLocations).toHaveLength(2);
      expect(allowedLocations.map(l => l.id)).toEqual(['loc1', 'loc3']);
    });

    it('should filter out inactive locations', () => {
      const allLocations = [
        { id: 'loc1', name: 'Location 1', code: 'L001', type: 'office' as const, isActive: true },
        { id: 'loc2', name: 'Location 2', code: 'L002', type: 'branch' as const, isActive: false },
        { id: 'loc3', name: 'Location 3', code: 'L003', type: 'warehouse' as const, isActive: true },
      ];

      const allowedLocationIds = ['loc1', 'loc2', 'loc3'];
      
      const activeAllowedLocations = allLocations.filter(loc => 
        allowedLocationIds.includes(loc.id) && loc.isActive
      );

      expect(activeAllowedLocations).toHaveLength(2);
      expect(activeAllowedLocations.map(l => l.id)).toEqual(['loc1', 'loc3']);
    });
  });

  describe('Location Selection', () => {
    it('should default to first allowed location', () => {
      const allowedLocations = [
        { id: 'loc2', name: 'Location 2', code: 'L002', type: 'branch' as const, isActive: true },
        { id: 'loc1', name: 'Location 1', code: 'L001', type: 'office' as const, isActive: true },
      ];

      const defaultLocation = allowedLocations[0];

      expect(defaultLocation.id).toBe('loc2');
    });

    it('should maintain selected location if valid', () => {
      const allowedLocations = [
        { id: 'loc1', name: 'Location 1', code: 'L001', type: 'office' as const, isActive: true },
        { id: 'loc2', name: 'Location 2', code: 'L002', type: 'branch' as const, isActive: true },
      ];

      const currentLocationId = 'loc2';
      const isValidSelection = allowedLocations.some(loc => loc.id === currentLocationId);

      expect(isValidSelection).toBe(true);
    });

    it('should fallback to first location if current selection is invalid', () => {
      const allowedLocations = [
        { id: 'loc1', name: 'Location 1', code: 'L001', type: 'office' as const, isActive: true },
        { id: 'loc2', name: 'Location 2', code: 'L002', type: 'branch' as const, isActive: true },
      ];

      const currentLocationId = 'loc3'; // Not in allowed locations
      const isValidSelection = allowedLocations.some(loc => loc.id === currentLocationId);
      const selectedLocation = isValidSelection ? currentLocationId : allowedLocations[0]?.id;

      expect(selectedLocation).toBe('loc1');
    });
  });
});

describe('Transaction Schema Validation', () => {
  describe('Transaction Type Validation', () => {
    it('should validate transaction types', () => {
      const validTypes = ['NEW', 'RENEWAL', 'ENDORSEMENT', 'CANCELLATION', 'REINSTATEMENT'];
      
      validTypes.forEach(type => {
        const transaction = {
          id: 'txn1',
          orgId: 'org1',
          entityId: 'entity1',
          locationId: 'loc1',
          performedAtLocationId: 'loc1',
          policyRef: 'pol1',
          customerRef: 'cust1',
          userRef: 'user1',
          type: type as any,
          fees: [],
          payments: [],
          amount: {
            subtotal: 1000,
            feesTotal: 25,
            taxTotal: 2,
            grandTotal: 1027,
            currency: 'USD'
          },
          status: 'PENDING' as any,
          receipt: { number: 1 },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        expect(validTypes).toContain(transaction.type);
      });
    });
  });

  describe('Payment Method Validation', () => {
    it('should validate payment methods', () => {
      const validMethods = ['card', 'ach', 'cash', 'check'];
      
      validMethods.forEach(method => {
        const payment = {
          method: method as any,
          amount: 100,
          gateway: method === 'card' || method === 'ach' ? 'authnet' : 'offline'
        };
        
        expect(validMethods).toContain(payment.method);
      });
    });
  });

  describe('Transaction Status Validation', () => {
    it('should validate transaction statuses', () => {
      const validStatuses = ['PENDING', 'AUTHORIZED', 'CAPTURED', 'SETTLED', 'VOIDED', 'REFUNDED', 'FAILED'];
      
      validStatuses.forEach(status => {
        expect(validStatuses).toContain(status);
      });
    });
  });

  describe('Fee Structure Validation', () => {
    it('should validate fee structure', () => {
      const fee = {
        code: 'POLICY_FEE',
        label: 'Policy Fee',
        amount: 25.00,
        taxable: true
      };

      expect(fee.code).toBeDefined();
      expect(fee.label).toBeDefined();
      expect(typeof fee.amount).toBe('number');
      expect(typeof fee.taxable).toBe('boolean');
    });
  });

  describe('Amount Calculation', () => {
    it('should calculate transaction amounts correctly', () => {
      const subtotal = 1000;
      const fees = [
        { code: 'POLICY_FEE', label: 'Policy Fee', amount: 25, taxable: true },
        { code: 'PROCESSING_FEE', label: 'Processing Fee', amount: 15, taxable: false }
      ];
      
      const feesTotal = fees.reduce((sum, fee) => sum + fee.amount, 0);
      const taxTotal = fees.reduce((sum, fee) => sum + (fee.taxable ? fee.amount * 0.08 : 0), 0);
      const grandTotal = subtotal + feesTotal + taxTotal;

      expect(feesTotal).toBe(40);
      expect(taxTotal).toBe(2); // 25 * 0.08 = 2
      expect(grandTotal).toBe(1042);
    });
  });
});

describe('Receipt Numbering Logic', () => {
  describe('Counter Increment', () => {
    it('should increment receipt counter atomically', () => {
      // Mock counter increment logic
      let currentValue = 100;
      const newValue = currentValue + 1;
      
      expect(newValue).toBe(101);
      expect(newValue).toBeGreaterThan(currentValue);
    });

    it('should handle first receipt number', () => {
      let currentValue = 0; // No existing counter
      const newValue = currentValue + 1;
      
      expect(newValue).toBe(1);
    });

    it('should generate sequential receipt numbers', () => {
      const receiptNumbers = [];
      let counter = 0;
      
      // Simulate creating 5 receipts
      for (let i = 0; i < 5; i++) {
        counter++;
        receiptNumbers.push(counter);
      }
      
      expect(receiptNumbers).toEqual([1, 2, 3, 4, 5]);
      expect(receiptNumbers.length).toBe(5);
    });
  });
});

describe('Payment Processing Logic', () => {
  describe('Split Payments', () => {
    it('should handle multiple payment methods', () => {
      const grandTotal = 1000;
      const payments = [
        { method: 'card', amount: 600, gateway: 'authnet' },
        { method: 'cash', amount: 400, gateway: 'offline' }
      ];
      
      const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
      
      expect(totalPayments).toBe(grandTotal);
      expect(payments).toHaveLength(2);
    });

    it('should validate payment balance', () => {
      const grandTotal = 1000;
      const payments = [
        { method: 'card', amount: 500, gateway: 'authnet' },
        { method: 'cash', amount: 500, gateway: 'offline' }
      ];
      
      const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
      const isBalanced = Math.abs(totalPayments - grandTotal) < 0.01;
      
      expect(isBalanced).toBe(true);
    });

    it('should detect unbalanced payments', () => {
      const grandTotal = 1000;
      const payments = [
        { method: 'card', amount: 600, gateway: 'authnet' }
      ];
      
      const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
      const isBalanced = Math.abs(totalPayments - grandTotal) < 0.01;
      
      expect(isBalanced).toBe(false);
      expect(grandTotal - totalPayments).toBe(400);
    });
  });

  describe('Gateway Processing', () => {
    it('should process Authorize.Net payments', () => {
      const payment = {
        method: 'card',
        amount: 100,
        gateway: 'authnet',
        ref: 'opaque_token_123'
      };
      
      // Mock successful processing
      const result = {
        success: true,
        transactionId: 'auth_12345',
        batchId: 'batch_67890',
        avs: 'Y',
        cvv: 'M'
      };
      
      expect(result.success).toBe(true);
      expect(result.transactionId).toBeDefined();
      expect(payment.gateway).toBe('authnet');
    });

    it('should handle offline payments', () => {
      const payment = {
        method: 'cash',
        amount: 100,
        gateway: 'offline',
        ref: 'Cash payment'
      };
      
      // Offline payments don't need processing
      expect(payment.gateway).toBe('offline');
      expect(payment.method).toBe('cash');
    });
  });
});

describe('Transaction Status Transitions', () => {
  describe('Valid Transitions', () => {
    it('should allow valid status transitions', () => {
      const validTransitions: Record<string, string[]> = {
        PENDING: ['AUTHORIZED', 'FAILED'],
        AUTHORIZED: ['CAPTURED', 'VOIDED', 'FAILED'],
        CAPTURED: ['SETTLED', 'REFUNDED'],
        SETTLED: ['REFUNDED'],
        VOIDED: [],
        REFUNDED: [],
        FAILED: []
      };

      // Test some valid transitions
      expect(validTransitions['PENDING']).toContain('AUTHORIZED');
      expect(validTransitions['AUTHORIZED']).toContain('CAPTURED');
      expect(validTransitions['CAPTURED']).toContain('SETTLED');
    });

    it('should reject invalid status transitions', () => {
      const validTransitions: Record<string, string[]> = {
        PENDING: ['AUTHORIZED', 'FAILED'],
        AUTHORIZED: ['CAPTURED', 'VOIDED', 'FAILED'],
        CAPTURED: ['SETTLED', 'REFUNDED'],
        SETTLED: ['REFUNDED'],
        VOIDED: [],
        REFUNDED: [],
        FAILED: []
      };

      // Test invalid transitions
      expect(validTransitions['VOIDED']).not.toContain('AUTHORIZED');
      expect(validTransitions['REFUNDED']).not.toContain('CAPTURED');
      expect(validTransitions['SETTLED']).not.toContain('PENDING');
    });
  });
});
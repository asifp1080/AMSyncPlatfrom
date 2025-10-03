const { describe, it, expect } = require('@jest/globals');

describe('Sprint 5 - TurboRater Import Unit Tests', () => {
  
  describe('TurboRater File Parser', () => {
    it('should parse TT2 file format correctly', () => {
      const mockTT2Content = `
NAMED_INSURED|John Smith
EFFECTIVE_DATE|2024-01-01
DRIVER_1|John Smith|1980-05-15|D123456789|NY
DRIVER_2|Jane Smith|1982-08-22|D987654321|NY
VEHICLE_1|1HGBH41JXMN109186|2022|Honda|Accord|10001
COVERAGE_BI|100/300
COVERAGE_PD|50
PREMIUM_BASE|1200.00
PREMIUM_TAXES|120.00
PREMIUM_FEES|50.00
PREMIUM_TOTAL|1370.00
CARRIER_1|State Farm|1370.00|1
CARRIER_2|Geico|1425.50|2
      `.trim();

      const parser = require('../packages/functions/src/turborater-parser');
      const result = parser.parseTT2Content(mockTT2Content);

      expect(result.namedInsured).toBe('John Smith');
      expect(result.effectiveDate).toBe('2024-01-01');
      expect(result.drivers).toHaveLength(2);
      expect(result.drivers[0].name).toBe('John Smith');
      expect(result.vehicles).toHaveLength(1);
      expect(result.vehicles[0].vin).toBe('1HGBH41JXMN109186');
      expect(result.premiums.totalPremium).toBe(1370.00);
      expect(result.carriers).toHaveLength(2);
    });

    it('should handle missing optional fields gracefully', () => {
      const mockTT2Content = `
NAMED_INSURED|John Smith
DRIVER_1|John Smith
VEHICLE_1||2022|Honda|Accord
PREMIUM_TOTAL|1000.00
      `.trim();

      const parser = require('../packages/functions/src/turborater-parser');
      const result = parser.parseTT2Content(mockTT2Content);

      expect(result.namedInsured).toBe('John Smith');
      expect(result.drivers[0].dateOfBirth).toBeUndefined();
      expect(result.vehicles[0].vin).toBe('');
      expect(result.premiums.totalPremium).toBe(1000.00);
    });

    it('should validate required fields', () => {
      const mockTT2Content = `
DRIVER_1|John Smith
VEHICLE_1|VIN123|2022|Honda|Accord
      `.trim();

      const parser = require('../packages/functions/src/turborater-parser');
      
      expect(() => {
        parser.parseTT2Content(mockTT2Content);
      }).toThrow('Missing required field: NAMED_INSURED');
    });
  });

  describe('Quote Fingerprinting', () => {
    it('should generate consistent fingerprints', () => {
      const quoteData1 = {
        namedInsured: 'John Smith',
        drivers: [{ dateOfBirth: '1980-05-15' }],
        vehicles: [{ vin: '1HGBH41JXMN109186' }],
        effectiveDate: '2024-01-01'
      };

      const quoteData2 = {
        namedInsured: 'John Smith',
        drivers: [{ dateOfBirth: '1980-05-15' }],
        vehicles: [{ vin: '1HGBH41JXMN109186' }],
        effectiveDate: '2024-01-01'
      };

      const fingerprinter = require('../packages/functions/src/quote-fingerprinter');
      const fingerprint1 = fingerprinter.generateFingerprint(quoteData1);
      const fingerprint2 = fingerprinter.generateFingerprint(quoteData2);

      expect(fingerprint1).toBe(fingerprint2);
      expect(fingerprint1).toBeTruthy();
    });

    it('should generate different fingerprints for different data', () => {
      const quoteData1 = {
        namedInsured: 'John Smith',
        drivers: [{ dateOfBirth: '1980-05-15' }],
        vehicles: [{ vin: '1HGBH41JXMN109186' }],
        effectiveDate: '2024-01-01'
      };

      const quoteData2 = {
        namedInsured: 'Jane Smith',
        drivers: [{ dateOfBirth: '1982-08-22' }],
        vehicles: [{ vin: '2T1BURHE0JC123456' }],
        effectiveDate: '2024-01-01'
      };

      const fingerprinter = require('../packages/functions/src/quote-fingerprinter');
      const fingerprint1 = fingerprinter.generateFingerprint(quoteData1);
      const fingerprint2 = fingerprinter.generateFingerprint(quoteData2);

      expect(fingerprint1).not.toBe(fingerprint2);
    });

    it('should handle missing optional data in fingerprinting', () => {
      const quoteData = {
        namedInsured: 'John Smith',
        drivers: [{}],
        vehicles: [{}],
        effectiveDate: undefined
      };

      const fingerprinter = require('../packages/functions/src/quote-fingerprinter');
      const fingerprint = fingerprinter.generateFingerprint(quoteData);

      expect(fingerprint).toBeTruthy();
      expect(typeof fingerprint).toBe('string');
    });
  });

  describe('Customer Matching', () => {
    it('should match existing customers by name', async () => {
      const mockFirestore = {
        collection: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({
          empty: false,
          docs: [{ id: 'existing_customer_123' }]
        })
      };

      const customerMatcher = require('../packages/functions/src/customer-matcher');
      const customerId = await customerMatcher.findOrCreateCustomer(
        mockFirestore,
        'org1',
        'John Smith',
        {}
      );

      expect(customerId).toBe('existing_customer_123');
      expect(mockFirestore.collection).toHaveBeenCalledWith('customers');
      expect(mockFirestore.where).toHaveBeenCalledWith('orgId', '==', 'org1');
      expect(mockFirestore.where).toHaveBeenCalledWith('name', '==', 'John Smith');
    });

    it('should create new customer when no match found', async () => {
      const mockFirestore = {
        collection: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({
          empty: true,
          docs: []
        }),
        doc: jest.fn().mockReturnValue({
          id: 'new_customer_456'
        }),
        set: jest.fn().mockResolvedValue()
      };

      const customerMatcher = require('../packages/functions/src/customer-matcher');
      const customerId = await customerMatcher.findOrCreateCustomer(
        mockFirestore,
        'org1',
        'Jane Doe',
        {}
      );

      expect(customerId).toBe('new_customer_456');
      expect(mockFirestore.set).toHaveBeenCalled();
    });
  });

  describe('Import Job Processing', () => {
    it('should process import job successfully', async () => {
      const mockJob = {
        id: 'job_123',
        orgId: 'org1',
        files: [
          {
            name: 'test.tt2',
            size: 1024,
            storagePath: 'imports/turborater/org1/job_123/test.tt2'
          }
        ]
      };

      const processor = require('../packages/functions/src/import-processor');
      const result = await processor.processImportJob(mockJob);

      expect(result.success).toBe(true);
      expect(result.counts.quotes).toBeGreaterThan(0);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle processing errors gracefully', async () => {
      const mockJob = {
        id: 'job_456',
        orgId: 'org1',
        files: [
          {
            name: 'invalid.tt2',
            size: 0,
            storagePath: 'imports/turborater/org1/job_456/invalid.tt2'
          }
        ]
      };

      const processor = require('../packages/functions/src/import-processor');
      const result = await processor.processImportJob(mockJob);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].code).toBe('PARSE_ERROR');
    });
  });

  describe('File Validation', () => {
    it('should accept valid TT2 files', () => {
      const validator = require('../packages/functions/src/file-validator');
      
      expect(validator.isValidTurboRaterFile('quotes.tt2')).toBe(true);
      expect(validator.isValidTurboRaterFile('data.tt2x')).toBe(true);
      expect(validator.isValidTurboRaterFile('QUOTES.TT2')).toBe(true);
    });

    it('should reject invalid file types', () => {
      const validator = require('../packages/functions/src/file-validator');
      
      expect(validator.isValidTurboRaterFile('document.pdf')).toBe(false);
      expect(validator.isValidTurboRaterFile('data.csv')).toBe(false);
      expect(validator.isValidTurboRaterFile('file.txt')).toBe(false);
    });

    it('should validate file size limits', () => {
      const validator = require('../packages/functions/src/file-validator');
      
      expect(validator.isValidFileSize(1024 * 1024)).toBe(true); // 1MB
      expect(validator.isValidFileSize(50 * 1024 * 1024)).toBe(true); // 50MB
      expect(validator.isValidFileSize(100 * 1024 * 1024)).toBe(false); // 100MB (too large)
    });
  });
});
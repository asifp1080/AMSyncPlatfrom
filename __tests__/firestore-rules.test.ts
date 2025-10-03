import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { 
  initializeTestEnvironment, 
  RulesTestEnvironment,
  assertFails,
  assertSucceeds 
} from '@firebase/rules-unit-testing';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'test-project',
    firestore: {
      rules: require('fs').readFileSync('firestore.rules', 'utf8'),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('Firestore Security Rules - Sprint 1', () => {
  describe('Multi-tenant Isolation', () => {
    it('should allow users to read documents from their own organization', async () => {
      const alice = testEnv.authenticatedContext('alice', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      // Seed data for org1
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('transactions').doc('tx1').set({
          orgId: 'org1',
          performedAtLocationId: 'loc1',
          amount: 100,
        });
      });

      await assertSucceeds(
        alice.firestore().collection('transactions').doc('tx1').get()
      );
    });

    it('should deny users from reading documents from other organizations', async () => {
      const alice = testEnv.authenticatedContext('alice', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      // Seed data for org2
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('transactions').doc('tx2').set({
          orgId: 'org2',
          performedAtLocationId: 'loc2',
          amount: 200,
        });
      });

      await assertFails(
        alice.firestore().collection('transactions').doc('tx2').get()
      );
    });
  });

  describe('Location-based Access Control', () => {
    it('should allow users to create transactions at allowed locations', async () => {
      const alice = testEnv.authenticatedContext('alice', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1', 'loc2'],
      });

      await assertSucceeds(
        alice.firestore().collection('transactions').doc('tx1').set({
          orgId: 'org1',
          performedAtLocationId: 'loc1',
          amount: 100,
          createdAt: new Date(),
        })
      );
    });

    it('should deny users from creating transactions at non-allowed locations', async () => {
      const alice = testEnv.authenticatedContext('alice', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      await assertFails(
        alice.firestore().collection('transactions').doc('tx1').set({
          orgId: 'org1',
          performedAtLocationId: 'loc2', // Not in allowedLocationIds
          amount: 100,
          createdAt: new Date(),
        })
      );
    });

    it('should allow users to update transactions at allowed locations', async () => {
      const alice = testEnv.authenticatedContext('alice', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1', 'loc2'],
      });

      // Seed existing transaction
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('transactions').doc('tx1').set({
          orgId: 'org1',
          performedAtLocationId: 'loc1',
          amount: 100,
        });
      });

      await assertSucceeds(
        alice.firestore().collection('transactions').doc('tx1').update({
          amount: 150,
          performedAtLocationId: 'loc2', // Moving to another allowed location
        })
      );
    });

    it('should deny users from updating transactions to non-allowed locations', async () => {
      const alice = testEnv.authenticatedContext('alice', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      // Seed existing transaction
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('transactions').doc('tx1').set({
          orgId: 'org1',
          performedAtLocationId: 'loc1',
          amount: 100,
        });
      });

      await assertFails(
        alice.firestore().collection('transactions').doc('tx1').update({
          performedAtLocationId: 'loc3', // Not in allowedLocationIds
        })
      );
    });
  });

  describe('Role-based Permissions', () => {
    it('should allow admins to create users', async () => {
      const admin = testEnv.authenticatedContext('admin', {
        orgId: 'org1',
        role: 'admin',
        allowedLocationIds: ['loc1'],
      });

      await assertSucceeds(
        admin.firestore().collection('users').doc('newuser').set({
          orgId: 'org1',
          role: 'agent',
          directLocationIds: ['loc1'],
          groupIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );
    });

    it('should deny agents from creating users', async () => {
      const agent = testEnv.authenticatedContext('agent', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      await assertFails(
        agent.firestore().collection('users').doc('newuser').set({
          orgId: 'org1',
          role: 'agent',
          directLocationIds: ['loc1'],
          groupIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );
    });

    it('should allow managers to create location groups', async () => {
      const manager = testEnv.authenticatedContext('manager', {
        orgId: 'org1',
        role: 'manager',
        allowedLocationIds: ['loc1', 'loc2'],
      });

      await assertSucceeds(
        manager.firestore().collection('locationGroups').doc('group1').set({
          orgId: 'org1',
          name: 'Sales Team',
          locationIds: ['loc1', 'loc2'],
          memberUserIds: ['user1'],
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );
    });

    it('should deny agents from creating location groups', async () => {
      const agent = testEnv.authenticatedContext('agent', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      await assertFails(
        agent.firestore().collection('locationGroups').doc('group1').set({
          orgId: 'org1',
          name: 'Sales Team',
          locationIds: ['loc1'],
          memberUserIds: ['user1'],
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );
    });

    it('should allow owners to update preferences', async () => {
      const owner = testEnv.authenticatedContext('owner', {
        orgId: 'org1',
        role: 'owner',
        allowedLocationIds: ['loc1'],
      });

      await assertSucceeds(
        owner.firestore().collection('preferences').doc('org1').set({
          brand: { name: 'Test Agency' },
          currency: 'USD',
          decimals: 2,
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          timezone: 'America/New_York',
        })
      );
    });

    it('should deny agents from updating preferences', async () => {
      const agent = testEnv.authenticatedContext('agent', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      await assertFails(
        agent.firestore().collection('preferences').doc('org1').set({
          brand: { name: 'Test Agency' },
          currency: 'USD',
          decimals: 2,
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          timezone: 'America/New_York',
        })
      );
    });
  });

  describe('Customer homeLocationId Protection', () => {
    it('should allow admins to change customer homeLocationId', async () => {
      const admin = testEnv.authenticatedContext('admin', {
        orgId: 'org1',
        role: 'admin',
        allowedLocationIds: ['loc1', 'loc2'],
      });

      // Seed existing customer
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('customers').doc('cust1').set({
          orgId: 'org1',
          homeLocationId: 'loc1',
          name: 'John Doe',
        });
      });

      await assertSucceeds(
        admin.firestore().collection('customers').doc('cust1').update({
          homeLocationId: 'loc2',
        })
      );
    });

    it('should deny non-admins from changing customer homeLocationId', async () => {
      const agent = testEnv.authenticatedContext('agent', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1', 'loc2'],
      });

      // Seed existing customer
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('customers').doc('cust1').set({
          orgId: 'org1',
          homeLocationId: 'loc1',
          name: 'John Doe',
        });
      });

      await assertFails(
        agent.firestore().collection('customers').doc('cust1').update({
          homeLocationId: 'loc2',
        })
      );
    });

    it('should allow non-admins to update customer data without changing homeLocationId', async () => {
      const agent = testEnv.authenticatedContext('agent', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      // Seed existing customer
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('customers').doc('cust1').set({
          orgId: 'org1',
          homeLocationId: 'loc1',
          name: 'John Doe',
          email: 'john@example.com',
        });
      });

      await assertSucceeds(
        agent.firestore().collection('customers').doc('cust1').update({
          email: 'john.doe@example.com',
          homeLocationId: 'loc1', // Same as before
        })
      );
    });
  });

  describe('User Self-Update Restrictions', () => {
    it('should allow users to update their own profile data', async () => {
      const alice = testEnv.authenticatedContext('alice', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      // Seed existing user
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('users').doc('alice').set({
          orgId: 'org1',
          role: 'agent',
          directLocationIds: ['loc1'],
          groupIds: [],
          name: 'Alice Smith',
          email: 'alice@example.com',
        });
      });

      await assertSucceeds(
        alice.firestore().collection('users').doc('alice').update({
          name: 'Alice Johnson',
          email: 'alice.johnson@example.com',
          role: 'agent', // Same as before
          directLocationIds: ['loc1'], // Same as before
          groupIds: [], // Same as before
        })
      );
    });

    it('should deny users from changing their own role', async () => {
      const alice = testEnv.authenticatedContext('alice', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      // Seed existing user
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('users').doc('alice').set({
          orgId: 'org1',
          role: 'agent',
          directLocationIds: ['loc1'],
          groupIds: [],
          name: 'Alice Smith',
        });
      });

      await assertFails(
        alice.firestore().collection('users').doc('alice').update({
          role: 'admin', // Trying to escalate privileges
        })
      );
    });

    it('should deny users from changing their own location access', async () => {
      const alice = testEnv.authenticatedContext('alice', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      // Seed existing user
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('users').doc('alice').set({
          orgId: 'org1',
          role: 'agent',
          directLocationIds: ['loc1'],
          groupIds: [],
          name: 'Alice Smith',
        });
      });

      await assertFails(
        alice.firestore().collection('users').doc('alice').update({
          directLocationIds: ['loc1', 'loc2'], // Trying to add more locations
        })
      );
    });
  });

  describe('Unauthenticated Access', () => {
    it('should deny all access to unauthenticated users', async () => {
      const unauth = testEnv.unauthenticatedContext();

      await assertFails(
        unauth.firestore().collection('transactions').doc('tx1').get()
      );

      await assertFails(
        unauth.firestore().collection('users').doc('user1').get()
      );

      await assertFails(
        unauth.firestore().collection('preferences').doc('org1').get()
      );
    });
  });

  describe('Transaction Security Rules', () => {
    it('should allow users to read transactions from their org', async () => {
      const alice = testEnv.authenticatedContext('alice', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('transactions').doc('txn1').set({
          orgId: 'org1',
          performedAtLocationId: 'loc1',
          amount: { grandTotal: 100 },
          status: 'PENDING',
        });
      });

      await assertSucceeds(
        alice.firestore().collection('transactions').doc('txn1').get()
      );
    });

    it('should deny users from reading transactions from other orgs', async () => {
      const alice = testEnv.authenticatedContext('alice', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('transactions').doc('txn1').set({
          orgId: 'org2',
          performedAtLocationId: 'loc1',
          amount: { grandTotal: 100 },
          status: 'PENDING',
        });
      });

      await assertFails(
        alice.firestore().collection('transactions').doc('txn1').get()
      );
    });

    it('should allow users to create transactions at allowed locations', async () => {
      const agent = testEnv.authenticatedContext('agent', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      await assertSucceeds(
        agent.firestore().collection('transactions').doc('txn1').set({
          orgId: 'org1',
          performedAtLocationId: 'loc1',
          locationId: 'loc1',
          policyRef: 'pol1',
          customerRef: 'cust1',
          userRef: 'agent',
          type: 'NEW',
          fees: [],
          payments: [],
          amount: { grandTotal: 100, currency: 'USD' },
          status: 'PENDING',
          receipt: { number: 1 },
        })
      );
    });

    it('should deny users from creating transactions at disallowed locations', async () => {
      const agent = testEnv.authenticatedContext('agent', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      await assertFails(
        agent.firestore().collection('transactions').doc('txn1').set({
          orgId: 'org1',
          performedAtLocationId: 'loc2', // Not in allowedLocationIds
          locationId: 'loc1',
          policyRef: 'pol1',
          customerRef: 'cust1',
          userRef: 'agent',
          type: 'NEW',
          fees: [],
          payments: [],
          amount: { grandTotal: 100, currency: 'USD' },
          status: 'PENDING',
          receipt: { number: 1 },
        })
      );
    });
  });

  describe('Counter Security Rules', () => {
    it('should allow users to read receipt counters for their org', async () => {
      const alice = testEnv.authenticatedContext('alice', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('counters').doc('org1_receipt').set({
          id: 'org1_receipt',
          value: 100,
          updatedAt: new Date(),
        });
      });

      await assertSucceeds(
        alice.firestore().collection('counters').doc('org1_receipt').get()
      );
    });

    it('should deny users from reading receipt counters for other orgs', async () => {
      const alice = testEnv.authenticatedContext('alice', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1'],
      });

      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('counters').doc('org2_receipt').set({
          id: 'org2_receipt',
          value: 100,
          updatedAt: new Date(),
        });
      });

      await assertFails(
        alice.firestore().collection('counters').doc('org2_receipt').get()
      );
    });

    it('should deny all users from writing to counters', async () => {
      const admin = testEnv.authenticatedContext('admin', {
        orgId: 'org1',
        role: 'admin',
        allowedLocationIds: ['loc1'],
      });

      await assertFails(
        admin.firestore().collection('counters').doc('org1_receipt').set({
          id: 'org1_receipt',
          value: 100,
          updatedAt: new Date(),
        })
      );
    });
  });
});
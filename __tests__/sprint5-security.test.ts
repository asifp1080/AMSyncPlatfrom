const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals');
const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');

describe('Sprint 5 - TurboRater Import Security Rules', () => {
  let testEnv;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'amsync-test',
      firestore: {
        rules: require('fs').readFileSync('firestore.rules', 'utf8'),
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  describe('Import Jobs Collection', () => {
    it('should allow managers to read import jobs in their org', async () => {
      const managerContext = testEnv.authenticatedContext('manager1', {
        orgId: 'org1',
        role: 'manager',
        allowedLocationIds: ['loc1']
      });

      await assertSucceeds(
        managerContext.firestore()
          .collection('importJobs')
          .doc('job1')
          .get()
      );
    });

    it('should allow users to create import jobs in their org', async () => {
      const managerContext = testEnv.authenticatedContext('manager1', {
        orgId: 'org1',
        role: 'manager',
        allowedLocationIds: ['loc1']
      });

      await assertSucceeds(
        managerContext.firestore()
          .collection('importJobs')
          .doc('job1')
          .set({
            id: 'job1',
            orgId: 'org1',
            type: 'turborater',
            status: 'PENDING',
            files: [],
            startedAt: new Date(),
            createdBy: 'manager1'
          })
      );
    });

    it('should deny cross-org access to import jobs', async () => {
      const managerContext = testEnv.authenticatedContext('manager1', {
        orgId: 'org1',
        role: 'manager',
        allowedLocationIds: ['loc1']
      });

      await assertFails(
        managerContext.firestore()
          .collection('importJobs')
          .doc('job2')
          .get()
      );
    });

    it('should deny agents from accessing import jobs', async () => {
      const agentContext = testEnv.authenticatedContext('agent1', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1']
      });

      await assertFails(
        agentContext.firestore()
          .collection('importJobs')
          .doc('job1')
          .get()
      );
    });

    it('should deny direct updates to import jobs', async () => {
      const managerContext = testEnv.authenticatedContext('manager1', {
        orgId: 'org1',
        role: 'manager',
        allowedLocationIds: ['loc1']
      });

      await assertFails(
        managerContext.firestore()
          .collection('importJobs')
          .doc('job1')
          .update({
            status: 'SUCCESS'
          })
      );
    });
  });

  describe('Quotes Collection', () => {
    it('should allow managers to read quotes in their org', async () => {
      const managerContext = testEnv.authenticatedContext('manager1', {
        orgId: 'org1',
        role: 'manager',
        allowedLocationIds: ['loc1']
      });

      await assertSucceeds(
        managerContext.firestore()
          .collection('quotes')
          .doc('quote1')
          .get()
      );
    });

    it('should deny cross-org access to quotes', async () => {
      const managerContext = testEnv.authenticatedContext('manager1', {
        orgId: 'org1',
        role: 'manager',
        allowedLocationIds: ['loc1']
      });

      await assertFails(
        managerContext.firestore()
          .collection('quotes')
          .doc('quote2')
          .get()
      );
    });

    it('should deny agents from accessing quotes', async () => {
      const agentContext = testEnv.authenticatedContext('agent1', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1']
      });

      await assertFails(
        agentContext.firestore()
          .collection('quotes')
          .doc('quote1')
          .get()
      );
    });

    it('should deny direct writes to quotes collection', async () => {
      const managerContext = testEnv.authenticatedContext('manager1', {
        orgId: 'org1',
        role: 'manager',
        allowedLocationIds: ['loc1']
      });

      await assertFails(
        managerContext.firestore()
          .collection('quotes')
          .doc('quote1')
          .set({
            id: 'quote1',
            orgId: 'org1',
            customerRef: 'cust1',
            source: 'turborater'
          })
      );
    });
  });

  describe('TurboRater Uploads', () => {
    it('should allow managers to upload files', async () => {
      const managerContext = testEnv.authenticatedContext('manager1', {
        orgId: 'org1',
        role: 'manager',
        allowedLocationIds: ['loc1']
      });

      await assertSucceeds(
        managerContext.firestore()
          .collection('turboraterUploads')
          .doc('org1')
          .collection('uploads')
          .doc('upload1')
          .set({
            fileName: 'test.tt2',
            uploadedAt: new Date(),
            status: 'pending'
          })
      );
    });

    it('should deny cross-org upload access', async () => {
      const managerContext = testEnv.authenticatedContext('manager1', {
        orgId: 'org1',
        role: 'manager',
        allowedLocationIds: ['loc1']
      });

      await assertFails(
        managerContext.firestore()
          .collection('turboraterUploads')
          .doc('org2')
          .collection('uploads')
          .doc('upload1')
          .set({
            fileName: 'test.tt2',
            uploadedAt: new Date(),
            status: 'pending'
          })
      );
    });

    it('should deny agents from uploading files', async () => {
      const agentContext = testEnv.authenticatedContext('agent1', {
        orgId: 'org1',
        role: 'agent',
        allowedLocationIds: ['loc1']
      });

      await assertFails(
        agentContext.firestore()
          .collection('turboraterUploads')
          .doc('org1')
          .collection('uploads')
          .doc('upload1')
          .set({
            fileName: 'test.tt2',
            uploadedAt: new Date(),
            status: 'pending'
          })
      );
    });
  });
});
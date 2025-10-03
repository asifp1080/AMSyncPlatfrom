import { onCall, onDocumentWritten, onSchedule, onRequest } from "firebase-functions/v2/firestore";
import { onUserCreated } from "firebase-functions/v2/identity";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import { FieldValue } from "firebase-admin/firestore";

// Initialize Firebase Admin
initializeApp();

const auth = getAuth();
const db = getFirestore();

interface User {
  id: string;
  orgId: string;
  entityId?: string;
  role: "owner" | "admin" | "manager" | "agent";
  directLocationIds: string[];
  groupIds: string[];
  managerUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LocationGroup {
  id: string;
  orgId: string;
  name: string;
  locationIds: string[];
  memberUserIds: string[];
  managerUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomClaims {
  orgId: string;
  entityId?: string;
  allowedLocationIds: string[];
  role: string;
}

interface OrgBilling {
  orgId: string;
  stripeCustomerId: string;
  subscription?: {
    id: string;
    status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
    priceId: string;
    currentPeriodEnd?: Date;
  };
  history?: Array<{
    invoiceId: string;
    amount: number;
    paidAt?: Date;
    status: string;
  }>;
  updatedAt: Date;
}

interface Communication {
  id: string;
  orgId: string;
  type: 'email' | 'sms';
  template: string;
  to: string;
  subject?: string;
  variables?: Record<string, unknown>;
  related?: {
    txnId?: string;
    policyId?: string;
    customerId?: string;
  };
  status: 'QUEUED' | 'SENT' | 'FAILED';
  providerId?: string;
  error?: string;
  createdAt: Date;
  sentAt?: Date;
}

// ============= SPRINT 5: TURBORATER IMPORT FUNCTIONS =============

/**
 * Upload TurboRater Files
 */
export const uploadTurboRaterFiles = onCall(async (request) => {
  const { files } = request.data;
  const orgId = request.auth?.token?.orgId;
  const userId = request.auth?.uid;

  if (!orgId || !userId) {
    throw new Error("Organization ID and user authentication required");
  }

  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new Error("At least one file is required");
  }

  try {
    // Validate file extensions
    const validExtensions = ['.tt2', '.tt2x'];
    const invalidFiles = files.filter(file => 
      !validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (invalidFiles.length > 0) {
      throw new Error(`Invalid file types. Only .tt2 and .tt2x files are supported. Invalid files: ${invalidFiles.map(f => f.name).join(', ')}`);
    }

    // Create import job
    const jobId = db.collection("importJobs").doc().id;
    const importJob = {
      id: jobId,
      orgId,
      type: 'turborater' as const,
      status: 'PENDING' as const,
      files: files.map(file => ({
        name: file.name,
        size: file.size,
        controlId: file.controlId,
        storagePath: `imports/turborater/${orgId}/${jobId}/${file.name}`
      })),
      startedAt: new Date(),
      createdBy: userId
    };

    await db.collection("importJobs").doc(jobId).set(importJob);

    // In a real implementation, files would be uploaded to Cloud Storage here
    // For demo purposes, we'll simulate the upload and trigger processing
    setTimeout(() => processTurboRaterImport(jobId), 2000);

    return {
      success: true,
      jobId,
      message: "Files uploaded successfully. Processing will begin shortly."
    };

  } catch (error) {
    console.error("Error uploading TurboRater files:", error);
    throw new Error(`Failed to upload files: ${error}`);
  }
});

/**
 * Process TurboRater Import (triggered by Storage upload)
 */
async function processTurboRaterImport(jobId: string): Promise<void> {
  try {
    console.log(`Processing TurboRater import job: ${jobId}`);

    // Update job status to processing
    await db.collection("importJobs").doc(jobId).update({
      status: 'PROCESSING'
    });

    const jobDoc = await db.collection("importJobs").doc(jobId).get();
    if (!jobDoc.exists) {
      throw new Error(`Import job ${jobId} not found`);
    }

    const job = jobDoc.data() as ImportJob;
    const counts = { customers: 0, drivers: 0, vehicles: 0, quotes: 0 };
    const errors: Array<{ file: string; line?: number; code: string; message: string }> = [];

    // Process each file
    for (const file of job.files) {
      try {
        console.log(`Processing file: ${file.name}`);
        
        // Parse TurboTags 2.0 file (mock implementation)
        const parsedData = await parseTurboRaterFile(file.storagePath);
        
        // Create quote from parsed data
        const quote = await createQuoteFromTurboRaterData(job.orgId, parsedData, file.name);
        
        if (quote) {
          counts.quotes++;
          counts.customers++;
          counts.drivers += parsedData.drivers.length;
          counts.vehicles += parsedData.vehicles.length;
        }

      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError);
        errors.push({
          file: file.name,
          code: 'PARSE_ERROR',
          message: fileError.toString()
        });
      }
    }

    // Update job with results
    await db.collection("importJobs").doc(jobId).update({
      status: errors.length > 0 && counts.quotes === 0 ? 'FAILED' : 'SUCCESS',
      counts,
      errors: errors.length > 0 ? errors : undefined,
      finishedAt: new Date()
    });

    console.log(`Import job ${jobId} completed. Processed ${counts.quotes} quotes.`);

  } catch (error) {
    console.error(`Import job ${jobId} failed:`, error);
    
    await db.collection("importJobs").doc(jobId).update({
      status: 'FAILED',
      errors: [{
        file: 'system',
        code: 'PROCESSING_ERROR',
        message: error.toString()
      }],
      finishedAt: new Date()
    });
  }
}

/**
 * Parse TurboRater TT2/TT2X file
 */
async function parseTurboRaterFile(storagePath: string): Promise<TurboRaterFile> {
  // Mock implementation - in reality would read from Cloud Storage
  console.log(`Parsing TurboRater file: ${storagePath}`);
  
  // Simulate parsing a TurboTags 2.0 file
  const mockData: TurboRaterFile = {
    controlNumber: `CTRL_${Date.now()}`,
    namedInsured: "John Smith",
    effectiveDate: new Date().toISOString().split('T')[0],
    drivers: [
      {
        name: "John Smith",
        dateOfBirth: "1980-05-15",
        licenseNumber: "D123456789",
        licenseState: "NY"
      },
      {
        name: "Jane Smith", 
        dateOfBirth: "1982-08-22",
        licenseNumber: "D987654321",
        licenseState: "NY"
      }
    ],
    vehicles: [
      {
        vin: "1HGBH41JXMN109186",
        year: "2022",
        make: "Honda",
        model: "Accord",
        garagingZip: "10001"
      }
    ],
    coverages: {
      "BI": "100/300",
      "PD": "50",
      "COMP": "500",
      "COLL": "500"
    },
    premiums: {
      "basePremium": 1200.00,
      "taxes": 120.00,
      "fees": 50.00,
      "totalPremium": 1370.00
    },
    carriers: [
      { name: "State Farm", premium: 1370.00, rank: 1 },
      { name: "Geico", premium: 1425.50, rank: 2 },
      { name: "Progressive", premium: 1489.75, rank: 3 }
    ]
  };

  return mockData;
}

/**
 * Create Quote from TurboRater data
 */
async function createQuoteFromTurboRaterData(
  orgId: string, 
  data: TurboRaterFile, 
  fileName: string
): Promise<Quote | null> {
  try {
    // Generate quote fingerprint for deduplication
    const fingerprintData = [
      data.namedInsured,
      data.drivers[0]?.dateOfBirth || '',
      data.vehicles[0]?.vin || '',
      data.effectiveDate || ''
    ].join('|');
    
    const quoteFingerprint = Buffer.from(fingerprintData).toString('base64');

    // Check for existing quote with same fingerprint
    const existingQuoteQuery = await db.collection("quotes")
      .where("orgId", "==", orgId)
      .where("quoteFingerprint", "==", quoteFingerprint)
      .limit(1)
      .get();

    if (!existingQuoteQuery.empty) {
      console.log(`Duplicate quote found for fingerprint: ${quoteFingerprint}`);
      // Update existing quote instead of creating new one
      const existingQuoteId = existingQuoteQuery.docs[0].id;
      await db.collection("quotes").doc(existingQuoteId).update({
        importedAt: new Date(),
        premiumBreakdown: {
          basePremium: data.premiums.basePremium || 0,
          taxes: data.premiums.taxes || 0,
          fees: data.premiums.fees || 0,
          totalPremium: data.premiums.totalPremium || 0
        },
        marketResults: data.carriers || []
      });
      return existingQuoteQuery.docs[0].data() as Quote;
    }

    // Create new quote
    const quoteId = db.collection("quotes").doc().id;
    
    // Find or create customer
    const customerRef = await findOrCreateCustomer(orgId, data.namedInsured, data);

    const quote: Quote = {
      id: quoteId,
      orgId,
      customerRef,
      drivers: data.drivers.map((driver, index) => ({
        id: `driver_${index + 1}`,
        name: driver.name,
        dateOfBirth: driver.dateOfBirth,
        licenseNumber: driver.licenseNumber,
        licenseState: driver.licenseState,
        incidents: [] // Would be parsed from TT2 file
      })),
      vehicles: data.vehicles.map((vehicle, index) => ({
        id: `vehicle_${index + 1}`,
        vin: vehicle.vin,
        year: vehicle.year ? parseInt(vehicle.year) : undefined,
        make: vehicle.make,
        model: vehicle.model,
        garagingZip: vehicle.garagingZip
      })),
      coverages: Object.entries(data.coverages).map(([type, limit]) => ({
        type,
        limit,
        deductible: undefined // Would be parsed from TT2 file
      })),
      premiumBreakdown: {
        basePremium: data.premiums.basePremium || 0,
        taxes: data.premiums.taxes || 0,
        fees: data.premiums.fees || 0,
        totalPremium: data.premiums.totalPremium || 0
      },
      marketResults: data.carriers || [],
      source: 'turborater',
      importedAt: new Date(),
      quoteFingerprint,
      effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : undefined,
      namedInsured: {
        name: data.namedInsured,
        // Additional address info would be parsed from TT2 file
      }
    };

    await db.collection("quotes").doc(quoteId).set(quote);
    console.log(`Created quote ${quoteId} for ${data.namedInsured}`);
    
    return quote;

  } catch (error) {
    console.error("Error creating quote from TurboRater data:", error);
    throw error;
  }
}

/**
 * Find or create customer for quote
 */
async function findOrCreateCustomer(
  orgId: string, 
  namedInsured: string, 
  data: TurboRaterFile
): Promise<string> {
  // Try to find existing customer by name
  const existingCustomerQuery = await db.collection("customers")
    .where("orgId", "==", orgId)
    .where("name", "==", namedInsured)
    .limit(1)
    .get();

  if (!existingCustomerQuery.empty) {
    return existingCustomerQuery.docs[0].id;
  }

  // Create new customer
  const customerId = db.collection("customers").doc().id;
  const customer = {
    id: customerId,
    orgId,
    name: namedInsured,
    email: "", // Would be parsed from TT2 if available
    phone: "", // Would be parsed from TT2 if available
    homeLocationId: "", // Would need to be determined
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await db.collection("customers").doc(customerId).set(customer);
  return customerId;
}

/**
 * Get Import Jobs for Organization
 */
export const getImportJobs = onCall(async (request) => {
  const orgId = request.auth?.token?.orgId;

  if (!orgId) {
    throw new Error("Organization ID is required");
  }

  try {
    const jobsQuery = await db.collection("importJobs")
      .where("orgId", "==", orgId)
      .orderBy("startedAt", "desc")
      .limit(50)
      .get();

    const jobs = jobsQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      jobs
    };

  } catch (error) {
    console.error("Error fetching import jobs:", error);
    throw new Error(`Failed to fetch import jobs: ${error}`);
  }
});

/**
 * Get Quotes for Customer
 */
export const getCustomerQuotes = onCall(async (request) => {
  const { customerId } = request.data;
  const orgId = request.auth?.token?.orgId;

  if (!orgId || !customerId) {
    throw new Error("Organization ID and customer ID are required");
  }

  try {
    const quotesQuery = await db.collection("quotes")
      .where("orgId", "==", orgId)
      .where("customerRef", "==", customerId)
      .orderBy("importedAt", "desc")
      .get();

    const quotes = quotesQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      quotes
    };

  } catch (error) {
    console.error("Error fetching customer quotes:", error);
    throw new Error(`Failed to fetch customer quotes: ${error}`);
  }
});

/**
 * Export Import Errors CSV
 */
export const exportImportErrors = onCall(async (request) => {
  const { jobId } = request.data;
  const orgId = request.auth?.token?.orgId;

  if (!orgId || !jobId) {
    throw new Error("Organization ID and job ID are required");
  }

  try {
    const jobDoc = await db.collection("importJobs").doc(jobId).get();
    
    if (!jobDoc.exists) {
      throw new Error("Import job not found");
    }

    const job = jobDoc.data() as ImportJob;
    
    if (job.orgId !== orgId) {
      throw new Error("Access denied");
    }

    if (!job.errors || job.errors.length === 0) {
      throw new Error("No errors found for this job");
    }

    // Generate CSV content
    const headers = ['File', 'Line', 'Error Code', 'Message'];
    const rows = job.errors.map(error => [
      error.file,
      error.line?.toString() || '',
      error.code,
      error.message
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // In a real implementation, this would upload to Cloud Storage
    const downloadUrl = `https://storage.googleapis.com/exports/${orgId}/import-errors-${jobId}.csv`;

    return {
      success: true,
      downloadUrl,
      csvContent // For demo purposes
    };

  } catch (error) {
    console.error("Error exporting import errors:", error);
    throw new Error(`Failed to export errors: ${error}`);
  }
});

/**
 * Resolves user claims by merging direct location IDs with group location IDs
 */
async function resolveUserClaims(userId: string): Promise<void> {
  try {
    // Get user document
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      console.error(`User ${userId} not found`);
      return;
    }

    const user = userDoc.data() as User;

    // Start with direct location IDs
    let allowedLocationIds = [...user.directLocationIds];

    // Get all location groups for this user
    if (user.groupIds && user.groupIds.length > 0) {
      const groupsQuery = await db
        .collection("locationGroups")
        .where("id", "in", user.groupIds)
        .where("orgId", "==", user.orgId)
        .get();

      // Merge location IDs from all groups
      groupsQuery.docs.forEach((groupDoc) => {
        const group = groupDoc.data() as LocationGroup;
        allowedLocationIds = [...allowedLocationIds, ...group.locationIds];
      });
    }

    // Remove duplicates
    allowedLocationIds = [...new Set(allowedLocationIds)];

    // Create custom claims
    const customClaims: CustomClaims = {
      orgId: user.orgId,
      entityId: user.entityId,
      allowedLocationIds,
      role: user.role,
    };

    // Set custom claims in Firebase Auth
    await auth.setCustomUserClaims(userId, customClaims);

    console.log(`Claims resolved for user ${userId}:`, customClaims);
  } catch (error) {
    console.error(`Error resolving claims for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Resolves claims for all users in a location group
 */
async function resolveGroupMemberClaims(groupId: string): Promise<void> {
  try {
    // Get the group document
    const groupDoc = await db.collection("locationGroups").doc(groupId).get();
    if (!groupDoc.exists) {
      console.error(`Location group ${groupId} not found`);
      return;
    }

    const group = groupDoc.data() as LocationGroup;

    // Resolve claims for all members
    const promises = group.memberUserIds.map((userId) =>
      resolveUserClaims(userId),
    );
    await Promise.all(promises);

    console.log(`Claims resolved for all members of group ${groupId}`);
  } catch (error) {
    console.error(`Error resolving group member claims for ${groupId}:`, error);
    throw error;
  }
}

/**
 * Increment receipt counter atomically
 */
async function incrementReceiptCounter(orgId: string): Promise<number> {
  const counterId = `${orgId}_receipt`;
  const counterRef = db.collection("counters").doc(counterId);
  
  return await db.runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    
    let newValue = 1;
    if (counterDoc.exists) {
      const currentValue = counterDoc.data()?.value || 0;
      newValue = currentValue + 1;
    }
    
    transaction.set(counterRef, {
      id: counterId,
      value: newValue,
      updatedAt: new Date()
    }, { merge: true });
    
    return newValue;
  });
}

/**
 * Generate PDF receipt (placeholder - would integrate with PDF generation service)
 */
async function generateReceiptPDF(transaction: any): Promise<string> {
  // This would integrate with a PDF generation service
  // For now, return a placeholder URL
  const receiptUrl = `https://storage.googleapis.com/receipts/${transaction.orgId}/${transaction.id}.pdf`;
  
  // TODO: Implement actual PDF generation with brand preferences
  // - Fetch organization preferences for branding
  // - Generate HTML template with transaction data
  // - Convert HTML to PDF
  // - Upload to Cloud Storage
  // - Return public URL
  
  return receiptUrl;
}

/**
 * Process Authorize.Net payment (placeholder)
 */
async function processAuthorizeNetPayment(paymentData: any): Promise<any> {
  // This would integrate with Authorize.Net API
  // For now, return mock success response
  return {
    success: true,
    transactionId: `auth_${Date.now()}`,
    batchId: `batch_${Date.now()}`,
    avs: "Y",
    cvv: "M"
  };
}

/**
 * Void Authorize.Net transaction
 */
async function voidAuthorizeNetTransaction(transactionId: string): Promise<any> {
  // This would call Authorize.Net void API
  return {
    success: true,
    transactionId,
    status: "VOIDED"
  };
}

/**
 * Refund Authorize.Net transaction
 */
async function refundAuthorizeNetTransaction(transactionId: string, amount: number): Promise<any> {
  // This would call Authorize.Net refund API
  return {
    success: true,
    transactionId,
    refundId: `refund_${Date.now()}`,
    amount,
    status: "REFUNDED"
  };
}

// ============= STRIPE BILLING FUNCTIONS =============

/**
 * Create Stripe Checkout Session
 */
export const createCheckoutSession = onCall(async (request) => {
  const { orgId, priceId } = request.data;
  
  if (!orgId || !priceId) {
    throw new Error("orgId and priceId are required");
  }

  try {
    // Get or create Stripe customer
    let billing = await db.collection("orgBilling").doc(orgId).get();
    let stripeCustomerId: string;
    
    if (billing.exists && billing.data()?.stripeCustomerId) {
      stripeCustomerId = billing.data()!.stripeCustomerId;
    } else {
      // Create new Stripe customer (placeholder)
      stripeCustomerId = `cus_${Date.now()}`;
      
      await db.collection("orgBilling").doc(orgId).set({
        orgId,
        stripeCustomerId,
        updatedAt: new Date()
      }, { merge: true });
    }
    
    // Create checkout session (placeholder)
    const sessionId = `cs_${Date.now()}`;
    const checkoutUrl = `https://checkout.stripe.com/pay/${sessionId}`;
    
    return {
      success: true,
      sessionId,
      url: checkoutUrl
    };
    
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error(`Failed to create checkout session: ${error}`);
  }
});

/**
 * Create Stripe Customer Portal Session
 */
export const createPortalSession = onCall(async (request) => {
  const { orgId } = request.data;
  
  if (!orgId) {
    throw new Error("orgId is required");
  }

  try {
    const billing = await db.collection("orgBilling").doc(orgId).get();
    
    if (!billing.exists || !billing.data()?.stripeCustomerId) {
      throw new Error("No billing account found");
    }
    
    // Create portal session (placeholder)
    const sessionId = `pcs_${Date.now()}`;
    const portalUrl = `https://billing.stripe.com/p/session/${sessionId}`;
    
    return {
      success: true,
      url: portalUrl
    };
    
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw new Error(`Failed to create portal session: ${error}`);
  }
});

/**
 * Stripe Webhook Handler
 */
export const stripeWebhook = onRequest(async (req, res) => {
  try {
    const event = req.body;
    
    // Verify webhook signature (placeholder)
    // const sig = req.headers['stripe-signature'];
    // const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    console.log(`Processing Stripe webhook: ${event.type}`);
    
    switch (event.type) {
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    res.status(400).send(`Webhook error: ${error}`);
  }
});

async function handleInvoicePaid(invoice: any) {
  const customerId = invoice.customer;
  const orgId = await getOrgIdFromStripeCustomer(customerId);
  
  if (!orgId) return;
  
  const historyEntry = {
    invoiceId: invoice.id,
    amount: invoice.amount_paid / 100,
    paidAt: new Date(invoice.status_transitions.paid_at * 1000),
    status: 'paid'
  };
  
  await db.collection("orgBilling").doc(orgId).update({
    history: FieldValue.arrayUnion(historyEntry),
    updatedAt: new Date()
  });
}

async function handleInvoicePaymentFailed(invoice: any) {
  const customerId = invoice.customer;
  const orgId = await getOrgIdFromStripeCustomer(customerId);
  
  if (!orgId) return;
  
  // Send notification about payment failure
  await sendNotification({
    orgId,
    type: 'email',
    template: 'billing_payment_failed',
    to: 'billing@example.com', // Would get from org settings
    variables: {
      invoiceId: invoice.id,
      amount: invoice.amount_due / 100,
      dueDate: new Date(invoice.due_date * 1000)
    }
  });
  
  const historyEntry = {
    invoiceId: invoice.id,
    amount: invoice.amount_due / 100,
    status: 'failed'
  };
  
  await db.collection("orgBilling").doc(orgId).update({
    history: FieldValue.arrayUnion(historyEntry),
    updatedAt: new Date()
  });
}

async function handleSubscriptionChange(subscription: any) {
  const customerId = subscription.customer;
  const orgId = await getOrgIdFromStripeCustomer(customerId);
  
  if (!orgId) return;
  
  const subscriptionData = {
    id: subscription.id,
    status: subscription.status,
    priceId: subscription.items.data[0]?.price?.id,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000)
  };
  
  await db.collection("orgBilling").doc(orgId).update({
    subscription: subscriptionData,
    updatedAt: new Date()
  });
}

async function getOrgIdFromStripeCustomer(customerId: string): Promise<string | null> {
  const billingQuery = await db.collection("orgBilling")
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();
    
  if (billingQuery.empty) return null;
  
  return billingQuery.docs[0].data().orgId;
}

// ============= NOTIFICATION FUNCTIONS =============

/**
 * Send Email Notification
 */
export const sendEmail = onCall(async (request) => {
  const { template, to, variables, related } = request.data;
  
  return await sendNotification({
    orgId: request.auth?.token?.orgId,
    type: 'email',
    template,
    to,
    variables,
    related
  });
});

/**
 * Send SMS Notification
 */
export const sendSMS = onCall(async (request) => {
  const { template, to, variables, related } = request.data;
  
  return await sendNotification({
    orgId: request.auth?.token?.orgId,
    type: 'sms',
    template,
    to,
    variables,
    related
  });
});

async function sendNotification(params: {
  orgId: string;
  type: 'email' | 'sms';
  template: string;
  to: string;
  variables?: Record<string, unknown>;
  related?: {
    txnId?: string;
    policyId?: string;
    customerId?: string;
  };
}): Promise<{ success: boolean; communicationId: string }> {
  
  const { orgId, type, template, to, variables, related } = params;
  
  // Check notification preferences
  const prefsDoc = await db.collection("preferences").doc(orgId).get();
  const prefs = prefsDoc.data()?.notifications;
  
  if (!prefs || (type === 'email' && !prefs.emailEnabled) || (type === 'sms' && !prefs.smsEnabled)) {
    throw new Error(`${type} notifications are disabled for this organization`);
  }
  
  // Create communication record
  const communicationId = db.collection("communications").doc().id;
  const communication: Communication = {
    id: communicationId,
    orgId,
    type,
    template,
    to,
    variables,
    related,
    status: 'QUEUED',
    createdAt: new Date()
  };
  
  await db.collection("communications").doc(communicationId).set(communication);
  
  try {
    let providerId: string;
    
    if (type === 'email') {
      providerId = await sendEmailViaLoops(template, to, variables, prefs);
    } else {
      providerId = await sendSMSViaTwilio(template, to, variables);
    }
    
    // Update communication record
    await db.collection("communications").doc(communicationId).update({
      status: 'SENT',
      providerId,
      sentAt: new Date()
    });
    
    return { success: true, communicationId };
    
  } catch (error) {
    // Update communication record with error
    await db.collection("communications").doc(communicationId).update({
      status: 'FAILED',
      error: error.toString()
    });
    
    throw error;
  }
}

async function sendEmailViaLoops(template: string, to: string, variables?: Record<string, unknown>, prefs?: any): Promise<string> {
  // Placeholder for Loops API integration
  console.log(`Sending email via Loops: ${template} to ${to}`);
  
  // Would make actual API call to Loops here
  // const response = await fetch('https://app.loops.so/api/v1/transactional', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     transactionalId: template,
  //     email: to,
  //     dataVariables: variables
  //   })
  // });
  
  return `loops_${Date.now()}`;
}

async function sendSMSViaTwilio(template: string, to: string, variables?: Record<string, unknown>): Promise<string> {
  // Placeholder for Twilio API integration
  console.log(`Sending SMS via Twilio: ${template} to ${to}`);
  
  // Would make actual API call to Twilio here
  // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  // const message = await client.messages.create({
  //   body: renderTemplate(template, variables),
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: to
  // });
  
  return `twilio_${Date.now()}`;
}

// ============= REPORTING FUNCTIONS =============

/**
 * Generate Daily Reports (Scheduled Function)
 */
export const generateDailyReports = onSchedule("0 2 * * *", async (event) => {
  console.log("Starting daily report generation");
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const today = new Date(yesterday);
  today.setDate(today.getDate() + 1);
  
  // Get all organizations
  const orgsQuery = await db.collection("organizations").get();
  
  for (const orgDoc of orgsQuery.docs) {
    const orgId = orgDoc.id;
    
    try {
      await generateDailyReportForOrg(orgId, yesterday);
      await updateMonthlyReportForOrg(orgId, yesterday);
    } catch (error) {
      console.error(`Error generating reports for org ${orgId}:`, error);
    }
  }
  
  console.log("Daily report generation completed");
});

async function generateDailyReportForOrg(orgId: string, date: Date): Promise<void> {
  const dateStr = date.toISOString().split('T')[0];
  const reportId = `${orgId}_${dateStr.replace(/-/g, '')}`;
  
  // Check if report already exists
  const existingReport = await db.collection("reports").doc("daily").collection("data").doc(reportId).get();
  if (existingReport.exists) {
    console.log(`Daily report already exists for ${orgId} on ${dateStr}`);
    return;
  }
  
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  // Query transactions for the day
  const txnsQuery = await db.collection("transactions")
    .where("orgId", "==", orgId)
    .where("createdAt", ">=", date)
    .where("createdAt", "<", nextDay)
    .get();
  
  // Initialize counters
  const totals = { count: 0, amount: 0, fees: 0, taxes: 0 };
  const byMethod = { card: 0, ach: 0, cash: 0, check: 0 };
  const byType = { NEW: 0, RENEWAL: 0, ENDORSEMENT: 0, CANCELLATION: 0, REINSTATEMENT: 0 };
  const batchIds: string[] = [];
  
  // Process transactions
  txnsQuery.docs.forEach(doc => {
    const txn = doc.data();
    
    totals.count++;
    totals.amount += txn.amount.grandTotal || 0;
    totals.fees += txn.amount.feesTotal || 0;
    totals.taxes += txn.amount.taxTotal || 0;
    
    // Count by payment method
    txn.payments?.forEach((payment: any) => {
      if (byMethod[payment.method as keyof typeof byMethod] !== undefined) {
        byMethod[payment.method as keyof typeof byMethod] += payment.amount;
      }
    });
    
    // Count by transaction type
    if (byType[txn.type as keyof typeof byType] !== undefined) {
      byType[txn.type as keyof typeof byType] += txn.amount.grandTotal || 0;
    }
    
    // Collect batch IDs
    if (txn.gatewayMeta?.authnet?.batchId) {
      batchIds.push(txn.gatewayMeta.authnet.batchId);
    }
  });
  
  // Create daily report
  const dailyReport = {
    id: reportId,
    orgId,
    date: dateStr,
    totals,
    byMethod,
    byType,
    batchIds: [...new Set(batchIds)],
    createdAt: new Date()
  };
  
  await db.collection("reports").doc("daily").collection("data").doc(reportId).set(dailyReport);
  
  console.log(`Generated daily report for ${orgId} on ${dateStr}`);
}

async function updateMonthlyReportForOrg(orgId: string, date: Date): Promise<void> {
  const monthStr = date.toISOString().substring(0, 7); // YYYY-MM
  const reportId = `${orgId}_${monthStr.replace('-', '')}`;
  
  // Get existing monthly report or create new one
  const monthlyReportRef = db.collection("reports").doc("monthly").collection("data").doc(reportId);
  const existingReport = await monthlyReportRef.get();
  
  // Get all daily reports for the month
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  const dailyReportsQuery = await db.collection("reports").doc("daily").collection("data")
    .where("orgId", "==", orgId)
    .where("date", ">=", startOfMonth.toISOString().split('T')[0])
    .where("date", "<=", endOfMonth.toISOString().split('T')[0])
    .get();
  
  // Aggregate daily reports
  const totals = { count: 0, amount: 0, fees: 0, taxes: 0 };
  const byMethod = { card: 0, ach: 0, cash: 0, check: 0 };
  const byType = { NEW: 0, RENEWAL: 0, ENDORSEMENT: 0, CANCELLATION: 0, REINSTATEMENT: 0 };
  const dailyBreakdown: Array<{ date: string; count: number; amount: number }> = [];
  
  dailyReportsQuery.docs.forEach(doc => {
    const report = doc.data();
    
    totals.count += report.totals.count;
    totals.amount += report.totals.amount;
    totals.fees += report.totals.fees;
    totals.taxes += report.totals.taxes;
    
    Object.keys(byMethod).forEach(method => {
      byMethod[method as keyof typeof byMethod] += report.byMethod[method] || 0;
    });
    
    Object.keys(byType).forEach(type => {
      byType[type as keyof typeof byType] += report.byType[type] || 0;
    });
    
    dailyBreakdown.push({
      date: report.date,
      count: report.totals.count,
      amount: report.totals.amount
    });
  });
  
  // Sort daily breakdown by date
  dailyBreakdown.sort((a, b) => a.date.localeCompare(b.date));
  
  const monthlyReport = {
    id: reportId,
    orgId,
    month: monthStr,
    totals,
    byMethod,
    byType,
    dailyBreakdown,
    createdAt: existingReport.exists ? existingReport.data()?.createdAt : new Date(),
    updatedAt: new Date()
  };
  
  await monthlyReportRef.set(monthlyReport);
  
  console.log(`Updated monthly report for ${orgId} for ${monthStr}`);
}

/**
 * Export CSV Data
 */
export const exportCSV = onCall(async (request) => {
  const { type, dateRange, filters } = request.data;
  const orgId = request.auth?.token?.orgId;
  
  if (!orgId) {
    throw new Error("Organization ID is required");
  }
  
  try {
    const exportId = db.collection("exports").doc().id;
    
    // Create export request record
    await db.collection("exports").doc(exportId).set({
      id: exportId,
      orgId,
      type,
      dateRange: {
        start: new Date(dateRange.start),
        end: new Date(dateRange.end)
      },
      filters: filters || {},
      status: 'PENDING',
      requestedBy: request.auth.uid,
      createdAt: new Date()
    });
    
    // Process export asynchronously
    processExportAsync(exportId, orgId, type, dateRange, filters);
    
    return {
      success: true,
      exportId,
      message: "Export request created. You will be notified when it's ready."
    };
    
  } catch (error) {
    console.error("Error creating export:", error);
    throw new Error(`Failed to create export: ${error}`);
  }
});

async function processExportAsync(exportId: string, orgId: string, type: string, dateRange: any, filters: any) {
  try {
    // Update status to processing
    await db.collection("exports").doc(exportId).update({
      status: 'PROCESSING'
    });
    
    let csvData: string;
    
    switch (type) {
      case 'transactions':
        csvData = await generateTransactionCSV(orgId, dateRange, filters);
        break;
      case 'policies':
        csvData = await generatePolicyCSV(orgId, dateRange, filters);
        break;
      case 'customers':
        csvData = await generateCustomerCSV(orgId, filters);
        break;
      default:
        throw new Error(`Unsupported export type: ${type}`);
    }
    
    // Upload to Cloud Storage (placeholder)
    const downloadUrl = `https://storage.googleapis.com/exports/${orgId}/${exportId}.csv`;
    
    // Update export record
    await db.collection("exports").doc(exportId).update({
      status: 'COMPLETED',
      downloadUrl,
      completedAt: new Date()
    });
    
    console.log(`Export ${exportId} completed successfully`);
    
  } catch (error) {
    console.error(`Export ${exportId} failed:`, error);
    
    await db.collection("exports").doc(exportId).update({
      status: 'FAILED',
      error: error.toString(),
      completedAt: new Date()
    });
  }
}

async function generateTransactionCSV(orgId: string, dateRange: any, filters: any): Promise<string> {
  const startDate = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);
  
  const txnsQuery = await db.collection("transactions")
    .where("orgId", "==", orgId)
    .where("createdAt", ">=", startDate)
    .where("createdAt", "<=", endDate)
    .get();
  
  const headers = [
    'Transaction ID', 'Receipt Number', 'Date', 'Type', 'Customer', 'Policy',
    'Subtotal', 'Fees', 'Tax', 'Total', 'Payment Methods', 'Status'
  ];
  
  const rows = txnsQuery.docs.map(doc => {
    const txn = doc.data();
    const paymentMethods = txn.payments?.map((p: any) => `${p.method}:$${p.amount}`).join('; ') || '';
    
    return [
      txn.id,
      txn.receipt?.number || '',
      txn.createdAt.toDate().toISOString().split('T')[0],
      txn.type,
      txn.customerRef || '',
      txn.policyRef || '',
      txn.amount?.subtotal || 0,
      txn.amount?.feesTotal || 0,
      txn.amount?.taxTotal || 0,
      txn.amount?.grandTotal || 0,
      paymentMethods,
      txn.status
    ];
  });
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

async function generatePolicyCSV(orgId: string, dateRange: any, filters: any): Promise<string> {
  // Placeholder implementation
  return "Policy ID,Customer,Product,Status,Premium,Effective Date\n";
}

async function generateCustomerCSV(orgId: string, filters: any): Promise<string> {
  // Placeholder implementation
  return "Customer ID,Name,Email,Phone,Location\n";
}

// ============= GUSTO INTEGRATION FUNCTIONS =============

/**
 * Initiate Gusto OAuth Connection
 */
export const gustoConnect = onCall(async (request) => {
  const orgId = request.auth?.token?.orgId;
  
  if (!orgId) {
    throw new Error("Organization ID is required");
  }
  
  try {
    // Generate OAuth state parameter
    const state = `${orgId}_${Date.now()}`;
    
    // Store state for verification
    await db.collection("integrations").doc("gusto").collection("oauth_states").doc(state).set({
      orgId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });
    
    // Generate OAuth URL (placeholder)
    const clientId = process.env.GUSTO_CLIENT_ID || 'placeholder_client_id';
    const redirectUri = `${process.env.FUNCTIONS_URL}/gustoCallback`;
    const scope = 'read:companies read:employees read:locations';
    
    const authUrl = `https://api.gusto.com/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}`;
    
    return {
      success: true,
      authUrl
    };
    
  } catch (error) {
    console.error("Error initiating Gusto connection:", error);
    throw new Error(`Failed to initiate Gusto connection: ${error}`);
  }
});

/**
 * Handle Gusto OAuth Callback
 */
export const gustoCallback = onRequest(async (req, res) => {
  try {
    const { code, state, error } = req.query;
    
    if (error) {
      res.redirect(`${process.env.WEB_URL}/settings?gusto_error=${error}`);
      return;
    }
    
    if (!code || !state) {
      res.status(400).send('Missing code or state parameter');
      return;
    }
    
    // Verify state parameter
    const stateDoc = await db.collection("integrations").doc("gusto").collection("oauth_states").doc(state as string).get();
    
    if (!stateDoc.exists) {
      res.status(400).send('Invalid state parameter');
      return;
    }
    
    const stateData = stateDoc.data()!;
    const orgId = stateData.orgId;
    
    // Exchange code for access token (placeholder)
    const tokenResponse = await exchangeGustoCode(code as string);
    
    // Store integration data
    await db.collection("integrations").doc("gusto").collection("orgs").doc(orgId).set({
      orgId,
      connected: true,
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      tokenExpiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
      status: 'ok',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Clean up state
    await stateDoc.ref.delete();
    
    // Perform initial sync
    await syncGustoData(orgId);
    
    res.redirect(`${process.env.WEB_URL}/settings?gusto_connected=true`);
    
  } catch (error) {
    console.error("Gusto callback error:", error);
    res.status(500).send('Internal server error');
  }
});

async function exchangeGustoCode(code: string): Promise<any> {
  // Placeholder for actual Gusto token exchange
  return {
    access_token: `gus_at_${Date.now()}`,
    refresh_token: `gus_rt_${Date.now()}`,
    expires_in: 3600,
    token_type: 'Bearer'
  };
}

/**
 * Sync Gusto Data
 */
export const syncGustoData = onCall(async (request) => {
  const orgId = request.auth?.token?.orgId;
  
  if (!orgId) {
    throw new Error("Organization ID is required");
  }
  
  return await syncGustoData(orgId);
});

async function syncGustoData(orgId: string): Promise<{ success: boolean; message: string }> {
  try {
    const integrationDoc = await db.collection("integrations").doc("gusto").collection("orgs").doc(orgId).get();
    
    if (!integrationDoc.exists || !integrationDoc.data()?.connected) {
      throw new Error("Gusto integration not found or not connected");
    }
    
    const integration = integrationDoc.data()!;
    
    // Fetch companies (placeholder)
    const companies = await fetchGustoCompanies(integration.accessToken);
    
    // Store company data
    if (companies.length > 0) {
      const company = companies[0]; // Use first company
      
      await db.collection("integrations").doc("gusto").collection("orgs").doc(orgId).update({
        companyId: company.id,
        lastSyncAt: new Date(),
        updatedAt: new Date()
      });
      
      // Fetch and store employees
      const employees = await fetchGustoEmployees(integration.accessToken, company.id);
      
      // Store in gustoMirror collection
      const batch = db.batch();
      
      // Store company data
      batch.set(
        db.collection("gustoMirror").doc(orgId).collection("companies").doc(company.id),
        { ...company, syncedAt: new Date() }
      );
      
      // Store employee data
      employees.forEach(employee => {
        batch.set(
          db.collection("gustoMirror").doc(orgId).collection("employees").doc(employee.id),
          { ...employee, syncedAt: new Date() }
        );
      });
      
      await batch.commit();
    }
    
    return {
      success: true,
      message: `Synced ${companies.length} companies and data for org ${orgId}`
    };
    
  } catch (error) {
    console.error(`Error syncing Gusto data for org ${orgId}:`, error);
    
    // Update integration status
    await db.collection("integrations").doc("gusto").collection("orgs").doc(orgId).update({
      status: 'error',
      errorMessage: error.toString(),
      updatedAt: new Date()
    });
    
    throw new Error(`Failed to sync Gusto data: ${error}`);
  }
}

async function fetchGustoCompanies(accessToken: string): Promise<any[]> {
  // Placeholder for actual Gusto API call
  return [
    {
      id: 'comp_123',
      name: 'Demo Company',
      ein: '12-3456789',
      locations: [
        {
          id: 'loc_456',
          street1: '123 Business St',
          city: 'New York',
          state: 'NY',
          zip: '10001'
        }
      ]
    }
  ];
}

async function fetchGustoEmployees(accessToken: string, companyId: string): Promise<any[]> {
  // Placeholder for actual Gusto API call
  return [
    {
      id: 'emp_789',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      workLocationId: 'loc_456',
      department: 'Sales',
      jobTitle: 'Sales Representative',
      employmentStatus: 'active',
      hireDate: '2023-01-15'
    }
  ];
}

/**
 * Gusto Webhook Handler
 */
export const gustoWebhook = onRequest(async (req, res) => {
  try {
    const signature = req.headers['x-gusto-signature'];
    const payload = req.body;
    
    // Verify webhook signature (placeholder)
    // const isValid = verifyGustoSignature(payload, signature, process.env.GUSTO_WEBHOOK_SECRET);
    // if (!isValid) {
    //   res.status(401).send('Invalid signature');
    //   return;
    // }
    
    const event = payload;
    console.log(`Processing Gusto webhook: ${event.event_type}`);
    
    // Store webhook event
    const eventId = db.collection("gustoWebhookEvents").doc().id;
    await db.collection("gustoWebhookEvents").doc(eventId).set({
      id: eventId,
      eventType: event.event_type,
      resourceType: event.resource_type,
      resourceId: event.resource_id,
      timestamp: new Date(event.timestamp),
      processed: false,
      data: event,
      createdAt: new Date()
    });
    
    // Process specific event types
    switch (event.event_type) {
      case 'employee.created':
      case 'employee.updated':
        await handleEmployeeChange(event);
        break;
      case 'company.updated':
        await handleCompanyChange(event);
        break;
      default:
        console.log(`Unhandled Gusto event type: ${event.event_type}`);
    }
    
    // Mark event as processed
    await db.collection("gustoWebhookEvents").doc(eventId).update({
      processed: true
    });
    
    res.json({ received: true });
    
  } catch (error) {
    console.error("Gusto webhook error:", error);
    res.status(400).send(`Webhook error: ${error}`);
  }
});

async function handleEmployeeChange(event: any) {
  // Find the org associated with this company
  const integrationQuery = await db.collection("integrations").doc("gusto").collection("orgs")
    .where("companyId", "==", event.company_id)
    .limit(1)
    .get();
  
  if (integrationQuery.empty) {
    console.log(`No integration found for company ${event.company_id}`);
    return;
  }
  
  const orgId = integrationQuery.docs[0].data().orgId;
  
  // Trigger a sync for this org
  await syncGustoData(orgId);
}

async function handleCompanyChange(event: any) {
  // Similar to employee change handling
  await handleEmployeeChange(event);
}

/**
 * Create Transaction with receipt generation
 */
export const createTransaction = onCall(async (request) => {
  const transactionData = request.data;
  
  if (!transactionData.orgId || !transactionData.performedAtLocationId) {
    throw new Error("orgId and performedAtLocationId are required");
  }

  try {
    // Generate receipt number
    const receiptNumber = await incrementReceiptCounter(transactionData.orgId);
    
    // Process payments
    const processedPayments = [];
    let gatewayMeta = {};
    
    for (const payment of transactionData.payments) {
      if (payment.gateway === 'authnet' && (payment.method === 'card' || payment.method === 'ach')) {
        // Process with Authorize.Net
        const authResult = await processAuthorizeNetPayment({
          amount: payment.amount,
          method: payment.method,
          token: payment.ref // opaque token from Accept.js
        });
        
        if (authResult.success) {
          processedPayments.push({
            ...payment,
            ref: authResult.transactionId
          });
          
          gatewayMeta = {
            authnet: {
              transactionId: authResult.transactionId,
              batchId: authResult.batchId,
              avs: authResult.avs,
              cvv: authResult.cvv
            }
          };
        } else {
          throw new Error(`Payment processing failed: ${authResult.error}`);
        }
      } else {
        // Cash/Check - no processing needed
        processedPayments.push(payment);
      }
    }
    
    // Create transaction document
    const transactionId = db.collection("transactions").doc().id;
    const now = new Date();
    
    const transaction = {
      id: transactionId,
      ...transactionData,
      payments: processedPayments,
      gatewayMeta,
      receipt: {
        number: receiptNumber,
        issuedAt: now
      },
      status: processedPayments.some(p => p.gateway === 'authnet') ? 'AUTHORIZED' : 'CAPTURED',
      createdAt: now,
      updatedAt: now
    };
    
    // Save transaction
    await db.collection("transactions").doc(transactionId).set(transaction);
    
    // Generate PDF receipt
    try {
      const pdfUrl = await generateReceiptPDF(transaction);
      await db.collection("transactions").doc(transactionId).update({
        'receipt.pdfUrl': pdfUrl,
        updatedAt: new Date()
      });
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
      // Continue without PDF - can be regenerated later
    }
    
    // Send receipt notification if enabled
    try {
      if (transactionData.customerEmail) {
        await sendNotification({
          orgId: transactionData.orgId,
          type: 'email',
          template: 'receipt_issued',
          to: transactionData.customerEmail,
          variables: {
            receiptNumber,
            amount: transaction.amount.grandTotal,
            receiptUrl: transaction.receipt.pdfUrl
          },
          related: {
            txnId: transactionId
          }
        });
      }
    } catch (notificationError) {
      console.error("Receipt notification failed:", notificationError);
      // Continue - notification failure shouldn't fail transaction
    }
    
    return {
      success: true,
      transactionId,
      receiptNumber,
      message: "Transaction created successfully"
    };
    
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error(`Failed to create transaction: ${error}`);
  }
});

/**
 * Void Transaction
 */
export const voidTransaction = onCall(async (request) => {
  const { transactionId } = request.data;
  
  if (!transactionId) {
    throw new Error("transactionId is required");
  }

  try {
    const transactionRef = db.collection("transactions").doc(transactionId);
    const transactionDoc = await transactionRef.get();
    
    if (!transactionDoc.exists) {
      throw new Error("Transaction not found");
    }
    
    const transaction = transactionDoc.data();
    
    if (transaction.status === 'VOIDED') {
      return { success: true, message: "Transaction already voided" };
    }
    
    if (!['AUTHORIZED', 'CAPTURED'].includes(transaction.status)) {
      throw new Error(`Cannot void transaction with status: ${transaction.status}`);
    }
    
    // Void gateway transactions
    if (transaction.gatewayMeta?.authnet?.transactionId) {
      const voidResult = await voidAuthorizeNetTransaction(transaction.gatewayMeta.authnet.transactionId);
      if (!voidResult.success) {
        throw new Error("Gateway void failed");
      }
    }
    
    // Update transaction status
    await transactionRef.update({
      status: 'VOIDED',
      updatedAt: new Date()
    });
    
    return {
      success: true,
      message: "Transaction voided successfully"
    };
    
  } catch (error) {
    console.error("Error voiding transaction:", error);
    throw new Error(`Failed to void transaction: ${error}`);
  }
});

/**
 * Refund Transaction
 */
export const refundTransaction = onCall(async (request) => {
  const { transactionId, amount } = request.data;
  
  if (!transactionId) {
    throw new Error("transactionId is required");
  }

  try {
    const transactionRef = db.collection("transactions").doc(transactionId);
    const transactionDoc = await transactionRef.get();
    
    if (!transactionDoc.exists) {
      throw new Error("Transaction not found");
    }
    
    const transaction = transactionDoc.data();
    
    if (transaction.status === 'REFUNDED') {
      return { success: true, message: "Transaction already refunded" };
    }
    
    if (!['CAPTURED', 'SETTLED'].includes(transaction.status)) {
      throw new Error(`Cannot refund transaction with status: ${transaction.status}`);
    }
    
    const refundAmount = amount || transaction.amount.grandTotal;
    
    // Process gateway refund
    if (transaction.gatewayMeta?.authnet?.transactionId) {
      const refundResult = await refundAuthorizeNetTransaction(
        transaction.gatewayMeta.authnet.transactionId, 
        refundAmount
      );
      if (!refundResult.success) {
        throw new Error("Gateway refund failed");
      }
    }
    
    // Update transaction status
    await transactionRef.update({
      status: 'REFUNDED',
      updatedAt: new Date()
    });
    
    return {
      success: true,
      message: "Transaction refunded successfully"
    };
    
  } catch (error) {
    console.error("Error refunding transaction:", error);
    throw new Error(`Failed to refund transaction: ${error}`);
  }
});

/**
 * Generate Receipt PDF
 */
export const generateReceipt = onCall(async (request) => {
  const { transactionId } = request.data;
  
  if (!transactionId) {
    throw new Error("transactionId is required");
  }

  try {
    const transactionDoc = await db.collection("transactions").doc(transactionId).get();
    
    if (!transactionDoc.exists) {
      throw new Error("Transaction not found");
    }
    
    const transaction = transactionDoc.data();
    const pdfUrl = await generateReceiptPDF(transaction);
    
    // Update transaction with PDF URL
    await db.collection("transactions").doc(transactionId).update({
      'receipt.pdfUrl': pdfUrl,
      updatedAt: new Date()
    });
    
    return {
      success: true,
      pdfUrl,
      message: "Receipt generated successfully"
    };
    
  } catch (error) {
    console.error("Error generating receipt:", error);
    throw new Error(`Failed to generate receipt: ${error}`);
  }
});

/**
 * Cloud Function: Triggered when a new user is created
 */
export const onUserSignup = onUserCreated(async (event) => {
  const { uid } = event.data;

  try {
    // Wait a bit for the user document to be created
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await resolveUserClaims(uid);
    console.log(`Claims resolved for new user: ${uid}`);
  } catch (error) {
    console.error(`Error in onUserSignup for ${uid}:`, error);
  }
});

/**
 * Cloud Function: Triggered when user document is updated
 */
export const onUserUpdate = onDocumentWritten(
  "users/{userId}",
  async (event) => {
    const userId = event.params.userId;

    try {
      await resolveUserClaims(userId);
      console.log(`Claims resolved for updated user: ${userId}`);
    } catch (error) {
      console.error(`Error in onUserUpdate for ${userId}:`, error);
    }
  },
);

/**
 * Cloud Function: Triggered when location group is updated
 */
export const onLocationGroupUpdate = onDocumentWritten(
  "locationGroups/{groupId}",
  async (event) => {
    const groupId = event.params.groupId;

    try {
      await resolveGroupMemberClaims(groupId);
      console.log(`Claims resolved for location group update: ${groupId}`);
    } catch (error) {
      console.error(`Error in onLocationGroupUpdate for ${groupId}:`, error);
    }
  },
);

/**
 * Callable Cloud Function: Manually trigger claims resolution for a user
 */
export const resolveClaimsForUser = onCall(async (request) => {
  const { userId } = request.data;

  if (!userId) {
    throw new Error("userId is required");
  }

  try {
    await resolveUserClaims(userId);
    return { success: true, message: `Claims resolved for user ${userId}` };
  } catch (error) {
    console.error(`Error in resolveClaimsForUser for ${userId}:`, error);
    throw new Error(`Failed to resolve claims: ${error}`);
  }
});

/**
 * Callable Cloud Function: Manually trigger claims resolution for all users in an organization
 */
export const resolveClaimsForOrganization = onCall(async (request) => {
  const { orgId } = request.data;

  if (!orgId) {
    throw new Error("orgId is required");
  }

  try {
    // Get all users in the organization
    const usersQuery = await db
      .collection("users")
      .where("orgId", "==", orgId)
      .get();

    // Resolve claims for all users
    const promises = usersQuery.docs.map((userDoc) =>
      resolveUserClaims(userDoc.id),
    );
    await Promise.all(promises);

    return {
      success: true,
      message: `Claims resolved for ${usersQuery.docs.length} users in organization ${orgId}`,
    };
  } catch (error) {
    console.error(`Error in resolveClaimsForOrganization for ${orgId}:`, error);
    throw new Error(`Failed to resolve organization claims: ${error}`);
  }
});

/**
 * Callable Cloud Function: Force token refresh for a user
 */
export const forceTokenRefresh = onCall(async (request) => {
  const { userId } = request.data;

  if (!userId) {
    throw new Error("userId is required");
  }

  try {
    // Revoke all refresh tokens to force a new token fetch
    await auth.revokeRefreshTokens(userId);

    return {
      success: true,
      message: `Token refresh forced for user ${userId}. User will need to re-authenticate.`,
    };
  } catch (error) {
    console.error(`Error in forceTokenRefresh for ${userId}:`, error);
    throw new Error(`Failed to force token refresh: ${error}`);
  }
});

/**
 * Policy lifecycle management function
 */
export const updatePolicyStatus = onCall(async (request) => {
  const { policyId, newStatus, reason, userId } = request.data;

  if (!policyId || !newStatus || !userId) {
    throw new Error("policyId, newStatus, and userId are required");
  }

  try {
    const policyRef = db.collection("policies").doc(policyId);
    const policyDoc = await policyRef.get();

    if (!policyDoc.exists) {
      throw new Error(`Policy ${policyId} not found`);
    }

    const policy = policyDoc.data();
    const currentStatus = policy?.status;

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      PENDING: ["ACTIVE", "CANCELLED"],
      ACTIVE: ["CANCELLED", "EXPIRED"],
      CANCELLED: [], // Cannot transition from cancelled
      EXPIRED: [], // Cannot transition from expired
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }

    // Create status history entry
    const statusHistoryEntry = {
      at: new Date(),
      from: currentStatus,
      to: newStatus,
      reason: reason || `Status changed to ${newStatus}`,
      by: userId,
    };

    // Update policy
    await policyRef.update({
      status: newStatus,
      statusHistory: [...(policy.statusHistory || []), statusHistoryEntry],
      updatedAt: new Date(),
    });

    return {
      success: true,
      message: `Policy ${policyId} status updated from ${currentStatus} to ${newStatus}`,
    };
  } catch (error) {
    console.error(`Error updating policy status for ${policyId}:`, error);
    throw new Error(`Failed to update policy status: ${error}`);
  }
});

/**
 * Auto-expire policies function (to be run on schedule)
 */
export const autoExpirePolicies = onCall(async (request) => {
  try {
    const now = new Date();
    const expiredPoliciesQuery = await db
      .collection("policies")
      .where("status", "==", "ACTIVE")
      .where("expirationDate", "<=", now)
      .get();

    const batch = db.batch();
    let expiredCount = 0;

    expiredPoliciesQuery.docs.forEach((doc) => {
      const policy = doc.data();
      const statusHistoryEntry = {
        at: now,
        from: "ACTIVE",
        to: "EXPIRED",
        reason: "Policy expired automatically",
        by: "system",
      };

      batch.update(doc.ref, {
        status: "EXPIRED",
        statusHistory: [...(policy.statusHistory || []), statusHistoryEntry],
        updatedAt: now,
      });

      expiredCount++;
    });

    if (expiredCount > 0) {
      await batch.commit();
    }

    return {
      success: true,
      message: `${expiredCount} policies expired automatically`,
      expiredCount,
    };
  } catch (error) {
    console.error("Error auto-expiring policies:", error);
    throw new Error(`Failed to auto-expire policies: ${error}`);
  }
});

/**
 * Callable Cloud Function: Seed demo data for testing
 */
export const seedDemoData = onCall(async (request) => {
  const { orgId } = request.data;

  if (!orgId) {
    throw new Error("orgId is required");
  }

  try {
    const batch = db.batch();
    const now = new Date();

    // Create organization
    const orgRef = db.collection("organizations").doc(orgId);
    batch.set(orgRef, {
      id: orgId,
      name: "Demo Insurance Agency",
      slug: "demo-insurance",
      description: "A sample insurance agency for testing AMSync features",
      settings: {
        timezone: "America/New_York",
        currency: "USD",
        dateFormat: "MM/DD/YYYY",
        fiscalYearStart: 1,
      },
      createdAt: now,
      updatedAt: now,
      createdBy: "system",
    });

    // Create entity
    const entityId = "entity1";
    const entityRef = db.collection("entities").doc(entityId);
    batch.set(entityRef, {
      id: entityId,
      organizationId: orgId,
      name: "Main Office",
      type: "branch",
      code: "MAIN",
      description: "Primary office location",
      isActive: true,
      settings: {
        allowTransactions: true,
        requireApproval: false,
      },
      createdAt: now,
      updatedAt: now,
      createdBy: "system",
    });

    // Create locations
    const locations = [
      {
        id: "loc1",
        name: "Downtown Office",
        code: "DT001",
        type: "office",
        address: {
          street1: "123 Main St",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "USA",
        },
      },
      {
        id: "loc2",
        name: "Uptown Branch",
        code: "UT002",
        type: "branch",
        address: {
          street1: "456 Broadway",
          city: "New York",
          state: "NY",
          postalCode: "10025",
          country: "USA",
        },
      },
      {
        id: "loc3",
        name: "Main Warehouse",
        code: "WH001",
        type: "warehouse",
        address: {
          street1: "789 Industrial Blvd",
          city: "Queens",
          state: "NY",
          postalCode: "11101",
          country: "USA",
        },
      },
    ];

    locations.forEach((location) => {
      const locationRef = db.collection("locations").doc(location.id);
      batch.set(locationRef, {
        ...location,
        organizationId: orgId,
        entityId,
        isActive: true,
        settings: {
          timezone: "America/New_York",
        },
        createdAt: now,
        updatedAt: now,
        createdBy: "system",
      });
    });

    // Create users
    const users = [
      {
        id: "user1",
        role: "admin",
        directLocationIds: ["loc1", "loc2"],
        groupIds: ["group1"],
        email: "admin@demo.com",
        name: "John Admin",
      },
      {
        id: "user2",
        role: "manager",
        directLocationIds: ["loc1"],
        groupIds: ["group1", "group2"],
        managerUserId: "user1",
        email: "manager@demo.com",
        name: "Jane Manager",
      },
      {
        id: "user3",
        role: "agent",
        directLocationIds: [],
        groupIds: ["group2"],
        managerUserId: "user2",
        email: "agent@demo.com",
        name: "Bob Agent",
      },
    ];

    users.forEach((user) => {
      const userRef = db.collection("users").doc(user.id);
      batch.set(userRef, {
        ...user,
        orgId,
        entityId,
        createdAt: now,
        updatedAt: now,
      });
    });

    // Create location groups
    const groups = [
      {
        id: "group1",
        name: "Sales Team",
        locationIds: ["loc1", "loc2"],
        memberUserIds: ["user1", "user2"],
        managerUserId: "user1",
      },
      {
        id: "group2",
        name: "Support Team",
        locationIds: ["loc2", "loc3"],
        memberUserIds: ["user2", "user3"],
        managerUserId: "user2",
      },
    ];

    groups.forEach((group) => {
      const groupRef = db.collection("locationGroups").doc(group.id);
      batch.set(groupRef, {
        ...group,
        orgId,
        createdAt: now,
        updatedAt: now,
      });
    });

    // Create preferences
    const preferencesRef = db.collection("preferences").doc(orgId);
    batch.set(preferencesRef, {
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
    });

    // Create insurance companies
    const companies = [
      {
        id: "comp1",
        orgId,
        name: "State Farm Insurance",
        companyType: "Carrier",
        naic: "25178",
        agentPortalUrl: "https://agent.statefarm.com",
        paymentUrl: "https://payments.statefarm.com",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "comp2",
        orgId,
        name: "Progressive Insurance",
        companyType: "Carrier",
        naic: "25178",
        agentPortalUrl: "https://agent.progressive.com",
        paymentUrl: "https://payments.progressive.com",
        createdAt: now,
        updatedAt: now,
      },
    ];

    companies.forEach((company) => {
      const companyRef = db.collection("insuranceCompanies").doc(company.id);
      batch.set(companyRef, {
        ...company,
        orgId,
        createdAt: now,
        updatedAt: now,
      });
    });

    await batch.commit();

    return {
      success: true,
      message: "Demo data seeded successfully",
    };
  } catch (error) {
    console.error("Error seeding demo data:", error);
    throw new Error(`Failed to seed demo data: ${error}`);
  }
});
// Application constants
export const APP_CONFIG = {
  NAME: "AMSync",
  VERSION: "1.0.0",
  DESCRIPTION: "Agency Management Sync Platform",
} as const;

// Date formats
export const DATE_FORMATS = {
  SHORT: "MM/dd/yyyy",
  LONG: "MMMM dd, yyyy",
  ISO: "yyyy-MM-dd",
  DATETIME: "MM/dd/yyyy HH:mm:ss",
  TIME: "HH:mm:ss",
  TIME_12H: "h:mm:ss a",
} as const;

// Currency codes
export const CURRENCY_CODES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "INR",
] as const;

// User roles
export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ORG_ADMIN: "org_admin",
  ENTITY_ADMIN: "entity_admin",
  LOCATION_ADMIN: "location_admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
  VIEWER: "viewer",
} as const;

// Policy types
export const POLICY_TYPES = {
  AUTO: "auto",
  HOME: "home",
  LIFE: "life",
  HEALTH: "health",
  COMMERCIAL: "commercial",
  UMBRELLA: "umbrella",
  OTHER: "other",
} as const;

// Transaction types
export const TRANSACTION_TYPES = {
  PREMIUM_PAYMENT: "premium_payment",
  CLAIM_PAYMENT: "claim_payment",
  COMMISSION: "commission",
  REFUND: "refund",
  ADJUSTMENT: "adjustment",
  FEE: "fee",
  OTHER: "other",
} as const;

// Status values
export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
  SUSPENDED: "suspended",
} as const;

// File upload limits
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  NOTES_MAX_LENGTH: 1000,
} as const;

// API endpoints (relative paths)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
  },
  ORGANIZATIONS: {
    LIST: "/organizations",
    CREATE: "/organizations",
    GET: "/organizations/:id",
    UPDATE: "/organizations/:id",
    DELETE: "/organizations/:id",
  },
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    GET: "/users/:id",
    UPDATE: "/users/:id",
    DELETE: "/users/:id",
  },
  POLICIES: {
    LIST: "/policies",
    CREATE: "/policies",
    GET: "/policies/:id",
    UPDATE: "/policies/:id",
    DELETE: "/policies/:id",
  },
  TRANSACTIONS: {
    LIST: "/transactions",
    CREATE: "/transactions",
    GET: "/transactions/:id",
    UPDATE: "/transactions/:id",
    DELETE: "/transactions/:id",
  },
} as const;

// Error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
} as const;

// Theme colors (for consistency across packages)
export const THEME_COLORS = {
  PRIMARY: "hsl(var(--primary))",
  SECONDARY: "hsl(var(--secondary))",
  ACCENT: "hsl(var(--accent))",
  DESTRUCTIVE: "hsl(var(--destructive))",
  MUTED: "hsl(var(--muted))",
  BACKGROUND: "hsl(var(--background))",
  FOREGROUND: "hsl(var(--foreground))",
  BORDER: "hsl(var(--border))",
} as const;

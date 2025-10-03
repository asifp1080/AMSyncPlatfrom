// Common types and utilities

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface FilterParams {
  [key: string]: any;
}

export interface SearchParams {
  query?: string;
  filters?: FilterParams;
  pagination?: PaginationParams;
}

// Audit trail types
export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: "create" | "update" | "delete" | "view";
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  userId: string;
  organizationId: string;
  locationId?: string;
  transactionId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface BusinessError {
  code: string;
  message: string;
  details?: any;
}

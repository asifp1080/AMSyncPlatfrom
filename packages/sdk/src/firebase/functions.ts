import { httpsCallable, HttpsCallable } from "firebase/functions";
import { firebase } from "./config";
import type { ApiResponse } from "@amsync/domain";

export class FunctionsService {
  private getCallable<T = any, R = any>(name: string): HttpsCallable<T, R> {
    return httpsCallable<T, R>(firebase.functions, name);
  }

  async call<T = any, R = any>(
    functionName: string,
    data?: T,
  ): Promise<ApiResponse<R>> {
    try {
      const callable = this.getCallable<T, ApiResponse<R>>(functionName);
      const result = await callable(data);
      return result.data;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || "UNKNOWN_ERROR",
          message: error.message || "An unknown error occurred",
          details: error.details,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Specific function calls for common operations
  async seedDemoData(orgId: string): Promise<ApiResponse<any>> {
    return this.call("seedDemoData", { orgId });
  }

  async createOrganization(data: any): Promise<ApiResponse<any>> {
    return this.call("createOrganization", data);
  }

  async processTransaction(data: any): Promise<ApiResponse<any>> {
    return this.call("processTransaction", data);
  }

  async generateReport(data: any): Promise<ApiResponse<any>> {
    return this.call("generateReport", data);
  }

  async sendNotification(data: any): Promise<ApiResponse<any>> {
    return this.call("sendNotification", data);
  }

  // Sprint 1 specific functions
  async resolveClaimsForUser(userId: string): Promise<ApiResponse<any>> {
    return this.call("resolveClaimsForUser", { userId });
  }

  async resolveClaimsForOrganization(orgId: string): Promise<ApiResponse<any>> {
    return this.call("resolveClaimsForOrganization", { orgId });
  }

  async forceTokenRefresh(userId: string): Promise<ApiResponse<any>> {
    return this.call("forceTokenRefresh", { userId });
  }
}

export const functionsService = new FunctionsService();

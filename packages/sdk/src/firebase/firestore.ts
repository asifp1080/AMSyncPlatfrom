import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryConstraint,
  DocumentSnapshot,
  QuerySnapshot,
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import { firebase } from "./config";
import type { PaginationParams, PaginatedResponse } from "@amsync/domain";

export class FirestoreService {
  private getCollection(path: string): CollectionReference<DocumentData> {
    return collection(firebase.firestore, path);
  }

  private getDocument(path: string): DocumentReference<DocumentData> {
    return doc(firebase.firestore, path);
  }

  async create<T extends DocumentData>(
    collectionPath: string,
    data: T,
  ): Promise<string> {
    const docRef = await addDoc(this.getCollection(collectionPath), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  }

  async get<T>(documentPath: string): Promise<T | null> {
    const docSnap = await getDoc(this.getDocument(documentPath));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  async update<T extends Partial<DocumentData>>(
    documentPath: string,
    data: T,
  ): Promise<void> {
    await updateDoc(this.getDocument(documentPath), {
      ...data,
      updatedAt: new Date(),
    });
  }

  async delete(documentPath: string): Promise<void> {
    await deleteDoc(this.getDocument(documentPath));
  }

  async list<T>(
    collectionPath: string,
    constraints: QueryConstraint[] = [],
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<T>> {
    let q = query(this.getCollection(collectionPath), ...constraints);

    if (pagination) {
      const {
        page = 1,
        limit: pageLimit = 10,
        sortBy,
        sortOrder = "asc",
      } = pagination;

      if (sortBy) {
        q = query(q, orderBy(sortBy, sortOrder));
      }

      if (page > 1) {
        // For pagination, we'd need to implement cursor-based pagination
        // This is a simplified version
        q = query(q, limit(pageLimit));
      } else {
        q = query(q, limit(pageLimit));
      }
    }

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];

    // Calculate pagination info (simplified)
    const total = data.length; // In a real implementation, you'd need a separate count query
    const currentPage = pagination?.page || 1;
    const pageLimit = pagination?.limit || 10;
    const totalPages = Math.ceil(total / pageLimit);

    return {
      data,
      pagination: {
        page: currentPage,
        limit: pageLimit,
        total,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    };
  }

  async search<T>(
    collectionPath: string,
    field: string,
    value: any,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<T>> {
    const constraints = [where(field, "==", value)];
    return this.list<T>(collectionPath, constraints, pagination);
  }

  // Utility methods for common query patterns
  where(field: string, operator: any, value: any): QueryConstraint {
    return where(field, operator, value);
  }

  orderBy(field: string, direction: "asc" | "desc" = "asc"): QueryConstraint {
    return orderBy(field, direction);
  }

  limit(count: number): QueryConstraint {
    return limit(count);
  }
}

export const firestoreService = new FirestoreService();

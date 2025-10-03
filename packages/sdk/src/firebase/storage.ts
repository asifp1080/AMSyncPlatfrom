import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  StorageReference,
  UploadTask,
  UploadTaskSnapshot,
} from "firebase/storage";
import { firebase } from "./config";

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

export class StorageService {
  private getRef(path: string): StorageReference {
    return ref(firebase.storage, path);
  }

  async upload(
    path: string,
    file: File | Blob,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<string> {
    const storageRef = this.getRef(path);

    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot: UploadTaskSnapshot) => {
            const progress = {
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            };
            onProgress(progress);
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          },
        );
      });
    } else {
      const snapshot = await uploadBytes(storageRef, file);
      return getDownloadURL(snapshot.ref);
    }
  }

  async getDownloadURL(path: string): Promise<string> {
    const storageRef = this.getRef(path);
    return getDownloadURL(storageRef);
  }

  async delete(path: string): Promise<void> {
    const storageRef = this.getRef(path);
    await deleteObject(storageRef);
  }

  async listFiles(path: string): Promise<string[]> {
    const storageRef = this.getRef(path);
    const result = await listAll(storageRef);
    return result.items.map((item) => item.fullPath);
  }

  // Utility method to generate unique file paths
  generatePath(
    organizationId: string,
    folder: string,
    fileName: string,
  ): string {
    const timestamp = Date.now();
    const extension = fileName.split(".").pop();
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    return `${organizationId}/${folder}/${baseName}_${timestamp}.${extension}`;
  }
}

export const storageService = new StorageService();

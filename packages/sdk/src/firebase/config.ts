import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import {
  getStorage,
  FirebaseStorage,
  connectStorageEmulator,
} from "firebase/storage";
import {
  getFunctions,
  Functions,
  connectFunctionsEmulator,
} from "firebase/functions";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface EmulatorConfig {
  auth?: { host: string; port: number };
  firestore?: { host: string; port: number };
  storage?: { host: string; port: number };
  functions?: { host: string; port: number };
}

class FirebaseService {
  private app: FirebaseApp | null = null;
  private _auth: Auth | null = null;
  private _firestore: Firestore | null = null;
  private _storage: FirebaseStorage | null = null;
  private _functions: Functions | null = null;
  private emulatorConnected = false;

  initialize(config: FirebaseConfig, emulators?: EmulatorConfig) {
    if (getApps().length === 0) {
      this.app = initializeApp(config);
    } else {
      this.app = getApps()[0];
    }

    // Initialize services
    this._auth = getAuth(this.app);
    this._firestore = getFirestore(this.app);
    this._storage = getStorage(this.app);
    this._functions = getFunctions(this.app);

    // Connect to emulators if provided and not already connected
    if (emulators && !this.emulatorConnected) {
      this.connectEmulators(emulators);
    }

    return this;
  }

  private connectEmulators(emulators: EmulatorConfig) {
    if (emulators.auth && this._auth) {
      connectAuthEmulator(
        this._auth,
        `http://${emulators.auth.host}:${emulators.auth.port}`,
      );
    }

    if (emulators.firestore && this._firestore) {
      connectFirestoreEmulator(
        this._firestore,
        emulators.firestore.host,
        emulators.firestore.port,
      );
    }

    if (emulators.storage && this._storage) {
      connectStorageEmulator(
        this._storage,
        emulators.storage.host,
        emulators.storage.port,
      );
    }

    if (emulators.functions && this._functions) {
      connectFunctionsEmulator(
        this._functions,
        emulators.functions.host,
        emulators.functions.port,
      );
    }

    this.emulatorConnected = true;
  }

  get auth(): Auth {
    if (!this._auth) {
      throw new Error(
        "Firebase Auth not initialized. Call initialize() first.",
      );
    }
    return this._auth;
  }

  get firestore(): Firestore {
    if (!this._firestore) {
      throw new Error("Firestore not initialized. Call initialize() first.");
    }
    return this._firestore;
  }

  get storage(): FirebaseStorage {
    if (!this._storage) {
      throw new Error(
        "Firebase Storage not initialized. Call initialize() first.",
      );
    }
    return this._storage;
  }

  get functions(): Functions {
    if (!this._functions) {
      throw new Error(
        "Firebase Functions not initialized. Call initialize() first.",
      );
    }
    return this._functions;
  }
}

export const firebase = new FirebaseService();
export type { FirebaseConfig, EmulatorConfig };

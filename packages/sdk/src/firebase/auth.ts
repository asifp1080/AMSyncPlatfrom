import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";
import { firebase } from "./config";

export class AuthService {
  async signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(firebase.auth, email, password);
  }

  async signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(firebase.auth, email, password);
  }

  async signOut(): Promise<void> {
    return signOut(firebase.auth);
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(firebase.auth, callback);
  }

  getCurrentUser(): User | null {
    return firebase.auth.currentUser;
  }

  async getIdToken(forceRefresh = false): Promise<string | null> {
    const user = this.getCurrentUser();
    if (!user) return null;
    return user.getIdToken(forceRefresh);
  }
}

export const authService = new AuthService();

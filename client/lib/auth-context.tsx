import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Admin emails that have special privileges
// Set via environment variable or defaults to example admin emails
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "mihai.pecican@student.upt.ro,alexandru.trofin@student.upt.ro")
  .split(",")
  .map((email: string) => email.trim());

interface AuthUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
  displayName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  isAdmin: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const isAdmin = ADMIN_EMAILS.includes(firebaseUser.email || "");

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            isAdmin,
          });
          setError(null);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to initialize authentication";
      setError(message);
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user document in Firestore
      const isAdmin = ADMIN_EMAILS.includes(email);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        isAdmin,
        role: isAdmin ? "admin" : "student",
        createdAt: new Date(),
      });

      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        isAdmin,
      });
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create account";
      setError(message);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const isAdmin = ADMIN_EMAILS.includes(email);

      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        isAdmin,
      });
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in";
      setError(message);
      throw err;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to sign out";
      setError(message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        logOut,
        isAdmin: user?.isAdmin ?? false,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

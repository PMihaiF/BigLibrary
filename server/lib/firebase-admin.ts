import * as admin from "firebase-admin";

// Initialize Firebase Admin
// Uses GOOGLE_APPLICATION_CREDENTIALS environment variable or default credentials
if (!admin.apps.length) {
  try {
    // In production, set GOOGLE_APPLICATION_CREDENTIALS to point to service account JSON
    // For development, Firebase can use application default credentials
    admin.initializeApp({
      projectId: "seproject-916c2",
    });
    console.log("Firebase Admin SDK initialized");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    // Continue anyway - the error might occur if credentials aren't available yet
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

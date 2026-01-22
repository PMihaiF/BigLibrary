import { RequestHandler } from "express";
import { adminDb, adminAuth } from "../lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

// Middleware to verify Firebase authentication token
export const verifyFirebaseToken: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  const token = authHeader.substring(7);
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    (req as any).userId = decodedToken.uid;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Add a book to favorites
export const addToFavorites: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { bookId, title, imageUrl, authors } = req.body;

    if (!bookId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if already favorited
    const existing = await adminDb
      .collection("favorites")
      .where("userId", "==", userId)
      .where("bookId", "==", bookId)
      .get();

    if (!existing.empty) {
      return res.status(200).json({ message: "Book already in favorites" });
    }

    // Add to favorites
    const docRef = await adminDb.collection("favorites").add({
      userId,
      bookId,
      title,
      imageUrl: imageUrl || null,
      authors: authors || [],
      addedAt: Timestamp.now(),
    });

    res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ error: "Failed to add to favorites" });
  }
};

// Remove a book from favorites
export const removeFromFavorites: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ error: "Missing bookId" });
    }

    const snapshot = await adminDb
      .collection("favorites")
      .where("userId", "==", userId)
      .where("bookId", "==", bookId)
      .get();

    const deletePromises = snapshot.docs.map((doc) => doc.ref.delete());
    await Promise.all(deletePromises);

    res.json({ success: true });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({ error: "Failed to remove from favorites" });
  }
};

// Get all favorites for user
export const getUserFavorites: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;

    const snapshot = await adminDb
      .collection("favorites")
      .where("userId", "==", userId)
      .orderBy("addedAt", "desc")
      .get();

    const favorites = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

// Check if a book is favorited
export const isFavorited: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { bookId } = req.query;

    if (!bookId) {
      return res.status(400).json({ error: "Missing bookId" });
    }

    const snapshot = await adminDb
      .collection("favorites")
      .where("userId", "==", userId)
      .where("bookId", "==", bookId)
      .get();

    res.json({ favorited: !snapshot.empty });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    res.status(500).json({ error: "Failed to check favorite status" });
  }
};

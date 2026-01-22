import {
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface FavoriteBook {
  id: string;
  userId: string;
  bookId: string;
  title: string;
  imageUrl?: string;
  authors?: string[];
  addedAt: Timestamp;
}

/**
 * Add a book to user's favorites
 */
export async function addToFavorites(
  userId: string,
  bookId: string,
  bookTitle: string,
  bookImageUrl?: string,
  bookAuthors?: string[],
): Promise<void> {
  try {
    console.log("Adding to favorites:", { userId, bookId, bookTitle });

    if (!userId) {
      throw new Error("User ID is required to add favorites");
    }

    // Check if already favorited
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("bookId", "==", bookId),
    );
    const existing = await getDocs(q);

    if (!existing.empty) {
      console.log("Book already in favorites");
      return;
    }

    // Add to favorites - filter out undefined values
    const favoriteData: any = {
      userId,
      bookId,
      title: bookTitle,
      addedAt: Timestamp.now(),
    };

    // Only include optional fields if they're defined
    if (bookImageUrl !== undefined) {
      favoriteData.imageUrl = bookImageUrl;
    }
    if (bookAuthors !== undefined && bookAuthors.length > 0) {
      favoriteData.authors = bookAuthors;
    }

    const docRef = await addDoc(collection(db, "favorites"), favoriteData);
    console.log("Added to favorites with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding to favorites:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error code:", (error as any).code);
    }
    throw error;
  }
}

/**
 * Remove a book from user's favorites
 */
export async function removeFromFavorites(
  userId: string,
  bookId: string,
): Promise<void> {
  try {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("bookId", "==", bookId),
    );
    const results = await getDocs(q);

    for (const docSnapshot of results.docs) {
      await deleteDoc(doc(db, "favorites", docSnapshot.id));
    }
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
}

/**
 * Get all favorite books for a user
 */
export async function getUserFavorites(
  userId: string,
): Promise<FavoriteBook[]> {
  try {
    const q = query(collection(db, "favorites"), where("userId", "==", userId));
    const results = await getDocs(q);

    return results.docs.map(
      (docSnapshot) =>
        ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
          addedAt: docSnapshot.data().addedAt,
        }) as FavoriteBook,
    );
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
}

/**
 * Check if a book is favorited by user
 */
export async function isFavorited(
  userId: string,
  bookId: string,
): Promise<boolean> {
  try {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("bookId", "==", bookId),
    );
    const results = await getDocs(q);
    const isFav = !results.empty;
    console.log(`Book ${bookId} favorited by ${userId}:`, isFav);
    return isFav;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
}

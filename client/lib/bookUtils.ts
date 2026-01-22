import type { BookItem } from "./useGoogleBooks";

const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || "";

interface SingleBookResponse {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    previewLink?: string;
    publishedDate?: string;
    publisher?: string;
    categories?: string[];
    pageCount?: number;
    language?: string;
    maturityRating?: string;
    averageRating?: number;
    ratingsCount?: number;
  };
}

/**
 * Convert HTTP image URLs to HTTPS to prevent mixed content warnings
 */
export function convertToHttps(url?: string): string | undefined {
  if (!url) return undefined;
  return url.replace(/^http:\/\//, "https://");
}

/**
 * Fetch a single book's complete data from Google Books API by ID
 */
export async function fetchBookById(bookId: string): Promise<BookItem | null> {
  try {
    const url = new URL(
      `https://www.googleapis.com/books/v1/volumes/${bookId}`,
    );
    url.searchParams.set("key", GOOGLE_BOOKS_API_KEY);

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error(`Failed to fetch book ${bookId}:`, response.statusText);
      return null;
    }

    const data: SingleBookResponse = await response.json();

    return {
      id: data.id,
      title: data.volumeInfo.title,
      authors: data.volumeInfo.authors,
      description: data.volumeInfo.description,
      imageUrl: convertToHttps(
        data.volumeInfo.imageLinks?.thumbnail ||
          data.volumeInfo.imageLinks?.smallThumbnail,
      ),
      previewLink: data.volumeInfo.previewLink,
      publishedDate: data.volumeInfo.publishedDate,
      publisher: data.volumeInfo.publisher,
      categories: data.volumeInfo.categories,
      pageCount: data.volumeInfo.pageCount,
      language: data.volumeInfo.language,
      maturityRating: data.volumeInfo.maturityRating,
      averageRating: data.volumeInfo.averageRating,
      ratingsCount: data.volumeInfo.ratingsCount,
    };
  } catch (error) {
    console.error(`Error fetching book ${bookId}:`, error);
    return null;
  }
}

/**
 * Fetch multiple books by IDs in parallel
 */
export async function fetchBooksById(bookIds: string[]): Promise<BookItem[]> {
  const results = await Promise.all(bookIds.map((id) => fetchBookById(id)));
  return results.filter((book): book is BookItem => book !== null);
}

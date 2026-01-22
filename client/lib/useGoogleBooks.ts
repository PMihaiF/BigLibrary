import { useState, useCallback } from "react";
import { convertToHttps } from "./bookUtils";

export interface BookItem {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  imageUrl?: string;
  previewLink?: string;
  publishedDate?: string;
  publisher?: string;
  categories?: string[];
  pageCount?: number;
  language?: string;
  maturityRating?: string;
  averageRating?: number;
  ratingsCount?: number;
}

interface GoogleBooksResponse {
  items?: Array<{
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
  }>;
  totalItems?: number;
}

const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || "";

export function useGoogleBooks() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const searchBooks = useCallback(
    async (
      query: string,
      orderBy: "relevance" | "newest" = "relevance",
      startIndex: number = 0,
      maxResults: number = 20,
    ) => {
      if (!query.trim()) {
        setBooks([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const url = new URL("https://www.googleapis.com/books/v1/volumes");
        url.searchParams.set("q", query);
        url.searchParams.set("key", GOOGLE_BOOKS_API_KEY);
        url.searchParams.set("maxResults", Math.min(maxResults, 40).toString());
        url.searchParams.set("startIndex", startIndex.toString());
        url.searchParams.set("orderBy", orderBy);
        url.searchParams.set(
          "projection",
          "lite", // Use lite projection to optimize response size
        );

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data: GoogleBooksResponse = await response.json();
        setTotalItems(data.totalItems || 0);

        if (data.items) {
          const transformedBooks: BookItem[] = data.items.map((item) => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            description: item.volumeInfo.description,
            imageUrl: convertToHttps(
              item.volumeInfo.imageLinks?.thumbnail ||
                item.volumeInfo.imageLinks?.smallThumbnail,
            ),
            previewLink: item.volumeInfo.previewLink,
            publishedDate: item.volumeInfo.publishedDate,
            publisher: item.volumeInfo.publisher,
            categories: item.volumeInfo.categories,
            pageCount: item.volumeInfo.pageCount,
            language: item.volumeInfo.language,
            maturityRating: item.volumeInfo.maturityRating,
            averageRating: item.volumeInfo.averageRating,
            ratingsCount: item.volumeInfo.ratingsCount,
          }));

          setBooks(transformedBooks);
        } else {
          setBooks([]);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch books";
        setError(message);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    books,
    loading,
    error,
    searchBooks,
    totalItems,
  };
}

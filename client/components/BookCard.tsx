import { useState, useEffect } from "react";
import { BookItem } from "@/lib/useGoogleBooks";
import { Star, ExternalLink, BookOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  addToFavorites,
  removeFromFavorites,
  isFavorited,
} from "@/lib/favoritesService";
import { useAuth } from "@/lib/auth-context";

interface BookCardProps {
  book: BookItem;
  onFavoriteChange?: () => void;
}

export function BookCard({ book, onFavoriteChange }: BookCardProps) {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if book is favorited on component mount
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, book.id]);

  const checkFavoriteStatus = async () => {
    if (!user) return;
    try {
      const favorited = await isFavorited(user.uid, book.id);
      setIsFav(favorited);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please sign in to add favorites");
      return;
    }

    setLoading(true);
    try {
      if (isFav) {
        await removeFromFavorites(user.uid, book.id);
        setIsFav(false);
      } else {
        await addToFavorites(
          user.uid,
          book.id,
          book.title,
          book.imageUrl,
          book.authors
        );
        setIsFav(true);
      }
      onFavoriteChange?.();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Error updating favorites: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30 flex flex-col h-full">
      {/* Book Cover */}
      <div className="relative overflow-hidden bg-muted/30 aspect-[3/4] flex items-center justify-center">
        {book.imageUrl ? (
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="text-center px-4">
              <BookOpen className="h-8 w-8 text-primary/50 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No Cover</p>
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={loading}
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer hover:scale-110"
          title={isFav ? "Remove from favorites" : "Add to favorites"}
          type="button"
        >
          <Heart
            className={`h-5 w-5 transition-all ${
              isFav
                ? "fill-red-500 text-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>
      </div>

      {/* Book Details */}
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {book.title}
        </h3>

        {book.authors && book.authors.length > 0 && (
          <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
            {book.authors.join(", ")}
          </p>
        )}

        {/* Rating */}
        {book.averageRating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(book.averageRating!)
                      ? "fill-accent text-accent"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {book.averageRating.toFixed(1)}
              {book.ratingsCount && ` (${book.ratingsCount})`}
            </span>
          </div>
        )}

        {/* Categories */}
        {book.categories && book.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="inline-block px-2 py-1 rounded-md bg-primary/10 text-xs font-medium text-primary">
              {book.categories[0]}
            </span>
          </div>
        )}

        {/* Description */}
        {book.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
            {book.description.replace(/<[^>]*>/g, "")}
          </p>
        )}

        {/* Meta Info */}
        <div className="text-xs text-muted-foreground space-y-1 mb-4">
          {book.publishedDate && (
            <p>Published: {book.publishedDate}</p>
          )}
          {book.pageCount && (
            <p>Pages: {book.pageCount}</p>
          )}
        </div>

        {/* Read Button */}
        {book.previewLink && (
          <Button
            asChild
            variant="outline"
            className="w-full h-9 text-sm group-hover:border-primary group-hover:text-primary transition-all"
          >
            <a href={book.previewLink} target="_blank" rel="noopener noreferrer">
              Read Preview
              <ExternalLink className="h-3 w-3 ml-2" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

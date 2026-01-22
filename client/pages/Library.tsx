import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { AppLogo } from "@/components/AppLogo";
import { useGoogleBooks, type BookItem } from "@/lib/useGoogleBooks";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Search,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  FileText,
  Heart,
} from "lucide-react";
import { getUserFavorites, FavoriteBook } from "@/lib/favoritesService";
import { fetchBooksById } from "@/lib/bookUtils";

export default function Library() {
  const { user, isAdmin, logOut } = useAuth();
  const { books, loading, searchBooks, totalItems } = useGoogleBooks();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteBook[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>("books");
  const itemsPerPage = 20;
  const initialLoadDone = useRef(false);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "fiction", label: "Fiction" },
    { value: "science", label: "Science" },
    { value: "technology", label: "Technology" },
    { value: "history", label: "History" },
    { value: "biography", label: "Biography" },
    { value: "self-help", label: "Self-Help" },
    { value: "mathematics", label: "Mathematics" },
    { value: "business", label: "Business" },
    { value: "education", label: "Education" },
    { value: "art", label: "Art & Design" },
    { value: "religion", label: "Religion & Philosophy" },
  ];

  // Load all books on initial page load
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      setLastSearchQuery("books");
      searchBooks("books", "relevance", 0, itemsPerPage);
    }
  }, [searchBooks]);

  // Handle pagination changes
  useEffect(() => {
    if (!showFavorites && currentPage > 0) {
      searchBooks(
        lastSearchQuery,
        "relevance",
        currentPage * itemsPerPage,
        itemsPerPage,
      );
    }
  }, [currentPage, searchBooks, showFavorites, lastSearchQuery]);

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    setFavoritesLoading(true);
    try {
      const userFavorites = await getUserFavorites(user.uid);

      // Try to fetch complete book data from Google Books API if API key is available
      const bookIds = userFavorites.map((fav) => fav.bookId);
      let enrichedBooks: any[] = [];

      if (bookIds.length > 0) {
        try {
          enrichedBooks = await fetchBooksById(bookIds);
        } catch (error) {
          console.warn(
            "Could not fetch book enrichment data - using stored data only",
          );
          enrichedBooks = [];
        }
      }

      // Merge API data with stored favorites data
      const enrichedFavorites: FavoriteBook[] = userFavorites.map((fav) => {
        const apiData = enrichedBooks.find((book) => book.id === fav.bookId);
        const enriched: any = {
          ...fav,
          imageUrl: apiData?.imageUrl || fav.imageUrl,
          authors: apiData?.authors || fav.authors,
        };
        if (apiData) {
          enriched.description = apiData.description;
          enriched.publishedDate = apiData.publishedDate;
          enriched.categories = apiData.categories;
          enriched.averageRating = apiData.averageRating;
          enriched.ratingsCount = apiData.ratingsCount;
          enriched.pageCount = apiData.pageCount;
          enriched.previewLink = apiData.previewLink;
        }
        return enriched;
      });

      setFavorites(enrichedFavorites);
      setCurrentPage(0);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  }, [user]);

  // Load favorites when showFavorites changes to true
  useEffect(() => {
    if (showFavorites && user) {
      console.log("Loading favorites for user:", user.uid);
      loadFavorites();
    }
  }, [showFavorites, user, loadFavorites]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    setSelectedCategory("all");
    setShowFavorites(false);
    const query = searchQuery.trim() || "books";
    setLastSearchQuery(query);
    searchBooks(query, "relevance", 0, itemsPerPage);
  };

  const handleCategoryChange = (value: string) => {
    setShowFavorites(false);
    setSelectedCategory(value);
    setCurrentPage(0);
    const baseQuery = searchQuery.trim() || "books";
    let finalQuery: string;
    if (value === "all") {
      finalQuery = baseQuery;
    } else {
      finalQuery = `${baseQuery} ${value}`;
    }
    setLastSearchQuery(finalQuery);
    searchBooks(finalQuery, "relevance", 0, itemsPerPage);
  };

  const handleToggleFavorites = useCallback(() => {
    if (!user) {
      alert("Please sign in to use favorites");
      return;
    }
    setShowFavorites((prev) => !prev);
    setCurrentPage(0);
  }, [user]);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Convert favorite books to book items for consistent rendering
  const favoriteBooksAsItems = favorites.map(
    (fav) =>
      ({
        id: fav.bookId,
        title: fav.title,
        imageUrl: fav.imageUrl || undefined,
        authors: fav.authors || undefined,
        description: (fav as any).description,
        publishedDate: (fav as any).publishedDate,
        categories: (fav as any).categories,
        averageRating: (fav as any).averageRating,
        ratingsCount: (fav as any).ratingsCount,
        pageCount: (fav as any).pageCount,
        previewLink: (fav as any).previewLink,
      }) as BookItem,
  );

  // Calculate pagination based on current view
  const displayBooks = showFavorites ? favoriteBooksAsItems : books;
  const totalPages = showFavorites
    ? Math.ceil(favorites.length / itemsPerPage)
    : Math.ceil(totalItems / itemsPerPage);

  // For favorites, paginate locally; for library, books are already paginated from API
  const paginatedBooks = showFavorites
    ? displayBooks.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage,
      )
    : displayBooks; // API already returns paginated results

  const displayedCount = showFavorites
    ? Math.min((currentPage + 1) * itemsPerPage, favorites.length)
    : Math.min(currentPage * itemsPerPage + displayBooks.length, totalItems);

  const totalCount = showFavorites ? favorites.length : totalItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      {/* Faded Library Background */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(15,23,42,0.8) 0%, transparent 50%, rgba(15,23,42,0.8) 100%),
            repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(59,130,246,0.05) 40px, rgba(59,130,246,0.05) 80px),
            repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(34,197,94,0.03) 30px, rgba(34,197,94,0.03) 60px)
          `,
          backgroundSize: "100% 100%, 100% 200px, 200px 100%",
        }}
      ></div>
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-blue-500/30">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Back Button with Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <ChevronLeft className="h-5 w-5 text-blue-300 group-hover:text-blue-200 transition-colors" />
            </Link>
            <Link to="/" className="flex items-center gap-3 group">
              <AppLogo
                size="lg"
                className="drop-shadow-lg group-hover:drop-shadow-xl transition-all group-hover:scale-110 group-hover:rotate-3"
              />
              <div className="hidden sm:block">
                <h1 className="font-black text-2xl bg-gradient-to-r from-purple-400 via-blue-400 via-cyan-300 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                  Big Library
                </h1>
                <p className="text-xs font-black bg-gradient-to-r from-purple-300 via-cyan-300 to-pink-300 bg-clip-text text-transparent tracking-widest">
                  KNOWLEDGE PALACE
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="font-bold text-blue-200/70 hover:text-blue-200 transition-colors"
            >
              Home
            </Link>
            <div className="font-bold text-blue-300">Browse Library</div>
            <Link
              to="/articles"
              className="font-bold text-blue-200/70 hover:text-blue-200 transition-colors"
            >
              Articles
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="font-bold text-blue-200/70 hover:text-blue-200 transition-colors flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-sm text-right">
              <p className="font-bold text-blue-300">{user?.email}</p>
              {isAdmin && (
                <p className="text-xs text-cyan-400 font-bold">Admin</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-blue-500/30 bg-slate-900/90 backdrop-blur">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                to="/"
                className="block font-bold text-blue-200/70 hover:text-blue-200 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <div className="font-bold text-blue-300">Browse Library</div>
              <Link
                to="/articles"
                className="block font-bold text-blue-200/70 hover:text-blue-200 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Articles
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block font-bold text-blue-200/70 hover:text-blue-200 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <div className="pt-4 border-t border-blue-500/30">
                <div className="text-sm mb-3">
                  <p className="font-bold text-blue-300">{user?.email}</p>
                  {isAdmin && (
                    <p className="text-xs text-cyan-400 font-bold">Admin</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full text-cyan-300 border-cyan-500/50 hover:bg-cyan-500/10"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            {showFavorites ? (
              <>
                My{" "}
                <span className="bg-gradient-to-r from-red-400 via-pink-400 to-red-500 bg-clip-text text-transparent">
                  Favorites
                </span>
              </>
            ) : (
              <>
                Browse{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Library
                </span>
              </>
            )}
          </h1>
          <p className="text-blue-200/90 text-lg font-medium">
            {showFavorites ? (
              <>
                {favorites.length === 0 ? (
                  <>You haven't favorited any books yet</>
                ) : (
                  <>
                    You have{" "}
                    <span className="font-bold text-cyan-300">
                      {favorites.length}
                    </span>{" "}
                    favorite{favorites.length !== 1 ? "s" : ""}
                  </>
                )}
              </>
            ) : (
              <>
                Discover and explore{" "}
                <span className="font-bold text-cyan-300">
                  {totalItems.toLocaleString()} books
                </span>{" "}
                and articles
              </>
            )}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-2 border-blue-500/50 rounded-2xl p-8 mb-12 backdrop-blur-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                <input
                  type="text"
                  placeholder="Search books and articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-blue-500/50 bg-slate-800/50 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  disabled={showFavorites}
                  title={
                    showFavorites
                      ? "Search is disabled when viewing favorites"
                      : ""
                  }
                />
              </div>
              <Button
                type="submit"
                disabled={loading || showFavorites}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white px-8 h-11 font-bold shadow-2xl shadow-blue-500/50 transition-all duration-300 rounded-lg"
              >
                Search
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              <div>
                <label className="text-sm font-black text-white block mb-3 uppercase tracking-widest">
                  Category
                </label>
                <Select
                  value={showFavorites ? "all" : selectedCategory}
                  onValueChange={handleCategoryChange}
                  disabled={showFavorites}
                >
                  <SelectTrigger className="h-11 rounded-lg border-2 border-blue-500/50 bg-slate-800/50 text-white focus:ring-blue-400 w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Favorites Tab */}
              <Button
                type="button"
                onClick={handleToggleFavorites}
                className={`h-11 flex items-center gap-2 transition-all ${
                  showFavorites
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/50"
                    : "bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 border border-blue-500/30"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${showFavorites ? "fill-white" : ""}`}
                />
                My Favorites
              </Button>

              {/* Results Info */}
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-200/80">
                  Showing{" "}
                  <span className="text-cyan-300">
                    {displayedCount > 0 ? displayedCount : 0}
                  </span>{" "}
                  of{" "}
                  <span className="text-blue-300">
                    {totalCount.toLocaleString()}
                  </span>{" "}
                  results
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        {showFavorites && favoritesLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : !showFavorites && loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : paginatedBooks.length > 0 ? (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              key={`books-${showFavorites}`}
            >
              {paginatedBooks.map((book, index) => (
                <BookCard
                  key={`${showFavorites ? "fav" : "lib"}-${book.id}-${index}`}
                  book={book}
                  onFavoriteChange={() => {
                    // Reload favorites if viewing favorites tab
                    if (showFavorites) {
                      loadFavorites();
                    }
                  }}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 py-8">
                <Button
                  variant="outline"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, i) => {
                      let pageNum = i;
                      if (currentPage > 2) {
                        pageNum = currentPage - 2 + i;
                      }
                      if (pageNum >= totalPages) return null;

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === currentPage ? "default" : "outline"
                          }
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-10 h-10"
                        >
                          {pageNum + 1}
                        </Button>
                      );
                    },
                  )}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                  }
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {showFavorites ? "No favorites yet" : "No books found"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {showFavorites
                ? "Start adding books to your favorites with the heart icon"
                : "Try a different search query"}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                if (showFavorites) {
                  setShowFavorites(false);
                  setSelectedCategory("all");
                  setCurrentPage(0);
                } else {
                  setSearchQuery("");
                  setCurrentPage(0);
                }
                setLastSearchQuery("books");
                searchBooks("books", "relevance", 0, itemsPerPage);
              }}
            >
              {showFavorites ? "Browse Library" : "Reset Search"}
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-500/30 bg-slate-900/80 py-12 mt-16">
        <div className="container mx-auto px-4 text-center text-sm">
          <p className="text-blue-300/60 font-semibold">
            © 2026 Big Library. Powered by Google Books API.
          </p>
        </div>
      </footer>
    </div>
  );
}

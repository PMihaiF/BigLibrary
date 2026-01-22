import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/AppLogo";
import {
  BookOpen,
  Search,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  LogIn,
  UserPlus,
  LayoutDashboard,
  FileText,
  ChevronLeft,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useGoogleBooks } from "@/lib/useGoogleBooks";
import { BookCard } from "@/components/BookCard";

export default function Index() {
  const { user, isAdmin, logOut } = useAuth();
  const navigate = useNavigate();
  const { books, loading: booksLoading, searchBooks } = useGoogleBooks();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load featured books on mount with popular query
    searchBooks("popular books", "relevance", 0, 12);
  }, [searchBooks]);

  const handleLogout = async () => {
    try {
      await logOut();
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchBooks(searchQuery, "relevance", 0, 12);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-blue-500/30">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="font-bold text-blue-300 hover:text-blue-200 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/library"
              className="font-bold text-blue-200/70 hover:text-blue-200 transition-colors"
            >
              Browse Library
            </Link>
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
                Admin
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-sm text-right">
              <p className="font-bold text-blue-300">{user?.email}</p>
              {isAdmin && (
                <p className="text-xs text-cyan-400 font-bold">ADMIN</p>
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
            className="md:hidden p-2 text-blue-300"
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
                className="block font-bold text-blue-300 hover:text-blue-200 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/library"
                className="block font-bold text-blue-200/70 hover:text-blue-200 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Browse Library
              </Link>
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
              <div className="pt-4 border-t border-blue-500/30 space-y-2">
                <div className="text-sm px-2 py-2">
                  <p className="font-bold text-blue-300">{user?.email}</p>
                  {isAdmin && (
                    <p className="text-xs text-cyan-400 font-bold">ADMIN</p>
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

      {/* Hero Section */}
      <section className="relative py-32 md:py-48 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Faded Library Background */}
        <div
          className="absolute inset-0 opacity-15 blur-sm animate-pulse"
          style={{
            backgroundImage:
              'url("https://images.pexels.com/photos/8045884/pexels-photo-8045884.jpeg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            animationDuration: "6s",
          }}
        ></div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl opacity-30"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-full backdrop-blur-sm">
              <p className="text-sm font-black text-transparent bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text flex items-center gap-2 uppercase tracking-widest">
                <Sparkles className="h-4 w-4 text-blue-400" />
                Welcome to your knowledge palace
              </p>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="block text-white mb-2">Your Digital</span>
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Knowledge Hub
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-blue-200/90 mb-10 max-w-2xl mx-auto">
              Explore{" "}
              <span className="font-bold text-cyan-300">1 million+ books</span>{" "}
              and{" "}
              <span className="font-bold text-blue-300">
                countless articles
              </span>
              . Powered by Google Books API.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto mb-12"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                <input
                  type="text"
                  placeholder="Search books and articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-blue-500/50 bg-slate-800/50 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                />
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 h-14 text-lg font-bold shadow-2xl shadow-blue-500/50 transition-all duration-300 rounded-lg"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/50 rounded-2xl backdrop-blur-sm group hover:border-blue-400 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  1M+
                </div>
                <p className="text-sm text-blue-200/80 font-bold uppercase tracking-widest">
                  Books Available
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/50 rounded-2xl backdrop-blur-sm group hover:border-cyan-400 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-300 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  500K+
                </div>
                <p className="text-sm text-cyan-200/80 font-bold uppercase tracking-widest">
                  Authors
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-700/20 to-blue-800/10 border border-blue-700/50 rounded-2xl backdrop-blur-sm group hover:border-blue-600 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  50+
                </div>
                <p className="text-sm text-blue-200/80 font-bold uppercase tracking-widest">
                  Categories
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
                Featured{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Resources
                </span>
              </h2>
              <p className="text-blue-200/80 font-medium text-lg">
                Explore trending books from our vast collection
              </p>
            </div>
            <Link to="/library">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 h-12 text-lg font-bold shadow-2xl shadow-blue-500/50 hidden md:flex">
                Browse All
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Books Grid */}
          {booksLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-blue-200/80 mb-4 text-lg font-medium">
                No books found. Try a different search.
              </p>
            </div>
          )}

          <div className="flex justify-center md:hidden">
            <Link to="/library">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 h-12 text-lg font-bold shadow-2xl shadow-blue-500/50">
                Browse All
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Big Library?
              </span>
            </h2>
            <p className="text-blue-200/80 max-w-2xl mx-auto text-lg font-medium">
              Everything you need for your intellectual adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-10 w-10" />,
                title: "Vast Collection",
                description:
                  "Access millions of books and articles from every discipline",
                color: "from-blue-500/20 to-blue-600/10",
                border: "border-blue-500/50",
              },
              {
                icon: <Users className="h-10 w-10" />,
                title: "Role-Based Access",
                description:
                  "Students explore, admins curate the finest knowledge",
                color: "from-cyan-500/20 to-cyan-600/10",
                border: "border-cyan-500/50",
              },
              {
                icon: <BarChart3 className="h-10 w-10" />,
                title: "Smart Search",
                description: "Powerful engine powered by Google Books API",
                color: "from-blue-700/20 to-blue-800/10",
                border: "border-blue-700/50",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${feature.color} ${feature.border} border-2 rounded-2xl p-10 backdrop-blur-sm hover:scale-105 hover:shadow-2xl transition-all duration-300 group cursor-pointer`}
              >
                <div className="text-blue-300 mb-6 group-hover:scale-125 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-blue-200/80 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/30 bg-slate-900/80 py-12">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="text-sm text-blue-300/60 font-semibold text-center">
            © 2026 Big Library. All rights reserved.
          </div>
          <div />
        </div>
      </footer>
    </div>
  );
}

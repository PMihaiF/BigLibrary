import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  LogOut,
  Menu,
  X as XIcon,
  LayoutDashboard,
  ChevronLeft,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  User,
  Sparkles,
} from "lucide-react";
import { getArticles, deleteArticle, Article } from "@/lib/articlesService";

export default function Articles() {
  const { user, isAdmin, logOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (error) {
      console.error("Failed to load articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      await deleteArticle(id);
      setArticles(articles.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Failed to delete article:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-blue-500/30">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Back Button with Home Link */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <ChevronLeft className="h-5 w-5 text-blue-300 group-hover:text-blue-200 transition-colors" />
            </Link>
            <Link
              to="/"
              className="flex items-center gap-3 group relative z-20"
            >
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="font-bold text-blue-200/70 hover:text-blue-200 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/library"
              className="font-bold text-blue-200/70 hover:text-blue-200 transition-colors"
            >
              Browse Library
            </Link>
            <Link to="/articles" className="font-bold text-blue-300">
              Articles
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="font-bold text-blue-200/70 hover:text-blue-200 transition-colors"
              >
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
            className="md:hidden p-2 text-blue-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <XIcon className="h-6 w-6" />
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
              <Link
                to="/library"
                className="block font-bold text-blue-200/70 hover:text-blue-200 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Browse Library
              </Link>
              <Link
                to="/articles"
                className="block font-bold text-blue-300"
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

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-blue-500/50 rounded-xl backdrop-blur-sm">
                <FileText className="h-8 w-8 text-blue-300" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Articles
              </h1>
            </div>
            <p className="text-xl text-blue-200/90 mb-8 font-medium max-w-2xl">
              Explore expert-written articles on various topics across multiple
              disciplines. Curated knowledge from leading academics.
            </p>
            {isAdmin && (
              <Link to="/admin">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 h-12 text-lg font-bold shadow-2xl shadow-blue-500/50 rounded-lg flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Publish Article
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="group bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-blue-500/50 rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="p-6 h-full flex flex-col">
                    {isAdmin && (
                      <div className="flex gap-2 mb-4 justify-end">
                        <Link to={`/admin?edit=${article.id}`}>
                          <button className="text-blue-300/70 hover:text-blue-200 hover:bg-blue-500/20 p-2 rounded-lg transition-all">
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteArticle(article.id);
                          }}
                          className="text-cyan-300/70 hover:text-cyan-200 hover:bg-cyan-500/20 p-2 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <h3 className="text-xl font-black text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all">
                      {article.title}
                    </h3>
                    <p className="text-blue-200/80 text-sm mb-4 font-medium flex-grow">
                      {article.description}
                    </p>
                    <div className="space-y-3 pt-4 border-t border-blue-500/30">
                      <div className="flex items-center justify-between text-xs text-blue-300/70 font-semibold">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-blue-300/50 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        <Sparkles className="h-3 w-3" />
                        Click to read
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-blue-500/50 rounded-2xl p-24 text-center backdrop-blur-sm">
              <FileText className="h-16 w-16 text-blue-300/50 mx-auto mb-4" />
              <p className="text-blue-200/80 mb-6 text-xl font-bold">
                No articles available yet
              </p>
              {isAdmin && (
                <Link to="/admin">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 h-12 font-bold shadow-2xl shadow-blue-500/50 rounded-lg inline-flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Publish the First Article
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-2 border-blue-500/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-900/80 to-cyan-900/80 backdrop-blur border-b border-blue-500/30 p-8 flex items-center justify-between">
              <h2 className="text-3xl font-black text-white">
                {selectedArticle.title}
              </h2>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-blue-300 hover:text-blue-200 hover:bg-blue-500/20 p-2 rounded-lg transition-all"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-6 text-sm text-blue-300 font-semibold">
                <div className="flex items-center gap-3 bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/50">
                  <User className="h-4 w-4" />
                  <span>By {selectedArticle.author}</span>
                </div>
                <div className="flex items-center gap-3 bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/50">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(selectedArticle.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-blue-200/90 whitespace-pre-wrap leading-relaxed font-medium text-base">
                  {selectedArticle.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-blue-500/30 bg-slate-900/80 py-12">
        <div className="container mx-auto px-4 flex justify-center">
          <p className="text-sm text-blue-300/60 font-semibold text-center">
            © 2026 Big Library. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

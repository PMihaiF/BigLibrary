import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  LogOut,
  Menu,
  X,
  Plus,
  Edit2,
  Trash2,
  LayoutDashboard,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  FileText,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  publishArticle,
  updateArticle,
  deleteArticle,
  getArticles,
  Article,
} from "@/lib/articlesService";

export default function AdminDashboard() {
  const { user, logOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
  });

  // Load articles on mount
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const articles = await getArticles();
      setArticles(articles);
    } catch (error) {
      console.error("Error loading articles:", error);
      setMessage({
        type: "error",
        text: "Failed to load articles",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.content) {
      setMessage({
        type: "error",
        text: "Please fill in all fields",
      });
      return;
    }

    setLoading(true);
    try {
      if (isEditing && editingId) {
        // Update existing article
        await updateArticle(editingId, {
          ...formData,
          author: user?.email || "Unknown",
        });
        setMessage({
          type: "success",
          text: "Article updated successfully",
        });
      } else {
        // Create new article
        await publishArticle({
          ...formData,
          author: user?.email || "Unknown",
        });
        setMessage({
          type: "success",
          text: "Article published successfully",
        });
      }

      // Reload articles
      const updatedArticles = await getArticles();
      setArticles(updatedArticles);

      // Reset form
      setFormData({
        title: "",
        description: "",
        content: "",
      });
      setIsEditing(false);
      setEditingId(null);

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving article:", error);
      setMessage({
        type: "error",
        text: "Failed to save article",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      description: article.description,
      content: article.content,
    });
    setIsEditing(true);
    setEditingId(article.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    setLoading(true);
    try {
      await deleteArticle(id);
      setArticles(articles.filter((article) => article.id !== id));
      setMessage({
        type: "success",
        text: "Article deleted successfully",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error deleting article:", error);
      setMessage({
        type: "error",
        text: "Failed to delete article",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-blue-500/30">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Back Button with Logo */}
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
                  ADMIN PANEL
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
            <div className="flex items-center gap-2 font-bold text-blue-300">
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-sm text-right">
              <p className="font-bold text-blue-300">{user?.email}</p>
              <p className="text-xs text-cyan-400 font-bold">Admin</p>
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
                className="block font-bold text-blue-200/70 hover:text-blue-200 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Articles
              </Link>
              <div className="font-bold text-blue-300">Admin Dashboard</div>
              <div className="pt-4 border-t border-blue-500/30">
                <div className="text-sm mb-3">
                  <p className="font-bold text-blue-300">{user?.email}</p>
                  <p className="text-xs text-cyan-400 font-bold">Admin</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-2 border-blue-500/50 rounded-2xl p-8 backdrop-blur-sm sticky top-24">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <Plus className="h-6 w-6 text-blue-300" />
                {isEditing ? "Edit Article" : "Publish Article"}
              </h2>

              {message && (
                <Alert
                  variant={message.type === "error" ? "destructive" : "default"}
                  className={`mb-6 ${
                    message.type === "error"
                      ? "bg-red-500/20 border-red-500/50"
                      : "bg-green-500/20 border-green-500/50"
                  }`}
                >
                  {message.type === "error" ? (
                    <AlertCircle className="h-4 w-4 text-red-300" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-300" />
                  )}
                  <AlertDescription
                    className={
                      message.type === "error"
                        ? "text-red-200"
                        : "text-green-200"
                    }
                  >
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label
                    htmlFor="title"
                    className="text-sm font-bold text-white uppercase tracking-widest block mb-2"
                  >
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Article title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="h-10 border-2 border-blue-500/50 bg-slate-800/50 text-white placeholder-blue-300/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="description"
                    className="text-sm font-bold text-white uppercase tracking-widest block mb-2"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="resize-none border-2 border-blue-500/50 bg-slate-800/50 text-white placeholder-blue-300/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    rows={2}
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="content"
                    className="text-sm font-bold text-white uppercase tracking-widest block mb-2"
                  >
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Article content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="resize-none border-2 border-blue-500/50 bg-slate-800/50 text-white placeholder-blue-300/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    rows={6}
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold shadow-2xl shadow-blue-500/50 rounded-lg h-10"
                  >
                    {loading
                      ? "Saving..."
                      : isEditing
                        ? "Update Article"
                        : "Publish Article"}
                  </Button>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={loading}
                      className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Articles List Section */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-4xl font-black text-white mb-2">
                Published{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Articles
                </span>
              </h2>
              <p className="text-blue-200/80 font-medium">
                {articles.length} article{articles.length !== 1 ? "s" : ""}{" "}
                published
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-5">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-blue-500/50 rounded-xl p-6 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-black text-white mb-2">
                        {article.title}
                      </h3>
                      <p className="text-blue-200/80 text-sm font-medium">
                        {article.description}
                      </p>
                    </div>

                    <p className="text-sm text-blue-200/70 line-clamp-2 mb-4">
                      {article.content}
                    </p>

                    <div className="flex items-center justify-between text-xs text-blue-300/70 mb-4 font-semibold">
                      <span>By {article.author}</span>
                      <span>{article.createdAt.toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(article)}
                        className="flex items-center gap-2 border-blue-500/50 text-blue-300 hover:bg-blue-500/10 font-semibold"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(article.id)}
                        className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-blue-500/50 rounded-xl p-16 text-center backdrop-blur-sm">
                <BookOpen className="h-12 w-12 text-blue-300/50 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-2">
                  No articles published yet
                </h3>
                <p className="text-blue-200/80 font-medium">
                  Start by publishing your first article using the form on the
                  left
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-500/30 bg-slate-900/80 py-12 mt-16">
        <div className="container mx-auto px-4 text-center text-sm">
          <p className="text-blue-300/60 font-semibold">
            © 2026 Big Library Admin Panel
          </p>
        </div>
      </footer>
    </div>
  );
}

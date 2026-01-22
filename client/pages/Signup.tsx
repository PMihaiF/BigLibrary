import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      // Add a small delay to ensure auth state updates before navigation
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 100);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home Button */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-300 hover:text-blue-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Signup Card */}
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-2 border-blue-500/50 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
          <div className="mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2">
              Join the Library
            </h1>
            <p className="text-blue-200/80 font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              Create your account to start exploring
            </p>
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="mb-6 bg-red-500/20 border-red-500/50"
            >
              <AlertCircle className="h-4 w-4 text-red-300" />
              <AlertDescription className="text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-bold text-white uppercase tracking-widest"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-lg border-2 border-blue-500/50 bg-slate-800/50 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-bold text-white uppercase tracking-widest"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-lg border-2 border-blue-500/50 bg-slate-800/50 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                disabled={loading}
              />
              <p className="text-xs text-blue-300/70 font-medium">
                Minimum 6 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-bold text-white uppercase tracking-widest"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-11 rounded-lg border-2 border-blue-500/50 bg-slate-800/50 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={
                loading ||
                !email ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword
              }
              className="w-full h-11 rounded-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white transition-all shadow-2xl shadow-blue-500/50 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-blue-500/30">
            <p className="text-sm text-center text-blue-200/80 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-300 hover:text-blue-200 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-blue-300/60 font-semibold">
          <p>Big Library - Knowledge Platform</p>
        </div>
      </div>
    </div>
  );
}

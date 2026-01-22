import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-block p-6 bg-primary/10 rounded-full mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
          404
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-foreground mb-2">
          Page Not Found
        </p>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          We couldn't find the page you're looking for. The book you're
          searching for might not exist yet.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="gap-2 bg-primary hover:bg-primary/90 px-6 h-11">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link to="/library">
            <Button
              variant="outline"
              className="gap-2 px-6 h-11 border-primary text-primary hover:bg-primary/5"
            >
              <Search className="h-4 w-4" />
              Browse Library
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Need help? <Link to="/" className="text-primary font-medium hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/AppLogo";
import {
  Users,
  BarChart3,
  LogIn,
  UserPlus,
  ArrowRight,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-blue-500/30">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group relative z-20">
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

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/50"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 md:py-48 overflow-hidden">
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
        <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl opacity-40"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="container mx-auto px-4 relative z-10 -mt-2.5">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-full backdrop-blur-sm hover:border-blue-400/80 transition-all duration-300">
              <p className="text-sm font-black text-transparent bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text flex items-center gap-2 uppercase tracking-widest">
                <Sparkles className="h-4 w-4 text-blue-400" />
                Your Infinite Knowledge Palace
              </p>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span className="block text-white mb-2">Explore</span>
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
                Infinite Knowledge
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-blue-200/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Explore{" "}
              <span className="text-cyan-300 font-bold">1 million+ books</span>{" "}
              and{" "}
              <span className="text-blue-300 font-bold">
                countless articles
              </span>{" "}
              curated by leading academics worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-10 h-14 text-lg font-bold shadow-2xl shadow-blue-500/50 hover:shadow-blue-400/60 transition-all duration-300 rounded-lg">
                  <UserPlus className="h-5 w-5 mr-3" />
                  Create Account Now
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="px-10 h-14 text-lg font-bold border-2 border-blue-400/80 text-blue-300 hover:bg-blue-500/10 hover:border-blue-300 transition-all duration-300 rounded-lg"
                >
                  <LogIn className="h-5 w-5 mr-3" />
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="p-8 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/50 rounded-2xl backdrop-blur-sm hover:border-blue-400 hover:from-blue-500/30 transition-all duration-300 group">
                <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  1M+
                </div>
                <p className="text-sm md:text-base text-blue-200/80 font-bold uppercase tracking-widest">
                  Books Available
                </p>
              </div>
              <div className="p-8 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/50 rounded-2xl backdrop-blur-sm hover:border-cyan-400 hover:from-cyan-500/30 transition-all duration-300 group">
                <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-300 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <p className="text-sm md:text-base text-cyan-200/80 font-bold uppercase tracking-widest">
                  Access
                </p>
              </div>
              <div className="p-8 bg-gradient-to-br from-blue-700/20 to-blue-800/10 border border-blue-700/50 rounded-2xl backdrop-blur-sm hover:border-blue-600 hover:from-blue-700/30 transition-all duration-300 group">
                <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  50+
                </div>
                <p className="text-sm md:text-base text-blue-200/80 font-bold uppercase tracking-widest">
                  Categories
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black mb-4">
              <span className="block text-white mb-2">Why Choose</span>
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Big Library?
              </span>
            </h2>
            <p className="text-blue-200/80 max-w-2xl mx-auto text-lg font-medium">
              Everything you need for your intellectual journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-10 w-10" />,
                title: "Vast Collection",
                description:
                  "Access millions of books and articles from every discipline imaginable",
                color: "from-blue-500/20 to-blue-600/10",
                border: "border-blue-500/50",
                textColor: "text-blue-300",
              },
              {
                icon: <Users className="h-10 w-10" />,
                title: "Expert Curated",
                description:
                  "Content published and validated by leading academic experts worldwide",
                color: "from-cyan-500/20 to-cyan-600/10",
                border: "border-cyan-500/50",
                textColor: "text-cyan-300",
              },
              {
                icon: <BarChart3 className="h-10 w-10" />,
                title: "Smart Discovery",
                description:
                  "Powerful AI-driven search to find exactly what you're looking for instantly",
                color: "from-blue-700/20 to-blue-800/10",
                border: "border-blue-700/50",
                textColor: "text-blue-400",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${feature.color} ${feature.border} border-2 rounded-2xl p-10 backdrop-blur-sm hover:scale-105 hover:shadow-2xl transition-all duration-300 group cursor-pointer`}
              >
                <div
                  className={`${feature.textColor} mb-6 group-hover:scale-125 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all duration-300">
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

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-500/30 via-cyan-500/20 to-blue-600/30 border-2 border-blue-500/50 rounded-3xl p-12 md:p-16 text-center backdrop-blur-sm hover:border-blue-400/80 transition-all duration-300">
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Ready to Transform
              <br />
              Your Learning?
            </h3>
            <p className="text-blue-200/90 mb-12 text-lg font-medium leading-relaxed">
              Join thousands of students, researchers, and lifelong learners
              discovering knowledge at their fingertips. Sign up for free today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-10 h-14 text-lg font-bold shadow-2xl shadow-blue-500/50 hover:shadow-blue-400/60 transition-all duration-300 rounded-lg w-full sm:w-auto">
                  Get Started Now
                  <ArrowRight className="h-5 w-5 ml-3" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="px-10 h-14 text-lg font-bold border-2 border-blue-400/80 text-blue-300 hover:bg-blue-500/10 hover:border-blue-300 transition-all duration-300 rounded-lg w-full sm:w-auto"
                >
                  Already a Member?
                </Button>
              </Link>
            </div>
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

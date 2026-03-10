import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="hero-glow fixed inset-0 pointer-events-none" />
      <div className="floating-orb w-[600px] h-[600px] bg-primary top-[-250px] right-[-200px]" />
      <div className="floating-orb w-[400px] h-[400px] bg-accent bottom-[-200px] left-[-150px]" />

      {/* Left panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="h-11 w-11 rounded-xl bg-primary/15 flex items-center justify-center gradient-border">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">
              Insight<span className="gradient-text">AI</span>
            </span>
          </div>

          <h1 className="text-4xl font-extrabold text-foreground leading-tight">
            Your data,{" "}
            <span className="gradient-text">understood</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Upload datasets, ask natural language questions, and receive
            instant AI-powered dashboards and insights.
          </p>

          <div className="mt-12 space-y-5">
            {[
              "Natural language to SQL conversion",
              "Auto-generated interactive charts",
              "Real-time processing pipeline",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse-subtle" />
                <span className="text-sm text-foreground/80">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center gradient-border">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              Insight<span className="gradient-text">AI</span>
            </span>
          </div>

          <div className="glass-panel p-8 md:p-10">
            <h2 className="text-2xl font-bold text-foreground">
              {isSignUp ? "Create account" : "Welcome back"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              {isSignUp ? "Start your analytics journey" : "Sign in to continue"}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {isSignUp && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <label className="text-sm font-medium text-foreground block mb-2">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-muted/50 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-muted/50 border border-border/50 rounded-xl pl-10 pr-11 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-gradient w-full py-3.5 flex items-center justify-center gap-2 group text-base"
              >
                {isSignUp ? "Create Account" : "Sign In"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <span className="font-medium text-primary">
                  {isSignUp ? "Sign in" : "Sign up"}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

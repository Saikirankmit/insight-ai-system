import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, BarChart3, Zap, Shield, ArrowRight,
  Brain, Database, TrendingUp, ChevronRight
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const features = [
  {
    icon: Brain,
    title: "Natural Language Queries",
    description: "Ask questions in plain English. Our AI understands context, intent, and generates precise analytics.",
  },
  {
    icon: BarChart3,
    title: "Auto-Generated Dashboards",
    description: "Beautiful charts and visualizations created instantly from your data — no configuration needed.",
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Watch your query transform through our AI pipeline in real-time with live progress tracking.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data never leaves the pipeline. Enterprise-grade security with end-to-end encryption.",
  },
];

const stats = [
  { value: "10x", label: "Faster Insights" },
  { value: "Zero", label: "SQL Required" },
  { value: "∞", label: "Chart Types" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="hero-glow fixed inset-0 pointer-events-none" />
      <div className="hero-glow-accent fixed inset-0 pointer-events-none" />
      <div className="floating-orb w-[500px] h-[500px] bg-primary top-[-200px] left-[-100px]" />
      <div className="floating-orb w-[400px] h-[400px] bg-accent bottom-[-150px] right-[-100px]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center gradient-border">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">
            Insight<span className="gradient-text">AI</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => navigate("/login")}
            className="btn-glass text-sm px-4 py-2"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/login")}
            className="btn-gradient text-sm px-5 py-2"
          >
            Get Started
          </button>
        </motion.div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-3xl">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Gemini AI
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.08] tracking-tight"
          >
            Turn questions into{" "}
            <span className="gradient-text">dashboards</span>{" "}
            instantly
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground mt-6 max-w-xl leading-relaxed"
          >
            Upload your data, ask in plain English, and watch AI generate
            beautiful SQL queries, charts, and insights in seconds.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-wrap items-center gap-4 mt-10"
          >
            <button
              onClick={() => navigate("/login")}
              className="btn-gradient text-base px-8 py-3.5 flex items-center gap-2 group"
            >
              Start Analyzing
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-glass text-base px-8 py-3.5 flex items-center gap-2"
            >
              See How It Works
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-20 flex flex-wrap gap-8 md:gap-16"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-extrabold gradient-text">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Everything you need for{" "}
            <span className="gradient-text">data intelligence</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-xl">
            From raw CSV to interactive dashboards in under 30 seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="glass-panel-hover p-7 group"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Three steps to{" "}
            <span className="gradient-text">clarity</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", icon: Database, title: "Upload Data", desc: "Drag & drop your CSV file. We parse schemas automatically." },
            { step: "02", icon: Brain, title: "Ask Anything", desc: "Type your question in plain English. AI handles the rest." },
            { step: "03", icon: TrendingUp, title: "Get Insights", desc: "Receive interactive charts, SQL queries, and data tables instantly." },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="relative glass-panel p-7"
            >
              <span className="text-5xl font-black gradient-text opacity-20 absolute top-4 right-6">
                {item.step}
              </span>
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="floating-orb w-[300px] h-[300px] bg-primary top-[-100px] right-[-50px]" />
          <div className="floating-orb w-[200px] h-[200px] bg-accent bottom-[-80px] left-[-30px]" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground relative z-10">
            Ready to unlock your data?
          </h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-md mx-auto relative z-10">
            Join the future of business intelligence. No SQL expertise required.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="btn-gradient text-base px-10 py-4 mt-8 relative z-10 flex items-center gap-2 mx-auto group"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">InsightAI</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2024 InsightAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

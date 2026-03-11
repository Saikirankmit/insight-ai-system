import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Database, Search, History, Settings,
  Sparkles, Moon, Sun, ChevronLeft, ChevronRight, LogOut
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { to: "/app", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/app/datasets", icon: Database, label: "Datasets" },
  { to: "/app/explorer", icon: Search, label: "Data Explorer" },
  { to: "/app/history", icon: History, label: "Query History" },
  { to: "/app/settings", icon: Settings, label: "Settings" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${collapsed ? "w-[72px]" : "w-64"} shrink-0 bg-gradient-to-b from-sidebar to-sidebar/60 border-r border-sidebar-border/50 flex flex-col transition-all duration-300 ease-out`}
    >
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-5"} h-16 border-b border-sidebar-border/50 backdrop-blur-sm`}>
        <motion.div
          whileHover={{ rotate: 20, scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/15 flex items-center justify-center shrink-0 border border-primary/30 hover:border-primary/50 transition-colors"
        >
          <Sparkles className="h-5 w-5 text-primary" />
        </motion.div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sidebar-accent-foreground font-bold text-lg tracking-tight">
              Insight<span className="text-primary">AI</span>
            </span>
            <span className="text-[10px] text-sidebar-foreground/50 font-medium">V3 Analytics</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-2 mt-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <motion.div
              key={to}
              whileHover={{ x: collapsed ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <RouterNavLink
                to={to}
                className={`group flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-primary/15 to-accent/10 text-primary border border-primary/40 shadow-lg shadow-primary/10"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground/90 border border-transparent hover:border-primary/20"
                }`}
              >
                <motion.div
                  animate={{ scale: active ? 1.2 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className={`h-5 w-5 shrink-0 transition-all duration-200 ${active ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"}`} />
                </motion.div>
                {!collapsed && <span>{label}</span>}
                {active && !collapsed && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto h-2 w-2 rounded-full bg-primary"
                  />
                )}
              </RouterNavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border/50 space-y-2 backdrop-blur-sm">
        <motion.button
          whileHover={{ x: collapsed ? 0 : 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground/90 w-full transition-all duration-300 group border border-transparent hover:border-primary/20"
        >
          {isDark ? (
            <Sun className="h-5 w-5 shrink-0 group-hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon className="h-5 w-5 shrink-0 group-hover:-rotate-12 transition-transform duration-300" />
          )}
          {!collapsed && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
        </motion.button>
        <motion.button
          whileHover={{ x: collapsed ? 0 : 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-destructive/15 hover:text-destructive/90 w-full transition-all duration-300 border border-transparent hover:border-destructive/30"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </motion.button>
        <motion.button
          whileHover={{ x: collapsed ? 0 : 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground/90 w-full transition-all duration-300 border border-transparent hover:border-primary/20"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 shrink-0" />
          ) : (
            <ChevronLeft className="h-5 w-5 shrink-0" />
          )}
          {!collapsed && <span>Collapse</span>}
        </motion.button>
      </div>
    </aside>
  );
}

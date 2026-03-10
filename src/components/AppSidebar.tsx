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
      className={`${collapsed ? "w-[68px]" : "w-64"} shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-out`}
    >
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-5"} h-16 border-b border-sidebar-border`}>
        <motion.div
          whileHover={{ rotate: 15 }}
          className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0"
        >
          <Sparkles className="h-5 w-5 text-primary" />
        </motion.div>
        {!collapsed && (
          <span className="text-sidebar-accent-foreground font-bold text-lg tracking-tight">
            Insight<span className="text-primary">AI</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 mt-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <RouterNavLink
              key={to}
              to={to}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? "bg-primary/10 text-primary font-semibold shadow-sm shadow-primary/5"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 ${active ? "" : "group-hover:scale-110"}`} />
              {!collapsed && <span>{label}</span>}
              {active && !collapsed && (
                <motion.div
                  layoutId="activeNav"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
            </RouterNavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground hover:bg-sidebar-accent/60 w-full transition-all duration-200 group"
        >
          {isDark ? (
            <Sun className="h-[18px] w-[18px] shrink-0 group-hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon className="h-[18px] w-[18px] shrink-0 group-hover:-rotate-12 transition-transform duration-300" />
          )}
          {!collapsed && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive w-full transition-all duration-200"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground hover:bg-sidebar-accent/60 w-full transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="h-[18px] w-[18px] shrink-0" />
          ) : (
            <ChevronLeft className="h-[18px] w-[18px] shrink-0" />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

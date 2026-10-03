import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, ClipboardList, Settings, LogOut, ArrowLeft, ShieldCheck, Sun, Moon, Menu as MenuIcon, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Overview", shortName: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Products & Stock", shortName: "Products", path: "/admin/products", icon: ShoppingBag },
    { name: "Order Management", shortName: "Orders", path: "/admin/orders", icon: ClipboardList },
    { name: "Store Settings", shortName: "Settings", path: "/admin/settings", icon: Settings }
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
      {/* Sidebar (Desktop - Fixed / Sticky Left Navigation) */}
      <aside className="w-64 h-full bg-[var(--bg-card)] border-r border-[var(--border-color)] flex flex-col justify-between shrink-0 hidden md:flex z-30">
        <div className="p-6 space-y-8 overflow-y-auto">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center font-serif-heading font-extrabold text-lg shadow-sm">
              HB
            </div>
            <div>
              <h2 className="font-serif-heading font-extrabold text-lg text-[var(--text-primary)] leading-tight">
                Hidden Bakers
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--accent-primary)] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[var(--accent-primary)] text-white shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar Actions */}
        <div className="p-6 border-t border-[var(--border-color)] space-y-3 shrink-0 bg-[var(--bg-card)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <div className="truncate">
              <p className="font-bold text-[var(--text-primary)] truncate">{user?.name}</p>
              <p className="text-[10px] text-[var(--text-muted)] capitalize">{user?.role} Staff</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer"
              title="Toggle Theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>

          <Link
            to="/"
            className="w-full py-2 px-3 rounded-xl border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Customer Site
          </Link>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout Session
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container - Independent Scroll */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Admin Header & 2x2 Navigation Bar */}
        <div className="md:hidden bg-[var(--bg-card)] border-b border-[var(--border-color)] shrink-0 z-40 shadow-xs">
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] text-white flex items-center justify-center font-serif-heading font-extrabold text-sm shadow-xs">
                HB
              </div>
              <div>
                <span className="font-serif-heading font-extrabold text-sm text-[var(--text-primary)] block leading-tight">
                  Bakery Admin
                </span>
                <span className="text-[9px] font-extrabold text-[var(--accent-primary)] uppercase tracking-wider block">
                  Akola Store
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] cursor-pointer"
                title="Toggle Theme"
              >
                {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              </button>
              <Link to="/" className="text-xs font-bold text-[var(--accent-primary)] px-2 py-1 rounded-lg border border-[var(--accent-primary)]/30 hover:bg-[var(--accent-light)]">
                Main Site
              </Link>
              <button onClick={handleLogout} className="text-xs font-bold text-rose-500 px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 cursor-pointer">
                Logout
              </button>
            </div>
          </div>

          {/* 2x2 Visible Grid Bar — All 4 Menu Sections */}
          <div className="grid grid-cols-2 gap-1.5 p-2 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-[11px] font-extrabold transition-all text-center ${
                    isActive
                      ? "bg-[var(--accent-primary)] text-white shadow-xs"
                      : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Scrollable Main Content Area */}
        <main className="p-4 sm:p-6 md:p-10 flex-1 overflow-y-auto min-h-0">{children}</main>
      </div>
    </div>
  );
};

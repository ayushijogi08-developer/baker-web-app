import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("admin@thehiddenbakers.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-primary)]">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)] text-white flex items-center justify-center font-serif-heading font-extrabold text-xl mx-auto shadow-md">
            HB
          </div>
          <h1 className="font-serif-heading font-extrabold text-2xl text-[var(--text-primary)]">
            Admin Staff Login
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Sign in to access store inventory, live order management, and bakery settings.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[var(--text-primary)] mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@thehiddenbakers.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[var(--text-primary)] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-medium"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-900 dark:text-amber-200">
            💡 Default Seed Admin: <b>admin@thehiddenbakers.com</b> / <b>admin123</b>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? "Authenticating..." : "Login to Admin Panel"} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>
      </div>
    </div>
  );
};

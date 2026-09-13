import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, User } from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, switchDemoRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      await login(email);
      onNavigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setLoading(true);
    try {
      await switchDemoRole(role);
      if (role === 'admin') onNavigate('/admin');
      else if (role === 'inspector') onNavigate('/analyze');
      else onNavigate('/wheelchair-token');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pt-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Sign In to AccessSmart
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Official Accessibility Portal & Verification Terminal
        </p>
      </div>

      {/* One-Click Demo Role Accounts for Testing */}
      <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-center space-y-2">
        <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
          Academic Evaluation One-Click Logins:
        </span>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleDemoLogin('wheelchair_user')}
            className="py-2 px-2.5 rounded-xl bg-white border border-blue-300 hover:bg-blue-600 hover:text-white font-bold text-blue-900 transition shadow-2xs truncate"
          >
            Wheelchair User
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('inspector')}
            className="py-2 px-2.5 rounded-xl bg-white border border-purple-300 hover:bg-purple-600 hover:text-white font-bold text-purple-900 transition shadow-2xs truncate"
          >
            AI Inspector
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('admin')}
            className="py-2 px-2.5 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-600 hover:text-white font-bold text-emerald-900 transition shadow-2xs truncate"
          >
            Gov Admin
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@college.edu or city.gov"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('/register')}
            className="text-blue-600 font-bold hover:underline"
          >
            Register new account
          </button>
        </div>
      </div>
    </div>
  );
};

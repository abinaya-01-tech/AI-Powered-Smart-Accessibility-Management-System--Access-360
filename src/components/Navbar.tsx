import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAccessibilitySettings } from '../context/AccessibilitySettingsContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  MapPin,
  QrCode,
  Sparkles,
  BarChart3,
  User,
  LogOut,
  SunMoon,
  Type,
  Menu,
  X,
  FileCheck2,
  Users
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, logout, switchDemoRole } = useAuth();
  const { highContrast, toggleHighContrast, textSize, cycleTextSize } = useAccessibilitySettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Portal', path: '/', roles: ['all'] },
    { label: 'Accessible Map', path: '/map', icon: MapPin, roles: ['all'] },
    { label: 'Verify Pass', path: '/verify-token', icon: QrCode, roles: ['all'] },
    { label: 'My Wheelchair Token', path: '/wheelchair-token', icon: ShieldCheck, roles: ['wheelchair_user'] },
    { label: 'User Dashboard', path: '/dashboard', icon: User, roles: ['wheelchair_user'] },
    { label: 'AI Image Inspection', path: '/analyze', icon: Sparkles, roles: ['inspector', 'admin'] },
    { label: 'Government Dashboard', path: '/admin', icon: BarChart3, roles: ['admin'] },
    { label: 'Audit Reports', path: '/admin/reports', icon: FileCheck2, roles: ['inspector', 'admin'] },
    { label: 'User Registry', path: '/admin/users', icon: Users, roles: ['admin'] },
  ];

  const visibleLinks = navLinks.filter(link => {
    if (link.roles.includes('all')) return true;
    if (!user) return false;
    return link.roles.includes(user.role);
  });

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Institutional Top Bar */}
      <div className="bg-slate-950 px-4 py-1 text-xs text-slate-300 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">
              Official Accessibility Infrastructure & Mobility Gateway
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* College project badge */}
            <span className="text-[11px] bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded border border-blue-700/50">
              YOLOv8 + OpenCV Vision
            </span>

            {/* Role Demo Switcher */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-400">Demo Role:</span>
              <button
                onClick={() => switchDemoRole('wheelchair_user')}
                className={`px-1.5 py-0.5 rounded ${
                  user?.role === 'wheelchair_user'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                User
              </button>
              <button
                onClick={() => switchDemoRole('inspector')}
                className={`px-1.5 py-0.5 rounded ${
                  user?.role === 'inspector'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Inspector
              </button>
              <button
                onClick={() => switchDemoRole('admin')}
                className={`px-1.5 py-0.5 rounded ${
                  user?.role === 'admin'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 text-left focus:outline-hidden focus:ring-2 focus:ring-blue-400 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight block leading-tight text-white">
                AccessSmart <span className="text-blue-400 font-semibold text-xs sm:text-sm">AI Portal</span>
              </span>
              <span className="text-[11px] text-slate-400 block tracking-wide uppercase font-medium">
                Public Accessibility Management
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {visibleLinks.map(link => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {link.icon && <link.icon className="w-4 h-4 shrink-0" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right utilities & Auth */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Accessibility Quick Controls */}
            <button
              onClick={toggleHighContrast}
              title="Toggle High Contrast Mode"
              aria-label="Toggle High Contrast Mode"
              className={`p-2 rounded-lg border transition ${
                highContrast
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <SunMoon className="w-4 h-4" />
            </button>

            <button
              onClick={cycleTextSize}
              title={`Text Size: ${textSize}`}
              aria-label={`Cycle Text Size, current is ${textSize}`}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 text-xs font-bold flex items-center gap-1"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="uppercase">{textSize}</span>
            </button>

            {/* User Profile / Logout */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
                <div className="text-right hidden md:block">
                  <span className="text-xs font-bold text-slate-200 block leading-tight truncate max-w-[130px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-400">
                    {user.role.replace('_', ' ')}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="p-2 rounded-lg bg-slate-800 text-rose-300 hover:bg-rose-950/50 hover:text-rose-200 border border-slate-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleHighContrast}
              className="p-2 rounded-lg bg-slate-800 text-slate-300"
              aria-label="Toggle High Contrast"
            >
              <SunMoon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {visibleLinks.map(link => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                currentPath === link.path ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {link.icon && <link.icon className="w-4 h-4 shrink-0" />}
              {link.label}
            </button>
          ))}

          <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div>
                  <span className="text-xs font-bold text-white block">{user.name}</span>
                  <span className="text-[10px] text-blue-400 uppercase">{user.role.replace('_', ' ')}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg bg-rose-900/60 text-rose-200 text-xs font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => handleNav('/login')}
                  className="flex-1 py-2 text-center bg-slate-800 rounded-lg text-xs font-bold"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="flex-1 py-2 text-center bg-blue-600 rounded-lg text-xs font-bold"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

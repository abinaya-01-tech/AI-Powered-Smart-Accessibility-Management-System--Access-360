import React from 'react';
import {
  ShieldCheck,
  MapPin,
  Sparkles,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  BarChart3,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user, switchDemoRole } = useAuth();

  const handleRoleSelect = async (role: UserRole, targetPath: string) => {
    await switchDemoRole(role);
    onNavigate(targetPath);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-radial-gradient from-blue-900/30 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-600/50 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Computer Vision + Privacy-Preserving Smart Access</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            AI-Powered Smart Accessibility Management System
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            A state-of-the-art municipal and campus infrastructure platform. Wheelchair users discover verified accessible facilities
            and unlock automated access via anonymous digital tokens, while certified inspectors deploy YOLOv8 computer vision to audit physical accessibility.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('/map')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition text-sm"
            >
              <MapPin className="w-4 h-4" />
              Explore Accessible Map
            </button>

            <button
              onClick={() => onNavigate('/verify-token')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl transition text-sm"
            >
              <QrCode className="w-4 h-4" />
              Verify Facility Pass
            </button>
          </div>
        </div>

        {/* Quick Tech Highlights Badge */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Vision Model</span>
            <span className="font-bold text-white">YOLOv8 + OpenCV</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Token Security</span>
            <span className="font-bold text-white">Cryptographic Nonce (Zero-PII)</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Geospatial</span>
            <span className="font-bold text-white">OpenStreetMap & Google</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Data Storage</span>
            <span className="font-bold text-white">Firestore Schema + RBAC</span>
          </div>
        </div>
      </section>

      {/* Role-Based Portals (Instant One-Click Entry) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Interactive Portals by Role
            </h2>
            <p className="text-sm text-slate-600">
              Select your role to access role-specific workflows and privileges.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wheelchair User Portal */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                  Public User Portal
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Wheelchair User Experience
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate and display your secure Wheelchair Access Token, present QR passes at entrance scanners, and navigate obstacle-free routes.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Anonymous cryptographic digital pass</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Real-time access verification logs</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleRoleSelect('wheelchair_user', '/wheelchair-token')}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-xl text-xs transition"
            >
              Enter as Wheelchair User
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Inspector Portal */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-purple-400 hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">
                  Inspector Portal
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  AI Computer Vision Audit
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload facility inspection images to detect ramps, handrails, lifts, accessible toilets, and stairs. Generate explainable scores.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>YOLOv8 bounding box annotations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Formulaic, transparent score breakdown</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleRoleSelect('inspector', '/analyze')}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold rounded-xl text-xs transition"
            >
              Enter as Inspector
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Government / Admin Portal */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                  Authority Portal
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Government Dashboard
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monitor municipal compliance, inspect problem facilities with low scores, review real-time access events, and analyze charts.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Facility compliance analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Problematic infrastructure alerts</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleRoleSelect('admin', '/admin')}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition"
            >
              Enter as Admin
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* How the System Works — Transparent Pipeline */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
            System Architecture & Standards
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            How the Smart Accessibility Pipeline Operates
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-base">Image Capture & Vision</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspectors photograph entrances, ramps, and pathways. The image is passed to a YOLO model running in Python OpenCV.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-base">Explainable Scoring</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Features are weighted mathematically: Ramps (+30), Handrails (+20), Lifts (+20), Toilets (+20), Stairs (-10).
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-base">Anonymous Digital Pass</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Users hold a cryptographically secure token (e.g. WAT-7X92-KL8P-QM41) encoding zero personal information for barrier-free entry.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
              4
            </div>
            <h4 className="font-bold text-slate-900 text-base">Authority Oversight</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Government officials track city-wide accessibility ratings, detect barriers, and deploy targeted infrastructure upgrades.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

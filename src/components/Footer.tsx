import React from 'react';
import { ShieldCheck, Info, Sparkles, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16 pt-12 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Project Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                AI-Powered Smart Accessibility Management System
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              A comprehensive college-level AI and accessibility engineering platform.
              Combines YOLO computer vision and OpenCV infrastructure verification with
              cryptographically secured, anonymous wheelchair access tokens and real-time
              authority monitoring dashboards.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                React 19 + Vite
              </span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                Express REST API
              </span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                Firestore Blueprint
              </span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                Python + YOLOv8 + OpenCV
              </span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                OpenStreetMap & Google Maps
              </span>
            </div>
          </div>

          {/* AI Specification */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              YOLO Detection Classes
            </h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Ramp (+30 pts)
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Handrail (+20 pts)
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Lift / Elevator (+20 pts)
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Accessible Toilet Sign (+20 pts)
              </li>
              <li className="flex items-center gap-1.5 text-rose-300">
                <span>⚠</span> Stairs (-10 pts penalty)
              </li>
            </ul>
          </div>

          {/* Legal and Privacy Disclaimer */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              Institutional Privacy Policy
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Tokens are strictly anonymous identifiers for facility entry and automated gate releases.
              The system does not perform biometric identification, facial recognition, or store sensitive health records.
            </p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-6 border-t border-slate-800 text-center md:flex md:justify-between text-xs text-slate-400">
          <p>© 2026 AI-Powered Smart Accessibility Management System. Academic & Municipal Infrastructure Project.</p>
          <p className="mt-2 md:mt-0 font-medium text-slate-300">
            Compliant with Section 508 & WCAG 2.1 AA Standards
          </p>
        </div>
      </div>
    </footer>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { WheelchairToken, AccessLog, LocationItem } from '../types';
import { ScoreBadge } from '../components/ScoreBadge';
import { QRCodeModal } from '../components/QRCodeModal';
import {
  ShieldCheck,
  QrCode,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  ExternalLink,
  Navigation
} from 'lucide-react';

interface UserDashboardProps {
  onNavigate: (path: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [token, setToken] = useState<WheelchairToken | null>(null);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [qrOpen, setQrOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const tokenRes = await api.getTokenByUserId(user.userId);
        setToken(tokenRes.token);

        if (tokenRes.token) {
          const logsRes = await api.getAccessLogs(tokenRes.token.tokenId);
          setLogs(logsRes.logs.slice(0, 5));
        }

        const locsRes = await api.getLocations({ minScore: 70 });
        setLocations(locsRes.locations.slice(0, 3));
      } catch (err: any) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block">
            Wheelchair Mobility Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Valued User'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Your anonymous Wheelchair Access Token is active and ready for automatic facility gate releases and priority lifts.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('/map')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-xs"
          >
            <MapPin className="w-4 h-4" />
            Find Accessible Facilities
          </button>
        </div>
      </div>

      {/* Main Grid: Active Token Pass & Quick Verification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Token Card */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Active Accessibility Pass</h3>
                <span className="text-xs text-slate-500 font-medium">Valid for all municipal facilities</span>
              </div>
            </div>

            {token?.status === 'ACTIVE' ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ACTIVE
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                {token?.status || 'NOT ISSUED'}
              </span>
            )}
          </div>

          {token ? (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Cryptographic Token Identifier
              </span>
              <code className="text-xl sm:text-3xl font-mono font-black text-blue-900 tracking-wider select-all block">
                {token.tokenId}
              </code>
              <p className="text-xs text-slate-500">
                Expires: {new Date(token.expiresAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <p className="text-xs text-slate-600 mb-3">No active token currently on file.</p>
              <button
                onClick={() => onNavigate('/wheelchair-token')}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Generate Token
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {token && (
              <button
                onClick={() => setQrOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-2xs"
              >
                <QrCode className="w-4 h-4" />
                Show QR Code
              </button>
            )}

            <button
              onClick={() => onNavigate('/wheelchair-token')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
            >
              Token Details & Revocation
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Verify Simulator Widget */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-3">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Test Facility Verification</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Verify your token against a facility scanner to test automated entrance gateway response in real-time.
            </p>
          </div>

          <button
            onClick={() => onNavigate(`/verify-token?token=${encodeURIComponent(token?.tokenId || '')}`)}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold rounded-xl text-xs transition"
          >
            Launch Verification Terminal
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Accessible Facilities Nearby */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Top Verified Accessible Locations</h3>
            <p className="text-xs text-slate-500">Audited buildings with step-free entrances and lifts</p>
          </div>
          <button
            onClick={() => onNavigate('/map')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
          >
            View All on Map
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {locations.map(loc => (
            <div key={loc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-sm text-slate-900 truncate">{loc.name}</h4>
                <ScoreBadge score={loc.accessibilityScore} category={loc.accessibilityCategory} size="sm" />
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 shrink-0" />
                {loc.address}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-blue-700 hover:underline font-semibold text-[11px]"
                >
                  <Navigation className="w-3 h-3" />
                  Route Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Modal */}
      {token && (
        <QRCodeModal
          tokenId={token.tokenId}
          isOpen={qrOpen}
          onClose={() => setQrOpen(false)}
        />
      )}
    </div>
  );
};

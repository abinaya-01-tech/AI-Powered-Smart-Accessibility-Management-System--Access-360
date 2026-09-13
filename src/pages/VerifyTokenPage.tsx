import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { VerificationResponse } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Building2,
  KeyRound,
  ArrowRight,
  History,
  Lock
} from 'lucide-react';

export const VerifyTokenPage: React.FC = () => {
  const [inputToken, setInputToken] = useState('');
  const [facility, setFacility] = useState('Central University Library - Automated Accessible Door');
  const [accessType, setAccessType] = useState('Power Door Release');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResponse | null>(null);

  // Check URL query parameters for preloaded token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) {
      setInputToken(t);
      handleVerify(t);
    }
  }, []);

  const handleVerify = async (tokenToVerify = inputToken) => {
    if (!tokenToVerify.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await api.verifyToken(tokenToVerify.trim(), 'FAC-VERIFIER-01', facility, accessType);
      setResult(res);
    } catch (err: any) {
      setResult({
        valid: false,
        tokenId: tokenToVerify,
        status: 'NOT_FOUND',
        accessAuthorized: false,
        message: err.message || 'Token verification failed',
        checkedAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const sampleTokens = [
    { label: 'Active Token', token: 'WAT-7X92-KL8P-QM41', type: 'active' },
    { label: 'Expired Token', token: 'WAT-4K99-M8P2-ZV71', type: 'expired' },
    { label: 'Revoked Token', token: 'WAT-8B33-N1W9-TR64', type: 'revoked' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
          Municipal Facility Access Gateway
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Wheelchair Token Verification Terminal
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Used by automated campus turnstiles, public library doors, and metro barrier scanners to validate entry rights anonymously.
        </p>
      </div>

      {/* Quick Test Token Chips */}
      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
          Academic Demo Quick-Test Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleTokens.map(sample => (
            <button
              key={sample.token}
              onClick={() => {
                setInputToken(sample.token);
                handleVerify(sample.token);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 text-slate-800 transition shadow-2xs"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  sample.type === 'active'
                    ? 'bg-emerald-500'
                    : sample.type === 'expired'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
              <span>{sample.label}:</span>
              <span className="text-blue-700 font-semibold">{sample.token}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Verification Input Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div>
          <label htmlFor="token-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Enter or Scan Token Identifier:
          </label>
          <div className="relative">
            <input
              id="token-input"
              type="text"
              value={inputToken}
              onChange={e => setInputToken(e.target.value.toUpperCase())}
              placeholder="e.g. WAT-7X92-KL8P-QM41"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 font-mono text-base sm:text-lg uppercase tracking-wider text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="facility-select" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Portal / Entrance Location:
            </label>
            <select
              id="facility-select"
              value={facility}
              onChange={e => setFacility(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 outline-hidden"
            >
              <option value="Central University Library - Automated Accessible Door">
                Central Library - Automated Accessible Door
              </option>
              <option value="Engineering Complex - Platform Lift & South Gate">
                Engineering Complex - Platform Lift & South Gate
              </option>
              <option value="Civic Metro Transit Hub - Platform 1 Priority Elevator">
                Civic Metro Hub - Platform 1 Priority Elevator
              </option>
              <option value="Student Services Pavilion - Level 1 ADA Barrier">
                Student Services Pavilion - Level 1 Barrier
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="access-type" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Access Mechanism:
            </label>
            <select
              id="access-type"
              value={accessType}
              onChange={e => setAccessType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 outline-hidden"
            >
              <option value="Power Door Release">Automated Power Door Release</option>
              <option value="Platform Lift Unlock">Platform Lift Unlock</option>
              <option value="Turnstile Bypass">Accessible Turnstile Bypass</option>
              <option value="Parking Gate Barrier">Accessible Parking Gate</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => handleVerify()}
          disabled={loading || !inputToken.trim()}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition shadow-sm disabled:opacity-50"
        >
          <KeyRound className="w-4 h-4" />
          {loading ? 'Verifying with Firestore...' : 'Verify Pass & Grant Access'}
        </button>
      </div>

      {/* Verification Result Card */}
      {result && (
        <div
          className={`rounded-3xl p-6 sm:p-8 border shadow-lg transition animate-in fade-in zoom-in-95 duration-200 ${
            result.accessAuthorized
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-2xl ${
                result.accessAuthorized ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {result.accessAuthorized ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <XCircle className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider block opacity-70">
                Gateway Decision
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                {result.accessAuthorized ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
              </h3>
              <p className="text-sm font-medium">{result.message}</p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                result.accessAuthorized ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
              }`}
            >
              {result.status}
            </span>
          </div>

          {/* Audit Details */}
          <div className="mt-6 pt-5 border-t border-current/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="opacity-70 block">Verified Token:</span>
              <span className="font-mono font-bold text-sm">{result.tokenId}</span>
            </div>
            <div>
              <span className="opacity-70 block">Timestamp:</span>
              <span className="font-semibold">{new Date(result.checkedAt).toLocaleTimeString()}</span>
            </div>
            <div>
              <span className="opacity-70 block">Audit Log ID:</span>
              <span className="font-mono font-semibold">
                {result.accessLog ? result.accessLog.id : 'RECORDED'}
              </span>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="mt-4 pt-3 border-t border-current/15 flex items-center gap-2 text-[11px] opacity-80">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>
              Zero-PII Compliance: The verification protocol returned authorization status only. No personal identity was exchanged.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

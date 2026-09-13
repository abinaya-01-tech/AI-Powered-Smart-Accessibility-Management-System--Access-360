import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { WheelchairToken, AccessLog } from '../types';
import { QRCodeModal } from '../components/QRCodeModal';
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Clock,
  History,
  Lock,
  Copy,
  Check,
  KeyRound,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface WheelchairTokenPageProps {
  onNavigate: (path: string) => void;
}

export const WheelchairTokenPage: React.FC<WheelchairTokenPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [token, setToken] = useState<WheelchairToken | null>(null);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchTokenAndLogs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const tokenRes = await api.getTokenByUserId(user.userId);
      setToken(tokenRes.token);

      if (tokenRes.token) {
        const logsRes = await api.getAccessLogs(tokenRes.token.tokenId);
        setLogs(logsRes.logs);
      } else {
        setLogs([]);
      }
    } catch (err: any) {
      console.error('Failed to load token:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenAndLogs();
  }, [user]);

  const handleGenerateNewToken = async () => {
    if (!user) return;
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await api.generateToken(user.userId);
      setToken(res.token);
      setMessage({ type: 'success', text: 'New cryptographically secure Wheelchair Access Token issued successfully.' });
      const logsRes = await api.getAccessLogs(res.token.tokenId);
      setLogs(logsRes.logs);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to generate token' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeToken = async () => {
    if (!token) return;
    if (!window.confirm('Are you sure you wish to revoke this Wheelchair Access Token? Facility gates will immediately reject it.')) {
      return;
    }
    setActionLoading(true);
    setMessage(null);
    try {
      await api.revokeToken(token.tokenId);
      setMessage({ type: 'success', text: 'Token has been revoked. You can generate a new one at any time.' });
      await fetchTokenAndLogs();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to revoke token' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopy = () => {
    if (!token) return;
    navigator.clipboard.writeText(token.tokenId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ACTIVE
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            EXPIRED
          </span>
        );
      case 'REVOKED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            REVOKED
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
            Digital Accessibility Credential
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Wheelchair Access Token
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Present this credential at automated door releases, platform lifts, and accessible transit barriers.
          </p>
        </div>

        <button
          onClick={handleGenerateNewToken}
          disabled={actionLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
          {token ? 'Reissue New Token' : 'Generate Access Token'}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Token Digital Card */}
      {token ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Official Mobility Gateway Pass
                </span>
                <span className="text-base font-bold text-slate-900">
                  Municipal Smart Accessibility Registry
                </span>
              </div>
            </div>

            <div>{getStatusBadge(token.status)}</div>
          </div>

          {/* Token String Display */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Cryptographic Token Identifier
            </span>
            <div className="flex items-center justify-center gap-3">
              <code className="text-2xl sm:text-4xl font-mono font-black text-blue-900 tracking-wider select-all">
                {token.tokenId}
              </code>
              <button
                onClick={handleCopy}
                title="Copy Token to Clipboard"
                className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Format: <span className="font-mono font-semibold">WAT-XXXX-XXXX-XXXX</span> • Pseudo-random high-entropy nonce
            </p>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 font-medium block">Issued On:</span>
              <span className="font-bold text-slate-800">
                {new Date(token.createdAt).toLocaleDateString()} at{' '}
                {new Date(token.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Valid Until:</span>
              <span className="font-bold text-slate-800">
                {new Date(token.expiresAt).toLocaleDateString()} at{' '}
                {new Date(token.expiresAt).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setQrOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition"
            >
              <QrCode className="w-4 h-4" />
              Show QR Code Pass
            </button>

            <button
              onClick={() => onNavigate(`/verify-token?token=${encodeURIComponent(token.tokenId)}`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold rounded-xl transition"
            >
              <KeyRound className="w-4 h-4" />
              Test Token Verification
            </button>

            {token.status === 'ACTIVE' && (
              <button
                onClick={handleRevokeToken}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold rounded-xl border border-rose-200 transition ml-auto disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Revoke Token
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Active Wheelchair Token</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            You do not currently have an issued token. Generate your official cryptographic accessibility pass to enable smart gate and lift access.
          </p>
          <button
            onClick={handleGenerateNewToken}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition shadow-sm"
          >
            <RotateCw className="w-4 h-4" />
            Generate Wheelchair Access Token
          </button>
        </div>
      )}

      {/* Privacy & Cryptography Policy Card */}
      <div className="bg-blue-50/70 rounded-2xl p-6 border border-blue-200/80 text-xs space-y-3">
        <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
          <Lock className="w-4 h-4 text-blue-700" />
          <span>Security & Zero-PII Privacy Protection</span>
        </div>
        <p className="text-blue-950/80 leading-relaxed">
          <strong>Cryptographic Anonymity:</strong> Tokens are produced via a cryptographically secure random generator
          yielding 1.5 × 10¹⁴ possible combinations. The token contains <strong>zero personal identifiable information (PII)</strong>,
          medical classifications, or user names. Scanning a token simply confirms facility entitlement without exposing private data.
        </p>
      </div>

      {/* Access Event History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" />
            <h3 className="font-bold text-slate-900 text-base">Facility Access Verification History</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">{logs.length} logged events</span>
        </div>

        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Location / Portal</th>
                  <th className="py-2.5 px-3">Access Mechanism</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{log.location}</td>
                    <td className="py-3 px-3">{log.accessType}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">
            No access verification events logged yet. Use this token at a facility scanner to test!
          </p>
        )}
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

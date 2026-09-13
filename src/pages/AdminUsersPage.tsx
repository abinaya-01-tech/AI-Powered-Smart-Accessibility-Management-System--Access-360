import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, AccessLog } from '../types';
import {
  Users,
  ShieldCheck,
  History,
  KeyRound,
  CheckCircle2,
  Lock,
  Search,
  Clock
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'users' | 'logs'>('users');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const usersRes = await api.getDemoUsers();
        setUsers(usersRes.users);

        const logsRes = await api.getAccessLogs();
        setLogs(logsRes.logs);
      } catch (err: any) {
        console.error('Failed to load admin registry:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
          Municipal Access Control & Identity Registry
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          System Registry & Facility Access Logs
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Monitor authenticated personnel, anonymous token credentials, and real-time entrance telemetry.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition inline-flex items-center gap-2 ${
            tab === 'users'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Registered Accounts ({users.length})
        </button>

        <button
          onClick={() => setTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition inline-flex items-center gap-2 ${
            tab === 'logs'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          All Facility Access Logs ({logs.length})
        </button>
      </div>

      {tab === 'users' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">User ID</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Active Token</th>
                  <th className="py-3.5 px-4 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map(u => (
                  <tr key={u.userId} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{u.userId}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.role === 'inspector'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-blue-800">
                      {u.tokenId || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-right">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Log ID</th>
                  <th className="py-3.5 px-4">Token Nonce</th>
                  <th className="py-3.5 px-4">Entrance / Facility</th>
                  <th className="py-3.5 px-4">Access Mechanism</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{log.id}</td>
                    <td className="py-3.5 px-4 font-mono text-blue-800 font-semibold">{log.tokenId}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.location}</td>
                    <td className="py-3.5 px-4">{log.accessType}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

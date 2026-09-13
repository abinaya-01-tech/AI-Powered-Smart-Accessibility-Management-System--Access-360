import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AdminStatistics } from '../types';
import { ScoreBadge } from '../components/ScoreBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ExternalLink,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getAdminStatistics();
        setStats(data);
      } catch (err: any) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        Aggregating municipal infrastructure statistics...
      </div>
    );
  }

  const { summary, charts, problematicLocations } = stats;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
            Government Authority Oversight
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Municipal Accessibility Infrastructure Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time compliance monitoring, barrier analytics, and automated access pass telemetry.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('/admin/reports')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
          >
            <FileCheck2 className="w-4 h-4" />
            View All Reports
          </button>
          <button
            onClick={() => onNavigate('/analyze')}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            New Inspection
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Locations
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary.totalLocations}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Civic & Campus</span>
        </div>

        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
            Highly Accessible
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900">
            {summary.highlyAccessible}
          </div>
          <span className="text-[11px] text-emerald-700 block mt-1">Score 80–100</span>
        </div>

        <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
            Accessible
          </span>
          <div className="text-2xl sm:text-3xl font-black text-blue-900">
            {summary.accessible}
          </div>
          <span className="text-[11px] text-blue-700 block mt-1">Score 60–79</span>
        </div>

        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
            Partially Accessible
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-900">
            {summary.partiallyAccessible}
          </div>
          <span className="text-[11px] text-amber-700 block mt-1">Score 40–59</span>
        </div>

        <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block mb-1">
            Poor Accessibility
          </span>
          <div className="text-2xl sm:text-3xl font-black text-rose-900">
            {summary.poorAccessibility}
          </div>
          <span className="text-[11px] text-rose-700 block mt-1">Score &lt; 40 (Action)</span>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
            Verified Passes
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {summary.verifiedAccessEvents}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Automated entries</span>
        </div>
      </div>

      {/* Charts Row 1: Score Distribution & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Accessibility Score Distribution</h3>
            <p className="text-xs text-slate-500">Number of inspected buildings by score bracket</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.scoreBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {charts.scoreBuckets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Facilities by Accessibility Category</h3>
            <p className="text-xs text-slate-500">Proportion of campus infrastructure classifications</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {charts.categoryDistribution.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Feature Compliance & Access Events Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Compliance % */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Infrastructure Feature Coverage</h3>
            <p className="text-xs text-slate-500">Percentage of inspected buildings equipped with feature</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={charts.featureCompliance}
                margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
                <YAxis dataKey="feature" type="category" tick={{ fontSize: 11, fill: '#334155' }} />
                <Tooltip
                  formatter={(value: any) => [`${value}% compliance`, 'Coverage']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="percentage" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Access Events Timeline */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">7-Day Access Gateway Telemetry</h3>
            <p className="text-xs text-slate-600">Daily authorized wheelchair passes validated at barriers</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.accessTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="authorized"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Problematic Locations Alert Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-lg">
              Priority Infrastructure Action Required (Score &lt; 60)
            </h3>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            {problematicLocations.length} Facilities Flagged
          </span>
        </div>

        <p className="text-xs text-slate-600">
          The following facilities have received low accessibility compliance scores. Immediate retrofitting or ramp installations are mandated.
        </p>

        <div className="divide-y divide-slate-100">
          {problematicLocations.map(loc => (
            <div key={loc.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">{loc.id}</span>
                  <h4 className="font-bold text-slate-900 text-sm">{loc.name}</h4>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {loc.address}
                </p>
                <div className="flex gap-2 text-[11px] pt-1">
                  {loc.features.stairs && (
                    <span className="text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      ⚠ Steep Stairs Identified
                    </span>
                  )}
                  {!loc.features.ramp && (
                    <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Missing Ground Ramp
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ScoreBadge score={loc.accessibilityScore} category={loc.accessibilityCategory} size="sm" />
                <button
                  onClick={() => onNavigate('/analyze')}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                >
                  Schedule Audit
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

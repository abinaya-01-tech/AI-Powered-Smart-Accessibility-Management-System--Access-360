import React from 'react';
import { AccessibilityCategory } from '../types';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ScoreBadgeProps {
  score: number;
  category: AccessibilityCategory;
  showDetails?: boolean;
  detectedFeatures?: string[];
  issues?: string[];
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  category,
  showDetails = false,
  detectedFeatures = [],
  issues = [],
  size = 'md'
}) => {
  let colorClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  let badgeClass = 'bg-emerald-600 text-white';
  let progressColor = 'bg-emerald-500';

  if (score < 40) {
    colorClass = 'bg-rose-50 text-rose-800 border-rose-300';
    badgeClass = 'bg-rose-600 text-white';
    progressColor = 'bg-rose-500';
  } else if (score < 60) {
    colorClass = 'bg-amber-50 text-amber-800 border-amber-300';
    badgeClass = 'bg-amber-600 text-white';
    progressColor = 'bg-amber-500';
  } else if (score < 80) {
    colorClass = 'bg-blue-50 text-blue-800 border-blue-300';
    badgeClass = 'bg-blue-600 text-white';
    progressColor = 'bg-blue-500';
  }

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${colorClass}`}>
        <span className="font-bold">{score}/100</span>
        <span>•</span>
        <span>{category}</span>
      </span>
    );
  }

  return (
    <div className={`rounded-xl p-5 border ${colorClass} shadow-xs`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Accessibility Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight">{score}</span>
            <span className="text-slate-500 text-base font-semibold">/ 100</span>
          </div>
        </div>
        <span className={`px-3.5 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase shadow-xs ${badgeClass}`}>
          {category}
        </span>
      </div>

      {/* Progress meter */}
      <div className="w-full bg-slate-200 h-2.5 rounded-full mt-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
          style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
        />
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-current/15 space-y-3 text-sm">
          {detectedFeatures.length > 0 && (
            <div>
              <span className="font-semibold block mb-1">Detected Infrastructure:</span>
              <div className="flex flex-wrap gap-1.5">
                {detectedFeatures.map(feat => (
                  <span
                    key={feat}
                    className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded text-xs font-medium border border-current/10"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {feat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}

          {issues.length > 0 && (
            <div className="text-rose-900 bg-rose-100/70 p-2.5 rounded-md border border-rose-200">
              <div className="flex items-center gap-1.5 font-semibold text-xs uppercase mb-1 text-rose-700">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Issues Identified:</span>
              </div>
              <ul className="list-disc list-inside text-xs space-y-0.5">
                {issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

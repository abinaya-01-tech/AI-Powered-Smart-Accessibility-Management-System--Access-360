import React, { useState } from 'react';
import { api } from '../services/api';
import { ScoreBadge } from '../components/ScoreBadge';
import { useAuth } from '../context/AuthContext';
import {
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Layers,
  Save,
  Info,
  RefreshCw,
  Eye,
  Check,
  Building2
} from 'lucide-react';

interface AnalyzePageProps {
  onNavigate: (path: string) => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [facilityName, setFacilityName] = useState('Central Campus Library - West Entrance');
  const [error, setError] = useState<string | null>(null);

  // Preset sample inspection files for instant testing
  const samplePresets = [
    {
      name: 'campus_ramp_entrance.jpg',
      label: 'Campus Ramp & Handrail',
      url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'steep_heritage_stairs.jpg',
      label: 'Steep Heritage Stairs (Barrier)',
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'accessible_lift_lobby.jpg',
      label: 'Transit Platform Lift',
      url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'accessible_toilet_sign.jpg',
      label: 'ADA Restroom Sign',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
      setSavedSuccess(false);
      setError(null);
    }
  };

  const handleSelectPreset = async (preset: typeof samplePresets[0]) => {
    setError(null);
    setSavedSuccess(false);
    setPreviewUrl(preset.url);

    try {
      const response = await fetch(preset.url);
      const blob = await response.blob();
      const file = new File([blob], preset.name, { type: 'image/jpeg' });
      setSelectedFile(file);
    } catch {
      // Fallback dummy file
      const dummyBlob = new Blob(['sample-data'], { type: 'image/jpeg' });
      const file = new File([dummyBlob], preset.name, { type: 'image/jpeg' });
      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const result = await api.analyzeImage(selectedFile);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || 'Analysis encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!analysisResult) return;
    setSaveLoading(true);
    setError(null);

    try {
      await api.saveReport({
        locationName: facilityName,
        score: analysisResult.score,
        category: analysisResult.category,
        detections: analysisResult.detections,
        recommendations: analysisResult.recommendations,
        issues: analysisResult.issues,
        imageUrl: previewUrl || '',
        annotatedImageUrl: analysisResult.annotatedImageUrl || previewUrl || '',
        inspectorId: user?.userId || 'USER-INSPECTOR-01',
        inspectorName: user?.name || 'Certified Accessibility Inspector',
        isDemoMode: analysisResult.isDemoMode,
        modelStatus: analysisResult.modelStatus
      });
      setSavedSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to save report to Firestore.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 block">
            Inspector Computer Vision Audit
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            AI Accessibility Verification & Scoring
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Detect accessibility infrastructure using YOLOv8 and generate mathematically explainable compliance scores.
          </p>
        </div>

        {/* Model Status Badge */}
        {analysisResult && (
          <div>
            {analysisResult.isDemoMode ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                DEMO MODE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                REAL AI RESULT (YOLOv8 + OpenCV)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Preset Scenario Selectors */}
      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
          Select a sample inspection image or upload your own:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {samplePresets.map(preset => (
            <button
              key={preset.name}
              onClick={() => handleSelectPreset(preset)}
              className="p-2.5 rounded-xl text-left bg-white border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 text-slate-800 transition shadow-2xs group"
            >
              <span className="block text-xs font-bold truncate group-hover:text-purple-900">
                {preset.label}
              </span>
              <span className="block text-[10px] text-slate-400 font-mono truncate">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload and Target Facility Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Audited Facility Name:
            </label>
            <input
              type="text"
              value={facilityName}
              onChange={e => setFacilityName(e.target.value)}
              placeholder="e.g. Central Campus Library - West Entrance"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-purple-600 outline-hidden font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Inspection Photo:
            </label>

            <div className="relative border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-2xl p-6 text-center transition bg-slate-50/50">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm">
                  <span className="font-bold text-purple-700">Click to upload</span> or drag and drop
                </div>
                <p className="text-xs text-slate-500">
                  JPEG, PNG, or WEBP (Max 10MB)
                </p>
                {selectedFile && (
                  <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-900 font-mono text-xs font-bold rounded-md">
                    Selected: {selectedFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-sm transition shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Processing with YOLOv8 Vision...' : 'Analyze Accessibility Infrastructure'}
          </button>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Quick Image Preview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Photo Evidence Preview
            </span>
            {previewUrl ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 aspect-4/3 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Inspection site"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 aspect-4/3 flex items-center justify-center text-slate-400 text-xs">
                No image loaded
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100 text-[11px] text-purple-950/80">
            <span className="font-bold block mb-1">Target Detection Classes:</span>
            <span>Ramp (+30), Handrail (+20), Lift (+20), Toilet (+20), Stairs (-10)</span>
          </div>
        </div>
      </div>

      {/* Analysis Output Section */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Demo Mode Notice Banner */}
          {analysisResult.isDemoMode && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3 text-xs">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-bold">DEMO MODE</strong>
                <p className="mt-0.5 opacity-90">
                  {analysisResult.notice ||
                    'The backend is presenting explainable inspection results using deterministic rule-based evaluation. Connect best.pt in ai-service/models/ for live YOLO model execution.'}
                </p>
              </div>
            </div>
          )}

          {/* Scores and Visual Comparisons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Card */}
            <div>
              <ScoreBadge
                score={analysisResult.score}
                category={analysisResult.category}
                showDetails={true}
                detectedFeatures={analysisResult.detectedFeatures}
                issues={analysisResult.issues}
              />
            </div>

            {/* Detections Breakdown Table */}
            <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">
                  Detected Infrastructure Elements
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  {analysisResult.detections.length} objects localized
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-2.5 px-3">Class</th>
                      <th className="py-2.5 px-3">Confidence</th>
                      <th className="py-2.5 px-3">Impact</th>
                      <th className="py-2.5 px-3 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {analysisResult.detections.map((det: any, idx: number) => {
                      const isStairs = det.class === 'stairs';
                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-bold text-slate-900">
                            {det.class.replace(/_/g, ' ').toUpperCase()}
                          </td>
                          <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                            {Math.round(det.confidence * 100)}%
                          </td>
                          <td className="py-3 px-3 font-bold">
                            {isStairs ? (
                              <span className="text-rose-600">-10 pts (Barrier)</span>
                            ) : det.class === 'ramp' ? (
                              <span className="text-emerald-600">+30 pts (Primary)</span>
                            ) : (
                              <span className="text-emerald-600">+20 pts</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                                isStairs
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isStairs ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                              {isStairs ? 'Barrier Flag' : 'Compliant'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Formulaic Breakdown */}
              {analysisResult.breakdown && analysisResult.breakdown.length > 0 && (
                <div className="pt-3 border-t border-slate-100 text-xs">
                  <span className="font-bold text-slate-700 block mb-1.5">Score Calculation Walkthrough:</span>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.breakdown.map((item: any, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700 font-mono text-[11px]">
                        {item.rule}: <strong className="text-blue-700">{item.points}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actionable Recommendations Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-purple-600" />
              Inspector Recommendations & Action Items
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-2">
                <span className="font-bold text-purple-900 block uppercase tracking-wider text-[11px]">
                  Recommended Engineering Interventions:
                </span>
                <ul className="list-disc list-inside space-y-1 text-purple-950">
                  {analysisResult.recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block uppercase tracking-wider text-[11px]">
                  Official Audit Submission:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Saving this report records it into the persistent Firestore database. The facility's public accessibility score and status on the interactive map will automatically update.
                </p>

                <div className="pt-2">
                  <button
                    onClick={handleSaveReport}
                    disabled={saveLoading || savedSuccess}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-xs disabled:opacity-75"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        Report Saved to Firestore!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {saveLoading ? 'Writing to Firestore...' : 'Save Official Report to Firestore'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

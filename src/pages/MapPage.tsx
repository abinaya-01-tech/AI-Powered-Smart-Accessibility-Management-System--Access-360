import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LocationItem } from '../types';
import { InteractiveMap } from '../components/InteractiveMap';
import { ScoreBadge } from '../components/ScoreBadge';
import {
  Search,
  Filter,
  CheckCircle2,
  MapPin,
  SlidersHorizontal,
  Navigation,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export const MapPage: React.FC = () => {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [minScore, setMinScore] = useState(0);
  const [filterRamp, setFilterRamp] = useState(false);
  const [filterLift, setFilterLift] = useState(false);
  const [filterHandrail, setFilterHandrail] = useState(false);
  const [filterToilet, setFilterToilet] = useState(false);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await api.getLocations({
        search: search.trim() || undefined,
        category: category !== 'ALL' ? category : undefined,
        minScore: minScore > 0 ? minScore : undefined,
        ramp: filterRamp || undefined,
        lift: filterLift || undefined,
        handrail: filterHandrail || undefined,
        accessibleToilet: filterToilet || undefined,
      });
      setLocations(res.locations);
      if (res.locations.length > 0 && !selectedLocation) {
        setSelectedLocation(res.locations[0]);
      }
    } catch (err: any) {
      console.error('Failed to load locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [category, minScore, filterRamp, filterLift, filterHandrail, filterToilet]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLocations();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('ALL');
    setMinScore(0);
    setFilterRamp(false);
    setFilterLift(false);
    setFilterHandrail(false);
    setFilterToilet(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
          Geospatial Navigation
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Accessible Facilities Discovery Map
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Locate wheelchair-friendly civic buildings, verified entry ramps, accessible restrooms, and elevators.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search facilities by name or address..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
          >
            Search
          </button>

          <button
            type="button"
            onClick={handleResetFilters}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </form>

        {/* Filter Badges & Amenities */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
            >
              <option value="ALL">All Ratings</option>
              <option value="Highly Accessible">Highly Accessible (80+)</option>
              <option value="Accessible">Accessible (60–79)</option>
              <option value="Partially Accessible">Partially Accessible (40–59)</option>
              <option value="Poor Accessibility">Poor Accessibility (0–39)</option>
            </select>
          </div>

          {/* Amenities checklist */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-medium">Require:</span>
            <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={filterRamp}
                onChange={e => setFilterRamp(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Ramp</span>
            </label>

            <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={filterLift}
                onChange={e => setFilterLift(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Elevator / Lift</span>
            </label>

            <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={filterToilet}
                onChange={e => setFilterToilet(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Accessible Restroom</span>
            </label>

            <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={filterHandrail}
                onChange={e => setFilterHandrail(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Handrail</span>
            </label>
          </div>
        </div>
      </div>

      {/* Map & Facility List Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <InteractiveMap
            locations={locations}
            selectedLocation={selectedLocation}
            onSelectLocation={loc => setSelectedLocation(loc)}
          />
        </div>

        {/* Facilities Side List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Matching Facilities ({locations.length})
            </span>
          </div>

          {locations.map(loc => {
            const isSelected = selectedLocation?.id === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`p-4 rounded-2xl border transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">
                    {loc.name}
                  </h4>
                  <ScoreBadge
                    score={loc.accessibilityScore}
                    category={loc.accessibilityCategory}
                    size="sm"
                  />
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-1 mb-2.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{loc.address}</span>
                </p>

                {/* Features Badges */}
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {loc.features.ramp && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      Ramp
                    </span>
                  )}
                  {loc.features.lift && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      Lift
                    </span>
                  )}
                  {loc.features.accessibleToilet && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      Toilet
                    </span>
                  )}
                  {loc.features.handrail && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                      Handrail
                    </span>
                  )}
                  {loc.features.stairs && (
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold">
                      Stairs
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {locations.length === 0 && !loading && (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              No facilities match the active filter criteria. Try adjusting your requirements.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

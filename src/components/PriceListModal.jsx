import React, { useState } from 'react';
import { 
  X, 
  Search, 
  ShieldAlert, 
  CheckCircle, 
  Car, 
  MapPin, 
  Clock, 
  AlertOctagon, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { ZONES, SURCHARGE_RULES } from '../data/priceData';

export default function PriceListModal({ isOpen, onClose, onSelectLocation }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-purple-600/40 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 p-4 sm:p-6 border-b border-purple-700/50 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚗</span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                UiTM SHAH ALAM TRANSPORTERS
              </h2>
            </div>
            <p className="text-xs text-amber-300 font-semibold mt-0.5">
              OFFICIAL PRICE LIST (Effective: 1st April 2026)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Strict Policy Banner */}
          <div className="bg-rose-950/40 border border-rose-600/50 rounded-2xl p-4 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200/90 leading-relaxed">
              <span className="font-bold text-rose-300 uppercase tracking-wide block mb-1">
                ⚠️ STRICT POLICY:
              </span>
              These rates are set to keep these services reliable and sustainable for everyone. To prevent a "race to the bottom" that hurts everyone, any attempts to bypass these floor prices by either party will result in an immediate and permanent ban.
            </div>
          </div>

          {/* Mandatory Surcharges Section */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              🔴 MANDATORY SURCHARGES (Add to base fare where applicable)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <strong className="text-white block font-medium">🔹 Peak Hours: +RM 2~5</strong>
                <span className="text-slate-400 text-[11px]">(7:30–9:30 AM / 5:00–8:00 PM)</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <strong className="text-white block font-medium">🔹 Rainy Weather: +RM 2~4</strong>
                <span className="text-slate-400 text-[11px]">Heavy rain / slippery roads</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <strong className="text-white block font-medium">🔹 Midnight / Gate Closed: +RM 2~4</strong>
                <span className="text-slate-400 text-[11px]">(12:00 AM – 6:00 AM)</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <strong className="text-white block font-medium">🔹 MPV (5-6 Pax): RM1.5x Base Fare</strong>
                <span className="text-slate-400 text-[11px]">Multiplier applied to base rate</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <strong className="text-white block font-medium">🔹 Heavy Luggage: +RM 2~4</strong>
                <span className="text-slate-400 text-[11px]">Oversized luggage / moving items</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <strong className="text-white block font-medium">🔹 Late Fee: +RM 1 per 10 mins</strong>
                <span className="text-slate-400 text-[11px]">Waiting time beyond scheduled pickup</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 sm:col-span-2">
                <strong className="text-white block font-medium">🔹 Tolls: Paid as per actual highway charges</strong>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search any destination or landmark (e.g. Baiduri, i-City, KTM, MSU, KLIA)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Zones Directory */}
          <div className="space-y-4">
            {Object.values(ZONES).map((zone) => {
              const matchedLocations = zone.locations.filter(loc =>
                !searchTerm ||
                loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                loc.category.toLowerCase().includes(searchTerm.toLowerCase())
              );

              if (searchTerm && matchedLocations.length === 0) return null;

              return (
                <div
                  key={zone.id}
                  className="bg-slate-800/40 border border-slate-700/70 rounded-2xl p-4 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 border-b border-slate-700/60 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm sm:text-base">
                        {zone.title}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-black font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-400/20 self-start sm:self-auto">
                      RM {zone.baseMin} ~ {zone.baseMax}
                    </span>
                  </div>

                  {zone.extraNotice && (
                    <div className="text-[11px] text-indigo-300 bg-indigo-950/40 p-2 rounded-lg border border-indigo-700/40 mb-2.5">
                      ℹ️ {zone.extraNotice}
                    </div>
                  )}

                  {/* Landmarks List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {matchedLocations.map((loc, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (onSelectLocation) onSelectLocation(loc);
                          onClose();
                        }}
                        className="text-xs text-slate-300 hover:text-white bg-slate-900/50 hover:bg-purple-900/40 p-2 rounded-lg border border-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="truncate pr-2">{loc.name}</span>
                        {loc.customBaseMin ? (
                          <span className="text-[11px] font-mono text-amber-400 flex-shrink-0">
                            RM {loc.customBaseMin}~{loc.customBaseMax}
                          </span>
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>UiTM Transporter Community Guidelines</span>
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Close Price List
          </button>
        </div>
      </div>
    </div>
  );
}

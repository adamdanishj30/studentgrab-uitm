import React, { useState } from 'react';
import { 
  X, 
  Search, 
  ShieldAlert, 
  Car, 
  ChevronRight,
  AlertOctagon,
  Clock,
  CloudRain,
  Moon,
  Luggage
} from 'lucide-react';
import { ZONES } from '../data/priceData';

export default function PriceListModal({ isOpen, onClose, onSelectLocation }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FAF9F5] border border-stone-200 rounded-[36px] shadow-2xl overflow-hidden my-auto max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-200/80 flex items-start justify-between gap-4 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚗</span>
              <h2 className="text-base sm:text-lg font-black text-[#1E2E1E] tracking-tight">
                UiTM SHAH ALAM TRANSPORTERS
              </h2>
            </div>
            <p className="text-xs text-[#556355] font-semibold mt-0.5">
              OFFICIAL PRICE LIST (Effective 1st April 2026)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-800 p-1.5 rounded-full bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Policy Banner */}
          <div className="bg-[#FFF4E5] border border-[#FFE0B2] rounded-2xl p-3.5 flex items-start gap-2.5">
            <AlertOctagon className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#6A4000] leading-relaxed">
              <strong>⚠️ STRICT POLICY:</strong> These rates are set to keep transporter services sustainable. Any attempts to bypass floor prices will result in an immediate and permanent ban.
            </div>
          </div>

          {/* Surcharges List */}
          <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#1E2E1E] mb-2.5">
              🔴 MANDATORY SURCHARGES (Add-ons)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#F7F6F1] p-2 rounded-xl">
                <strong className="text-[#1E2E1E] block">Peak Hours: +RM 2~5</strong>
                <span className="text-[10px] text-[#6B756B]">7:30–9:30 AM / 5–8 PM</span>
              </div>
              <div className="bg-[#F7F6F1] p-2 rounded-xl">
                <strong className="text-[#1E2E1E] block">Rainy Weather: +RM 2~4</strong>
                <span className="text-[10px] text-[#6B756B]">Wet roads / traffic</span>
              </div>
              <div className="bg-[#F7F6F1] p-2 rounded-xl">
                <strong className="text-[#1E2E1E] block">Midnight: +RM 2~4</strong>
                <span className="text-[10px] text-[#6B756B]">12:00 AM – 6:00 AM</span>
              </div>
              <div className="bg-[#F7F6F1] p-2 rounded-xl">
                <strong className="text-[#1E2E1E] block">MPV (5-6 Pax): 1.5x Base</strong>
                <span className="text-[10px] text-[#6B756B]">Base fare multiplier</span>
              </div>
              <div className="bg-[#F7F6F1] p-2 rounded-xl">
                <strong className="text-[#1E2E1E] block">Heavy Luggage: +RM 2~4</strong>
                <span className="text-[10px] text-[#6B756B]">Oversized boxes / bags</span>
              </div>
              <div className="bg-[#F7F6F1] p-2 rounded-xl">
                <strong className="text-[#1E2E1E] block">Late Fee: +RM 1 / 10m</strong>
                <span className="text-[10px] text-[#6B756B]">Waiting time</span>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search destination (Baiduri, i-City, KTM, KLIA)..."
              className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-[#1E2E1E] placeholder-stone-400 focus:outline-none"
            />
          </div>

          {/* Zones Directory */}
          <div className="space-y-3">
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
                  className="bg-white border border-stone-200/80 rounded-2xl p-3.5"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                    <span className="font-bold text-xs sm:text-sm text-[#1E2E1E]">
                      {zone.title}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#1E2E1E] bg-[#E7ECE7] px-2 py-0.5 rounded-lg">
                      RM {zone.baseMin} ~ {zone.baseMax}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {matchedLocations.map((loc, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (onSelectLocation) onSelectLocation(loc);
                          onClose();
                        }}
                        className="text-[11px] text-[#333] hover:text-[#1E2E1E] hover:bg-[#F5F8F5] p-1.5 rounded-lg flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate pr-1">{loc.name}</span>
                        {loc.customBaseMin ? (
                          <span className="font-mono font-semibold text-[#1E2E1E] text-[10px]">
                            RM {loc.customBaseMin}~{loc.customBaseMax}
                          </span>
                        ) : (
                          <ChevronRight className="w-3 h-3 text-stone-300" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white p-3.5 border-t border-stone-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="bg-[#1E2E1E] text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}

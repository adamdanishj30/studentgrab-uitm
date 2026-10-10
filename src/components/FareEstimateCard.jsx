import React from 'react';
import { 
  ShieldCheck, 
  Car, 
  Users, 
  AlertCircle, 
  Coins, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp 
} from 'lucide-react';

export default function FareEstimateCard({ estimate, tripData, appMode }) {
  if (!estimate) return null;

  const {
    zone,
    isBothInternal,
    effectiveIsMPV,
    baseFare,
    surcharges,
    totalMin,
    totalMax,
    fareRangeString,
    baseRangeString,
  } = estimate;

  const pax = tripData.pax || 1;
  const perPersonMin = (totalMin / pax).toFixed(1);
  const perPersonMax = (totalMax / pax).toFixed(1);

  return (
    <div className="bg-white rounded-[32px] p-5 sm:p-6 border border-stone-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative overflow-hidden mb-5">
      {/* Top Header Pill */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E7ECE7] text-[#1E2E1E] flex items-center gap-1.5">
          <Car className="w-3.5 h-3.5 text-[#3B4D3B]" />
          {isBothInternal ? 'Campus Internal' : zone ? zone.badge : 'Destination Fare'}
        </span>

        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          Floor Protected
        </span>
      </div>

      {/* Main Fare Display */}
      <div className="text-center py-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B756B] mb-0.5">
          {appMode === 'driver' ? 'Recommended Transporter Quote' : 'Official Estimated Fare'}
        </div>
        <div className="text-4xl sm:text-5xl font-black text-[#1E2E1E] tracking-tight font-mono py-1">
          {fareRangeString}
        </div>
        <div className="text-xs text-[#556355] mt-1 flex items-center justify-center gap-2 flex-wrap">
          <span>
            Floor Rate: <strong className="text-[#1E2E1E] font-mono">{baseRangeString}</strong>
          </span>
          {surcharges.length > 0 && (
            <span className="text-[#2D452D] font-bold bg-[#EBF0EB] px-2 py-0.5 rounded-full text-[11px]">
              +RM {estimate.surchargeMinTotal}~{estimate.surchargeMaxTotal} surcharges
            </span>
          )}
        </div>
      </div>

      {/* Per Pax Split (if pax > 1) */}
      {pax > 1 && (
        <div className="mt-3 bg-[#F4F7F4] rounded-2xl p-2.5 text-center flex items-center justify-center gap-2 text-xs text-[#1E2E1E] font-medium border border-[#E0E8E0]">
          <Coins className="w-4 h-4 text-emerald-700" />
          <span>
            Carpool Split ({pax} pax):{' '}
            <strong className="font-mono font-bold text-[#1E2E1E]">
              RM {perPersonMin} ~ {perPersonMax}
            </strong>{' '}
            per person
          </span>
        </div>
      )}

      {/* Breakdown List */}
      <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
        <div className="text-xs font-bold text-[#1E2E1E] flex items-center justify-between">
          <span>Fare Breakdown</span>
          <span className="text-[10px] text-[#6B756B] font-normal">April 2026 rates</span>
        </div>

        {/* Base Floor Row */}
        <div className="flex items-center justify-between text-xs bg-[#F7F6F1] p-2.5 rounded-xl text-[#1E2E1E]">
          <span className="font-medium">
            Base Floor ({zone ? zone.title : 'Zone'})
          </span>
          <span className="font-mono font-bold">
            RM {baseFare.rawMin} ~ {baseFare.rawMax}
          </span>
        </div>

        {/* MPV Multiplier */}
        {effectiveIsMPV && (
          <div className="flex items-center justify-between text-xs bg-[#E7ECE7] p-2.5 rounded-xl text-[#1E2E1E]">
            <span className="font-medium">
              MPV 1.5x Base Multiplier
            </span>
            <span className="font-mono font-bold text-[#1E2E1E]">
              +RM {baseFare.mpvExtraMin} ~ {baseFare.mpvExtraMax}
            </span>
          </div>
        )}

        {/* Surcharge rows */}
        {surcharges.map((sur, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs bg-[#F7F6F1] p-2.5 rounded-xl text-[#1E2E1E]"
          >
            <span className="text-[#444]">{sur.name}</span>
            <span className="font-mono font-bold text-[#1E2E1E]">{sur.range}</span>
          </div>
        ))}
      </div>

      {/* Floor Rate Notice */}
      <div className="mt-4 bg-[#F5F4EE] rounded-2xl p-3 text-[11px] text-[#555] leading-relaxed border border-stone-200/50 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-emerald-800 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Floor Rate Guaranteed:</strong> Rates below RM {totalMin} violate community policy to protect student driver sustainability.
        </span>
      </div>
    </div>
  );
}

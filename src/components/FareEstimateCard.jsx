import React from 'react';
import { 
  ShieldCheck, 
  Car, 
  Users, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  TrendingUp, 
  Coins 
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
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-purple-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-purple-900/80 text-purple-200 border border-purple-600/40">
            {isBothInternal ? '🏫 Campus Internal Trip' : zone ? zone.badge : 'Destination Fare'}
          </span>
          {effectiveIsMPV && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              MPV 1.5x Applied
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Official Floor Verified</span>
        </div>
      </div>

      {/* Main Fare Display */}
      <div className="text-center py-3">
        <div className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-1">
          {appMode === 'driver' ? 'Recommended Quote Range' : 'Estimated Official Fare'}
        </div>
        <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200 tracking-tight font-mono py-1">
          {fareRangeString}
        </div>
        <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-2 flex-wrap">
          <span>
            Base Floor Rate: <strong className="text-white font-mono">{baseRangeString}</strong>
          </span>
          {surcharges.length > 0 && (
            <span className="text-amber-400 font-medium">
              (+RM {estimate.surchargeMinTotal}~{estimate.surchargeMaxTotal} in surcharges)
            </span>
          )}
        </div>
      </div>

      {/* Per Pax Split (if pax > 1) */}
      {pax > 1 && (
        <div className="mt-3 bg-purple-950/40 border border-purple-800/40 rounded-xl p-2.5 text-center flex items-center justify-center gap-2 text-xs text-purple-200">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>
            Carpool Split ({pax} pax):{' '}
            <strong className="text-white font-mono">
              RM {perPersonMin} ~ {perPersonMax}
            </strong>{' '}
            per person
          </span>
        </div>
      )}

      {/* Breakdown Breakdown List */}
      <div className="mt-4 pt-3 border-t border-slate-700/60 space-y-2">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Fare Composition</span>
          <span className="text-[11px] text-slate-400 font-normal">Floor rate policy</span>
        </div>

        {/* Base Item */}
        <div className="flex items-center justify-between text-xs bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-slate-200 font-medium">
              Base Floor Fare ({zone ? zone.title : 'Zone'})
            </span>
          </div>
          <span className="font-mono font-semibold text-slate-200">
            RM {baseFare.rawMin} ~ {baseFare.rawMax}
          </span>
        </div>

        {/* MPV Multiplier row */}
        {effectiveIsMPV && (
          <div className="flex items-center justify-between text-xs bg-purple-950/30 p-2.5 rounded-xl border border-purple-800/40">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span className="text-purple-200 font-medium">
                MPV 1.5x Base Adjustment
              </span>
            </div>
            <span className="font-mono font-semibold text-purple-300">
              +RM {baseFare.mpvExtraMin} ~ {baseFare.mpvExtraMax}
            </span>
          </div>
        )}

        {/* Surcharge rows */}
        {surcharges.map((sur, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span className="text-slate-300">{sur.name}</span>
            </div>
            <span className="font-mono font-semibold text-rose-300">
              {sur.range}
            </span>
          </div>
        ))}

        {surcharges.length === 0 && !effectiveIsMPV && (
          <div className="text-center py-1 text-[11px] text-slate-500 italic">
            No active surcharges applied. Clean base rate.
          </div>
        )}
      </div>

      {/* Strict Floor Price Policy Warning */}
      <div className="mt-4 bg-amber-950/30 border border-amber-600/40 rounded-xl p-3 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-[11px] text-amber-200/90 leading-relaxed">
          <strong>Community Floor Price Policy:</strong> Rates lower than RM {totalMin} violate UiTM transporter floor guidelines. Attempting to bypass floor rates to undercut drivers is prohibited.
        </div>
      </div>
    </div>
  );
}

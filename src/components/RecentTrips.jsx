import React from 'react';
import { History, ArrowRight, Trash2, Clock } from 'lucide-react';

export default function RecentTrips({ history, onSelectHistoryItem, onClearHistory }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 sm:p-5 mt-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3">
        <h3 className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-2">
          <History className="w-4 h-4 text-purple-400" />
          <span>Recent Quotes & Trips</span>
        </h3>
        <button
          onClick={onClearHistory}
          className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {history.slice(0, 4).map((item, index) => (
          <div
            key={index}
            onClick={() => onSelectHistoryItem(item)}
            className="cursor-pointer bg-slate-900/70 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-600/50 p-2.5 rounded-xl transition-all flex items-center justify-between"
          >
            <div className="min-w-0 pr-2">
              <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1">
                <span>{item.pickupName}</span>
                <ArrowRight className="w-3 h-3 text-slate-500 flex-shrink-0" />
                <span className="text-purple-300">{item.dropName}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {item.pax} pax • {item.passengerName || 'Student'}
              </div>
            </div>
            <div className="text-xs font-black font-mono text-amber-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 flex-shrink-0">
              {item.fareRangeString}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

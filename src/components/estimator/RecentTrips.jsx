import React from 'react';
import { History, ArrowRight, Trash2 } from 'lucide-react';

export default function RecentTrips({ history, onSelectHistoryItem, onClearHistory }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="bg-white rounded-[32px] p-5 border border-stone-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] mb-5">
      <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 mb-3">
        <h3 className="text-xs font-bold text-[#1E2E1E] flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-[#556355]" />
          <span>Recent Searches</span>
        </h3>
        <button
          onClick={onClearHistory}
          className="text-[10px] text-stone-400 hover:text-stone-700 flex items-center gap-1"
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
            className="cursor-pointer bg-[#F7F6F1] hover:bg-[#EBECE7] p-2.5 rounded-2xl transition-all flex items-center justify-between"
          >
            <div className="min-w-0 pr-2">
              <div className="text-xs font-bold text-[#1E2E1E] truncate flex items-center gap-1">
                <span>{item.pickupName}</span>
                <ArrowRight className="w-3 h-3 text-stone-400 flex-shrink-0" />
                <span>{item.dropName}</span>
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                {item.pax} pax • {item.passengerName || 'Student'}
              </div>
            </div>
            <div className="text-xs font-bold font-mono text-[#1E2E1E] bg-white px-2 py-0.5 rounded-lg border border-stone-200/60 flex-shrink-0">
              {item.fareRangeString}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

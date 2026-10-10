import React from 'react';
import { Compass, ClipboardPaste, CloudRain, BookOpen } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'estimate', label: 'Estimate', icon: Compass },
    { id: 'parser', label: 'Paste Order', icon: ClipboardPaste },
    { id: 'weather', label: 'Live Weather', icon: CloudRain },
    { id: 'rates', label: 'Price List', icon: BookOpen },
  ];

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 max-w-md mx-auto px-4 pointer-events-none">
      <div className="bg-[#1E2E1E] text-white rounded-full p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex items-center justify-around pointer-events-auto border border-[#2D3E2D]/80 backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 py-2 px-3.5 rounded-full transition-all text-xs font-semibold ${
                isActive
                  ? 'bg-[#2F442F] text-white shadow-xs'
                  : 'text-[#9DA99D] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {isActive && <span className="text-[11px] tracking-wide">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

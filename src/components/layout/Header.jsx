import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Clock, 
  Bell, 
  Settings, 
  ShieldCheck, 
  CloudRain, 
  ChevronRight, 
  Compass, 
  Sparkles 
} from 'lucide-react';
import { SURCHARGE_RULES } from '../../data/priceData';

export default function Header({ 
  onOpenPriceList, 
  appMode, 
  setAppMode, 
  weather, 
  onOpenWeatherTab 
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isPeak = SURCHARGE_RULES.peakHour.isPeakNow(currentTime);
  const isMidnight = SURCHARGE_RULES.midnight.isMidnightNow(currentTime);

  const formattedTime = currentTime.toLocaleTimeString('en-MY', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="mb-5">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between py-2 px-1 mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-[#1E2E1E] tracking-tight">
            UiTM <span className="text-[#3B5B3B]">RideWise</span>
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E7ECE7] text-[#1E2E1E]">
            Shah Alam
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Weather Pill */}
          <button
            onClick={onOpenWeatherTab}
            className="flex items-center gap-1.5 bg-white border border-stone-200/80 rounded-full px-3 py-1 text-xs font-semibold text-[#1E2E1E] shadow-2xs hover:bg-stone-50 transition-colors"
          >
            <span>{weather?.icon || '⛅'}</span>
            <span className="font-mono">{weather?.temperature || 28}°C</span>
            {weather?.isRaining && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            )}
          </button>

          {/* Notification / Rate Guide Button */}
          <button
            onClick={onOpenPriceList}
            className="w-8 h-8 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-[#1E2E1E] hover:bg-stone-50 transition-colors shadow-2xs"
            title="Official Price Guide"
          >
            <Bell className="w-4 h-4 text-[#1E2E1E]" />
          </button>
        </div>
      </div>

      {/* Profile Card (matching the exact aesthetic of the screenshot) */}
      <div className="bg-white rounded-[32px] p-4 sm:p-5 border border-stone-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative overflow-hidden">
        {/* Subtle decorative curve */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#F5F8F5] rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-[24px] bg-gradient-to-br from-[#E2EBE2] to-[#C9DAC9] p-1 flex-shrink-0 flex items-center justify-center shadow-xs">
            <div className="w-full h-full bg-[#1E2E1E] rounded-[20px] flex items-center justify-center text-white relative overflow-hidden">
              <Car className="w-9 h-9 text-[#C9DAC9]" />
              <div className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#1E2E1E]"></div>
            </div>
          </div>

          {/* Right Info Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#1E2E1E] truncate">
                  UiTM Transporters
                </h2>
                <p className="text-xs text-[#6B756B] -mt-0.5">
                  Official Floor Rate Hub
                </p>
              </div>

              {/* Mode Toggle Pill */}
              <div className="bg-[#F0EFEA] p-0.5 rounded-full flex items-center text-[11px] font-semibold">
                <button
                  onClick={() => setAppMode('student')}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    appMode === 'student'
                      ? 'bg-[#1E2E1E] text-white shadow-xs font-bold'
                      : 'text-[#6B756B] hover:text-[#1E2E1E]'
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => setAppMode('driver')}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    appMode === 'driver'
                      ? 'bg-[#1E2E1E] text-white shadow-xs font-bold'
                      : 'text-[#6B756B] hover:text-[#1E2E1E]'
                  }`}
                >
                  Driver
                </button>
              </div>
            </div>

            {/* Sub-cards like "Connection" and "Level" in the screenshot */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div 
                onClick={onOpenPriceList}
                className="bg-[#F6F5F0] hover:bg-[#EAE8DF] cursor-pointer p-2 rounded-[18px] transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] text-[#6B756B] font-semibold">
                  <span>Policy</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
                <div className="text-xs font-extrabold text-[#1E2E1E] mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Apr 2026</span>
                </div>
              </div>

              <div className="bg-[#F6F5F0] p-2 rounded-[18px]">
                <div className="text-[10px] text-[#6B756B] font-semibold">
                  Status
                </div>
                <div className="text-xs font-extrabold text-[#1E2E1E] mt-0.5 flex items-center gap-1">
                  {isPeak ? (
                    <span className="text-rose-600 font-bold">🔥 Peak Hour</span>
                  ) : isMidnight ? (
                    <span className="text-indigo-600 font-bold">🌙 Midnight</span>
                  ) : (
                    <span className="text-emerald-700 font-bold">🟢 Normal</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

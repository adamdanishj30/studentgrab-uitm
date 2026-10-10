import React, { useState, useEffect } from 'react';
import { Car, Clock, ShieldAlert, Sparkles, BookOpen, UserCheck, ShieldCheck } from 'lucide-react';
import { SURCHARGE_RULES } from '../data/priceData';

export default function Header({ onOpenPriceList, appMode, setAppMode }) {
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
    second: '2-digit',
    hour12: true,
  });

  return (
    <header className="relative bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border-b border-purple-800/40 text-white shadow-xl">
      {/* Top Banner for Policy Notice */}
      <div className="bg-gradient-to-r from-purple-700 via-amber-600 to-purple-700 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 shadow-inner">
        <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 animate-pulse text-amber-200" />
        <span>
          <strong>Official Price List:</strong> Effective 1st April 2026 • Strict floor rate policy enforced
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-purple-600 to-indigo-700 p-0.5 shadow-lg shadow-purple-900/50">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  UiTM <span className="text-amber-400">RideWise</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 border border-purple-700/60">
                  Shah Alam
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-0.5">
                Official Fare Range Estimator & Transporter Hub
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Clock & Period Indicator */}
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono">{formattedTime}</span>
              {isPeak ? (
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  🔥 Peak Hour (+RM 2-5)
                </span>
              ) : isMidnight ? (
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  🌙 Midnight (+RM 2-4)
                </span>
              ) : (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Normal Fare
                </span>
              )}
            </div>

            {/* Official Price List Button */}
            <button
              onClick={onOpenPriceList}
              className="flex items-center gap-1.5 bg-purple-800/60 hover:bg-purple-700/80 border border-purple-600/50 text-purple-100 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm"
              title="View full official price list and zone guidelines"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Rates</span>
            </button>

            {/* Mode Switcher */}
            <div className="bg-slate-900/90 border border-purple-700/50 p-0.5 rounded-xl flex items-center text-xs">
              <button
                onClick={() => setAppMode('student')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  appMode === 'student'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setAppMode('driver')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  appMode === 'driver'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Transporter
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

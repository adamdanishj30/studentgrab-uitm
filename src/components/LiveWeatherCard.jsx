import React, { useState } from 'react';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Thermometer
} from 'lucide-react';

export default function LiveWeatherCard({ 
  weather, 
  isLoading, 
  onRefresh, 
  isRainSurchargeActive, 
  onToggleRainSurcharge 
}) {
  const [isRotating, setIsRotating] = useState(false);

  const handleRefreshClick = () => {
    setIsRotating(true);
    onRefresh();
    setTimeout(() => setIsRotating(false), 800);
  };

  return (
    <div className="bg-[#E7ECE7] rounded-[28px] p-5 border border-[#D5DDD5] shadow-sm relative overflow-hidden mb-5">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{weather?.icon || '⛅'}</span>
          <div>
            <h3 className="text-sm font-bold text-[#1E2E1E] leading-tight flex items-center gap-1.5">
              Live Shah Alam Weather
              {weather?.isRaining && (
                <span className="text-[10px] bg-[#D1E0D1] text-[#1E2E1E] px-2 py-0.5 rounded-full font-bold">
                  Rain Active
                </span>
              )}
            </h3>
            <p className="text-[11px] text-[#4F5D4F]">
              Live Open-Meteo Radar • UiTM Campus
            </p>
          </div>
        </div>

        <button
          onClick={handleRefreshClick}
          disabled={isLoading}
          className="p-2 rounded-full bg-white/70 hover:bg-white text-[#1E2E1E] transition-all shadow-xs"
          title="Refresh live weather"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRotating || isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-end justify-between py-2 border-b border-[#D8E2D8] pb-3 mb-3">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#1E2E1E] tracking-tight font-mono">
            {weather ? `${weather.temperature}°C` : '28°C'}
          </div>
          <div className="text-xs font-semibold text-[#3B4D3B] mt-0.5">
            {weather?.condition || 'Partly Cloudy'} • Feels like {weather?.apparentTemperature || 30}°C
          </div>
        </div>

        {/* Rain Alert Status */}
        <div className="text-right">
          {weather?.isRaining ? (
            <div className="bg-white/90 border border-emerald-300/60 rounded-xl px-2.5 py-1.5 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                Rain in Shah Alam
              </span>
              <span className="text-[10px] text-emerald-700 block mt-0.5 font-mono">
                {weather.rainMm > 0 ? `${weather.rainMm} mm/h rain` : 'Precipitation detected'}
              </span>
            </div>
          ) : (
            <div className="bg-white/70 rounded-xl px-2.5 py-1.5 text-[11px] text-[#4F5D4F]">
              <span>Dry roads • Clear</span>
            </div>
          )}
        </div>
      </div>

      {/* Mini Stats (matching the Interaction Stats card from design) */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white/70 rounded-2xl p-2.5 text-center shadow-xs">
          <div className="text-[10px] text-[#556355] flex items-center justify-center gap-1">
            <Droplets className="w-3 h-3 text-[#3B4D3B]" />
            Humidity
          </div>
          <div className="text-xs font-bold text-[#1E2E1E] mt-0.5 font-mono">
            {weather?.humidity || 75}%
          </div>
        </div>

        <div className="bg-white/70 rounded-2xl p-2.5 text-center shadow-xs">
          <div className="text-[10px] text-[#556355] flex items-center justify-center gap-1">
            <Wind className="w-3 h-3 text-[#3B4D3B]" />
            Wind
          </div>
          <div className="text-xs font-bold text-[#1E2E1E] mt-0.5 font-mono">
            {weather?.windSpeed || 7} km/h
          </div>
        </div>

        <div className="bg-white/70 rounded-2xl p-2.5 text-center shadow-xs">
          <div className="text-[10px] text-[#556355] flex items-center justify-center gap-1">
            <CloudRain className="w-3 h-3 text-[#3B4D3B]" />
            Precip
          </div>
          <div className="text-xs font-bold text-[#1E2E1E] mt-0.5 font-mono">
            {weather?.rainMm !== undefined ? `${weather.rainMm} mm` : '0 mm'}
          </div>
        </div>
      </div>

      {/* Auto-Sync with Rainy Surcharge */}
      <div className="bg-white rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isRainSurchargeActive ? 'bg-emerald-500 animate-ping' : 'bg-stone-300'}`}></div>
          <div>
            <span className="text-xs font-bold text-[#1E2E1E] block">
              Rainy Weather Surcharge (+RM 2~4)
            </span>
            <span className="text-[10px] text-[#556355]">
              {weather?.isRaining 
                ? 'Detected automatically via live weather radar'
                : 'Roads dry, can be toggled if raining locally'}
            </span>
          </div>
        </div>

        <button
          onClick={onToggleRainSurcharge}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            isRainSurchargeActive
              ? 'bg-[#1E2E1E] text-white shadow-xs'
              : 'bg-[#E7ECE7] text-[#1E2E1E] hover:bg-[#D5DDD5]'
          }`}
        >
          {isRainSurchargeActive ? 'Applied' : 'Enable'}
        </button>
      </div>
    </div>
  );
}

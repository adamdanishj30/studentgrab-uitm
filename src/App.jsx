import React, { useState, useMemo, useEffect } from 'react';
import {
  Header,
  BottomNav,
  CalculatorForm,
  FareEstimateCard,
  RecentTrips,
  OrderParserBox,
  TemplateGenerator,
  LiveWeatherCard,
  PriceListModal,
} from './components';
import { calculateFare, matchLocation, fetchShahAlamWeather } from './utils';
import { ZONES, SURCHARGE_RULES } from './data/priceData';

export default function App() {
  const [appMode, setAppMode] = useState('student'); // 'student' | 'driver'
  const [activeTab, setActiveTab] = useState('estimate'); // 'estimate' | 'parser' | 'weather' | 'rates'
  const [isPriceListOpen, setIsPriceListOpen] = useState(false);

  // Weather State
  const [weather, setWeather] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // Auto Peak Hour check
  const now = new Date();
  const initialIsPeak = SURCHARGE_RULES.peakHour.isPeakNow(now);
  const initialIsMidnight = SURCHARGE_RULES.midnight.isMidnightNow(now);

  const [tripData, setTripData] = useState({
    passengerName: '',
    pickupName: 'Kolej Mawar',
    pickupLocation: matchLocation('kolej mawar'),
    dropName: 'Pusat Komersial Seksyen 7',
    dropLocation: matchLocation('pusat komersial sek 7'),
    customZoneId: 'SEKSYEN_7',
    pax: 1,
    isPeakHour: initialIsPeak,
    isRainy: false,
    isMidnight: initialIsMidnight,
    isMPV: false,
    hasHeavyLuggage: false,
    waitingMinutes: 0,
    tollAmount: 0,
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('uitm_transporter_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch live Shah Alam weather on mount
  const loadWeather = async () => {
    setIsWeatherLoading(true);
    const data = await fetchShahAlamWeather();
    setWeather(data);
    setIsWeatherLoading(false);

    // If it's currently raining in Shah Alam, auto-enable rainy surcharge
    if (data.isRaining) {
      setTripData(prev => ({ ...prev, isRainy: true }));
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  // Reactive Fare calculation
  const estimate = useMemo(() => {
    return calculateFare(tripData);
  }, [tripData]);

  // Debounced history save
  useEffect(() => {
    if (!estimate || !tripData.dropName) return;
    const timeout = setTimeout(() => {
      setHistory(prev => {
        const newItem = {
          passengerName: tripData.passengerName,
          pickupName: tripData.pickupName,
          dropName: tripData.dropName,
          pax: tripData.pax,
          fareRangeString: estimate.fareRangeString,
          timestamp: Date.now(),
        };
        if (prev.length > 0 && prev[0].dropName === newItem.dropName && prev[0].pickupName === newItem.pickupName) {
          return prev;
        }
        const updated = [newItem, ...prev.slice(0, 7)];
        try {
          localStorage.setItem('uitm_transporter_history', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }, 1200);

    return () => clearTimeout(timeout);
  }, [estimate, tripData.pickupName, tripData.dropName, tripData.pax, tripData.passengerName]);

  const handleUpdateTripData = (updates) => {
    setTripData(prev => ({ ...prev, ...updates }));
  };

  const handleApplyParsedOrder = (parsed) => {
    if (!parsed) return;
    const updates = {
      passengerName: parsed.passengerName,
      pickupName: parsed.pickupQuery,
      dropName: parsed.dropQuery,
      pickupLocation: parsed.matchedPickup || { name: parsed.pickupQuery, zoneId: 'INTERNAL_UITM', baseMin: 5, baseMax: 8 },
      dropLocation: parsed.matchedDrop || null,
      pax: parsed.pax || 1,
      isMPV: parsed.pax >= 5,
    };

    if (parsed.matchedDrop) {
      updates.customZoneId = parsed.matchedDrop.zoneId;
    }

    if (parsed.detectedSurcharges) {
      if (parsed.detectedSurcharges.rain) updates.isRainy = true;
      if (parsed.detectedSurcharges.heavyLuggage) updates.hasHeavyLuggage = true;
      if (parsed.detectedSurcharges.peakHour) updates.isPeakHour = true;
      if (parsed.detectedSurcharges.midnight) updates.isMidnight = true;
    }

    setTripData(prev => ({ ...prev, ...updates }));
    setActiveTab('estimate'); // switch to estimate view to see result
  };

  const handleSelectLocationFromModal = (loc) => {
    setTripData(prev => ({
      ...prev,
      dropName: loc.name,
      dropLocation: loc,
      customZoneId: loc.zoneId,
    }));
    setActiveTab('estimate');
  };

  const handleSelectHistoryItem = (item) => {
    const matchedP = matchLocation(item.pickupName);
    const matchedD = matchLocation(item.dropName);
    setTripData(prev => ({
      ...prev,
      passengerName: item.passengerName || '',
      pickupName: item.pickupName,
      dropName: item.dropName,
      pickupLocation: matchedP || { name: item.pickupName, zoneId: 'INTERNAL_UITM' },
      dropLocation: matchedD || null,
      customZoneId: matchedD ? matchedD.zoneId : prev.customZoneId,
      pax: item.pax || 1,
    }));
    setActiveTab('estimate');
  };

  return (
    <div className="min-h-screen bg-[#F5F4EF] text-[#1E2E1E] flex flex-col justify-between selection:bg-[#E2EBE2] selection:text-[#1E2E1E]">
      {/* Mobile-centric Main App Container */}
      <div className="w-full max-w-md mx-auto px-4 pt-4 pb-28">
        {/* Profile-style Header */}
        <Header
          onOpenPriceList={() => setIsPriceListOpen(true)}
          appMode={appMode}
          setAppMode={setAppMode}
          weather={weather}
          onOpenWeatherTab={() => setActiveTab('weather')}
        />

        {/* Tab 1: Fare Estimator */}
        {activeTab === 'estimate' && (
          <div className="space-y-4 animate-fade-in">
            {/* Live Weather Mini Banner */}
            {weather?.isRaining && (
              <div 
                onClick={() => setActiveTab('weather')}
                className="bg-[#E7ECE7] rounded-2xl p-3 flex items-center justify-between cursor-pointer border border-[#D5DDD5] mb-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌧️</span>
                  <div className="text-xs">
                    <strong className="text-[#1E2E1E] block">Rain in Shah Alam (+RM 2~4)</strong>
                    <span className="text-[#556355] text-[10px]">Tap to view live weather radar</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#1E2E1E] bg-white px-2.5 py-1 rounded-full shadow-2xs">
                  {tripData.isRainy ? 'Active' : 'Enable'}
                </span>
              </div>
            )}

            {/* Estimated Fare Display */}
            <FareEstimateCard
              estimate={estimate}
              tripData={tripData}
              appMode={appMode}
            />

            {/* Form Inputs */}
            <CalculatorForm
              tripData={tripData}
              onChangeTripData={handleUpdateTripData}
            />

            {/* Template Copy Section */}
            <TemplateGenerator
              tripData={tripData}
              estimate={estimate}
              appMode={appMode}
            />

            {/* Search History */}
            <RecentTrips
              history={history}
              onSelectHistoryItem={handleSelectHistoryItem}
              onClearHistory={() => {
                setHistory([]);
                localStorage.removeItem('uitm_transporter_history');
              }}
            />
          </div>
        )}

        {/* Tab 2: Smart Paste (WhatsApp / Telegram Order Parser) */}
        {activeTab === 'parser' && (
          <div className="space-y-4 animate-fade-in">
            <OrderParserBox
              onApplyParsedOrder={handleApplyParsedOrder}
            />

            <FareEstimateCard
              estimate={estimate}
              tripData={tripData}
              appMode={appMode}
            />

            <TemplateGenerator
              tripData={tripData}
              estimate={estimate}
              appMode={appMode}
            />
          </div>
        )}

        {/* Tab 3: Live Weather Radar & Forecast */}
        {activeTab === 'weather' && (
          <div className="space-y-4 animate-fade-in">
            <LiveWeatherCard
              weather={weather}
              isLoading={isWeatherLoading}
              onRefresh={loadWeather}
              isRainSurchargeActive={tripData.isRainy}
              onToggleRainSurcharge={() => handleUpdateTripData({ isRainy: !tripData.isRainy })}
            />

            <div className="bg-white rounded-[32px] p-5 border border-stone-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-3">
              <h3 className="text-xs font-bold text-[#1E2E1E] uppercase tracking-wider">
                About Weather Surcharge Policy
              </h3>
              <p className="text-xs text-[#556355] leading-relaxed">
                Shah Alam experiences heavy tropical downpours, causing flash floods around Seksyen 7, Persiaran Kayangan, and the Federal Highway.
              </p>
              <div className="bg-[#F7F6F1] p-3 rounded-2xl text-xs text-[#1E2E1E] space-y-1">
                <div className="font-bold">🔹 Rainy Weather: +RM 2~4</div>
                <div className="text-[11px] text-[#6B756B]">
                  Applied when roads are slippery, visibility is low, or heavy rain causes traffic delays.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Official Price List Directory */}
        {activeTab === 'rates' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-[32px] p-5 border border-stone-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                <div>
                  <h2 className="text-base font-bold text-[#1E2E1E]">
                    Official Price Directory
                  </h2>
                  <p className="text-[11px] text-[#6B756B]">
                    Effective 1st April 2026 • Floor rates
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E7ECE7] text-[#1E2E1E]">
                  Strict Floor
                </span>
              </div>

              <div className="space-y-2">
                {Object.values(ZONES).map((z) => (
                  <div key={z.id} className="bg-[#F7F6F1] p-3 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#1E2E1E]">{z.title}</div>
                      <div className="text-[10px] text-[#6B756B]">{z.subtitle}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#1E2E1E] bg-white px-2 py-0.5 rounded-lg border border-stone-200/60">
                      RM {z.baseMin}~{z.baseMax}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Pill Bottom Navigation (Matching the screenshot) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Full Modal Guide */}
      <PriceListModal
        isOpen={isPriceListOpen}
        onClose={() => setIsPriceListOpen(false)}
        onSelectLocation={handleSelectLocationFromModal}
      />
    </div>
  );
}

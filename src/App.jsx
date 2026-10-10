import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import OrderParserBox from './components/OrderParserBox';
import CalculatorForm from './components/CalculatorForm';
import FareEstimateCard from './components/FareEstimateCard';
import TemplateGenerator from './components/TemplateGenerator';
import PriceListModal from './components/PriceListModal';
import RecentTrips from './components/RecentTrips';
import { calculateFare, matchLocation } from './utils/fareCalculator';
import { ZONES, ALL_LOCATIONS, SURCHARGE_RULES } from './data/priceData';

export default function App() {
  const [appMode, setAppMode] = useState('student'); // 'student' | 'driver'
  const [isPriceListOpen, setIsPriceListOpen] = useState(false);

  // Check current time for automatic peak/midnight suggestions
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

  // Calculate fare whenever tripData updates
  const estimate = useMemo(() => {
    return calculateFare(tripData);
  }, [tripData]);

  // Save to history debounce
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
        // Avoid duplicate top item
        if (prev.length > 0 && prev[0].dropName === newItem.dropName && prev[0].pickupName === newItem.pickupName) {
          return prev;
        }
        const updated = [newItem, ...prev.slice(0, 9)];
        try {
          localStorage.setItem('uitm_transporter_history', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }, 1200);

    return () => clearTimeout(timeout);
  }, [estimate, tripData.pickupName, tripData.dropName, tripData.pax, tripData.passengerName]);

  const handleUpdateTripData = (updates) => {
    setTripData(prev => ({
      ...prev,
      ...updates,
    }));
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

    setTripData(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const handleSelectLocationFromModal = (loc) => {
    setTripData(prev => ({
      ...prev,
      dropName: loc.name,
      dropLocation: loc,
      customZoneId: loc.zoneId,
    }));
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
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('uitm_transporter_history');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenPriceList={() => setIsPriceListOpen(true)}
        appMode={appMode}
        setAppMode={setAppMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8">
        {/* Smart Order Paste Box (Auto Parser) */}
        <OrderParserBox
          onApplyParsedOrder={handleApplyParsedOrder}
        />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <CalculatorForm
              tripData={tripData}
              onChangeTripData={handleUpdateTripData}
            />

            {/* Past History */}
            <RecentTrips
              history={history}
              onSelectHistoryItem={handleSelectHistoryItem}
              onClearHistory={handleClearHistory}
            />
          </div>

          {/* Right Column: Estimate Result & Template (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-6">
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
        </div>

        {/* Footer Policy and Community Guidelines */}
        <footer className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 space-y-2">
          <p>
            UiTM Shah Alam Transporter Fare Estimator • Based on Official Price List (Effective 1st April 2026)
          </p>
          <p className="text-[11px] text-slate-600">
            Strict Floor Rate Policy: Built to prevent predatory price cutting and ensure fair student driver income.
          </p>
        </footer>
      </main>

      {/* Official Price List Full Modal */}
      <PriceListModal
        isOpen={isPriceListOpen}
        onClose={() => setIsPriceListOpen(false)}
        onSelectLocation={handleSelectLocationFromModal}
      />
    </div>
  );
}

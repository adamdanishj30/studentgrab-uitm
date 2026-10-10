import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Users, 
  CloudRain, 
  Clock, 
  Moon, 
  Luggage, 
  Car, 
  DollarSign, 
  Search, 
  AlertCircle, 
  ChevronDown,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  ZONES, 
  ALL_LOCATIONS, 
  QUICK_PICKUP_SPOTS, 
  QUICK_DROP_SPOTS, 
  SURCHARGE_RULES 
} from '../data/priceData';
import { matchLocation } from '../utils/fareCalculator';

export default function CalculatorForm({
  tripData,
  onChangeTripData,
  onReset,
}) {
  const [pickupSearch, setPickupSearch] = useState(tripData.pickupName || 'Kolej Mawar');
  const [dropSearch, setDropSearch] = useState(tripData.dropName || 'Pusat Komersial Seksyen 7');
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropDropdown, setShowDropDropdown] = useState(false);

  const pickupRef = useRef(null);
  const dropRef = useRef(null);

  // Sync internal state when external tripData updates (like from parser)
  useEffect(() => {
    if (tripData.pickupName !== undefined) setPickupSearch(tripData.pickupName);
    if (tripData.dropName !== undefined) setDropSearch(tripData.dropName);
  }, [tripData.pickupName, tripData.dropName]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (pickupRef.current && !pickupRef.current.contains(e.target)) {
        setShowPickupDropdown(false);
      }
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setShowDropDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered lists
  const filteredPickupLocations = ALL_LOCATIONS.filter(loc =>
    loc.name.toLowerCase().includes(pickupSearch.toLowerCase()) ||
    loc.category.toLowerCase().includes(pickupSearch.toLowerCase())
  );

  const filteredDropLocations = ALL_LOCATIONS.filter(loc =>
    loc.name.toLowerCase().includes(dropSearch.toLowerCase()) ||
    loc.category.toLowerCase().includes(dropSearch.toLowerCase()) ||
    loc.zoneTitle.toLowerCase().includes(dropSearch.toLowerCase())
  );

  const handleSelectPickup = (loc) => {
    setPickupSearch(loc.name);
    setShowPickupDropdown(false);
    onChangeTripData({
      pickupName: loc.name,
      pickupLocation: loc,
    });
  };

  const handleSelectDrop = (loc) => {
    setDropSearch(loc.name);
    setShowDropDropdown(false);
    onChangeTripData({
      dropName: loc.name,
      dropLocation: loc,
      customZoneId: loc.zoneId,
    });
  };

  const handleCustomPickupChange = (text) => {
    setPickupSearch(text);
    const matched = matchLocation(text);
    onChangeTripData({
      pickupName: text,
      pickupLocation: matched || { name: text, zoneId: 'INTERNAL_UITM', baseMin: 5, baseMax: 8 },
    });
  };

  const handleCustomDropChange = (text) => {
    setDropSearch(text);
    const matched = matchLocation(text);
    onChangeTripData({
      dropName: text,
      dropLocation: matched || null,
      customZoneId: matched ? matched.zoneId : tripData.customZoneId,
    });
  };

  const currentZone = tripData.dropLocation
    ? ZONES[tripData.dropLocation.zoneId]
    : tripData.customZoneId
    ? ZONES[tripData.customZoneId]
    : ZONES.SEKSYEN_7;

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-5">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Car className="w-5 h-5 text-amber-400" />
          <span>Trip Details & Surcharges</span>
        </h2>
        <span className="text-xs text-slate-400">
          UiTM Shah Alam Base Hub
        </span>
      </div>

      <div className="space-y-5">
        {/* Passenger Name & Pax */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Passenger Name / Handle
            </label>
            <input
              type="text"
              value={tripData.passengerName || ''}
              onChange={(e) => onChangeTripData({ passengerName: e.target.value })}
              placeholder="e.g. Durrz / Amyra"
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Passengers</span>
              {tripData.pax >= 5 && (
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                  MPV (1.5x)
                </span>
              )}
            </label>
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onChangeTripData({ pax: num, isMPV: num >= 5 ? true : tripData.isMPV })}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    tripData.pax === num
                      ? num >= 5
                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                        : 'bg-purple-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pickup Location */}
        <div ref={pickupRef} className="relative">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Pickup Location
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">Inside / Near Campus</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={pickupSearch}
              onChange={(e) => {
                handleCustomPickupChange(e.target.value);
                setShowPickupDropdown(true);
              }}
              onFocus={() => setShowPickupDropdown(true)}
              placeholder="Search Kolej Kediaman, Faculty, Hall..."
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowPickupDropdown(!showPickupDropdown)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showPickupDropdown && (
            <div className="absolute z-30 mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-56 overflow-y-auto">
              <div className="p-1.5">
                <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase">
                  UiTM Campus Spots
                </div>
                {filteredPickupLocations.slice(0, 10).map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPickup(loc)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-purple-900/40 hover:text-white rounded-lg flex items-center justify-between transition-colors"
                  >
                    <span className="font-medium">{loc.name}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {loc.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Pickup Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[11px] text-slate-500 mr-1 self-center">Quick:</span>
            {QUICK_PICKUP_SPOTS.slice(0, 6).map((spot, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  const loc = ALL_LOCATIONS.find(l => l.name === spot) || { name: spot, zoneId: 'INTERNAL_UITM' };
                  handleSelectPickup(loc);
                }}
                className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all ${
                  pickupSearch === spot
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {spot}
              </button>
            ))}
          </div>
        </div>

        {/* Dropoff Location */}
        <div ref={dropRef} className="relative">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              Dropoff Destination
            </span>
            {currentZone && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-900/70 text-purple-200 border border-purple-700/60 flex items-center gap-1">
                {currentZone.badge} (RM {currentZone.baseMin}~{currentZone.baseMax})
              </span>
            )}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
              <Navigation className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={dropSearch}
              onChange={(e) => {
                handleCustomDropChange(e.target.value);
                setShowDropDropdown(true);
              }}
              onFocus={() => setShowDropDropdown(true)}
              placeholder="Search apartment, mall, station, or landmark..."
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
            />
            <button
              type="button"
              onClick={() => setShowDropDropdown(!showDropDropdown)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Dropdown for Drop locations */}
          {showDropDropdown && (
            <div className="absolute z-30 mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
              <div className="p-1.5">
                <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase">
                  Available Destinations by Zone
                </div>
                {filteredDropLocations.slice(0, 15).map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectDrop(loc)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-purple-900/40 hover:text-white rounded-lg flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-medium">{loc.name}</div>
                      <div className="text-[10px] text-slate-400">{loc.category}</div>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                      RM {loc.baseMin}~{loc.baseMax}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Drop Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[11px] text-slate-500 mr-1 self-center">Popular:</span>
            {QUICK_DROP_SPOTS.slice(0, 7).map((spot, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  const loc = ALL_LOCATIONS.find(l => l.name.includes(spot) || spot.includes(l.name));
                  if (loc) {
                    handleSelectDrop(loc);
                  } else {
                    handleCustomDropChange(spot);
                  }
                }}
                className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all ${
                  dropSearch.includes(spot)
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-semibold'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {spot}
              </button>
            ))}
          </div>
        </div>

        {/* Zone Selector (if custom location or manual override) */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-purple-400" />
              Fare Zone Category
            </span>
            <span className="text-[11px] text-slate-400">
              Base Floor Rate: <strong className="text-amber-400">RM {currentZone ? `${currentZone.baseMin} ~ ${currentZone.baseMax}` : '7 ~ 11'}</strong>
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {Object.values(ZONES).map((zone) => {
              const isSelected = tripData.customZoneId === zone.id || (tripData.dropLocation && tripData.dropLocation.zoneId === zone.id);
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => onChangeTripData({ customZoneId: zone.id })}
                  className={`text-left p-2 rounded-lg border text-xs transition-all ${
                    isSelected
                      ? 'bg-purple-600/30 border-purple-500 text-white font-medium shadow-sm'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold truncate text-[11px]">{zone.title}</div>
                  <div className="text-[10px] text-amber-400 font-mono">RM {zone.baseMin} ~ {zone.baseMax}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Surcharges Selection Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              Mandatory Surcharges (Add-ons)
            </span>
            <span className="text-[11px] text-slate-400">Official Community Rules</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Peak Hours */}
            <div
              onClick={() => onChangeTripData({ isPeakHour: !tripData.isPeakHour })}
              className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${
                tripData.isPeakHour
                  ? 'bg-rose-950/40 border-rose-500/70 text-white ring-1 ring-rose-500/40'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${tripData.isPeakHour ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1">
                    Peak Hours
                    <span className="text-[10px] text-rose-400 font-mono font-bold">+RM 2~5</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    7:30–9:30 AM / 5:00–8:00 PM
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={tripData.isPeakHour || false}
                readOnly
                className="w-4 h-4 rounded text-rose-600 focus:ring-0 cursor-pointer accent-rose-500"
              />
            </div>

            {/* Rainy Weather */}
            <div
              onClick={() => onChangeTripData({ isRainy: !tripData.isRainy })}
              className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${
                tripData.isRainy
                  ? 'bg-blue-950/40 border-blue-500/70 text-white ring-1 ring-blue-500/40'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${tripData.isRainy ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1">
                    Rainy Weather
                    <span className="text-[10px] text-blue-400 font-mono font-bold">+RM 2~4</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Heavy rain / slippery roads
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={tripData.isRainy || false}
                readOnly
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer accent-blue-500"
              />
            </div>

            {/* Midnight / Gate Closed */}
            <div
              onClick={() => onChangeTripData({ isMidnight: !tripData.isMidnight })}
              className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${
                tripData.isMidnight
                  ? 'bg-indigo-950/40 border-indigo-500/70 text-white ring-1 ring-indigo-500/40'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${tripData.isMidnight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1">
                    Midnight / Gate Closed
                    <span className="text-[10px] text-indigo-400 font-mono font-bold">+RM 2~4</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    12:00 AM – 6:00 AM
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={tripData.isMidnight || false}
                readOnly
                className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Heavy Luggage */}
            <div
              onClick={() => onChangeTripData({ hasHeavyLuggage: !tripData.hasHeavyLuggage })}
              className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${
                tripData.hasHeavyLuggage
                  ? 'bg-amber-950/40 border-amber-500/70 text-white ring-1 ring-amber-500/40'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${tripData.hasHeavyLuggage ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Luggage className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1">
                    Heavy Luggage
                    <span className="text-[10px] text-amber-400 font-mono font-bold">+RM 2~4</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Boxes, oversized luggage
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={tripData.hasHeavyLuggage || false}
                readOnly
                className="w-4 h-4 rounded text-amber-600 focus:ring-0 cursor-pointer accent-amber-500"
              />
            </div>

            {/* MPV 5-6 Pax */}
            <div
              onClick={() => onChangeTripData({ isMPV: !tripData.isMPV })}
              className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${
                tripData.isMPV || tripData.pax >= 5
                  ? 'bg-purple-950/50 border-purple-500/70 text-white ring-1 ring-purple-500/40'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${tripData.isMPV || tripData.pax >= 5 ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1">
                    MPV Vehicle
                    <span className="text-[10px] text-purple-400 font-mono font-bold">1.5x Base</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    5–6 passengers capacity
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={tripData.isMPV || tripData.pax >= 5}
                readOnly
                className="w-4 h-4 rounded text-purple-600 focus:ring-0 cursor-pointer accent-purple-500"
              />
            </div>

            {/* Waiting Time / Late Fee */}
            <div className="p-3 rounded-xl border bg-slate-900/60 border-slate-700/60 text-slate-300">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Waiting / Late Fee</span>
                </div>
                <span className="text-[10px] text-amber-400 font-mono font-semibold">
                  +RM {tripData.waitingMinutes > 0 ? Math.round(tripData.waitingMinutes / 10) : 0}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[0, 10, 20, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => onChangeTripData({ waitingMinutes: mins })}
                    className={`flex-1 py-1 text-[11px] rounded font-medium transition-colors ${
                      (tripData.waitingMinutes || 0) === mins
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mins === 0 ? 'None' : `${mins}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tolls Input */}
          <div className="mt-3 flex items-center gap-3 bg-slate-900/60 border border-slate-700/60 rounded-xl p-2.5">
            <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">
              Highway Tolls (RM):
            </span>
            <input
              type="number"
              step="0.5"
              min="0"
              value={tripData.tollAmount || ''}
              onChange={(e) => onChangeTripData({ tollAmount: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white text-right font-mono focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <div className="flex items-center gap-1 flex-wrap">
              {[2.50, 4.00, 5.00].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => onChangeTripData({ tollAmount: amt })}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono"
                >
                  +RM {amt.toFixed(2)}
                </button>
              ))}
              {tripData.tollAmount > 0 && (
                <button
                  type="button"
                  onClick={() => onChangeTripData({ tollAmount: 0 })}
                  className="text-[10px] text-rose-400 hover:underline px-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

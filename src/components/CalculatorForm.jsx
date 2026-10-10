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
  ChevronDown,
  Info,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { 
  ZONES, 
  ALL_LOCATIONS, 
  QUICK_PICKUP_SPOTS, 
  QUICK_DROP_SPOTS 
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

  useEffect(() => {
    if (tripData.pickupName !== undefined) setPickupSearch(tripData.pickupName);
    if (tripData.dropName !== undefined) setDropSearch(tripData.dropName);
  }, [tripData.pickupName, tripData.dropName]);

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
    <div className="bg-white rounded-[32px] p-5 sm:p-6 border border-stone-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-5 mb-5">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#1E2E1E]">
            Trip Details
          </h2>
          <p className="text-[11px] text-[#6B756B]">
            From UiTM Shah Alam to any destination
          </p>
        </div>
        <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#E7ECE7] text-[#1E2E1E]">
          {tripData.pax} {tripData.pax === 1 ? 'Pax' : 'Passengers'}
        </div>
      </div>

      {/* Passenger Name & Pax */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-[#4B554B] uppercase tracking-wider mb-1.5">
            Student / Passenger Name
          </label>
          <input
            type="text"
            value={tripData.passengerName || ''}
            onChange={(e) => onChangeTripData({ passengerName: e.target.value })}
            placeholder="e.g. Durrz / Amyra"
            className="w-full bg-[#F7F6F1] border border-stone-200/80 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1E2E1E] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E2E1E]/20"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#4B554B] uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Pax</span>
            {tripData.pax >= 5 && (
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                MPV 1.5x
              </span>
            )}
          </label>
          <div className="flex items-center bg-[#F7F6F1] border border-stone-200/80 rounded-2xl p-1">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onChangeTripData({ pax: num, isMPV: num >= 5 ? true : tripData.isMPV })}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  tripData.pax === num
                    ? 'bg-[#1E2E1E] text-white shadow-xs'
                    : 'text-[#6B756B] hover:text-[#1E2E1E]'
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
        <label className="block text-[11px] font-bold text-[#4B554B] uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Pickup Spot
          </span>
          <span className="text-[10px] text-emerald-800 font-semibold">UiTM Campus</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#556355]">
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
            placeholder="Search Kolej Mawar, Meranti, DSB..."
            className="w-full bg-[#F7F6F1] border border-stone-200/80 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-[#1E2E1E] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E2E1E]/20"
          />
          <button
            type="button"
            onClick={() => setShowPickupDropdown(!showPickupDropdown)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Autocomplete */}
        {showPickupDropdown && (
          <div className="absolute z-30 mt-1.5 w-full bg-white border border-stone-200 rounded-2xl shadow-xl max-h-52 overflow-y-auto p-1.5">
            {filteredPickupLocations.slice(0, 8).map((loc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPickup(loc)}
                className="w-full text-left px-3 py-2 text-xs text-[#1E2E1E] hover:bg-[#F5F8F5] rounded-xl flex items-center justify-between"
              >
                <span className="font-semibold">{loc.name}</span>
                <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                  {loc.category}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Interest-style quick pills */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {QUICK_PICKUP_SPOTS.slice(0, 6).map((spot, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                const loc = ALL_LOCATIONS.find(l => l.name === spot) || { name: spot, zoneId: 'INTERNAL_UITM' };
                handleSelectPickup(loc);
              }}
              className={`text-xs px-3 py-1 rounded-full transition-all ${
                pickupSearch === spot
                  ? 'bg-[#1E2E1E] text-white font-bold'
                  : 'bg-[#F0EFEA] text-[#4A554A] hover:bg-[#E4EAE4]'
              }`}
            >
              {spot}
            </button>
          ))}
        </div>
      </div>

      {/* Dropoff Location */}
      <div ref={dropRef} className="relative">
        <label className="block text-[11px] font-bold text-[#4B554B] uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1E2E1E]"></span>
            Dropoff Destination
          </span>
          {currentZone && (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E7ECE7] text-[#1E2E1E]">
              {currentZone.badge}
            </span>
          )}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#556355]">
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
            placeholder="Search Seksyen 7, i-City, AEON, Sunway, TBS..."
            className="w-full bg-[#F7F6F1] border border-stone-200/80 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-[#1E2E1E] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E2E1E]/20"
          />
          <button
            type="button"
            onClick={() => setShowDropDropdown(!showDropDropdown)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Dropdown for Drop locations */}
        {showDropDropdown && (
          <div className="absolute z-30 mt-1.5 w-full bg-white border border-stone-200 rounded-2xl shadow-xl max-h-56 overflow-y-auto p-1.5">
            {filteredDropLocations.slice(0, 10).map((loc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectDrop(loc)}
                className="w-full text-left px-3 py-2 text-xs text-[#1E2E1E] hover:bg-[#F5F8F5] rounded-xl flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{loc.name}</div>
                  <div className="text-[10px] text-stone-400">{loc.category}</div>
                </div>
                <span className="text-[11px] font-bold font-mono text-[#1E2E1E] bg-[#E7ECE7] px-2 py-0.5 rounded-md">
                  RM {loc.baseMin}~{loc.baseMax}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Popular Destination Pills (Interest style from screenshot) */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {QUICK_DROP_SPOTS.slice(0, 8).map((spot, i) => (
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
              className={`text-xs px-3 py-1 rounded-full transition-all ${
                dropSearch.includes(spot)
                  ? 'bg-[#1E2E1E] text-white font-bold'
                  : 'bg-[#F0EFEA] text-[#4A554A] hover:bg-[#E4EAE4]'
              }`}
            >
              {spot}
            </button>
          ))}
        </div>
      </div>

      {/* Surcharges Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-[11px] font-bold text-[#4B554B] uppercase tracking-wider">
            Mandatory Surcharges (Add-ons)
          </label>
          <span className="text-[10px] text-[#6B756B]">Community floor rules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Peak Hours */}
          <div
            onClick={() => onChangeTripData({ isPeakHour: !tripData.isPeakHour })}
            className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between ${
              tripData.isPeakHour
                ? 'bg-[#E7ECE7] border-[#BCD0BC] text-[#1E2E1E]'
                : 'bg-[#F7F6F1] border-stone-200/60 text-[#444]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${tripData.isPeakHour ? 'bg-[#1E2E1E] text-white' : 'bg-stone-200 text-stone-600'}`}>
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold">
                  Peak Hours <span className="font-mono text-[10px]">(+RM 2~5)</span>
                </div>
                <div className="text-[10px] text-[#6B756B]">
                  7:30–9:30 AM / 5–8 PM
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={tripData.isPeakHour || false}
              readOnly
              className="w-4 h-4 rounded text-[#1E2E1E] accent-[#1E2E1E]"
            />
          </div>

          {/* Rainy Weather */}
          <div
            onClick={() => onChangeTripData({ isRainy: !tripData.isRainy })}
            className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between ${
              tripData.isRainy
                ? 'bg-[#E7ECE7] border-[#BCD0BC] text-[#1E2E1E]'
                : 'bg-[#F7F6F1] border-stone-200/60 text-[#444]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${tripData.isRainy ? 'bg-[#1E2E1E] text-white' : 'bg-stone-200 text-stone-600'}`}>
                <CloudRain className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold">
                  Rainy Weather <span className="font-mono text-[10px]">(+RM 2~4)</span>
                </div>
                <div className="text-[10px] text-[#6B756B]">
                  Wet roads / traffic
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={tripData.isRainy || false}
              readOnly
              className="w-4 h-4 rounded text-[#1E2E1E] accent-[#1E2E1E]"
            />
          </div>

          {/* Midnight / Gate Closed */}
          <div
            onClick={() => onChangeTripData({ isMidnight: !tripData.isMidnight })}
            className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between ${
              tripData.isMidnight
                ? 'bg-[#E7ECE7] border-[#BCD0BC] text-[#1E2E1E]'
                : 'bg-[#F7F6F1] border-stone-200/60 text-[#444]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${tripData.isMidnight ? 'bg-[#1E2E1E] text-white' : 'bg-stone-200 text-stone-600'}`}>
                <Moon className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold">
                  Midnight / Closed <span className="font-mono text-[10px]">(+RM 2~4)</span>
                </div>
                <div className="text-[10px] text-[#6B756B]">
                  12:00 AM – 6:00 AM
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={tripData.isMidnight || false}
              readOnly
              className="w-4 h-4 rounded text-[#1E2E1E] accent-[#1E2E1E]"
            />
          </div>

          {/* Heavy Luggage */}
          <div
            onClick={() => onChangeTripData({ hasHeavyLuggage: !tripData.hasHeavyLuggage })}
            className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between ${
              tripData.hasHeavyLuggage
                ? 'bg-[#E7ECE7] border-[#BCD0BC] text-[#1E2E1E]'
                : 'bg-[#F7F6F1] border-stone-200/60 text-[#444]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${tripData.hasHeavyLuggage ? 'bg-[#1E2E1E] text-white' : 'bg-stone-200 text-stone-600'}`}>
                <Luggage className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold">
                  Heavy Luggage <span className="font-mono text-[10px]">(+RM 2~4)</span>
                </div>
                <div className="text-[10px] text-[#6B756B]">
                  Balik kampung boxes
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={tripData.hasHeavyLuggage || false}
              readOnly
              className="w-4 h-4 rounded text-[#1E2E1E] accent-[#1E2E1E]"
            />
          </div>
        </div>

        {/* Waiting fee & Tolls row */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {/* Waiting Time */}
          <div className="bg-[#F7F6F1] p-3 rounded-2xl border border-stone-200/60">
            <div className="text-[10px] font-bold text-[#4B554B] uppercase mb-1">
              Late Fee (+RM 1/10m)
            </div>
            <div className="flex items-center gap-1">
              {[0, 10, 20, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => onChangeTripData({ waitingMinutes: mins })}
                  className={`flex-1 py-1 text-[10px] rounded-lg font-bold transition-all ${
                    (tripData.waitingMinutes || 0) === mins
                      ? 'bg-[#1E2E1E] text-white shadow-xs'
                      : 'bg-white text-stone-500'
                  }`}
                >
                  {mins === 0 ? '0' : `${mins}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Tolls */}
          <div className="bg-[#F7F6F1] p-3 rounded-2xl border border-stone-200/60">
            <div className="text-[10px] font-bold text-[#4B554B] uppercase mb-1">
              Highway Toll (RM)
            </div>
            <input
              type="number"
              step="0.5"
              min="0"
              value={tripData.tollAmount || ''}
              onChange={(e) => onChangeTripData({ tollAmount: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-[#1E2E1E] font-mono text-center focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

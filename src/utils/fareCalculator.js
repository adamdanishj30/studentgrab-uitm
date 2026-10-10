import { ZONES, ALL_LOCATIONS, SURCHARGE_RULES } from '../data/priceData';

/**
 * Find matching location or zone based on query text
 */
export function matchLocation(query) {
  if (!query || typeof query !== 'string') return null;
  const clean = query.trim().toLowerCase();

  // 1. Direct match on location keywords
  for (const loc of ALL_LOCATIONS) {
    if (loc.name.toLowerCase() === clean) return loc;
    if (loc.keywords && loc.keywords.some(k => clean.includes(k) || k.includes(clean))) {
      return loc;
    }
  }

  // 2. Fuzzy match checks
  if (clean.includes('mawar')) return findLocByName('Kolej Mawar');
  if (clean.includes('meranti')) return findLocByName('Kolej Meranti');
  if (clean.includes('melati')) return findLocByName('Kolej Melati');
  if (clean.includes('delima')) return findLocByName('Kolej Delima');
  if (clean.includes('perindu')) return findLocByName('Kolej Perindu');
  if (clean.includes('seroja')) return findLocByName('Kolej Seroja');
  if (clean.includes('teratai')) return findLocByName('Kolej Teratai');
  if (clean.includes('dahlia')) return findLocByName('Kolej Dahlia');
  if (clean.includes('akasia')) return findLocByName('Kolej Akasia');
  if (clean.includes('kenanga')) return findLocByName('Kolej Kenanga');
  if (clean.includes('seri budiman') || clean.includes('dsb')) return findLocByName('Dewan Seri Budiman (DSB)');
  if (clean.includes('datc')) return findLocByName('Dewan Agong Tuanku Canselor (DATC)');
  
  if (clean.includes('baiduri')) return findLocByName('Apartment Baiduri');
  if (clean.includes('kristal')) return findLocByName('Kristal View');
  if (clean.includes('puncak 7')) return findLocByName('Puncak 7');
  if (clean.includes('pusat komersial') || clean.includes('pk sek 7')) return findLocByName('Pusat Komersial Seksyen 7');
  if (clean.includes('hospital') || clean.includes('hsa')) return findLocByName('Hospital Shah Alam');
  if (clean.includes('i-city') || clean.includes('icity') || clean.includes('i-soho')) return findLocByName('Central i-City Mall');
  if (clean.includes('padang jawa')) return findLocByName('Seksyen 16 - KTM Padang Jawa');
  if (clean.includes('suria jaya')) return findLocByName('Seksyen 16 - Suria Jaya');
  if (clean.includes('aeon') && clean.includes('shah alam')) return findLocByName('Seksyen 13 - AEON Mall Shah Alam');
  if (clean.includes('msu')) return findLocByName('Seksyen 13 - MSU (Management & Science University)');
  if (clean.includes('terminal 17')) return findLocByName('Seksyen 17 - Terminal 17 (Bus Hub)');
  if (clean.includes('sunway')) return findLocByName('Sunway - Sunway Pyramid / Sunway Lagoon');
  if (clean.includes('one utama') || clean.includes('1 utama')) return findLocByName('Petaling Jaya - One Utama Mall (1U)');
  if (clean.includes('subang airport') || clean.includes('ltsaas')) return findLocByName('Subang Airport (LTSAAS)');
  if (clean.includes('tbs')) return findLocByName('TBS (Terminal Bersepadu Selatan)');
  if (clean.includes('puncak alam') || clean.includes('palam')) return findLocByName('UiTM Puncak Alam (Puncak Alam Campus)');
  if (clean.includes('klia')) return findLocByName('KLIA 1 / KLIA 2 (Sepang)');

  return null;
}

function findLocByName(name) {
  return ALL_LOCATIONS.find(l => l.name.toLowerCase() === name.toLowerCase()) || null;
}

/**
 * Calculates estimated fare breakdown based on trip details and surcharges
 */
export function calculateFare({
  pickupLocation,
  dropLocation,
  customZoneId = null,
  pax = 1,
  isPeakHour = false,
  isRainy = false,
  isMidnight = false,
  isMPV = false,
  hasHeavyLuggage = false,
  waitingMinutes = 0,
  tollAmount = 0,
}) {
  // Determine if trip is campus internal
  const isPickupInternal = pickupLocation && pickupLocation.zoneId === 'INTERNAL_UITM';
  const isDropInternal = dropLocation && dropLocation.zoneId === 'INTERNAL_UITM';
  const isBothInternal = isPickupInternal && isDropInternal;

  let baseMin = 5;
  let baseMax = 8;
  let detectedZone = ZONES.INTERNAL_UITM;
  let targetLocation = dropLocation || pickupLocation;

  if (isBothInternal) {
    baseMin = 5;
    baseMax = 8;
    detectedZone = ZONES.INTERNAL_UITM;
  } else if (customZoneId && ZONES[customZoneId]) {
    detectedZone = ZONES[customZoneId];
    baseMin = detectedZone.baseMin;
    baseMax = detectedZone.baseMax;
  } else if (dropLocation && dropLocation.zoneId !== 'INTERNAL_UITM') {
    detectedZone = ZONES[dropLocation.zoneId] || ZONES.MID_DISTANCE;
    baseMin = dropLocation.baseMin || detectedZone.baseMin;
    baseMax = dropLocation.baseMax || detectedZone.baseMax;
  } else if (pickupLocation && pickupLocation.zoneId !== 'INTERNAL_UITM') {
    detectedZone = ZONES[pickupLocation.zoneId] || ZONES.MID_DISTANCE;
    baseMin = pickupLocation.baseMin || detectedZone.baseMin;
    baseMax = pickupLocation.baseMax || detectedZone.baseMax;
  } else {
    // Default fallback
    baseMin = 7;
    baseMax = 11;
    detectedZone = ZONES.SEKSYEN_7;
  }

  // MPV Check: If pax >= 5 or explicitly toggled MPV, 1.5x base fare
  const effectiveIsMPV = isMPV || pax >= 5;
  let adjustedBaseMin = baseMin;
  let adjustedBaseMax = baseMax;
  let mpvExtraMin = 0;
  let mpvExtraMax = 0;

  if (effectiveIsMPV) {
    adjustedBaseMin = Math.round(baseMin * 1.5);
    adjustedBaseMax = Math.round(baseMax * 1.5);
    mpvExtraMin = adjustedBaseMin - baseMin;
    mpvExtraMax = adjustedBaseMax - baseMax;
  }

  // Surcharges breakdown
  const surcharges = [];
  let surchargeMinTotal = 0;
  let surchargeMaxTotal = 0;

  if (isPeakHour) {
    const min = SURCHARGE_RULES.peakHour.min;
    const max = SURCHARGE_RULES.peakHour.max;
    surcharges.push({
      id: 'peakHour',
      name: 'Peak Hours Surcharge',
      range: `+RM ${min}~${max}`,
      min,
      max,
    });
    surchargeMinTotal += min;
    surchargeMaxTotal += max;
  }

  if (isRainy) {
    const min = SURCHARGE_RULES.rainyWeather.min;
    const max = SURCHARGE_RULES.rainyWeather.max;
    surcharges.push({
      id: 'rainyWeather',
      name: 'Rainy Weather Surcharge',
      range: `+RM ${min}~${max}`,
      min,
      max,
    });
    surchargeMinTotal += min;
    surchargeMaxTotal += max;
  }

  if (isMidnight) {
    const min = SURCHARGE_RULES.midnight.min;
    const max = SURCHARGE_RULES.midnight.max;
    surcharges.push({
      id: 'midnight',
      name: 'Midnight / Gate Closed (12AM - 6AM)',
      range: `+RM ${min}~${max}`,
      min,
      max,
    });
    surchargeMinTotal += min;
    surchargeMaxTotal += max;
  }

  if (hasHeavyLuggage) {
    const min = SURCHARGE_RULES.heavyLuggage.min;
    const max = SURCHARGE_RULES.heavyLuggage.max;
    surcharges.push({
      id: 'heavyLuggage',
      name: 'Heavy Luggage',
      range: `+RM ${min}~${max}`,
      min,
      max,
    });
    surchargeMinTotal += min;
    surchargeMaxTotal += max;
  }

  // Late fee: RM 1 per 10 mins
  let lateFee = 0;
  if (waitingMinutes > 0) {
    lateFee = Math.max(1, Math.round(waitingMinutes / 10));
    surcharges.push({
      id: 'lateFee',
      name: `Late Fee (${waitingMinutes} mins waiting)`,
      range: `+RM ${lateFee}`,
      min: lateFee,
      max: lateFee,
    });
    surchargeMinTotal += lateFee;
    surchargeMaxTotal += lateFee;
  }

  // Tolls
  const parsedToll = parseFloat(tollAmount) || 0;
  if (parsedToll > 0) {
    surcharges.push({
      id: 'tolls',
      name: 'Highway Toll Charges',
      range: `+RM ${parsedToll.toFixed(2)}`,
      min: parsedToll,
      max: parsedToll,
    });
    surchargeMinTotal += parsedToll;
    surchargeMaxTotal += parsedToll;
  }

  // Total range
  const totalMin = Math.round(adjustedBaseMin + surchargeMinTotal);
  const totalMax = Math.round(adjustedBaseMax + surchargeMaxTotal);

  return {
    zone: detectedZone,
    isBothInternal,
    effectiveIsMPV,
    baseFare: {
      rawMin: baseMin,
      rawMax: baseMax,
      adjustedMin: adjustedBaseMin,
      adjustedMax: adjustedBaseMax,
      mpvExtraMin,
      mpvExtraMax,
    },
    surcharges,
    surchargeMinTotal,
    surchargeMaxTotal,
    totalMin,
    totalMax,
    fareRangeString: `RM ${totalMin} ~ ${totalMax}`,
    baseRangeString: `RM ${baseMin} ~ ${baseMax}`,
  };
}
